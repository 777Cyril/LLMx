#!/usr/bin/env node
const assert = require('node:assert/strict');

const handler = require('../api/sidebar-chat');

function test(name, fn) {
  Promise.resolve()
    .then(fn)
    .then(() => {
      process.stdout.write(`PASS ${name}\n`);
    })
    .catch((error) => {
      process.stderr.write(`FAIL ${name}\n${error.stack}\n`);
      process.exitCode = 1;
    });
}

async function invoke({ method = 'POST', body, env = {}, fetchImpl } = {}) {
  const previousKey = process.env.OPENAI_API_KEY;
  const previousModel = process.env.OPENAI_MODEL;
  const previousFetch = global.fetch;

  if (Object.prototype.hasOwnProperty.call(env, 'OPENAI_API_KEY')) {
    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  } else {
    delete process.env.OPENAI_API_KEY;
  }

  if (Object.prototype.hasOwnProperty.call(env, 'OPENAI_MODEL')) {
    process.env.OPENAI_MODEL = env.OPENAI_MODEL;
  } else {
    delete process.env.OPENAI_MODEL;
  }

  if (fetchImpl) {
    global.fetch = fetchImpl;
  }

  const req = { method, body };
  const res = {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(name, value) {
      this.headers[String(name).toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
    end(payload) {
      this.payload = payload;
      return this;
    }
  };

  try {
    await handler(req, res);
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;

    if (previousModel === undefined) delete process.env.OPENAI_MODEL;
    else process.env.OPENAI_MODEL = previousModel;

    global.fetch = previousFetch;
  }

  return res;
}

test('returns 405 for invalid method', async () => {
  const res = await invoke({ method: 'GET' });
  assert.equal(res.statusCode, 405);
  assert.equal(res.payload.error, 'method_not_allowed');
});

test('returns 400 for invalid payload', async () => {
  const res = await invoke({ body: { messages: [] } });
  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.error, 'invalid_request');
});

test('returns 503 when OPENAI_API_KEY is missing', async () => {
  const res = await invoke({
    body: {
      messages: [{ role: 'user', content: 'what is onyx?' }],
      context: { page: 'home' }
    },
    env: { OPENAI_API_KEY: undefined }
  });

  assert.equal(res.statusCode, 503);
  assert.equal(res.payload.error, 'temporarily_unavailable');
});

test('returns reply and sources when OpenAI call succeeds', async () => {
  const mockFetch = async () => ({
    ok: true,
    json: async () => ({ output_text: 'LLMx helps operators ship practical AI systems quickly.' })
  });

  const res = await invoke({
    body: {
      messages: [{ role: 'user', content: 'what is onyx?' }],
      context: { page: 'home' }
    },
    env: { OPENAI_API_KEY: 'test-key', OPENAI_MODEL: 'gpt-4.1-mini' },
    fetchImpl: mockFetch
  });

  assert.equal(res.statusCode, 200);
  assert.equal(typeof res.payload.reply, 'string');
  assert.ok(res.payload.reply.length > 0);
  assert.ok(Array.isArray(res.payload.sources));
  assert.ok(res.payload.sources.length > 0);
});
