#!/usr/bin/env node
const assert = require('node:assert/strict');

const { test } = require('./test-utils');

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

function shouldCloseMenuFromWidgetTransition(previousOpen, currentOpen) {
  return Boolean(previousOpen) && !Boolean(currentOpen);
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

test('menu closes only on open-to-closed transition', () => {
  assert.equal(shouldCloseMenuFromWidgetTransition(false, false), false);
  assert.equal(shouldCloseMenuFromWidgetTransition(false, true), false);
  assert.equal(shouldCloseMenuFromWidgetTransition(true, true), false);
  assert.equal(shouldCloseMenuFromWidgetTransition(true, false), true);
});
