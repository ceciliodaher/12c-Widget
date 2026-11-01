# Rastreamento do 12c Widget

> Documento vivo, atualizado ao fim de cada sessão. Versão 1.3, de 01/11/2026 (encerramento da sessão 2).

# 1 Estado geral

O PRD-01 (camada web para Mac) está concluído: ponte, teclado, área de transferência e página em `web/mac/`, com 30 testes verdes, e o motor em `web/upstream/` com 204 testes verdes. O projeto passou a se chamar 12c Widget, sem a marca HP no desenho (DEC-013), e o código de origem fica fora do repositório público, baixado por script (DEC-012). O repositório público `github.com/ceciliodaher/12c-Widget` recebeu `main` em 01/11/2026, com o push autorizado pelo Professor Cecílio, e sem `web/upstream/`. Na sessão 2, a consulta ao USPTO mostrou que «12C» sozinho é marca da HP (registro 4.858.892), e o app passou a se chamar FinRPN (DEC-014). As sondagens provaram que nem o painel nem o widget precisam de Xcode ou de conta Apple paga (DEC-015 e DEC-016, que resolve a DEC-010). O PRD-02 está em andamento na branch local `feat/prd-02-involucro-macos`, com as fases 1 e 2 prontas e o app por fazer. Segue pendente a DEC-009.

# 2 Sessões

| Sessão | Data | Escopo | Situação | HEAD | Testes | Próximo passo |
|---|---|---|---|---|---|---|
| 0 | 01/11/2026 | Comparativo de emuladores, escolha da base, arquitetura, fundação documental, PRD-01 | Concluída | sem repositório | upstream: 200 testes contados, não executados | Decidir DEC-008 e executar o PRD-01 no Claude Code |
| 1 | 01/11/2026 | PRD-01 completo; DEC-008, 011, 012 e 013; repositório público com `main` publicada; renomeação para 12c Widget | Concluída | `eda7ac541ad37576975204934965da8a8bae6dee` | upstream 204/204; web/tests 30/30 | Especificar e executar o PRD-02 (invólucro macOS) |
| 2 | 01/11/2026 | Consulta de marcas (USPTO e GitHub); DEC-014, 015 e 016; sondas de WKWebView e de widget sem Xcode; PRD-02 especificado; fases 1 e 2 do PRD-02 | Parcial | `main` no último commit `[S2]`; código na branch local `feat/prd-02-involucro-macos` | upstream 204/204; web/tests 30/30; swift test 17/17 | PRD-02, fases 3 (app) e 4 (verificação) |

# 3 Backlog

Os itens a seguir foram identificados, mas não priorizados: registro de passos para aula (ideia do mscottsewell), modo 12C Gold e sincronização por iCloud.

# 4 Decisões registradas

DEC-001 a DEC-008 e DEC-011 a DEC-016 vigentes (DEC-004, 005 e 013 com trechos substituídos pelas DEC-014 e 016); DEC-010 resolvida pela DEC-016; DEC-009 pendente. Ver `docs/DECISIONS.md`.
