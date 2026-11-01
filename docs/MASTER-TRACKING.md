# Rastreamento do 12c Widget

> Documento vivo, atualizado ao fim de cada sessão. Versão 1.2, de 01/11/2026 (encerramento da sessão 1).

# 1 Estado geral

O PRD-01 (camada web para Mac) está concluído: ponte, teclado, área de transferência e página em `web/mac/`, com 30 testes verdes, e o motor em `web/upstream/` com 204 testes verdes. O projeto passou a se chamar 12c Widget, sem a marca HP no desenho (DEC-013), e o código de origem fica fora do repositório público, baixado por script (DEC-012). O repositório público `github.com/ceciliodaher/12c-Widget` recebeu `main` em 01/11/2026, com o push autorizado pelo Professor Cecílio, e sem `web/upstream/`. Duas decisões seguem pendentes (DEC-009 e DEC-010).

# 2 Sessões

| Sessão | Data | Escopo | Situação | HEAD | Testes | Próximo passo |
|---|---|---|---|---|---|---|
| 0 | 01/11/2026 | Comparativo de emuladores, escolha da base, arquitetura, fundação documental, PRD-01 | Concluída | sem repositório | upstream: 200 testes contados, não executados | Decidir DEC-008 e executar o PRD-01 no Claude Code |
| 1 | 01/11/2026 | PRD-01 completo; DEC-008, 011, 012 e 013; repositório público com `main` publicada; renomeação para 12c Widget | Concluída | `eda7ac541ad37576975204934965da8a8bae6dee` | upstream 204/204; web/tests 30/30 | Especificar e executar o PRD-02 (invólucro macOS) |

# 3 Backlog

Os itens a seguir foram identificados, mas não priorizados: registro de passos para aula (ideia do mscottsewell), modo 12C Gold e sincronização por iCloud.

# 4 Decisões registradas

DEC-001 a DEC-008 e DEC-011 a DEC-013 vigentes; DEC-009 e DEC-010 pendentes. Ver `docs/DECISIONS.md`.
