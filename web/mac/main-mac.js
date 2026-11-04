// Ponto de entrada para o Mac. Adaptado de web/upstream/src/main.js (commit em web/UPSTREAM.md), com quatro trocas:
// armazenamento pela ponte (native-bridge.js), teclado físico (keyboard.js), área de transferência (clipboard.js)
// e sem rotação, layout esticado nem service worker. A cada atualização do upstream, compare render(), loop(),
// keyDown() e keyUp() com as funções de mesmo nome em src/main.js.
import { createCalculatorView } from '../upstream/src/ui/calculator-view.js';
import { attachInput } from '../upstream/src/ui/input.js';
import { initAudio, click, soundEnabled, setSoundEnabled } from '../upstream/src/ui/sound.js';
import { load, save } from '../upstream/src/storage.js';
import { tick } from '../upstream/src/engine/program.js';
import '../upstream/src/engine/all-ops.js';
import { createStorage, publishSnapshot, onNativeCommand } from './native-bridge.js';
import { KeyboardController } from './keyboard.js';
import { copyX, pasteToKeys, PasteFormatError } from './clipboard.js';
import { createImagePublisher } from './widget-image.js';

const ON = 41, HOLD_MS = 2000;
const stage = document.getElementById('stage');
if (!stage) throw new Error('#stage não disponível - obrigatório para montar a calculadora');
const storage = createStorage(window);
const calc = load(storage);
const view = createCalculatorView(stage);
const scheduleImage = createImagePublisher(window);

let overlay = null, overlayTimer = 0, flashUntil = 0, raf = 0, flashTimer = 0;

function render() {
  const d = calc.display;
  const s = calc.state;
  if (s.flashRunning) {                       // "running" por ~400 ms depois de IRR/YTM
    if (!flashUntil) flashUntil = performance.now() + 400;
    if (performance.now() < flashUntil) {
      d.text = 'running'; d.running = true;
      if (!flashTimer) flashTimer = setTimeout(() => { flashTimer = 0; render(); }, 420);
    } else { s.flashRunning = false; flashUntil = 0; persist(); }
  }
  view.update(overlay ? { ...d, text: overlay, running: false } : d);
}
function persist() { save(storage, calc); publishSnapshot(window, calc); scheduleImage(view.svg); }
function busy() { const s = calc.state; return s.prog.running || (s.selfTest && s.selfTest.phase === 'running'); }
function loop(now) {
  raf = 0;
  const was = busy();
  tick(calc, now);
  render();
  if (busy()) raf = requestAnimationFrame(loop);
  else if (was) persist();                    // programa parou
}
function ensureLoop() { if (!raf && busy()) raf = requestAnimationFrame(loop); }
function afterKey() { render(); persist(); ensureLoop(); }

function showOverlay(text) {
  overlay = text; render();
  clearTimeout(overlayTimer);
  overlayTimer = setTimeout(() => { overlay = null; render(); }, 1000);
}

// Tecla ON: toque liga e desliga; pressão de 2 s alterna o som; ON segurado + outra tecla = combinação.
// id identifica quem pressionou (pointerId do ponteiro ou 'kb:<code>' do teclado), para casar a soltura.
let onDown = null;   // { id, timer, combo, long }
function keyDown(code, id) {
  initAudio(); click();
  if (code === ON) {
    if (onDown) return;
    onDown = { id, combo: false, long: false,
      timer: setTimeout(() => {
        if (!onDown || onDown.combo) return;
        onDown.long = true;
        const on = !soundEnabled(); setSoundEnabled(on);
        showOverlay(on ? 'SOUnd On' : 'SOUnd OFF');
      }, HOLD_MS) };
    return;
  }
  if (onDown) { onDown.combo = true; clearTimeout(onDown.timer); calc.onCombo(code, performance.now()); afterKey(); return; }
  calc.press(code); afterKey();
}
function keyUp(code, id) {
  if (code === ON && onDown && onDown.id === id) {
    const o = onDown; onDown = null; clearTimeout(o.timer);
    if (!o.combo && !o.long) { calc.power(); afterKey(); }
    return;
  }
  if (!onDown) { calc.release(); afterKey(); }
}

// Porta única de entrada: ponteiro, teclado, colagem e comandos nativos passam por aqui.
export function pressKey(code, id = 'api') { keyDown(code, id); }
export function releaseKey(code, id = 'api') { keyUp(code, id); }

function paste(text) {
  if (calc.state.prefix !== null) { showOverlay('PAStE Err'); console.warn('[hp12c] colagem recusada: prefixo pendente (' + calc.state.prefix + ')'); return; }
  let keys;
  try { keys = pasteToKeys(text); }
  catch (e) {
    if (!(e instanceof PasteFormatError)) throw e;
    console.warn('[hp12c] ' + e.message); showOverlay('PAStE Err'); return;
  }
  for (const k of keys) { pressKey(k, 'paste'); releaseKey(k, 'paste'); }
}

attachInput(view, { onDown: (code, e) => keyDown(code, e.pointerId), onUp: (code, e) => keyUp(code, e.pointerId) });
new KeyboardController(window).attach(view, { onDown: keyDown, onUp: keyUp });
document.addEventListener('copy', e => { e.preventDefault(); e.clipboardData.setData('text/plain', copyX(calc)); });
document.addEventListener('paste', e => { e.preventDefault(); paste(e.clipboardData.getData('text/plain')); });
onNativeCommand(window, msg => {
  if (msg.cmd === 'press') { pressKey(msg.code, 'native'); releaseKey(msg.code, 'native'); }
  else if (msg.cmd === 'paste') paste(msg.text);
  // ponytail: copy dispara o evento copy do documento; confirmar no WKWebView no PRD-02 (sem gesto do usuário).
  else if (msg.cmd === 'copy') document.execCommand('copy');
});
addEventListener('pointerup', initAudio);
render();
scheduleImage(view.svg);   // o widget mostra a calculadora desde a partida, sem esperar a primeira tecla
ensureLoop();
window.__hp12c = { calc, view, pressKey, releaseKey };
