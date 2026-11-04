// Ponte entre a camada web e o app nativo (DEC-004). Contratos em .clavix/outputs/prd-01-camada-web-mac/full-prd.md, seção 3.
// Modo nativo: existe window.webkit.messageHandlers[HANDLER]. Modo de desenvolvimento: a página aberta no navegador,
// com localStorage explícito e anunciado no console (não é fallback silencioso).
import { STORAGE_KEY, BAD_KEY } from '../upstream/src/storage.js';
import { LAYOUT } from '../upstream/src/engine/keys.js';

// Nome do manipulador de mensagens registrado pelo app (DEC-014). O Contract.swift confere este valor.
export const HANDLER = 'finrpn';
export const MODE_NATIVE = 'nativo';
export const MODE_DEV = 'desenvolvimento';
const SAVE_KEYS = new Set([STORAGE_KEY, BAD_KEY]);
const KEY_CODES = new Set(LAYOUT.map(k => k.code));

function reject(message) {
  console.error('[ponte hp12c] ' + message);
  throw new Error(message);
}

export function detectMode(win) {
  return win.webkit?.messageHandlers?.[HANDLER] ? MODE_NATIVE : MODE_DEV;
}

function handlerOf(win) {
  const h = win.webkit?.messageHandlers?.[HANDLER];
  if (!h || typeof h.postMessage !== 'function') reject(`webkit.messageHandlers.${HANDLER} não disponível - obrigatório no modo nativo`);
  return h;
}

// Mesmo contrato do localStorage (getItem, setItem), para ser passado a load() e save() sem mexer em storage.js.
export class NativeStorage {
  #boot; #handler;
  constructor(win) {
    this.#handler = handlerOf(win);
    const boot = win.__HP12C_BOOT__;
    if (boot === null || typeof boot !== 'object') reject('window.__HP12C_BOOT__ não foi injetado - obrigatório no modo nativo');
    if (!Object.hasOwn(boot, STORAGE_KEY)) reject(`__HP12C_BOOT__ sem a chave ${STORAGE_KEY}`);
    const v = boot[STORAGE_KEY];
    if (v !== null && typeof v !== 'string') reject(`__HP12C_BOOT__[${STORAGE_KEY}] deve ser texto ou null`);
    this.#boot = boot;
  }
  getItem(key) {
    if (key !== STORAGE_KEY) reject('chave de leitura desconhecida: ' + key);
    return this.#boot[STORAGE_KEY];
  }
  setItem(key, value) {
    if (!SAVE_KEYS.has(key)) reject('chave de gravação desconhecida: ' + key);
    if (typeof value !== 'string') reject('valor de gravação deve ser texto');
    this.#handler.postMessage({ type: 'save', key, value });
  }
}

export function createStorage(win) {
  if (detectMode(win) === MODE_NATIVE) return new NativeStorage(win);
  console.warn('[ponte hp12c] modo de desenvolvimento: estado gravado no localStorage do navegador');
  if (!win.localStorage) reject('localStorage não disponível - obrigatório no modo de desenvolvimento');
  return win.localStorage;
}

// Fotografia para o widget. Números como texto decimal, nunca Number.
export function snapshotOf(calc) {
  const d = calc.display, f = calc.state.fin;
  return {
    type: 'snapshot', text: d.text, ann: { ...d.ann }, x: calc.x.toString(),
    fin: { n: f.n.toString(), i: f.i.toString(), pv: f.pv.toString(), pmt: f.pmt.toString(), fv: f.fv.toString() },
  };
}

export function publishSnapshot(win, calc) {
  if (detectMode(win) !== MODE_NATIVE) return;   // no navegador não há widget para receber
  handlerOf(win).postMessage(snapshotOf(calc));
}

// O Swift chama window.__hp12cCommand({ cmd, ... }) por evaluateJavaScript.
export function validateCommand(msg) {
  if (msg === null || typeof msg !== 'object') reject('comando nativo inválido: ' + JSON.stringify(msg));
  switch (msg.cmd) {
    case 'press': if (!KEY_CODES.has(msg.code)) reject('código de tecla inválido: ' + JSON.stringify(msg.code)); break;
    case 'copy': break;
    case 'paste': if (typeof msg.text !== 'string') reject('paste sem texto'); break;
    default: reject('comando nativo desconhecido: ' + JSON.stringify(msg.cmd));
  }
  return msg;
}

export function onNativeCommand(win, handler) {
  win.__hp12cCommand = msg => handler(validateCommand(msg));
}
