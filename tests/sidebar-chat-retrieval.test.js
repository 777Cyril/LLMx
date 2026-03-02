#!/usr/bin/env node
const assert = require('node:assert/strict');

const core = require('../api/sidebar-chat-core');
const { test } = require('./test-utils');

core._resetCacheForTests();
const corpus = core.buildCorpus();

test('query about LLMx maps to homepage positioning chunks', () => {
  const ranked = core.rankChunks('what does llmx do for operators', corpus.chunks, 5);
  const topThree = ranked.slice(0, 3);
  assert.ok(topThree.length > 0, 'expected ranked results');
  assert.ok(
    topThree.some((chunk) => chunk.label === 'Homepage'),
    'expected at least one Homepage chunk in top 3 results'
  );
});

test('query about Onyx ranks Onyx case study highly', () => {
  const ranked = core.rankChunks('what is onyx and how does the extension work', corpus.chunks, 5);
  assert.ok(ranked.length > 0, 'expected ranked results');
  assert.equal(ranked[0].label, 'Onyx Case Study');
});

test('unrelated query is marked low confidence', () => {
  const query = 'quantum vineyard satellites for asteroid gardening';
  const ranked = core.rankChunks(query, corpus.chunks, 5);
  assert.equal(core.isLowConfidence(query, ranked), true);
});
