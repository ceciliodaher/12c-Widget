import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KEYMAP, translate, KeyboardController } from '../mac/keyboard.js';
import { LAYOUT } from '../upstream/src/engine/keys.js';

const ev = (key, extra = {}) => ({ key, code: 'K' + key, metaKey: false, ctrlKey: false, altKey: false, repeat: false, ...extra });

// Tabela da DEC-008 com a DEC-011 (docs/ARCHITECTURE.md, seção 3), escrita aqui de forma independente do KEYMAP.
const DEC008 = [
  ...[...'0123456789'].map(d => [d, [Number(d)]]),
  ['.', [48]], [',', [48]], ['Enter', [36]], ['+', [40]], ['-', [30]], ['*', [20]], ['/', [10]],
  ['Backspace', [43, 30]], ['Escape', [35]], ['f', [42]], ['g', [43]],
  ['n', [11]], ['i', [12]], ['p', [13]], ['m', [14]], ['v', [15]], ['c', [16]], ['e', [26]],
  ['s', [44]], ['r', [45]], ['x', [34]], ['d', [33]], ['%', [25]], ['^', [21]], ['y', [21]], ['o', [41]],
];

test('cada linha da DEC-008 está no KEYMAP, e nada além dela', () => {
  for (const [key, codes] of DEC008) assert.deepEqual(translate(ev(key)), codes, key);
  assert.equal(Object.keys(KEYMAP).length, DEC008.length);
});

test('todo código do KEYMAP é tecla real da calculadora', () => {
  const real = new Set(LAYOUT.map(k => k.code));
  for (const codes of Object.values(KEYMAP)) for (const c of codes) assert.ok(real.has(c), String(c));
});

test('maiúscula vale como minúscula; teclas com ⌘, Ctrl e Option ficam para o sistema', () => {
  assert.deepEqual(translate(ev('N', { shiftKey: true })), [11]);
  assert.equal(translate(ev('c', { metaKey: true })), null);
  assert.equal(translate(ev('v', { metaKey: true })), null);
  assert.equal(translate(ev('n', { ctrlKey: true })), null);
  assert.equal(translate(ev('n', { altKey: true })), null);
  assert.equal(translate(ev('q')), null);
  assert.equal(translate(ev('Tab')), null);
});

function rig() {
  const target = new EventTarget(), log = [], pressed = new Set();
  const view = { setPressed: (c, on) => (on ? pressed.add(c) : pressed.delete(c)) };
  const kc = new KeyboardController(target);
  kc.attach(view, { onDown: (c, id) => log.push(['down', c, id]), onUp: (c, id) => log.push(['up', c, id]) });
  const fire = (type, key, extra) => { const e = Object.assign(new Event(type, { cancelable: true }), ev(key, extra)); target.dispatchEvent(e); return e; };
  return { target, log, pressed, kc, fire };
}

test('pressionar e soltar aciona a tecla certa com realce visual', () => {
  const { log, pressed, fire } = rig();
  const e = fire('keydown', 'n');
  assert.ok(e.defaultPrevented);
  assert.deepEqual([...pressed], [11]);
  fire('keyup', 'n');
  assert.deepEqual(log, [['down', 11, 'kb:Kn'], ['up', 11, 'kb:Kn']]);
  assert.equal(pressed.size, 0);
});

test('Delete gera a sequência g ←', () => {
  const { log, fire } = rig();
  fire('keydown', 'Backspace'); fire('keyup', 'Backspace');
  assert.deepEqual(log.map(([t, c]) => t + c), ['down43', 'up43', 'down30', 'up30']);
});

test('repetição automática é ignorada', () => {
  const { log, fire } = rig();
  fire('keydown', '5'); fire('keydown', '5', { repeat: true }); fire('keydown', '5', { repeat: true }); fire('keyup', '5');
  assert.equal(log.filter(([t]) => t === 'down').length, 1);
});

test('teclas com ⌘ não chegam à calculadora nem são bloqueadas', () => {
  const { log, fire } = rig();
  const e = fire('keydown', 'c', { metaKey: true });
  assert.equal(e.defaultPrevented, false);
  assert.equal(log.length, 0);
});

test('perder o foco solta as teclas presas; detach desliga', () => {
  const { target, log, pressed, kc, fire } = rig();
  fire('keydown', 'o');
  target.dispatchEvent(new Event('blur'));
  assert.deepEqual(log, [['down', 41, 'kb:Ko'], ['up', 41, 'kb:Ko']]);
  assert.equal(pressed.size, 0);
  kc.detach(); fire('keydown', '1');
  assert.equal(log.length, 2);
});

test('falha explícita sem alvo, vista ou manipuladores', () => {
  assert.throws(() => new KeyboardController(null), /obrigatório/);
  assert.throws(() => new KeyboardController(new EventTarget()).attach({}, {}), /vista/);
  assert.throws(() => new KeyboardController(new EventTarget()).attach({ setPressed() {} }, {}), /obrigatórios/);
});
