import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lcdRect, imageLayout, createImagePublisher, CALC_WIDTH, LCD_WIDTH } from '../mac/widget-image.js';
import { HANDLER } from '../mac/native-bridge.js';

// SVG falso: só o que widget-image.js consulta (viewBox e o retângulo do vidro do visor).
function fakeSvg({ glass = { x: '80', y: '65', width: '700', height: '115' }, viewBox = '0 0 1280 790' } = {}) {
  return {
    getAttribute: n => (n === 'viewBox' ? viewBox : null),
    querySelector: sel => (sel === 'rect[fill="url(#lcdGlass)"]' && glass ? { getAttribute: n => glass[n] ?? null } : null),
  };
}

function fakeWin({ native = true } = {}) {
  const sent = [], timers = [];
  const win = {
    sent, timers,
    setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
    clearTimeout: id => { if (timers[id - 1]) timers[id - 1].fn = null; },
  };
  if (native) win.webkit = { messageHandlers: { [HANDLER]: { postMessage: m => sent.push(m) } } };
  return win;
}
const runTimers = async win => { for (const t of win.timers.splice(0)) if (t.fn) await t.fn(); };

test('lcdRect lê o vidro do visor do próprio desenho', () => {
  assert.deepEqual(lcdRect(fakeSvg()), { x: 80, y: 65, w: 700, h: 115 });
});

test('lcdRect falha alto sem o vidro ou com atributo inválido', () => {
  assert.throws(() => lcdRect(fakeSvg({ glass: null })), /vidro do visor/);
  assert.throws(() => lcdRect(fakeSvg({ glass: { x: '80', y: '65', width: 'abc', height: '115' } })), /vidro do visor/);
});

test('imageLayout: calculadora inteira e recorte do visor nas larguras do widget', () => {
  const L = imageLayout(fakeSvg());
  assert.deepEqual(L.calc, { w: CALC_WIDTH, h: Math.round(CALC_WIDTH * 790 / 1280), scale: CALC_WIDTH / 1280, dx: 0, dy: 0 });
  const k = LCD_WIDTH / 700;
  assert.deepEqual(L.lcd, { w: LCD_WIDTH, h: Math.round(115 * k), scale: k, dx: -80 * k, dy: -65 * k });
  assert.deepEqual(L.view, { w: 1280, h: 790 });
});

test('imageLayout falha alto com viewBox inválido', () => {
  assert.throws(() => imageLayout(fakeSvg({ viewBox: null })), /viewBox/);
  assert.throws(() => imageLayout(fakeSvg({ viewBox: '0 0 0 790' })), /viewBox/);
});

test('publicador: vale a última chamada e publica uma mensagem image', async () => {
  const win = fakeWin(); let renders = 0;
  const schedule = createImagePublisher(win, async () => { renders++; return { calc: 'QUJD', lcd: 'REVG' }; });
  schedule({}); schedule({}); schedule({});
  assert.ok(win.timers.every(t => t.ms === 300));
  await runTimers(win);
  assert.equal(renders, 1);
  assert.deepEqual(win.sent, [{ type: 'image', calc: 'QUJD', lcd: 'REVG' }]);
});

test('publicador não faz nada no modo de desenvolvimento', async () => {
  const win = fakeWin({ native: false }); let renders = 0;
  createImagePublisher(win, async () => { renders++; return { calc: 'a', lcd: 'b' }; })({});
  await runTimers(win);
  assert.equal(win.timers.length + renders, 0);
});

test('publicador registra a falha da conversão e não publica nada', async () => {
  const win = fakeWin(); const errs = [];
  const e = console.error; console.error = (...a) => errs.push(a.join(' '));
  try {
    createImagePublisher(win, async () => { throw new Error('decode falhou'); })({});
    await runTimers(win);
  } finally { console.error = e; }
  assert.equal(win.sent.length, 0);
  assert.match(errs.join('\n'), /decode falhou/);
});

test('o upstream ainda desenha o vidro do visor que lcdRect procura', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../upstream/src/ui/calculator-view.js', import.meta.url), 'utf8');
  const glass = src.split('\n').filter(l => l.includes("el('rect'") && l.includes("fill: 'url(#lcdGlass)'"));
  assert.equal(glass.length, 1, 'esperado um único rect com o vidro do visor em calculator-view.js');
});
