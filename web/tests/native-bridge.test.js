import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NativeStorage, createStorage, detectMode, publishSnapshot, snapshotOf, onNativeCommand, MODE_NATIVE, MODE_DEV }
  from '../mac/native-bridge.js';
import { load, save, STORAGE_KEY, BAD_KEY } from '../upstream/src/storage.js';
import { Calculator } from '../upstream/src/engine/calculator.js';
import '../upstream/src/engine/all-ops.js';

const quiet = fn => { const e = console.error, w = console.warn; console.error = console.warn = () => {}; try { return fn(); } finally { console.error = e; console.warn = w; } };

function nativeWin(state = null) {
  const sent = [];
  return { sent, __HP12C_BOOT__: { [STORAGE_KEY]: state }, webkit: { messageHandlers: { hp12c: { postMessage: m => sent.push(m) } } } };
}

test('detecção de modo nos dois ambientes', () => {
  assert.equal(detectMode(nativeWin()), MODE_NATIVE);
  assert.equal(detectMode({}), MODE_DEV);
  assert.equal(detectMode({ webkit: { messageHandlers: {} } }), MODE_DEV);
});

test('modo de desenvolvimento usa o localStorage e avisa', () => {
  const ls = { getItem() { return null; }, setItem() {} };
  let warned = 0; const w = console.warn; console.warn = () => warned++;
  try { assert.equal(createStorage({ localStorage: ls }), ls); } finally { console.warn = w; }
  assert.equal(warned, 1);
});

test('NativeStorage lê do objeto de partida', () => {
  const c = new Calculator(); c.press(7); c.release();
  const st = new NativeStorage(nativeWin(c.serialize()));
  assert.equal(load(st).x.toString(), '7');
  assert.equal(new NativeStorage(nativeWin(null)).getItem(STORAGE_KEY), null);
});

test('NativeStorage envia save com formato exato', () => {
  const win = nativeWin(); const c = new Calculator(); c.press(5);
  save(new NativeStorage(win), c);
  assert.deepEqual(win.sent, [{ type: 'save', key: STORAGE_KEY, value: c.serialize() }]);
  new NativeStorage(win).setItem(BAD_KEY, 'x');
  assert.deepEqual(win.sent[1], { type: 'save', key: BAD_KEY, value: 'x' });
});

test('NativeStorage rejeita chave desconhecida e valor não textual', () => quiet(() => {
  const win = nativeWin(); const st = new NativeStorage(win);
  assert.throws(() => st.setItem('outra', 'x'), /chave de gravação desconhecida/);
  assert.throws(() => st.setItem(STORAGE_KEY, 5), /deve ser texto/);
  assert.throws(() => st.getItem('outra'), /chave de leitura desconhecida/);
  assert.equal(win.sent.length, 0);
}));

test('NativeStorage exige o objeto de partida no formato do contrato', () => quiet(() => {
  const win = nativeWin(); delete win.__HP12C_BOOT__;
  assert.throws(() => new NativeStorage(win), /não foi injetado/);
  const w2 = nativeWin(); w2.__HP12C_BOOT__ = {};
  assert.throws(() => new NativeStorage(w2), /sem a chave/);
  const w3 = nativeWin(42);
  assert.throws(() => new NativeStorage(w3), /texto ou null/);
}));

test('estado ilegível vira Pr Error e a cópia é preservada pela ponte', () => {
  const win = nativeWin('{lixo');
  const c = load(new NativeStorage(win));
  assert.equal(c.display.text, 'Pr Error');
  assert.deepEqual(win.sent, [{ type: 'save', key: BAD_KEY, value: '{lixo' }]);
});

test('fotografia com números em texto decimal', () => {
  const c = new Calculator();
  for (const k of [1, 2, 48, 5, 11]) c.press(k);   // 12.5 n
  c.press(3); c.press(48); c.press(3); c.press(3); c.press(3); c.press(3); c.press(3); c.press(3); c.press(3); c.press(3); c.press(3);
  const s = snapshotOf(c);
  assert.equal(s.type, 'snapshot');
  assert.equal(s.fin.n, '12.5');
  assert.equal(s.x, '3.333333333');
  for (const v of [s.x, ...Object.values(s.fin)]) assert.equal(typeof v, 'string');
  assert.equal(s.text, '3.333333333');
  assert.equal(s.ann.rpn, true);
  const win = nativeWin(); publishSnapshot(win, c); assert.deepEqual(win.sent, [s]);
  publishSnapshot({}, c);                          // navegador: sem destinatário, sem erro
});

test('comandos nativos validados', () => quiet(() => {
  const win = {}, got = [];
  onNativeCommand(win, m => got.push(m));
  win.__hp12cCommand({ cmd: 'press', code: 36 });
  win.__hp12cCommand({ cmd: 'copy' });
  win.__hp12cCommand({ cmd: 'paste', text: '1' });
  assert.equal(got.length, 3);
  assert.throws(() => win.__hp12cCommand({ cmd: 'press', code: 99 }), /código de tecla inválido/);
  assert.throws(() => win.__hp12cCommand({ cmd: 'press', code: '36' }), /código de tecla inválido/);
  assert.throws(() => win.__hp12cCommand({ cmd: 'paste' }), /paste sem texto/);
  assert.throws(() => win.__hp12cCommand({ cmd: 'reset' }), /desconhecido/);
  assert.throws(() => win.__hp12cCommand(null), /inválido/);
  assert.equal(got.length, 3);
}));
