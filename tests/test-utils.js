#!/usr/bin/env node
'use strict';

// Unified test runner shared across all test files.
// Works for both sync and async test functions — sync throws are caught via Promise.resolve().then(fn).
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

module.exports = { test };
