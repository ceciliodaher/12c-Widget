# Retomada Sessão 1 — Execução do PRD-01

## Prompt de arranque copiável

> Diretório: `/Users/ceciliodaher/Documents/git/HP-12c-Widget`. Leia `CLAUDE.md`, `.claude/context.md` (v1.0) e `docs/MASTER-TRACKING.md`. Estado: só documentação; sem git, sem código. Objetivo: executar o PRD-01 (`.clavix/outputs/prd-01-camada-web-mac/`), fases 0 a 4, seguindo `tasks.md`. Autorizações: criar o repositório local, a branch `feat/prd-01-camada-web-mac`, clonar o malufloyd/hp12c, instalar nada além do necessário para `node --test`, e fazer o commit final com merge fast-forward local. Sem push. Pare e pergunte se a DEC-008 não estiver decidida ao chegar à fase 2.

## Estado pós-sessão anterior

Sessão 0 encerrada em 01/11/2026. Sem repositório (sem HEAD). Suítes: nenhuma executada; o upstream tem 200 testes contados por leitura. Gates deferidos: execução da suíte do upstream (fase 0 do PRD-01). Decisões a formalizar: DEC-008, DEC-009 e DEC-010.

## Roteiro de execução

1. Confirmar com o Professor Cecílio a DEC-008 (tabela em `docs/ARCHITECTURE.md`, seção 3).
2. Executar a fase 0 do `tasks.md` e registrar o número exato da baseline.
3. Executar as fases 1 a 3, verificando cada gate antes de avançar.
4. Executar a fase 4 e gravar o `verification-report.md`.
5. Atualizar `docs/MASTER-TRACKING.md` (linha da sessão 1 com HEAD completo e números das suítes), versionar `.claude/context.md` para v2.0, atualizar `whats-next.md` e criar `RETOMADA-sessao-2.md`.

## Gate de encerramento

> PRD-01 com os cinco critérios de aceite verdes, `verification-report.md` gravado, commit `[PRD-01]` na branch principal, working tree limpo, e documentos de rastreamento e contexto atualizados.
