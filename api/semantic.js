'use strict';

/**
 * api/semantic.js
 *
 * Runtime semantic search: embed the user query with OpenAI,
 * query Pinecone for nearest corpus chunks, return scored results.
 *
 * Called in parallel with lexical ranking inside sidebar-chat.js.
 * Gracefully no-ops if PINECONE_API_KEY or OPENAI_API_KEY are absent.
 */

const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');

const INDEX_NAME = process.env.PINECONE_INDEX || 'llmx-faqs';
const NAMESPACE = 'corpus';
const EMBEDDING_MODEL = 'text-embedding-3-small';

/**
 * @param {string} query - raw user message
 * @param {{ pineconeKey: string, openaiKey: string }} keys
 * @param {number} topK - how many nearest neighbors to fetch
 * @returns {Promise<Array<{ id, score, label, url, title, text }>>}
 */
async function semanticSearch(query, { pineconeKey, openaiKey }, topK = 6) {
  const openai = new OpenAI({ apiKey: openaiKey });
  const pc    = new Pinecone({ apiKey: pineconeKey });
  const index = pc.index(INDEX_NAME).namespace(NAMESPACE);

  // 1. Embed the query
  const embResp = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  });
  const queryVector = embResp.data[0].embedding;

  // 2. Nearest-neighbor search in Pinecone
  const result = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  // 3. Normalise to a flat array matching the lexical chunk shape
  return (result.matches || []).map((match) => ({
    id:    match.id,
    score: match.score,           // cosine similarity 0–1
    label: match.metadata?.label || '',
    url:   match.metadata?.url   || '',
    title: match.metadata?.title || '',
    text:  match.metadata?.text  || '',
  }));
}

module.exports = { semanticSearch };
