# CLAUDE.md — 12c Widget

# 1 Visão geral

Utilitário para macOS 14 ou superior que emula a HP 12c Platinum no Mac (marca da HP Inc.; projeto sem vínculo com ela): painel flutuante aberto por atalho global ou pela barra de menus, teclado físico, memória contínua e, na fase 4, um widget de área de trabalho que mostra o visor. O motor de cálculo é o do projeto malufloyd/hp12c (JavaScript, aritmética decimal), rodando em WKWebView dentro de um app SwiftUI e AppKit. Projeto pessoal do Professor Cecílio; documentação em português.

# 2 Estratégia de desenvolvimento

> ⛔ Remoto: `origin` = `github.com/ceciliodaher/12c-Widget`, público. Push de `main` para `origin` autorizado pelo Professor Cecílio em 01/11/2026 (vale nas sessões seguintes); push forçado, outras branches ou outros remotos, só com nova autorização.
> ⛔ Nunca usar nem sugerir `/compact`: contexto cheio se resolve com `/encerramento` e `/arranque`.
> ⛔ `web/upstream/` nunca entra no git (DEC-012): é instalado por `web/fetch-upstream.sh`.
> ⛔ Nunca editar `web/upstream/`. Adaptações vivem em `web/mac/`; correção inevitável vai como patch em `web/upstream.patch` com DEC própria.
> ⛔ Nunca implementar cálculo financeiro, de data, estatístico ou de programação fora do motor (DEC-006).
> ⛔ Nunca commitar com suíte vermelha. Um commit por PRD, prefixo `[PRD-NN]`.
> ⛔ Nenhum arquivo de ROM da HP nem código GPL no repositório (DEC-007).

Cada unidade de trabalho segue o fluxo Clavix (PRD, Plan, Implement, Verify) em `.clavix/outputs/prd-NN-*/`. Antes de código extenso, apresentar a estrutura de classes e métodos. Diante de falha inesperada, reportar antes de corrigir.

# 3 Arquitetura ativa

**Estado real em 01/11/2026 (fim da sessão 2):** PRD-01 concluído. PRD-02 em andamento na branch local `feat/prd-02-involucro-macos`: fases 1 (camada web) e 2 (`FinRPNCore`, 17 testes) prontas; falta o app (fase 3) e a verificação (fase 4). O app se chama FinRPN (DEC-014), é compilado por SwiftPM sem Xcode (DEC-015) e grava o estado em `~/Library/Application Support/FinRPN/` (DEC-016).

| Artefato | Tipo | Propósito |
|---|---|---|
| `web/upstream/` | JS (baixado por script, fora do git) | Motor `src/engine/`, desenho SVG `src/ui/`, 204 testes; `web/upstream.patch` retira a marca HP (DEC-013) |
| `web/mac/` | JS | Ponto de entrada Mac, ponte nativa, teclado, área de transferência |
| `macos/Sources/FinRPNCore/` | Swift (SwiftPM) | Contrato da ponte, StateStore, mensagens, esquema `finrpn-app://`, script de partida |
| `macos/Sources/FinRPN/` | Swift (SwiftPM) | AppDelegate, NSPanel, WKWebView, manipuladores do WebKit (PRD-02, fase 3) |
| extensão WidgetKit | Swift, montada por `macos/build-app.sh` | Visor e registradores, somente leitura (PRD-04; ligar com `-Xlinker -e -Xlinker _NSExtensionMain`) |

Interface do motor: `new Calculator(state)`, `press(code)`, `release()`, `display`, `power()`, `onCombo(code, now)`, `serialize()`, `Calculator.deserialize(str)`; persistência por `load(storage)` e `save(storage, calc)`; laço de programa por `tick(calc, now)`. Códigos de tecla em `src/engine/keys.js` (linha e coluna; dígitos usam o próprio dígito).

# 4 Stack

JavaScript ES modules sem build e decimal.js (já incluído no upstream); testes com `node --test` (Node 22+). Swift 5.10+ (Command Line Tools, sem Xcode, DEC-015), SwiftUI, AppKit, WebKit, WidgetKit; testes Swift com Swift Testing; alvo macOS 14. Atalho global: pacote KeyboardShortcuts (MIT), a confirmar no PRD-03.

# 5 Comandos

| Ciclo | Comando | Situação |
|---|---|---|
| Instalar o motor | `web/fetch-upstream.sh` (cópia privada: `UPSTREAM_REPO=<bundle> web/fetch-upstream.sh`) | Disponível |
| Testes do upstream | `cd web/upstream && node --test 'tests/**/*.test.js'` | Disponível (204) |
| Testes da camada Mac | `node --test 'web/tests/**/*.test.js'` | Disponível (30) |
| Testes Swift | `cd macos && swift test -Xswiftc -plugin-path -Xswiftc /Library/Developer/CommandLineTools/usr/lib/swift/host/plugins/testing` | Disponível (17). O parâmetro é obrigatório: sem ele, o SwiftPM das Command Line Tools não acha o plugin `TestingMacros` (medido na sessão 2) |
| Página no navegador | `cd web && python3 -m http.server 8123` e abrir `http://localhost:8123/mac/index-mac.html` | Disponível |
| Build do app | `macos/build-app.sh` (gera `macos/build/FinRPN.app`) | A criar no PRD-02, fase 3 |

# 6 Padrões e decisões âncora

DEC-001 base malufloyd/hp12c, commit `f1c12e80a9c14757c8bf406386f7ced1f405c3a9`, uso autorizado. DEC-002 upstream intacto. DEC-003 painel flutuante; widget só leitura. DEC-004 estado no App Group, injetado na partida e gravado por mensagem. DEC-005 esquema `hp12c-app://`. DEC-006 motor como fonte única. DEC-007 sem ROM nem GPL. DEC-008 teclado (tabela da `ARCHITECTURE.md` §3). DEC-011 tecla `y` para yˣ. DEC-012 upstream fora do repositório, baixado por script. DEC-013 sem marca HP no desenho e no nome (12c Widget). DEC-014 nome FinRPN no app, nos identificadores e no selo «Fin / RPN» (repositório e documentos seguem «12c Widget» até a renomeação). DEC-015 build por SwiftPM e script, sem Xcode. DEC-016 estado em `~/Library/Application Support/FinRPN/`, lido pelo widget por exceção de leitura da sandbox; resolve a DEC-010. Pendente: DEC-009 atalho.

Zero fallbacks silenciosos: estado ilegível vira `Pr Error` com cópia preservada (comportamento do upstream); mensagem de ponte inválida é rejeitada e registrada; proibido `|| 0` e `?? padrão` em estado e cálculo. Números na ponte trafegam como texto decimal, nunca como `Number`.

# 7 Documentos de referência

`docs/REQUISITOS.md`, `docs/ARCHITECTURE.md`, `docs/CONSTITUTION.md`, `docs/DECISIONS.md`, `docs/MASTER-PLAN.md`, `docs/MASTER-TRACKING.md`, `docs/estudos/01-analise-emuladores-hp12c.md`, `.claude/context.md`, `docs/handoffs/whats-next.md`.

# 8 Observações operacionais

O upstream não tem tratamento de teclado físico; toda entrada por teclado nasce em `web/mac/keyboard.js`. A tecla ON tem três comportamentos (toque liga e desliga; 2 s alterna o som; ON + tecla executa combinações como troca de vírgula e teste), replicados de `src/main.js`. A pasta `_to_delete/` contém uma versão antiga do documento de arquitetura e pode ser apagada pelo Professor.
