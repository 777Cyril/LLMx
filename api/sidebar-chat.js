'use strict';

const fs = require('node:fs');
const path = require('node:path');
const core = require('./sidebar-chat-core');
const semantic = require('./semantic');

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const MAX_HISTORY_MESSAGES = 10;

function json(res, statusCode, payload) {
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  if (typeof res.setHeader === 'function') {
    res.setHeader('content-type', 'application/json; charset=utf-8');
  }
  if (typeof res.end === 'function') {
    res.end(JSON.stringify(payload));
  }
  return undefined;
}

function parseBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (_error) {
      return null;
    }
  }
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  return null;
}

function sanitizeMessages(rawMessages) {
  if (!Array.isArray(rawMessages)) return null;

  const cleaned = rawMessages
    .filter((message) => message && typeof message === 'object')
    .map((message) => ({
      role: message.role,
      content: typeof message.content === 'string' ? message.content.trim() : ''
    }))
    .filter((message) => (message.role === 'user' || message.role === 'assistant') && message.content.length > 0)
    .slice(-MAX_HISTORY_MESSAGES);

  if (!cleaned.length) return null;
  return cleaned;
}


async function callClaude({ model, apiKey, systemPrompt, contextBlock, messages }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      temperature: 0.25,
      system: `${systemPrompt}\n\nCONTEXT\n${contextBlock}`,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content
      }))
    })
  });

  if (!response.ok) {
    let bodyText = '';
    try {
      bodyText = await response.text();
    } catch (_error) {
      bodyText = '';
    }
    const msg = `Anthropic ${response.status}: ${bodyText.slice(0, 500)}`;
    console.error('[sidebar-chat] Anthropic API error →', msg);
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text?.trim();
  if (!text) {
    throw new Error('Anthropic response did not contain output text');
  }

  return text;
}

function buildSystemPrompt() {
  return fs.readFileSync(path.join(__dirname, 'system-prompt.txt'), 'utf8').trim();
}

/**
 * Merge lexical BM25-style scores with Pinecone cosine-similarity scores.
 * Lexical scores are normalised to 0–1 before blending.
 * Returns chunks sorted by hybrid score descending.
 */
function hybridMerge(lexicalRanked, semanticMatches) {
  const maxLexical = lexicalRanked.reduce((m, c) => Math.max(m, c.score), 1);

  const lexicalMap = new Map(
    lexicalRanked.map((c) => [c.id, { chunk: c, norm: c.score / maxLexical }])
  );
  const semanticMap = new Map(
    semanticMatches.map((m) => [m.id, { chunk: m, score: m.score }])
  );

  const allIds = new Set([...lexicalMap.keys(), ...semanticMap.keys()]);

  const merged = [...allIds].map((id) => {
    const lEntry = lexicalMap.get(id);
    const sEntry = semanticMap.get(id);
    const lScore = lEntry ? lEntry.norm  : 0;
    const sScore = sEntry ? sEntry.score : 0;
    const chunk  = (lEntry?.chunk) || (sEntry?.chunk);
    return { ...chunk, hybridScore: 0.4 * lScore + 0.6 * sScore };
  });

  return merged.sort((a, b) => b.hybridScore - a.hybridScore);
}

