'use strict';

const { OpenAI, toFile } = require('openai');

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method_not_allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[transcribe] OPENAI_API_KEY not set');
    return json(res, 503, { error: 'unavailable' });
  }

  const { audio, mimeType } = req.body || {};
  if (!audio) {
    return json(res, 400, { error: 'no_audio' });
  }

  try {
    const buffer = Buffer.from(audio, 'base64');
    const ext = mimeType?.includes('ogg') ? 'ogg'
              : mimeType?.includes('mp4') ? 'mp4'
              : 'webm';

    const openai = new OpenAI({ apiKey });
    const file = await toFile(buffer, `audio.${ext}`, { type: mimeType || 'audio/webm' });

    const response = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    });

    return json(res, 200, { text: response.text });
  } catch (err) {
    console.error('[transcribe] error:', err.message);
    return json(res, 500, { error: err.message });
  }
};
