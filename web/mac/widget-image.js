// Imagens do widget (PRD-04, DEC-018): a página converte o próprio desenho SVG em PNG e o envia ao app,
// que grava calc.png e lcd.png na pasta da DEC-016. O desenho continua só no upstream (DEC-002).
import { detectMode, MODE_NATIVE, HANDLER } from './native-bridge.js';

// Larguras em pixels: o dobro dos pontos do widget (364 pt no médio e no grande, 170 pt no pequeno).
export const CALC_WIDTH = 728;
export const LCD_WIDTH = 340;
export const IMAGE_DELAY_MS = 300;
const GLASS = 'rect[fill="url(#lcdGlass)"]';   // vidro do visor em web/upstream/src/ui/calculator-view.js

function num(el, attr, what) {
  const v = Number(el?.getAttribute(attr));
  if (!Number.isFinite(v) || v < 0) throw new Error(`${what}: atributo ${attr} inválido - obrigatório para a imagem do widget`);
  return v;
}

export function lcdRect(svg) {
  const g = svg.querySelector(GLASS);
  if (!g) throw new Error(`vidro do visor (${GLASS}) não encontrado no desenho - obrigatório para a imagem do widget`);
  return { x: num(g, 'x', 'vidro do visor'), y: num(g, 'y', 'vidro do visor'), w: num(g, 'width', 'vidro do visor'), h: num(g, 'height', 'vidro do visor') };
}

// Tamanho de cada canvas e como desenhar o SVG inteiro nele (escala e deslocamento).
export function imageLayout(svg) {
  const [, , vw, vh] = String(svg.getAttribute('viewBox')).trim().split(/\s+/).map(Number);
  if (!(vw > 0 && vh > 0)) throw new Error('viewBox do desenho inválido - obrigatório para a imagem do widget');
  const r = lcdRect(svg);
  const cs = CALC_WIDTH / vw, ls = LCD_WIDTH / r.w;
  return {
    view: { w: vw, h: vh },
    calc: { w: CALC_WIDTH, h: Math.round(vh * cs), scale: cs, dx: 0, dy: 0 },
    lcd: { w: LCD_WIDTH, h: Math.round(r.h * ls), scale: ls, dx: -r.x * ls, dy: -r.y * ls },
  };
}

// Conversão no navegador (XMLSerializer, Image, canvas); medida na sonda do full-prd §2.
export async function renderImages(svg, doc = document) {
  const L = imageLayout(svg);
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  await img.decode();
  const png = box => {
    const c = doc.createElement('canvas'); c.width = box.w; c.height = box.h;
    c.getContext('2d').drawImage(img, box.dx, box.dy, L.view.w * box.scale, L.view.h * box.scale);
    return c.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
  };
  return { calc: png(L.calc), lcd: png(L.lcd) };
}

// Devolve schedule(svg): agenda a publicação, e vale a última chamada dentro do intervalo.
export function createImagePublisher(win, render = renderImages) {
  let timer = 0;
  return svg => {
    if (detectMode(win) !== MODE_NATIVE) return;   // no navegador não há widget para receber
    win.clearTimeout(timer);
    timer = win.setTimeout(async () => {
      try {
        const { calc, lcd } = await render(svg);
        win.webkit.messageHandlers[HANDLER].postMessage({ type: 'image', calc, lcd });
      } catch (e) {
        console.error('[ponte hp12c] imagem do widget não gerada: ' + e.message);
      }
    }, IMAGE_DELAY_MS);
  };
}
