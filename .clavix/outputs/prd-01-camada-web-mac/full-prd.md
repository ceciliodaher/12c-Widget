# PRD-01 — Camada web para Mac

## 1. Contexto e motivação

O motor e o desenho do malufloyd/hp12c servem ao Mac sem mudança (DEC-001). O que impede o uso direto é a casca de iPhone de `src/main.js`: entrada só por toque e ponteiro, persistência em `localStorage`, rotação e áreas seguras. Este PRD constrói a casca de Mac na camada web, de modo que o PRD-02 só precise embutir a página no WKWebView. Não é objetivo deste PRD alterar comportamento de cálculo, criar código nativo ou mexer em `web/upstream/`.

## 2. Decisões arquiteturais

Aplicam-se DEC-002 (upstream intacto), DEC-004 (persistência nativa com injeção síncrona e gravação assíncrona) e DEC-006 (motor como fonte única de verdade). Decisão nova proposta: o modo de desenvolvimento no navegador usa `localStorage` **explicitamente**, ativado quando `window.webkit?.messageHandlers?.hp12c` não existe, com aviso no console na partida. Não é fallback silencioso: é um modo detectado e anunciado. O mapeamento de teclas depende da DEC-008; até a aprovação, `keyboard.js` implementa a tabela proposta em `docs/ARCHITECTURE.md`, seção 3, isolada em uma única constante `KEYMAP` para troca fácil.

## 3. Escopo funcional

**Dependências novas:** nenhuma em tempo de execução. Testes com `node --test` (Node 22 ou superior, por causa dos padrões de glob).

**Arquivos novos:**
- `web/UPSTREAM.md`: origem, commit, data da cópia e autorização (fora de `upstream/` para não tocá-lo).
- `web/mac/index-mac.html`: carrega `mac.css` e `main-mac.js` como módulo; sem manifesto PWA nem service worker.
- `web/mac/mac.css`: fundo transparente, sem regras de orientação ou área segura; mantém as animações do visor (`lcd-blink`, `lcd-running`).
- `web/mac/main-mac.js`: equivalente a `src/main.js` com quatro trocas: armazenamento via `NativeStorage`; teclado por `KeyboardController`; área de transferência; sem rotação nem service worker. Mantém o laço de renderização, o "running" de IRR e YTM, o laço de programas e a lógica da tecla ON (toque, pressão longa de 2 s, combinações). Expõe `pressKey(code)` e `releaseKey(code)` como porta única de entrada.
- `web/mac/native-bridge.js`: `class NativeStorage` (`getItem`, `setItem`), `publishSnapshot(calc)`, `onNativeCommand(handler)`, detecção de modo (`nativo` ou `desenvolvimento`).
- `web/mac/keyboard.js`: `KEYMAP`, `class KeyboardController` (`attach`, `detach`), `translate(event)`.
- `web/mac/clipboard.js`: `copyX(calc)`, `pasteToKeys(text)`.
- `web/tests/native-bridge.test.js`, `web/tests/keyboard.test.js`, `web/tests/clipboard.test.js`, `web/tests/integration.test.js`.

**Arquivos modificados:** nenhum.

**Arquivos explicitamente não tocados:** tudo em `web/upstream/`.

**Contratos da ponte (mensagens JS → Swift):**
- `{ type: "save", key: string, value: string }`: `key` é `hp12c.state.v1` ou `hp12c.state.bad`; `value` é o JSON de `calc.serialize()`.
- `{ type: "snapshot", text: string, ann: object, x: string, fin: { n, i, pv, pmt, fv } }`: números como texto decimal, nunca `Number`, para não perder precisão.
- Estado inicial (Swift → JS): `window.__HP12C_BOOT__ = { "hp12c.state.v1": string | null }`, injetado antes da carga.
- Comandos (Swift → JS): `{ cmd: "press", code }`, `{ cmd: "copy" }`, `{ cmd: "paste", text }`.

**Regras de `pasteToKeys(text)`:** aceita sinal, dígitos, um separador decimal (ponto ou vírgula) e expoente (`e` ou `E`, com sinal); remove espaços e separadores de milhar só quando inequívocos; respeita o limite de 10 dígitos de mantissa e 2 de expoente; texto inválido gera erro tipado `PasteFormatError` e nenhuma tecla é enviada. A sequência produzida usa as teclas da própria calculadora (dígitos, 48, 26, 16) e entra por `pressKey`, de modo que o motor trata a colagem como digitação.

**Regras de `copyX(calc)`:** copia o valor de X com 10 dígitos significativos, no separador decimal do modo ativo, sem separador de milhar.

## 4. Critérios de aceite

Valem os cinco critérios do quick-prd. Os testes novos cobrem, no mínimo:
- `NativeStorage` lê do objeto de partida, envia `save` com formato exato e rejeita chave desconhecida;
- detecção de modo nos dois ambientes;
- cada linha do `KEYMAP` e o Delete gerando a sequência g ←; teclas com ⌘ ignoradas pelo teclado da calculadora; repetição automática ignorada;
- `pasteToKeys` para inteiro, decimal com ponto e com vírgula, negativo, expoente negativo, excesso de dígitos e texto inválido;
- integração: colar `-1234.5e-3` em um `Calculator` novo deixa X igual a `-1.2345`; digitar `1000 ENTER 10 %` pelo teclado deixa X igual a 100.

## 5. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| `main-mac.js` divergir de `src/main.js` em atualizações futuras | Média | Médio | Comentário no topo apontando as linhas de origem; checar a diferença a cada atualização do upstream |
| Teclado ABNT2 gerar `,` no teclado numérico | Alta | Baixo | `translate` mapeia `,` e `.` para a tecla 48 |
| `localStorage` do modo de desenvolvimento mascarar falhas da ponte | Baixa | Médio | Aviso explícito no console; o PRD-02 testa a ponte real |

## 6. Cronograma estimado

Duas a três sessões do Claude Code: uma para baseline, cópia e ponte; uma para teclado e área de transferência; meia a uma para testes de integração e verificação.

## 7. Cross-refs

`docs/ARCHITECTURE.md` (seções 1, 2.3 e 3), `docs/DECISIONS.md` (DEC-002, DEC-004, DEC-006, DEC-008), `docs/MASTER-PLAN.md` (fase 1), `docs/CONSTITUTION.md`.

## 8. Aceite operacional

O PRD fecha quando os cinco critérios estiverem verdes, o `verification-report.md` registrar os números exatos das duas suítes, a DEC-008 estiver decidida e refletida no `KEYMAP`, e houver um único commit `[PRD-01] Camada web para Mac`.
