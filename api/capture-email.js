'use strict';

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS   = 'LLMx <team@llmxai.co>';
const NOTIFY_ADDRESS = 'team@llmxai.co';

function parseBody(req) {
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (_) { return null; }
  }
  if (req.body && typeof req.body === 'object') return req.body;
  return null;
}

function json(res, status, payload) {
  res.statusCode = status;
  if (typeof res.setHeader === 'function') {
    res.setHeader('content-type', 'application/json; charset=utf-8');
  }
  if (typeof res.end === 'function') res.end(JSON.stringify(payload));
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function sendEmail({ apiKey, from, to, subject, html }) {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ from, to, subject, html })
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Resend ${response.status}: ${text.slice(0, 200)}`);
  }
  return response.json();
}

async function handler(req, res) {
  if (String(req?.method || '').toUpperCase() !== 'POST') {
    return json(res, 405, { error: 'method_not_allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[capture-email] RESEND_API_KEY not set');
    return json(res, 503, { error: 'temporarily_unavailable' });
  }

  const body = parseBody(req);
  if (!body) return json(res, 400, { error: 'invalid_request' });

  const email = String(body.email || '').trim().toLowerCase();
  if (!isValidEmail(email)) return json(res, 400, { error: 'invalid_email' });

  const now = new Date().toUTCString();

  try {
    // 1. Notify founder
    await sendEmail({
      apiKey,
      from: FROM_ADDRESS,
      to: NOTIFY_ADDRESS,
      subject: `New LLMx lead: ${email}`,
      html: `
        <div style="font-family: monospace; font-size: 13px; color: #1a1a1a;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${now}</p>
          <p><strong>Source:</strong> Ask LLMx chat modal</p>
        </div>
      `
    });

    // 2. Auto-reply to visitor
    await sendEmail({
      apiKey,
      from: FROM_ADDRESS,
      to: email,
      subject: 'Your LLMx Sprint summary',
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; background: #f5f0e8;">
          <p style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 28px; opacity: 0.45;">LLMx — Studio Vol. 01</p>
          <p style="font-size: 15px; line-height: 1.65; margin: 0 0 16px;">Hey,</p>
          <p style="font-size: 15px; line-height: 1.65; margin: 0 0 16px;">You asked about the 0→1 Shipping Sprint. Here's the short version.</p>
          <p style="font-size: 15px; line-height: 1.65; margin: 0 0 24px;">Four sessions. In the first one, you ship something live — under three hours. Sessions 2–4 build the workflow, tools, and judgment to keep shipping on your own.</p>
          <div style="border-left: 2px solid #1a1a1a; padding-left: 16px; margin: 0 0 16px;">
            <p style="font-size: 13px; line-height: 1.7; margin: 0;"><strong>Who it's for:</strong> Operators with partial technical fluency blocked on implementation, not motivation — PMs, founders, consultants, agency owners.</p>
          </div>
          <div style="border-left: 2px solid #1a1a1a; padding-left: 16px; margin: 0 0 32px;">
            <p style="font-size: 13px; line-height: 1.7; margin: 0;"><strong>What you leave with:</strong> Deployed MVP, GitHub repo + pipeline, agentic coding workflow, next-build roadmap.</p>
          </div>
          <p style="margin: 0 0 16px;">
            <a href="https://calendly.com/llmxai" style="display: inline-block; background: #1a1a1a; color: #f5f0e8; padding: 10px 22px; text-decoration: none; font-size: 13px; letter-spacing: 0.04em;">Book a call →</a>
          </p>
          <p style="font-size: 13px; line-height: 1.65; margin: 0 0 32px; opacity: 0.65;">Or just reply with what you're building and I'll tell you if the Sprint is the right move.</p>
          <p style="font-size: 12px; line-height: 1.6; margin: 0; opacity: 0.45;">— LLMx<br>Brooklyn, NY<br>team@llmxai.co</p>
        </div>
      `
    });

    return json(res, 200, { success: true });
  } catch (err) {
    console.error('[capture-email] send failed:', err.message);
    return json(res, 500, { error: 'send_failed' });
  }
}

module.exports = handler;
