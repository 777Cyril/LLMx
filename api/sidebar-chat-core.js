'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how', 'i', 'in', 'is', 'it',
  'of', 'on', 'or', 'that', 'the', 'to', 'what', 'when', 'where', 'which', 'who', 'why', 'with',
  'can', 'you', 'your', 'does', 'do', 'about', 'this', 'we', 'our', 'they', 'their', 'them',
  'will', 'would', 'could', 'should', 'into', 'than', 'then', 'there', 'here', 'also', 'just'
]);

let cachedCorpus = null;

function safeReadFile(relativePath) {
  const absolutePath = path.join(ROOT_DIR, relativePath);
  return fs.readFileSync(absolutePath, 'utf8');
}

function decodeHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
}

function normalizeWhitespace(text) {
  return String(text || '')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \f\v]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripHtmlToText(html) {
  const withoutScripts = String(html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ');

  const withBlockBreaks = withoutScripts
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/section>/gi, '\n\n')
    .replace(/<\/article>/gi, '\n\n')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '');

  const stripped = withBlockBreaks.replace(/<[^>]+>/g, ' ');
  return normalizeWhitespace(decodeHtmlEntities(stripped));
}

function stripMarkdownToText(markdown) {
  const text = String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    .replace(/---+/g, ' ');
  return normalizeWhitespace(text);
}

function extractMainHtmlText(html) {
  const mainMatch = String(html || '').match(/<main\b[^>]*>[\s\S]*?<\/main>/i);
  const source = mainMatch ? mainMatch[0] : html;
  return stripHtmlToText(source);
}

function splitLongParagraph(paragraph, maxChunkSize) {
  if (paragraph.length <= maxChunkSize) return [paragraph];

  const sentenceSplit = paragraph
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!sentenceSplit.length) {
    const pieces = [];
    let idx = 0;
    while (idx < paragraph.length) {
      pieces.push(paragraph.slice(idx, idx + maxChunkSize));
      idx += maxChunkSize;
    }
    return pieces;
  }

  const chunks = [];
  let current = '';
  for (const sentence of sentenceSplit) {
    if (!current) {
      current = sentence;
      continue;
    }
    if ((current.length + sentence.length + 1) <= maxChunkSize) {
      current += ` ${sentence}`;
    } else {
      chunks.push(current);
      current = sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function chunkText(text, options = {}) {
  const targetSize = options.targetSize || 700;
  const minChunkSize = options.minChunkSize || 500;
  const maxChunkSize = options.maxChunkSize || 900;

  const paragraphs = normalizeWhitespace(text)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .flatMap((item) => splitLongParagraph(item, maxChunkSize));

  const chunks = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if (!current) {
      current = paragraph;
      continue;
    }

    const candidate = `${current}\n\n${paragraph}`;
    if (candidate.length <= targetSize || current.length < minChunkSize) {
      current = candidate;
      continue;
    }

    chunks.push(current);
    current = paragraph;
  }

  if (current) chunks.push(current);

  return chunks
    .map((item) => normalizeWhitespace(item))
    .filter((item) => item.length >= 120);
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && token.length > 1 && !STOPWORDS.has(token));
}

function tokenFrequency(tokens) {
  const freq = Object.create(null);
  for (const token of tokens) {
    freq[token] = (freq[token] || 0) + 1;
  }
  return freq;
}

function buildDocuments() {
  const homepageText = extractMainHtmlText(safeReadFile('index.html'));
  const onyxText = extractMainHtmlText(safeReadFile('work/onyx/index.html'));

  const blogRaw = JSON.parse(safeReadFile('blog/posts.json'));
  const publishedPosts = blogRaw.filter((post) => post && post.status === 'published');

  const docs = [
    {
      key: 'homepage',
      label: 'Homepage',
      url: '/#about',
      title: 'LLMx Homepage',
      text: homepageText
    },
    {
      key: 'onyx-case',
      label: 'Onyx Case Study',
      url: '/work/onyx/',
      title: 'Onyx Case Study',
      text: onyxText
    }
  ];

  for (const post of publishedPosts) {
    const postText = normalizeWhitespace([
      post.title || '',
      post.excerpt || '',
      stripMarkdownToText(post.body || '')
    ].join('\n\n'));

    docs.push({
      key: `blog-${post.id || 'post'}`,
      label: 'Blog',
      url: post.id ? `/blog/post.html?id=${post.id}` : '/blog/',
      title: post.title || 'Blog Post',
      text: postText
    });
  }

  return docs;
}

