# Retomada Sessão 2 — PRD-02, invólucro macOS

## ▶️ Prompt de arranque (copiar e colar)

```
Diretório: /Users/ceciliodaher/Documents/git/HP-12c-Widget (projeto 12c Widget; a pasta local mantém o nome antigo).
Leia, nesta ordem: docs/handoffs/RETOMADA-sessao-2-involucro-macos.md, CLAUDE.md, .claude/context.md (v2.1),
docs/MASTER-TRACKING.md (v1.2), docs/DECISIONS.md (v1.2), docs/MASTER-PLAN.md (fase 2) e docs/ARCHITECTURE.md (§2.4).
Estado: PRD-01 concluído em main (código em eda7ac5; topo = último commit [S1]), publicado em github.com/ceciliodaher/12c-Widget.
web/upstream/ não está no git: rode web/fetch-upstream.sh antes de qualquer teste (esperado: upstream 204/204, web/tests 30/30).
Tarefa: especificar o PRD-02 em .clavix/outputs/prd-02-involucro-macos/ (quick-prd, full-prd, tasks) e executá-lo:
projeto Xcode Widget12c em macos/, NSPanel flutuante, WKWebView, esquema hp12c-app://, BridgeController e StateStore.
Pendências a confirmar com o Professor Cecílio: nenhuma bloqueante para o PRD-02 (DEC-009 bloqueia só o PRD-03; DEC-010 só o PRD-04).
Restrições: nunca editar web/upstream/ (mudança só por web/upstream.patch com DEC); nenhum cálculo fora do motor (DEC-006);
um commit por PRD com prefixo [PRD-NN]; push de main para origin autorizado; nunca usar /compact.
```

## Estado ao fim desta sessão

- **HEAD e branch:** `main`, igual a `origin/main`, com o topo no último commit de prefixo `[S1]` (governança do encerramento). O código do PRD-01 está em `eda7ac541ad37576975204934965da8a8bae6dee`; depois dele há só commits `[S1]` de documentação. Árvore limpa. Se o topo de `main` ao abrir não for um commit `[S1]`, alguém mexeu depois do encerramento.
- **Suítes medidas no encerramento:** upstream 204/204 com o patch aplicado; `web/tests` 30/30.
- **Produção:** não há. O app nativo ainda não existe.
- **Gates atingidos:** os cinco critérios do PRD-01 (`verification-report.md`), verificados no Chromium automático e no Safari pelo Professor Cecílio; travas provadas por teste negativo; push publicado sem `web/upstream/`.
- **Gates deferidos para o PRD-02, com a razão:** o comando nativo `copy` sem gesto do usuário só se prova dentro do WKWebView; a preferência de som do upstream vai direto ao localStorage, e o comportamento dele no esquema `hp12c-app://` só se mede no app; o build precisa rodar `web/fetch-upstream.sh` antes de empacotar `web/`.

## Roteiro de execução

1. Rodar `web/fetch-upstream.sh` e as duas suítes; confirmar 204 e 30.
2. Especificar o PRD-02 (quick-prd, full-prd e tasks) a partir da `ARCHITECTURE.md` §2.4 e da fase 2 do `MASTER-PLAN.md`, incluindo a etapa de build que baixa o motor.
3. Apresentar ao Professor a estrutura de classes e métodos antes do código extenso.
4. Implementar, testando primeiro o carregamento pelo esquema `hp12c-app://` (risco de módulos ES em `file://`, DEC-005).
5. Verificar e gravar o `verification-report.md`; commit `[PRD-02]` e push.
6. Encerrar com `/encerramento`: rastreamento, contexto v3.0, whats-next e RETOMADA-sessao-3.

## Gate de encerramento

> PRD-02 com critérios de aceite verdes, app abrindo o painel com a calculadora funcional pelo mouse e pelo teclado e a memória mantida entre aberturas, `verification-report.md` gravado, commit `[PRD-02]` em `main` publicado, working tree limpo e documentos atualizados.
