# Relatório de verificação — PRD-01 Camada web para Mac

Sessão 1, 01/11/2026. Node 22.14.0; navegador de verificação automática: Chromium (Playwright), viewport 1280 × 790.

# 1 Critérios de aceite

| # | Critério | Situação | Evidência |
|---|---|---|---|
| 1 | `diff -r` entre `web/upstream/` e o clone do commit fixado é vazio | Verde | `diff -r -x .git <clone> web/upstream` sem saída, depois de remover um `.DS_Store` criado pelo Finder (agora no `.gitignore`) |
| 2 | Suíte do upstream com o mesmo número da baseline, zero falhas | Verde | Baseline 204 testes; final 204 testes, 204 verdes, 0 falhas |
| 3 | Suíte de `web/tests/` com zero falhas, cobrindo o full-prd | Verde | 30 testes, 30 verdes, 0 falhas (ponte 9, teclado 9, área de transferência 6, integração 5, patch de marca 1) |
| 4 | Página abre, calcula pelo mouse e pelo teclado, mantém a memória ao recarregar | Verde (Chromium automático; Safari conferido pelo Professor Cecílio) | Mouse: «1000 ENTER 10 %» deu `100.00`; «42 STO 3» sobreviveu à recarga (X = 42, R3 = 42). Teclado: as 36 linhas do `KEYMAP` acionaram o código certo, com realce visual; ⌫ gerou g ←; ⌘C não chegou à calculadora |
| 5 | ⌘C copia X; ⌘V cola número válido e rejeita inválido com aviso no visor | Verde (Chromium automático; Safari conferido pelo Professor Cecílio) | Colar `-1234.5e-3` deu X = `-1.2345`; copiar devolveu `-1.2345`; colar `1.234,56` deu `1234.56`; colar `12abc` e `xyz` manteve X e mostrou «PAStE Err» no visor, com aviso no console |

Os eventos de cópia e colagem do critério 5 foram disparados por script (`ClipboardEvent`), porque o navegador automatizado não dá acesso à área de transferência do sistema. A conferência com ⌘C e ⌘V reais fica para a verificação no Safari.

# 2 Casos mínimos do full-prd, seção 4

| Caso | Teste |
|---|---|
| `NativeStorage` lê do objeto de partida, envia `save` exato, rejeita chave desconhecida | `native-bridge.test.js` (testes 3, 4, 5 e 6) |
| Detecção de modo nos dois ambientes | `native-bridge.test.js` (testes 1 e 2) |
| Cada linha do `KEYMAP`, Delete = g ←, ⌘ ignorado, repetição ignorada | `keyboard.test.js` |
| `pasteToKeys`: inteiro, ponto, vírgula, negativo, expoente negativo, excesso de dígitos, inválido | `clipboard.test.js` |
| Colar `-1234.5e-3` → X = `-1.2345`; teclado `1000 ENTER 10 %` → X = 100 | `integration.test.js` |

# 3 Testes negativos das travas

Cada trava foi desligada por uma condição sempre falsa, numa cópia restaurada depois, e a suíte acusou:

| Trava | Teste que falhou com a trava desligada |
|---|---|
| Chave de gravação desconhecida em `NativeStorage.setItem` | «NativeStorage rejeita chave desconhecida e valor não textual» |
| Repetição automática em `KeyboardController` | «repetição automática é ignorada» |
| Limite de 10 dígitos em `pasteToKeys` | «excesso de dígitos e texto inválido geram PasteFormatError» |

# 4 Desvios e observações

- O modo de desenvolvimento usa `localStorage` com aviso no console, como manda o full-prd. A seção 2.3.2 de `docs/ARCHITECTURE.md` falava em armazenamento em memória; vale o PRD, mais recente e específico.
- A colagem é recusada, com «PAStE Err», quando há prefixo pendente (f, g, STO, RCL), porque os dígitos colados virariam comandos (por exemplo, f 2 = FIX 2). Sem prefixo, a colagem é digitação: durante uma entrada em curso, os dígitos se somam a ela.
- `copyX` usa notação científica (`1.5e+50`) fora de 1e-10 ≤ |x| < 1e10, para não gerar um número de 100 algarismos; `pasteToKeys` aceita esse formato, de modo que a ida e volta é exata.
- O comando nativo `copy` chama `document.execCommand('copy')`; o funcionamento sem gesto do usuário dentro do WKWebView fica para o PRD-02.
- No teclado ABNT2 do Mac, `^` é tecla morta, e o navegador pode entregar `Dead` em vez de `^`. Fica a conferir no Safari; se falhar, a alternativa é registrar nova DEC para yˣ.
- `sound.js` do upstream grava a preferência de som direto no `localStorage`; no WKWebView isso será tratado no PRD-02 (DEC-002 impede mexer no upstream).

# 5 Mudanças depois da primeira verificação (mesma sessão)

O Professor Cecílio conferiu a página no Safari: tudo funcionou, exceto o `^`, que é tecla morta no teclado ABNT2. Daí vieram três decisões.

- **DEC-011:** tecla `y` para yˣ, mantido o `^`. Conferida no Chromium (a tecla `y` aciona o código 21).
- **DEC-012:** `web/upstream/` saiu do git. `web/fetch-upstream.sh` baixa a origem no commit de `web/upstream.env`, confere o commit e aplica `web/upstream.patch`. O script foi exercitado pelos dois caminhos: GitHub do autor e cópia privada em git bundle.
- **DEC-013:** o patch troca o selo e a faixa da marca HP e recarimba o `sw.js`. Sem o recarimbo, o `pwa.test.js` do upstream falhou (203 de 204); com ele, 204 de 204. A trava `upstream-patch.test.js` foi provada pelo negativo: com o arquivo original no lugar, ela acusa «marca presente».

Com isso, o critério 1 passa a ser lido como «`web/upstream/` igual ao commit fixado mais `upstream.patch`», garantido pelo script, que reinstala a pasta do zero a cada execução.
