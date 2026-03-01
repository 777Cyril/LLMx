# LLMx — CLAUDE.md

## Project Overview

LLMx is an AI coaching platform. The site markets a **4-session "0→1 Shipping Sprint"** (coaching program for semi-technical operators) and includes:
- Main landing page with AI chat modal ("Ask LLMx" hero button → `#gpt-modal` dialog)
- Blog, prompt library, knowledge library
- Onyx case study (`/onyx/`, `/work/onyx/`)
- Retro arcade games (`/arcade/`)

**Active branch:** `redesign/v2` — ongoing homepage redesign. PRs target `main`.

---

## Architecture

**Static frontend + Vercel serverless API.** No build step. Files served as-is.

```
index.html          Main landing page (1342 lines)
style-v2.css        Main stylesheet — CSS Grid, theming, responsive (1945 lines)
scripts.js          Theme toggle, setSide() panel logic — used by arcade/work/knowledge/prompts pages

api/
  sidebar-chat.js       POST /api/sidebar-chat — orchestrates search + Claude call
  sidebar-chat-core.js  Corpus build, BM25-style lexical ranking, text chunking
  semantic.js           Semantic search — OpenAI embeddings + Pinecone query
  system-prompt.txt     Claude system prompt (voice, offer, CTA)
  corpus/               Static knowledge base: home/onyx/work/arcade/prompts/knowledge .html + posts.json + faqs.json

onyx/               Onyx product pages (own scripts.js + style.css)
onyx/privacy/       Privacy policy (own scripts.js)
arcade/             Six games — each has index.html, uses /scripts.js
blog/               Blog listing + post template (posts.json is source of truth)
prompts/            Prompt library (prompts.js holds all data)
knowledge/          Knowledge library (knowledge.js holds all data)
tests/              3 test files — native Node assert, no framework
```

---

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS — no framework, no build tooling
- **Backend:** Node.js ≥18, Vercel serverless functions
- **AI:** Anthropic Claude (`claude-haiku-4-5-20251001` default, override via `ANTHROPIC_MODEL` env var)
- **Search:** OpenAI `text-embedding-3-small` + Pinecone (`llmx-faqs` index) for semantic; BM25-style lexical in `sidebar-chat-core.js`
- **Hybrid scoring:** 40% lexical + 60% semantic; confidence threshold ≥0.28 hybrid or ≥1.6 lexical
- **Dependencies:** `@pinecone-database/pinecone`, `openai` (no frontend dependencies)
- **Deployment:** Vercel — `vercel.json` bundles `api/corpus/**` into the function

---

## Environment Variables

```
ANTHROPIC_API_KEY
OPENAI_API_KEY
PINECONE_API_KEY
ANTHROPIC_MODEL   # optional, defaults to claude-haiku-4-5-20251001
```

Stored in `.env` (gitignored). Set in Vercel dashboard for production.

---

## Chat Modal + API

**UX entry point:** "Ask LLMx" button in the hero section opens `#gpt-modal` (a `<dialog>` element). The floating widget (`llmx-panel` / `llmx-trigger`) exists in the HTML but is disabled via `window.ENABLE_FLOATING_LLMX_WIDGET = false`.

**POST /api/sidebar-chat**

Pipeline: sanitize input → build/cache corpus → lexical rank (top 6) → semantic search in parallel (4.5s timeout, graceful fallback) → hybrid merge → confidence gate → Claude call → post-process sources → return `{ reply, sources }`.

Key behaviors:
- Lexical query uses last 2 user turns; semantic query uses latest turn only
- Booking-intent detection suppresses page sources and shows Calendly CTA
- `buildCorpus()` is memoized — only runs once per cold start
- Semantic search is optional: if Pinecone/OpenAI keys are absent, falls back to lexical-only

---

## Conventions

- **Vanilla JS only** — no frameworks, no transpilation
- **CommonJS** (`require`/`module.exports`) in `api/` files
- **Constants in UPPERCASE** — `STOPWORDS`, `SCORE`, `INDEX_NAME`
- **camelCase** for functions/variables; **kebab-case** for CSS classes
- `setSide(target)` helper in all three `scripts.js` files controls the left/right body class for panel animations
- Theme: time-based dark mode default (dark 19:00–07:00), persisted in `localStorage` (root) or `sessionStorage` (index.html)
- CSS custom properties for all colors/spacing — defined on `:root` in `style-v2.css`
- `style.css` is legacy — prefer `style-v2.css`

---

## Testing

```bash
node tests/sidebar-chat-api.test.js
node tests/sidebar-chat-retrieval.test.js
node tests/widget-open-state.test.js
```

No test framework — uses native `node:assert/strict`. No test runner script in package.json; run files directly.

---

## Corpus Updates

When site content changes, update the corresponding file in `api/corpus/`:
- Page content → edit the matching `.html` file (e.g. `home.html`, `onyx.html`)
- Blog posts → `posts.json`
- FAQs → `faqs.json`

The corpus is rebuilt automatically on next cold start (memoized in memory during warm execution).
