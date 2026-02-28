'use strict';

const core = require('./sidebar-chat-core');

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
      max_tokens: 280,
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
    throw new Error(`Anthropic request failed (${response.status}): ${bodyText.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text?.trim();
  if (!text) {
    throw new Error('Anthropic response did not contain output text');
  }

  return text;
}

function buildSystemPrompt() {
  return [
    'You are LLMx GPT, a website assistant for llmxai.co.',
    'Voice rules: operator-first, pragmatic, direct, concise, and non-fluffy.',
    'Behavior rules:',
    '- Answer using only the provided CONTEXT.',
    '- If the context is insufficient, state uncertainty plainly.',
    '- Do not invent services, case studies, offers, metrics, or timelines.',
    '- Do not proactively pitch or sell; answer-only unless explicitly asked for next steps.',
    '- Keep responses concise (usually <= 150 words).'
  ].join('\n');
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

  const corpus = core.buildCorpus();
  const ranked = core.rankChunks(latestUserMessage.content, corpus.chunks, 6);

  if (core.isLowConfidence(latestUserMessage.content, ranked)) {
    return json(res, 200, {
      reply: core.fallbackReply(),
      sources: []
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json(res, 503, { error: 'temporarily_unavailable' });
  }

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const contextBlock = core.buildContextBlock(ranked, 4);

  let reply;
  try {
    reply = await callClaude({
      model,
      apiKey,
      systemPrompt: buildSystemPrompt(),
      contextBlock,
      messages
    });
  } catch (_error) {
    return json(res, 503, { error: 'temporarily_unavailable' });
  }

  return json(res, 200, {
    reply,
    sources: core.buildSourceList(ranked, 3)
  });
}

handler._internal = {
  parseBody,
  sanitizeMessages,
  callClaude,
  buildSystemPrompt
};

module.exports = handler;
