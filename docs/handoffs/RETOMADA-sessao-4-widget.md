# Retomada Sessão 4 — PRD-04, widget de área de trabalho

## ▶️ Prompt de arranque (copiar e colar)

```
Diretório: /Users/ceciliodaher/Documents/git/HP-12c-Widget (projeto 12c Widget; o app se chama FinRPN, DEC-014).
Leia, nesta ordem: docs/handoffs/RETOMADA-sessao-4-widget.md, CLAUDE.md, .claude/context.md (v3.0),
docs/DECISIONS.md (v1.4: DEC-003, 015, 016 e 017), docs/MASTER-PLAN.md (v1.2, fase 4),
.clavix/outputs/prd-02-involucro-macos/verification-report.md.
Estado: PRD-02 concluído e publicado (commit [PRD-02] e561ef9); main = origin/main no último commit [S3].
O FinRPN.app (macos/build-app.sh) já grava snapshot.json em ~/Library/Application Support/FinRPN/ a cada tecla.
Antes de mexer: web/fetch-upstream.sh e as três suítes (upstream 204, web/tests 30, swift test 17, com o comando do CLAUDE.md §5).
Tarefa: especificar (quick-prd, full-prd, tasks em .clavix/outputs/prd-04-widget/) e executar o PRD-04 — extensão WidgetKit
somente leitura (DEC-003) que mostra o visor e os registradores de snapshot.json e abre o painel com um clique, montada
por build-app.sh em Contents/PlugIns, sem Xcode, com os parâmetros da sonda da sessão 2 (DEC-015 e DEC-016).
Perguntar ao Professor no início: tamanhos do widget (pequeno, médio) e o que cada um mostra.
Restrições: sem Xcode (DEC-015); nunca editar web/upstream/; nenhum cálculo fora do motor (DEC-006) — o widget só exibe
texto já formatado pelo motor; push só de main; nunca usar /compact.
```

## Estado ao fim desta sessão

- **Git:** `main` = `origin/main`, topo no commit de governança `[S3]`, árvore limpa. O código do PRD-02 entrou no commit único `e561ef9 [PRD-02]`; a branch local `feat/prd-02-involucro-macos` foi consolidada e apagada. Nenhuma outra branch.
- **Suítes medidas no encerramento (em `main`, depois do commit `[PRD-02]`):** upstream 204/204, `web/tests` 30/30, `swift test` 17/17.
- **Produção:** não há. O app é montado localmente em `macos/build/FinRPN.app` (fora do git).
- **Gates atingidos:** seis critérios de aceite do PRD-02, verificados na tela pelo Professor Cecílio e nos arquivos gravados (relatório em `.clavix/outputs/prd-02-involucro-macos/verification-report.md`); DEC-017 registrada.
- **Gates deferidos, com a razão:**
  - o registro da recusa de mensagem no log não foi exercitado no app aberto, porque nenhuma mensagem foi recusada; a recusa está provada por teste;
  - o comando nativo `copy` sem gesto não foi medido, porque não tem chamador até o PRD-03;
  - a recarga depois de queda do processo da página não foi provocada.
- **Pendente do Professor:** DEC-009 (atalho global), que bloqueia só o PRD-03, agora posterior ao PRD-04.

## Pontos técnicos para o PRD-04

- **A sonda não foi versionada.** Os parâmetros que funcionaram estão nas DEC-015 e DEC-016: ligar o executável da extensão com `-Xlinker -e -Xlinker _NSExtensionMain`; `NSExtensionPointIdentifier` = `com.apple.widgetkit-extension`; sandbox ligada, com `com.apple.security.temporary-exception.files.home-relative-path.read-only` restrita a `/Library/Application Support/FinRPN/`; assinatura ad hoc de dentro para fora (primeiro a `.appex`, com os direitos, depois o `.app`).
- **Fonte do widget:** `snapshot.json` com `text`, `ann`, `x` e `fin` (n, i, pv, pmt, fv), todos os números em texto. O nome do arquivo está em `Contract.snapshotFile`, que é o ponto único no Swift; a extensão deve importar o `FinRPNCore` em vez de repetir o nome. Arquivo ausente ou ilegível vira estado explícito no widget, nunca um zero inventado.
- **Atualização:** o app pede a recarga da linha do tempo (`WidgetCenter.shared.reloadAllTimelines()`) depois de gravar a fotografia. Medir o atraso real e registrar no relatório, porque o macOS limita as recargas.
- **Clique:** por padrão, o clique no widget abre o app que o contém. Conferir se isso já mostra o painel (`applicationShouldHandleReopen` cobre o app aberto; o app fechado mostra o painel na partida). Só se não bastar, registrar um esquema de URL.

## Roteiro de execução

1. `web/fetch-upstream.sh` e as três suítes; confirmar 204, 30 e 17.
2. Perguntar ao Professor os tamanhos do widget e o conteúdo de cada um.
3. Escrever quick-prd, full-prd e tasks do PRD-04 em `.clavix/outputs/prd-04-widget/`.
4. TDD no `FinRPNCore`: leitura e validação do `snapshot.json` (o mesmo contrato do `BridgeMessage`), com teste negativo.
5. Alvo da extensão no `Package.swift`, `Info.plist` e direitos da extensão, e a montagem em `Contents/PlugIns` no `build-app.sh`. Conferir com `codesign --verify --deep --strict` e `pluginkit -m -p com.apple.widgetkit-extension`.
6. Recarga da linha do tempo no `BridgeController` depois do `snapshot`.
7. Verificação na tela com o Professor: o widget aparece na galeria, mostra o visor depois de um cálculo e abre o painel com um clique. Gravar o `verification-report.md`.
8. Commit único `[PRD-04]` em `main` e push; `/encerramento`.

## Gate de encerramento

> PRD-04 com os critérios de aceite verdes: o `FinRPN.app` montado por `build-app.sh` traz o widget, que aparece na galeria, mostra o visor atualizado depois de um cálculo feito no painel e abre o painel com um clique. Além disso: suítes verdes com o número medido, `verification-report.md` gravado, commit único `[PRD-04]` em `main` publicado, árvore limpa e documentos atualizados.
