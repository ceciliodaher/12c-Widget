# Retomada Sessão 2 — PRD-02, invólucro macOS

## Prompt de arranque copiável

> Diretório: `/Users/ceciliodaher/Documents/git/HP-12c-Widget` (projeto 12c Widget). Leia `CLAUDE.md`, `.claude/context.md` (v2.0) e `docs/MASTER-TRACKING.md`. Estado: PRD-01 concluído e commitado em `main`; rode `web/fetch-upstream.sh` antes de tudo, porque `web/upstream/` não está no git. Objetivo: especificar o PRD-02 (`.clavix/outputs/prd-02-*/`) e executá-lo: projeto Xcode `Widget12c`, NSPanel, WKWebView, esquema `hp12c-app://`, ponte e StateStore. Push para `origin` só com autorização expressa.

## Estado pós-sessão anterior

Sessão 1 encerrada em 01/11/2026. HEAD em `main`: o commit `[PRD-01] Camada web para Mac` (SHA completo registrado abaixo pelo encerramento). Suítes: upstream 204/204 com o patch aplicado; `web/tests` 30/30. Decisões novas: DEC-008, DEC-011, DEC-012 e DEC-013. Pendentes: DEC-009 (atalho, bloqueia o PRD-03) e DEC-010 (conta Apple Developer, bloqueia o PRD-04). Pendências herdadas: comando `copy` sem gesto no WKWebView; preferência de som do upstream no localStorage; push ao repositório público ainda não autorizado.

## Roteiro de execução

1. Rodar `web/fetch-upstream.sh` e as duas suítes; confirmar 204 e 30.
2. Especificar o PRD-02 (quick-prd, full-prd e tasks) a partir da `ARCHITECTURE.md` §2.4 e da fase 2 do `MASTER-PLAN.md`.
3. Apresentar a estrutura de classes e métodos antes do código extenso.
4. Executar e verificar o PRD-02, com o primeiro teste no esquema `hp12c-app://` (risco de módulos ES em `file://`).
5. Encerrar: rastreamento, contexto v3.0, whats-next e RETOMADA-sessao-3.

## Gate de encerramento

> PRD-02 com critérios de aceite verdes, app abrindo o painel com a calculadora funcional e a memória mantida entre aberturas, `verification-report.md` gravado, commit `[PRD-02]` em `main`, working tree limpo e documentos atualizados.
