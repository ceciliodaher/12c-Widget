// Copiar X e colar número. A colagem vira sequência de teclas da própria calculadora (dígitos, 48, 26, 16),
// de modo que o motor a trata como digitação (DEC-006).
import { D } from '../upstream/src/engine/number.js';

export class PasteFormatError extends Error {
  constructor(text, reason) { super(`texto colado inválido (${reason}): ${JSON.stringify(text)}`); this.name = 'PasteFormatError'; }
}

const DOT = 48, EEX = 26, CHS = 16;
const MAX_MANT = 10, MAX_EXP = 2;

// Texto de X para a área de transferência: 10 dígitos significativos, separador do modo ativo, sem milhar.
// Notação científica (1.234e+50) fora de 1e-10 <= |x| < 1e10, para não gerar um número de 100 algarismos.
export function copyX(calc) {
  const x = calc.x.toSignificantDigits(MAX_MANT, D.ROUND_HALF_UP);
  const t = x.isZero() || (x.e >= -10 && x.e < 10) ? x.toFixed() : x.toExponential();
  return calc.state.mode.commaDecimal ? t.replace('.', ',') : t;
}

// Separador de milhar só é removido quando inequívoco: os dois separadores presentes (o último é o decimal),
// ou um só separador repetido; em ambos os casos os grupos têm de ter 3 algarismos.
function normalizeMantissa(m, text) {
  const dots = (m.match(/\./g) ?? []).length, commas = (m.match(/,/g) ?? []).length;
  let thousands = null, decimal = null;
  if (dots && commas) { decimal = m.lastIndexOf('.') > m.lastIndexOf(',') ? '.' : ','; thousands = decimal === '.' ? ',' : '.'; }
  else if (dots > 1) thousands = '.';
  else if (commas > 1) thousands = ',';
  else if (dots || commas) decimal = dots ? '.' : ',';
  if (decimal && m.split(decimal).length !== 2) throw new PasteFormatError(text, 'mais de um separador decimal');
  let [ip, fp] = decimal ? m.split(decimal) : [m, undefined];
  if (thousands) {
    const g = ip.split(thousands);
    if (!/^\d{1,3}$/.test(g[0]) || g.slice(1).some(x => !/^\d{3}$/.test(x))) throw new PasteFormatError(text, 'separador de milhar ambíguo');
    ip = g.join('');
  }
  if (!/^\d*$/.test(ip) || (fp !== undefined && !/^\d*$/.test(fp)) || (ip + (fp ?? '')) === '') throw new PasteFormatError(text, 'não é número');
  return { ip: ip.replace(/^0+(?=\d)/, '').replace(/^0$/, ''), fp };
}

export function pasteToKeys(text) {
  if (typeof text !== 'string') throw new PasteFormatError(text, 'não é texto');
  const s = text.replace(/[\s  ]/g, '');
  const m = /^([+-]?)([\d.,]+)(?:[eE]([+-]?)(\d+))?$/.exec(s);
  if (!m) throw new PasteFormatError(text, 'não é número');
  const [, sign, mantRaw, expSign, exp] = m;
  const { ip, fp } = normalizeMantissa(mantRaw, text);
  const digits = ip + (fp ?? '');
  if (digits.length > MAX_MANT) throw new PasteFormatError(text, `mais de ${MAX_MANT} dígitos`);
  if (exp !== undefined && exp.length > MAX_EXP) throw new PasteFormatError(text, `expoente com mais de ${MAX_EXP} dígitos`);
  const keys = [...ip].map(Number);
  if (fp !== undefined) keys.push(DOT, ...[...fp].map(Number));
  if (keys.length === 0 || (keys.length === 1 && keys[0] === DOT)) keys.unshift(0);
  if (sign === '-') keys.push(CHS);
  if (exp !== undefined) { keys.push(EEX, ...[...exp].map(Number)); if (expSign === '-') keys.push(CHS); }
  return keys;
}
