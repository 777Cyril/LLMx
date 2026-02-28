#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['.git', 'node_modules']);

function collectHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function extractHrefs(html) {
  const hrefs = [];
  const regex = /\shref\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html))) {
    hrefs.push(match[1].trim());
  }
  return hrefs;
}

function isExternal(href) {
  return /^(https?:)?\/\//i.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:') ||
    href.startsWith('#');
}

function normalizeHref(href) {
  return href.split('#')[0].split('?')[0];
}

function resolveAbsoluteHrefToFilesystemPath(href) {
  if (href === '/') return [path.join(ROOT, 'index.html')];
  const clean = href.startsWith('/') ? href.slice(1) : href;
  const direct = path.join(ROOT, clean);
  const asDirectoryIndex = path.join(ROOT, clean, 'index.html');
  const noSlashDirectoryIndex = path.join(ROOT, clean.replace(/\/$/, ''), 'index.html');
  return [direct, asDirectoryIndex, noSlashDirectoryIndex];
}

function test(name, fn) {
  try {
    fn();
    process.stdout.write(`PASS ${name}\n`);
  } catch (err) {
    process.stderr.write(`FAIL ${name}\n${err.stack}\n`);
    process.exitCode = 1;
  }
}

test('no internal links reference /bootcamp/', () => {
  const offenders = [];
  for (const htmlFile of collectHtmlFiles(ROOT)) {
    const html = stripComments(fs.readFileSync(htmlFile, 'utf8'));
    const hrefs = extractHrefs(html);
    for (const href of hrefs) {
      if (href.includes('/bootcamp/')) {
        offenders.push(`${path.relative(ROOT, htmlFile)} -> ${href}`);
      }
    }
  }
  assert.equal(
    offenders.length,
    0,
    `Found deprecated /bootcamp/ links:\n${offenders.join('\n')}`
  );
});

test('root-relative internal links resolve to files', () => {
  const missing = [];
  for (const htmlFile of collectHtmlFiles(ROOT)) {
    const html = stripComments(fs.readFileSync(htmlFile, 'utf8'));
    const hrefs = extractHrefs(html);
    for (const rawHref of hrefs) {
      if (isExternal(rawHref)) continue;
      const href = normalizeHref(rawHref);
      if (!href.startsWith('/')) continue;

      const candidates = resolveAbsoluteHrefToFilesystemPath(href);
      const exists = candidates.some((candidate) => fs.existsSync(candidate));
      if (!exists) {
        missing.push(`${path.relative(ROOT, htmlFile)} -> ${rawHref}`);
      }
    }
  }
  assert.equal(
    missing.length,
    0,
    `Found missing root-relative internal links:\n${missing.join('\n')}`
  );
});
