const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('script.js', 'utf8');
const address = '0x1234567890abcdef1234567890abcdef12345678';

function setup({ ethereum, protocol = 'http:' } = {}) {
  const events = new Map();
  const buttons = [0, 1].map(() => ({
    disabled: false,
    addEventListener(type, handler) { this[type] = handler; },
    setAttribute(name, value) { this[name] = value; },
  }));
  const label = { textContent: 'Connect MetaMask' };
  const status = { textContent: '', scrollIntoView() { this.scrolled = true; } };
  const document = {
    querySelectorAll() { return buttons; },
    querySelector(selector) {
      if (selector === '.header-wallet') return buttons[0];
      if (selector === '[data-wallet-label]') return label;
      if (selector === '#wallet-status') return status;
      throw new Error(`Unexpected selector: ${selector}`);
    },
  };
  const window = {
    ethereum,
    addEventListener(type, handler) { events.set(type, handler); },
    dispatchEvent(event) { events.get(event.type)?.(event); },
  };
  vm.runInNewContext(source, { document, window, location: { protocol }, Event, setTimeout });
  return { buttons, label, status, events, window };
}

test('connects to an announced MetaMask provider instead of another injected wallet', async () => {
  let selected = false;
  const metaMask = {
    request: async ({ method }) => { assert.equal(method, 'eth_requestAccounts'); selected = true; return [address]; },
    on() {},
  };
  const otherWallet = { request: async () => { throw new Error('wrong provider'); } };
  const page = setup({ ethereum: otherWallet });
  page.window.dispatchEvent({ type: 'eip6963:announceProvider', detail: { info: { rdns: 'io.metamask' }, provider: metaMask } });
  await page.buttons[0].click();
  assert.equal(selected, true);
  assert.match(page.label.textContent, /^0x1234…5678$/);
  assert.match(page.status.textContent, /No transaction was requested/);
  assert.equal(page.buttons[0].disabled, false);
});

test('uses the legacy injected MetaMask provider and responds to account changes', async () => {
  let changed;
  const metaMask = {
    isMetaMask: true,
    request: async () => [address],
    on(type, handler) { if (type === 'accountsChanged') changed = handler; },
  };
  const page = setup({ ethereum: { providers: [{ request() {} }, metaMask] } });
  await page.buttons[1].click();
  changed([]);
  assert.equal(page.label.textContent, 'Connect MetaMask');
  assert.match(page.status.textContent, /no longer connected/);
});

test('explains a declined request and a request already open in MetaMask', async () => {
  for (const [code, expected] of [[4001, /declined/], [-32002, /already open/]]) {
    const page = setup({ ethereum: { isMetaMask: true, request: async () => { throw { code }; } } });
    await page.buttons[0].click();
    assert.match(page.status.textContent, expected);
    assert.equal(page.buttons[0].disabled, false);
  }
});

test('keeps the missing-wallet message short when no provider is injected', async () => {
  const page = setup({ protocol: 'file:' });
  await page.buttons[0].click();
  assert.equal(page.status.textContent, 'Wallet not detected in this browser.');
  assert.equal(page.status.scrolled, true);
});

test('does not send two simultaneous account requests', async () => {
  let calls = 0;
  let release;
  const pending = new Promise((resolve) => { release = resolve; });
  const page = setup({ ethereum: { isMetaMask: true, request: () => { calls++; return pending; } } });
  const first = page.buttons[0].click();
  const second = page.buttons[1].click();
  release([address]);
  await Promise.all([first, second]);
  assert.equal(calls, 1);
});
