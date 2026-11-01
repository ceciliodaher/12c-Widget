// Teclado físico -> códigos de tecla da calculadora (DEC-008 e DEC-011, tabela da seção 3 de docs/ARCHITECTURE.md).
// KEYMAP é a fonte única: chave = event.key (letras em minúscula), valor = sequência de códigos.
const OPS = { '+': [40], '-': [30], '*': [20], '/': [10] };
const DIGITS = Object.fromEntries([...'0123456789'].map(d => [d, [Number(d)]]));

export const KEYMAP = Object.freeze({
  ...DIGITS, ...OPS,
  '.': [48], ',': [48],            // ',' cobre o teclado numérico ABNT2
  Enter: [36], Backspace: [43, 30], Escape: [35],
  f: [42], g: [43],
  n: [11], i: [12], p: [13], m: [14], v: [15],
  c: [16], e: [26], s: [44], r: [45], x: [34], d: [33],
  '%': [25], '^': [21], y: [21], o: [41],   // y: no ABNT2 o ^ é tecla morta (DEC-011)
});

// Devolve a sequência de códigos, ou null quando a tecla não é da calculadora.
// Teclas com ⌘, Ctrl ou Option ficam para o sistema (⌘C e ⌘V são tratados por clipboard.js).
export function translate(event) {
  if (event.metaKey || event.ctrlKey || event.altKey) return null;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  return Object.hasOwn(KEYMAP, key) ? KEYMAP[key] : null;
}

// Liga keydown/keyup a onDown(code, id) / onUp(code, id). id = 'kb:' + event.code, para a lógica da tecla ON
// casar a soltura com a pressão. Sequências (⌫ = g ←) são pressionadas e soltas em ordem; a última solta no keyup.
export class KeyboardController {
  #target; #view = null; #h = null; #held = new Map();
  constructor(target) {
    if (!target || typeof target.addEventListener !== 'function') throw new Error('KeyboardController: alvo de eventos não disponível - obrigatório');
    this.#target = target;
  }
  attach(view, handlers) {
    if (!view || typeof view.setPressed !== 'function') throw new Error('KeyboardController: vista não disponível - obrigatória');
    if (typeof handlers?.onDown !== 'function' || typeof handlers?.onUp !== 'function') throw new Error('KeyboardController: onDown e onUp são obrigatórios');
    this.#view = view; this.#h = handlers;
    this.#target.addEventListener('keydown', this.#down);
    this.#target.addEventListener('keyup', this.#up);
    this.#target.addEventListener('blur', this.#releaseAll);
  }
  detach() {
    this.#releaseAll();
    this.#target.removeEventListener('keydown', this.#down);
    this.#target.removeEventListener('keyup', this.#up);
    this.#target.removeEventListener('blur', this.#releaseAll);
  }
  #down = e => {
    const codes = translate(e);
    if (!codes) return;
    e.preventDefault();
    if (e.repeat || this.#held.has(e.code)) return;    // repetição automática ignorada
    const id = 'kb:' + e.code;
    this.#held.set(e.code, codes);
    codes.forEach((code, i) => {
      this.#view.setPressed(code, true);
      this.#h.onDown(code, id);
      if (i < codes.length - 1) this.#h.onUp(code, id);
    });
  };
  #up = e => {
    if (!this.#held.has(e.code)) return;
    e.preventDefault();
    this.#finish(e.code);
  };
  #releaseAll = () => { for (const code of [...this.#held.keys()]) this.#finish(code); };   // janela perdeu o foco
  #finish(physical) {
    const codes = this.#held.get(physical);
    this.#held.delete(physical);
    for (const c of codes) this.#view.setPressed(c, false);
    this.#h.onUp(codes[codes.length - 1], 'kb:' + physical);
  }
}
