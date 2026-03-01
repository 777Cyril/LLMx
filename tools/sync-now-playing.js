#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const nowPlayingDir = path.join(rootDir, 'now playing');

const args = process.argv.slice(2);
const shouldPublish = args.includes('--publish');

function readCommitMessage(argv) {
  const messageFlagIndex = argv.indexOf('--message');
  if (messageFlagIndex === -1) return 'Sync now playing playlist';
  return argv[messageFlagIndex + 1] || 'Sync now playing playlist';
}

const commitMessage = readCommitMessage(args);

function escapeSingleQuotedJs(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: rootDir,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

if (!fs.existsSync(nowPlayingDir)) {
  console.error('Missing folder:', nowPlayingDir);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('Missing file:', indexPath);
  process.exit(1);
}

const files = fs
  .readdirSync(nowPlayingDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.mp3$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

if (!files.length) {
  console.error('No .mp3 files found in', nowPlayingDir);
  process.exit(1);
}

const trackLines = files.map((filename) => `        '${escapeSingleQuotedJs(filename)}'`);
const newBlock = `const NOW_PLAYING_FILES = [\n${trackLines.join(',\n')}\n    ];`;

const oldHtml = fs.readFileSync(indexPath, 'utf8');
const pattern = /const NOW_PLAYING_FILES = \[[\s\S]*?\n\s*\];/;

if (!pattern.test(oldHtml)) {
  console.error('Could not find NOW_PLAYING_FILES block in index.html');
  process.exit(1);
}

const newHtml = oldHtml.replace(pattern, newBlock);
const changed = newHtml !== oldHtml;

if (changed) {
  fs.writeFileSync(indexPath, newHtml, 'utf8');
  console.log(`Updated playlist with ${files.length} tracks.`);
} else {
  console.log(`Playlist already up to date (${files.length} tracks).`);
}

if (!shouldPublish) {
  console.log('Done. Run with --publish to add/commit/push changes.');
  process.exit(0);
}

run('git', ['add', 'index.html', 'now playing']);

const cachedDiff = spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: rootDir });
if (cachedDiff.status === 0) {
  console.log('No staged changes to commit.');
  process.exit(0);
}

run('git', ['commit', '-m', commitMessage]);
run('git', ['push']);

console.log('Published playlist changes to remote.');
