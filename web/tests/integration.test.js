// Teclado e colagem ligados a um Calculator real, pelo mesmo caminho press/release que main-mac.js usa.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KeyboardController } from '../mac/keyboard.js';
import { pasteToKeys, copyX } from '../mac/clipboard.js';
import { NativeStorage } from '../mac/native-bridge.js';
import { load, save, STORAGE_KEY } from '../upstream/src/storage.js';
import { Calculator } from '../upstream/src/engine/calculator.js';
import '../upstream/src/engine/all-ops.js';

function keyboardCalc() {
  const calc = new Calculator(), target = new EventTarget();
  new KeyboardController(target).attach({ setPressed() {} }, { onDown: c => calc.press(c), onUp: () => calc.release() });
  const type = keys => {
    for (const key of keys) for (const t of ['keydown', 'keyup'])
      target.dispatchEvent(Object.assign(new Event(t, { cancelable: true }), { key, code: 'K' + key, metaKey: false, ctrlKey: false, altKey: false, repeat: false }));
  };
  return { calc, type };
}

test('colar -1234.5e-3 num Calculator novo deixa X = -1.2345', () => {
  const calc = new Calculator();
  for (const k of pasteToKeys('-1234.5e-3')) { calc.press(k); calc.release(); }
  assert.equal(calc.x.toString(), '-1.2345');
});

test('digitar 1000 ENTER 10 % pelo teclado deixa X = 100', () => {
  const { calc, type } = keyboardCalc();
  type([...'1000', 'Enter', ...'10', '%']);
  assert.equal(calc.x.toString(), '100');
  assert.equal(calc.display.text, '100.00');
});

test('Delete apaga o último dígito pelo motor (g ←)', () => {
  const { calc, type } = keyboardCalc();
  type([...'123', 'Backspace']);
  assert.equal(calc.x.toString(), '12');
});

test('financeiro pelo teclado: 10 n 1 i 1000 CHS p → v (FV)', () => {
  const { calc, type } = keyboardCalc();
  type([...'10', 'n', '1', 'i', ...'1000', 'c', 'p', 'v']);
  assert.equal(calc.display.text, '1,104.62');
  assert.equal(copyX(calc), '1104.622125');
});

test('memória contínua: o estado gravado pela ponte volta igual na partida seguinte', () => {
  const sent = [], win = { __HP12C_BOOT__: { [STORAGE_KEY]: null }, webkit: { messageHandlers: { hp12c: { postMessage: m => sent.push(m) } } } };
  const { calc, type } = keyboardCalc();
  type([...'42', 's', '3']);                         // 42 STO 3
  save(new NativeStorage(win), calc);
  const win2 = { ...win, __HP12C_BOOT__: { [STORAGE_KEY]: sent.at(-1).value } };
  const back = load(new NativeStorage(win2));
  assert.equal(back.state.regs[3].toString(), '42');
});