function buildCorpus() {
  if (cachedCorpus) return cachedCorpus;

  const docs = buildDocuments();
  const chunks = [];

  for (const doc of docs) {
    const docChunks = chunkText(doc.text);
    docChunks.forEach((chunkTextValue, idx) => {
      const id = `${doc.key}-${idx + 1}`;
      const normalized = normalizeWhitespace(chunkTextValue.toLowerCase());
      const tokens = tokenize(chunkTextValue);
      chunks.push({
        id,
        label: doc.label,
        url: doc.url,
        title: doc.title,
        text: chunkTextValue,
        normalized,
        tokenFreq: tokenFrequency(tokens)
      });
    });
  }

  cachedCorpus = {
    docs,
    chunks
  };

  return cachedCorpus;
}

function buildBigrams(tokens) {
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i += 1) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
}

function scoreChunk(queryTokens, queryNorm, queryBigrams, chunk) {
  let score = 0;
  let matchedTokens = 0;

  for (const token of queryTokens) {
    const freq = chunk.tokenFreq[token] || 0;
    if (!freq) continue;
    matchedTokens += 1;
    score += 1 + Math.min(2, freq) * 0.35;
  }

  if (queryNorm.length >= 12 && chunk.normalized.includes(queryNorm)) {
    score += 4;
  }

  for (const bigram of queryBigrams) {
    if (chunk.normalized.includes(bigram)) {
      score += 1.2;
    }
  }

  if (queryTokens.length > 1 && matchedTokens === queryTokens.length) {
    score += 2;
  }

  return { score, matchedTokens };
}

function rankChunks(query, chunks, limit = 6) {
  const queryTokens = Array.from(new Set(tokenize(query)));
  const queryNorm = normalizeWhitespace(String(query || '').toLowerCase());
  const queryBigrams = buildBigrams(queryTokens);

  if (!queryTokens.length || !Array.isArray(chunks) || !chunks.length) {
    return [];
  }

  const scored = chunks
    .map((chunk) => {
      const { score, matchedTokens } = scoreChunk(queryTokens, queryNorm, queryBigrams, chunk);
      return {
        ...chunk,
        score,
        matchedTokens
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, limit));

  return scored;
}

function isLowConfidence(query, rankedChunks) {
  const queryTokens = Array.from(new Set(tokenize(query)));
  if (!queryTokens.length) return true;
  if (!rankedChunks.length) return true;

  const top = rankedChunks[0];
  if (top.score < 1.6) return true;

  if (queryTokens.length >= 3 && top.matchedTokens < 2) return true;
  if (queryTokens.length >= 5 && top.matchedTokens < 3) return true;

  return false;
}

function buildContextBlock(topChunks, maxChunks = 4) {
  return topChunks
    .slice(0, maxChunks)
    .map((chunk) => {
      const preview = chunk.text.length > 700 ? `${chunk.text.slice(0, 700)}...` : chunk.text;
      return `[${chunk.id} | ${chunk.label} | ${chunk.url}]\n${preview}`;
    })
    .join('\n\n');
}

function buildSourceList(topChunks, maxSources = 3) {
  return topChunks
    .slice(0, maxSources)
    .map((chunk) => ({
      id: chunk.id,
      label: chunk.label,
      url: chunk.url
    }));
}

function fallbackReply() {
  return 'I do not have enough reliable context on that yet. Ask about LLMx services, the Onyx case study, or published blog topics and I can answer directly.';
}

function resetCacheForTests() {
  cachedCorpus = null;
}

module.exports = {
  buildCorpus,
  rankChunks,
  isLowConfidence,
  buildContextBlock,
  buildSourceList,
  fallbackReply,
  normalizeWhitespace,
  tokenize,
  _resetCacheForTests: resetCacheForTests
};
