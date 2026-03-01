#!/usr/bin/env node
/**
 * scripts/ingest-corpus.js
 *
 * One-time script to embed all corpus chunks and upsert them into Pinecone.
 * Re-run whenever site content changes (corpus HTML files updated).
 *
 * Usage:
 *   PINECONE_API_KEY=... OPENAI_API_KEY=... node scripts/ingest-corpus.js
 *
 * Upserts into the 'corpus' namespace of the existing llmx-faqs index,
 * keeping FAQ vectors in the default namespace untouched.
 */
'use strict';

const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');
const core = require('../api/sidebar-chat-core');

const INDEX_NAME = process.env.PINECONE_INDEX || 'llmx-faqs';
const NAMESPACE = 'corpus';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 50;

async function main() {
  const pineconeKey = process.env.PINECONE_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!pineconeKey) { console.error('Missing PINECONE_API_KEY'); process.exit(1); }
  if (!openaiKey)   { console.error('Missing OPENAI_API_KEY');   process.exit(1); }

  const openai = new OpenAI({ apiKey: openaiKey });
  const pc = new Pinecone({ apiKey: pineconeKey });
  const index = pc.index(INDEX_NAME).namespace(NAMESPACE);

  // Build corpus using the same chunking logic as the serverless function
  if (typeof core._resetCacheForTests === 'function') core._resetCacheForTests();
  const corpus = core.buildCorpus();
  const chunks = corpus.chunks;

  console.log(`\nCorpus ready — ${chunks.length} chunks across all documents`);
  console.log(`Target: index="${INDEX_NAME}" namespace="${NAMESPACE}"\n`);

  // Embed each chunk
  const vectors = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(`  [${i + 1}/${chunks.length}] ${chunk.id} ... `);

    const resp = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: chunk.text,
    });

    vectors.push({
      id: chunk.id,
      values: resp.data[0].embedding,
      metadata: {
        label: chunk.label,
        url:   chunk.url,
        title: chunk.title,
        text:  chunk.text.slice(0, 1000), // Pinecone metadata cap
      },
    });

    process.stdout.write('done\n');
  }

  // Upsert in batches
  console.log(`\nUpserting ${vectors.length} vectors in batches of ${BATCH_SIZE}...`);
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);
    await index.upsert(batch);
    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1} upserted (${batch.length} vectors)`);
  }

  // Wait briefly for consistency then verify
  await new Promise((r) => setTimeout(r, 3000));
  const stats = await pc.index(INDEX_NAME).describeIndexStats();
  const nsStats = stats.namespaces?.[NAMESPACE];
  console.log(`\n✓ Done. Namespace "${NAMESPACE}": ${nsStats?.vectorCount ?? '(updating)'} vectors`);
  console.log(`  Full index stats:`, JSON.stringify(stats.namespaces, null, 2));
}

main().catch((err) => {
  console.error('\nIngestion failed:', err.message);
  process.exit(1);
});
