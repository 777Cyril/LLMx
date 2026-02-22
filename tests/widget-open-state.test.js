#!/usr/bin/env node
const assert = require('node:assert/strict');

function computeWidgetOpenState(state) {
  const panelOpen = Boolean(state.panelOpen) && !Boolean(state.panelAriaHidden);
  const panelVisible = state.panelActuallyVisible !== false;
  if (!panelOpen || !panelVisible) return false;

  if (!Boolean(state.overlayPresent)) {
    return panelOpen;
  }

  const overlayOpen = Boolean(state.overlayVisible) && !Boolean(state.overlayAriaHidden);
  const overlayVisible = state.overlayActuallyVisible !== false;
  if (!overlayVisible) return false;
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
      panelActuallyVisible: true,
      overlayPresent: true,
      overlayVisible: true,
      overlayAriaHidden: false,
      overlayActuallyVisible: true
    }),
    false
  );
});

test('open when panel open and overlay visible', () => {
  assert.equal(
    computeWidgetOpenState({
      panelOpen: true,
      panelAriaHidden: false,
      panelActuallyVisible: true,
      overlayPresent: true,
      overlayVisible: true,
      overlayAriaHidden: false,
      overlayActuallyVisible: true
    }),
    true
  );
});

test('closed when overlay exists but is hidden', () => {
  assert.equal(
    computeWidgetOpenState({
      panelOpen: true,
      panelAriaHidden: false,
      panelActuallyVisible: true,
      overlayPresent: true,
      overlayVisible: false,
      overlayAriaHidden: false,
      overlayActuallyVisible: true
    }),
    false
  );
});

test('open when panel open and no overlay exists yet', () => {
  assert.equal(
    computeWidgetOpenState({
      panelOpen: true,
      panelAriaHidden: false,
      panelActuallyVisible: true,
      overlayPresent: false,
      overlayVisible: false,
      overlayAriaHidden: false,
      overlayActuallyVisible: false
    }),
    true
  );
});

test('closed when panel semantic open but not actually visible', () => {
  assert.equal(
    computeWidgetOpenState({
      panelOpen: true,
      panelAriaHidden: false,
      panelActuallyVisible: false,
      overlayPresent: false,
      overlayVisible: false,
      overlayAriaHidden: false,
      overlayActuallyVisible: false
    }),
    false
  );
});

test('closed when overlay semantic open but not actually visible', () => {
  assert.equal(
    computeWidgetOpenState({
      panelOpen: true,
      panelAriaHidden: false,
      panelActuallyVisible: true,
      overlayPresent: true,
      overlayVisible: true,
      overlayAriaHidden: false,
      overlayActuallyVisible: false
    }),
    false
  );
});
