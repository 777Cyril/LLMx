#!/usr/bin/env node
const assert = require('node:assert/strict');

function computeWidgetOpenState(state) {
  const panelOpen = Boolean(state.panelOpen) && !Boolean(state.panelAriaHidden);
  if (!panelOpen) return false;

  if (!Boolean(state.overlayPresent)) {
    return panelOpen;
  }

  const overlayOpen = Boolean(state.overlayVisible) && !Boolean(state.overlayAriaHidden);
  return panelOpen && overlayOpen;
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

test('closed when panel is closed even if overlay says visible', () => {
  assert.equal(
    computeWidgetOpenState({
      panelOpen: false,
      panelAriaHidden: false,
      overlayPresent: true,
      overlayVisible: true,
      overlayAriaHidden: false
    }),
    false
  );
});

test('open when panel open and overlay visible', () => {
  assert.equal(
    computeWidgetOpenState({
      panelOpen: true,
      panelAriaHidden: false,
      overlayPresent: true,
      overlayVisible: true,
      overlayAriaHidden: false
    }),
    true
  );
});

test('closed when overlay exists but is hidden', () => {
  assert.equal(
    computeWidgetOpenState({
      panelOpen: true,
      panelAriaHidden: false,
      overlayPresent: true,
      overlayVisible: false,
      overlayAriaHidden: false
    }),
    false
  );
});

test('open when panel open and no overlay exists yet', () => {
  assert.equal(
    computeWidgetOpenState({
      panelOpen: true,
      panelAriaHidden: false,
      overlayPresent: false,
      overlayVisible: false,
      overlayAriaHidden: false
    }),
    true
  );
});

