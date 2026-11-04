// Trava da DEC-013 e da DEC-014: web/upstream/ tem de estar instalado por fetch-upstream.sh, com upstream.patch aplicado,
// para que o desenho não reproduza a marca HP (selo «hp 12C», faixa «HEWLETT·PACKARD») nem o «12c» (DEC-014: selo «Fin / RPN»).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const view = readFileSync(new URL('../upstream/src/ui/calculator-view.js', import.meta.url), 'utf8');

test('desenho sem a marca HP (upstream.patch aplicado)', () => {
  for (const mark of ["lg, 'hp')", "lg, '12C')", "lg, '12c')", 'HEWLETT', "'aria-label': 'HP 12C'", "'aria-label': '12c'"])
    assert.ok(!view.includes(mark), `marca presente: ${mark} - rode web/fetch-upstream.sh`);
  for (const repl of ["lg, 'Fin')", "lg, 'RPN')", 'FINANCIAL·CALCULATOR', "'aria-label': 'FinRPN'"]) assert.ok(view.includes(repl), repl);
});

// Ícone do app (PRD-04): o visor do icon.svg do upstream mostra «12C», marca da HP; o patch troca por «Fin».
test('ícone sem o «12C» no visor (upstream.patch aplicado)', () => {
  const icon = readFileSync(new URL('../upstream/icons/icon.svg', import.meta.url), 'utf8');
  assert.ok(!icon.includes('<line x1="200" y1="109" x2="200" y2="151"/>'), 'segmento do «1» de «12C» presente - rode web/fetch-upstream.sh');
  assert.ok(icon.includes('<title>FinRPN</title>'), 'título FinRPN ausente');
});
