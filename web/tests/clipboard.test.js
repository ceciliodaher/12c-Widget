import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyX, pasteToKeys, PasteFormatError } from '../mac/clipboard.js';
import { Calculator } from '../upstream/src/engine/calculator.js';
import '../upstream/src/engine/all-ops.js';

const typed = text => { const c = new Calculator(); for (const k of pasteToKeys(text)) { c.press(k); c.release(); } return c; };
const X = text => typed(text).x.toString();

test('pasteToKeys: sequências de teclas', () => {
  assert.deepEqual(pasteToKeys('42'), [4, 2]);
  assert.deepEqual(pasteToKeys('-1234.5e-3'), [1, 2, 3, 4, 48, 5, 16, 26, 3, 16]);
  assert.deepEqual(pasteToKeys('.5'), [48, 5]);
  assert.deepEqual(pasteToKeys('0'), [0]);
});

test('pasteToKeys: inteiro, decimal com ponto e com vírgula, negativo, expoente', () => {
  assert.equal(X('1234'), '1234');
  assert.equal(X('12.75'), '12.75');
  assert.equal(X('12,75'), '12.75');
  assert.equal(X('-8.5'), '-8.5');
  assert.equal(X('2.5e-3'), '0.0025');
  assert.equal(X('2.5E+3'), '2500');
  assert.equal(X(' 007 '), '7');
  assert.equal(X('0,001'), '0.001');
});

test('pasteToKeys: milhar removido só quando inequívoco', () => {
  assert.equal(X('1,234.56'), '1234.56');
  assert.equal(X('1.234,56'), '1234.56');
  assert.equal(X('1.234.567'), '1234567');
  assert.equal(X('1 234 567,8'), '1234567.8');
  assert.equal(X('1,234'), '1.234');                 // um só separador: é o decimal
  assert.throws(() => pasteToKeys('12,34.5'), PasteFormatError);
  assert.throws(() => pasteToKeys('1.2.3,4'), PasteFormatError);
});

test('pasteToKeys: excesso de dígitos e texto inválido geram PasteFormatError', () => {
  assert.equal(X('1234567890'), '1234567890');
  for (const bad of ['12345678901', '1e100', 'abc', '', '-', '.', '1..2', '1.2.', 'e5', '1e', '--1', '1-', '12a', '1,2,3.4.5'])
    assert.throws(() => pasteToKeys(bad), PasteFormatError, bad);
  assert.throws(() => pasteToKeys(null), PasteFormatError);
});

test('copyX: 10 dígitos significativos, separador do modo, sem milhar', () => {
  const c = typed('1234.5');
  assert.equal(copyX(c), '1234.5');
  c.state.mode.commaDecimal = true;
  assert.equal(copyX(c), '1234,5');
  const t = new Calculator(); for (const k of [2, 36, 3, 10]) t.press(k);   // 2 ÷ 3
  assert.equal(copyX(t), '0.6666666667');
  assert.equal(copyX(new Calculator()), '0');
  assert.equal(copyX(typed('1.5e50')), '1.5e+50');
  assert.equal(copyX(typed('-2e-20')), '-2e-20');
});

test('copyX e pasteToKeys fazem ida e volta', () => {
  for (const s of ['0.6666666667', '-1234.5', '1.5e+50', '-2e-20', '9999999999'])
    assert.equal(copyX(typed(s)), s);
});
