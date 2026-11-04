# Por onde começar

Especificar e executar o PRD-04, o widget de área de trabalho, que passou à frente do PRD-03 pela DEC-017. É uma extensão WidgetKit somente leitura (DEC-003): mostra o `snapshot.json` que o `FinRPN.app` já grava em `~/Library/Application Support/FinRPN/` e abre o painel com um clique. É montada por `macos/build-app.sh` sem Xcode, com os parâmetros da sonda da sessão 2 (DEC-015 e DEC-016). Antes de testar, rode `web/fetch-upstream.sh`; o `swift test` exige o parâmetro `-plugin-path` registrado no `CLAUDE.md` §5. A DEC-009 (atalho global) bloqueia só o PRD-03.

Retomada ativa: `docs/handoffs/RETOMADA-sessao-4-widget.md`.
