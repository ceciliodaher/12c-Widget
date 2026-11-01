// Trava da DEC-013: web/upstream/ tem de estar instalado por fetch-upstream.sh, com upstream.patch aplicado,
// para que o desenho não reproduza a marca HP (selo «hp 12C», faixa «HEWLETT·PACKARD»).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const view = readFileSync(new URL('../upstream/src/ui/calculator-view.js', import.meta.url), 'utf8');

test('desenho sem a marca HP (upstream.patch aplicado)', () => {
  for (const mark of ["lg, 'hp')", "lg, '12C')", 'HEWLETT', "'aria-label': 'HP 12C'"])
    assert.ok(!view.includes(mark), `marca presente: ${mark} - rode web/fetch-upstream.sh`);
  for (const repl of ["lg, '12c')", "lg, 'RPN')", 'FINANCIAL·CALCULATOR']) assert.ok(view.includes(repl), repl);
});