async function handler(req, res) {
  const method = String(req?.method || 'GET').toUpperCase();
  if (method !== 'POST') {
    if (typeof res.setHeader === 'function') {
      res.setHeader('Allow', 'POST');
    }
    return json(res, 405, { error: 'method_not_allowed' });
  }

  const payload = parseBody(req);
  if (!payload || typeof payload !== 'object') {
    return json(res, 400, { error: 'invalid_request' });
  }

  const messages = sanitizeMessages(payload.messages);
  if (!messages) {
    return json(res, 400, { error: 'invalid_request' });
  }

  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  if (!latestUserMessage) {
    return json(res, 400, { error: 'invalid_request' });
  }

  // Lexical query: combine last 2 user messages for more token signal.
  // Short follow-ups ("from scratch") have too few tokens alone — the
  // previous turn adds context that helps the BM25-style scorer match.
  const lexicalQuery = messages
    .filter((m) => m.role === 'user')
    .slice(-2)
    .map((m) => m.content)
    .join(' ');

  // Semantic query: use the latest message only.
  // Embeddings are sensitive to noise — "project management dashboard from scratch"
  // pulls the vector away from FAQ chunks about starting from zero.
  // The raw latest message ("from scratch") scores ~0.75 against faq-starting-from-zero;
  // the combined query might score 0.28 and miss the confidence threshold entirely.
  const semanticQuery = latestUserMessage.content;

  const corpus = core.buildCorpus();
  const ranked = core.rankChunks(lexicalQuery, corpus.chunks, 6);

  // ── Semantic search (runs in parallel with lexical; gracefully skipped if keys absent) ──
  const pineconeKey = process.env.PINECONE_API_KEY;
  const openaiKey   = process.env.OPENAI_API_KEY;
  let finalRanked   = ranked;
  let topSemanticScore = 0;

  if (pineconeKey && openaiKey) {
    try {
      const semanticMatches = await Promise.race([
        semantic.semanticSearch(
          semanticQuery,
          { pineconeKey, openaiKey },
          6
        ),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('semantic timeout')), 4500)
        )
      ]);
      topSemanticScore = semanticMatches[0]?.score || 0;
      finalRanked = hybridMerge(ranked, semanticMatches);
    } catch (_err) {
      // Fall back to lexical-only — no user-facing impact
      finalRanked = ranked;
    }
  }

  // ── Confidence check ──
  // If semantic fired and returned a strong match, trust it and skip lexical fallback.
  // If lexical-only, use the existing isLowConfidence heuristic.
  const isLowConfidence = core.isLowConfidence(lexicalQuery, ranked);
  const semanticConfident = topSemanticScore >= 0.28;
  if (!semanticConfident && isLowConfidence) {
    return json(res, 200, {
      reply: core.fallbackReply(),
      sources: []
    });
  }

  console.log(JSON.stringify({
    semanticQuery,
    lexicalQuery,
    topChunks: finalRanked.slice(0, 3).map((c) => ({ id: c.id, score: c.hybridScore })),
    topSemanticScore,
    lowConfidence: isLowConfidence
  }));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const allKeyNames = Object.keys(process.env).sort().join(', ');
    const relatedKeys = Object.keys(process.env)
      .filter(k => /ANTHROPIC|OPENAI|PINECONE|MODEL/i.test(k))
      .join(', ') || '(none matching)';
    const detail = `ANTHROPIC_API_KEY not set. Related: [${relatedKeys}]. Total visible: ${Object.keys(process.env).length}. All names: [${allKeyNames}]`;
    console.error('[sidebar-chat]', detail);
    return json(res, 503, { error: 'temporarily_unavailable', detail });
  }

  const model        = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const contextBlock = core.buildContextBlock(finalRanked, 4);

  console.log('[sidebar-chat] calling Claude model:', model);

  let reply;
  try {
    reply = await callClaude({
      model,
      apiKey,
      systemPrompt: buildSystemPrompt(),
      contextBlock,
      messages
    });
  } catch (claudeError) {
    console.error('[sidebar-chat] callClaude failed:', claudeError.message);
    return json(res, 503, { error: 'temporarily_unavailable', detail: claudeError.message });
  }

  const BOOKING_INTENT = /book a call|book directly|sanity.check fit|get started|calendly/i;
  const isBookingIntent = BOOKING_INTENT.test(reply);

  let sources = [];

  if (!isBookingIntent) {
    // Surface real site pages only — deduplicated by URL, above relevance threshold.
    // FAQ chunks are internal corpus; duplicate URLs occur when multiple chunks from
    // the same page are retrieved. Both are suppressed here.
    const seenUrls = new Set();
    const relevantPages = finalRanked.filter((c) => {
      if (c.label === 'FAQ') return false;
      // Only show if hybrid score clears the relevance bar (when semantic ran),
      // or if the chunk made it into the top results via lexical alone.
      const score = typeof c.hybridScore === 'number' ? c.hybridScore : 1;
      if (score < 0.40) return false;
      if (seenUrls.has(c.url)) return false;
      seenUrls.add(c.url);
      return true;
    });
    sources = core.buildSourceList(relevantPages, 3);
  } else {
    // Booking intent — suppress page links, focus UI entirely on conversion CTAs.
    sources.push({ id: 'calendly', label: 'Book a call →', url: 'https://calendly.com/llmxai' });
    sources.push({ id: 'email', label: 'Email us', url: 'mailto:cyril@llmxai.co' });
  }

  return json(res, 200, { reply, sources });
}

handler._internal = {
  parseBody,
  sanitizeMessages,
  callClaude,
  buildSystemPrompt
};

module.exports = handler;
