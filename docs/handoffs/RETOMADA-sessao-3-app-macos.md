# Retomada Sessão 3 — PRD-02, fases 3 e 4 (app FinRPN)

> ⚠️ **CONSUMIDA em 04/11/2026.** A sessão 3 executou este roteiro. Não use o prompt abaixo; a retomada ativa é `RETOMADA-sessao-4-widget.md`.

## Prompt de arranque (neutralizado — não usar)

```
Diretório: /Users/ceciliodaher/Documents/git/HP-12c-Widget (projeto 12c Widget; o app se chama FinRPN, DEC-014).
Leia, nesta ordem: docs/handoffs/RETOMADA-sessao-3-app-macos.md, CLAUDE.md, .claude/context.md (v2.2),
docs/DECISIONS.md (v1.3, DEC-014 a 016), .clavix/outputs/prd-02-involucro-macos/ (quick-prd, full-prd, tasks).
Estado: main publicada com a governança da sessão 2 (topo = último commit [S2]). O código do PRD-02 está na branch
LOCAL feat/prd-02-involucro-macos, no commit «[PRD-02] WIP fases 1 e 2», não publicada.
Antes de testar: git switch feat/prd-02-involucro-macos; git rebase main (a branch é local); web/fetch-upstream.sh.
Suítes esperadas: upstream 204/204; web/tests 30/30; swift test 17/17, com o comando do CLAUDE.md §5
(o -Xswiftc -plugin-path é obrigatório nas Command Line Tools).
Tarefa: fase 3 do PRD-02 — app FinRPN em macos/Sources/FinRPN/ (AppDelegate, PanelController, WebViewHost,
AppSchemeHandler, BridgeController, menu Editar), macos/Info.plist e macos/build-app.sh (fetch-upstream, swift build -c release,
montagem do .app com web/mac e web/upstream/{src,vendor} em Contents/Resources/web, codesign ad hoc).
Depois, a fase 4: verificação na tela com o Professor Cecílio (painel, teclado, memória entre aberturas, ⌘C/⌘V, som),
verification-report.md, commit único [PRD-02] em main (consolidando o WIP) e push.
Restrições: sem Xcode (DEC-015); nunca editar web/upstream/ (só por upstream.patch com DEC); nenhum cálculo fora do motor
(DEC-006); push só de main (outras branches exigem nova autorização); nunca usar /compact.
```

## Estado ao fim desta sessão

- **Git:** `main` = `origin/main`, com o topo no último commit `[S2]`. A branch local `feat/prd-02-involucro-macos` tem um commit próprio («[PRD-02] WIP fases 1 e 2») sobre o commit de governança `9f2f13c`. Os commits `[S2]` posteriores de `main` não estão nela; por isso o passo 1 faz `git rebase main`, e não *fast-forward*. Árvore limpa. A branch não foi publicada, porque o push de outras branches exige nova autorização.
- **Suítes medidas no encerramento:** upstream 204/204, `web/tests` 30/30, `swift test` 17/17 (com `-Xswiftc -plugin-path`).
- **Produção:** não há.
- **Gates atingidos:**
  - DEC-014, 015 e 016 aprovadas pelo Professor Cecílio;
  - fases 1 e 2 do PRD-02 verdes, com a trava do patch vista vermelha antes da troca;
  - lista paralela (`Contract` × JS) e recusa de caminho fora da raiz provadas por teste negativo;
  - sonda do widget sem Xcode confirmada na tela pelo Professor.
- **Gates deferidos, com a razão:** os critérios 1, 3, 4 e 6 do quick-prd dependem do app, que é a fase 3, e da verificação manual, que é a fase 4. São eles: o build do `.app`, o painel com teclado, a memória entre aberturas, ⌘C e ⌘V e a persistência da preferência de som.
- **Efeito colateral do ambiente:** depois de apagar `macos/.build`, o SwiftPM das Command Line Tools deixou de achar sozinho o plugin `TestingMacros`. Um pacote mínimo reproduz o problema, então ele não vem do projeto. O contorno está no `CLAUDE.md` §5.
- **Referência para o PRD-04:** o código da sonda do widget não foi versionado. Os parâmetros que funcionaram estão na DEC-015 e na DEC-016: a ligação com `-e _NSExtensionMain`, o `NSExtensionPointIdentifier` `com.apple.widgetkit-extension`, a sandbox e a exceção `home-relative-path.read-only`.

## Roteiro de execução

1. Trocar para a branch, `git rebase main`, rodar `web/fetch-upstream.sh` e as três suítes; confirmar 204, 30 e 17.
2. `Info.plist`, `main.swift` e `AppDelegate`: política de ativação regular, e o clique no Dock reabre o painel.
3. `AppSchemeHandler` (usa `SchemeResolver`), `BridgeController` (usa `BridgeMessage` e `StateStore`, e registra as recusas no `os.Logger`), `WebViewHost` (script de partida, fundo transparente) e `PanelController` (`canBecomeKey`, proporção 1280:790, `setFrameAutosaveName`, todos os espaços de trabalho), mais o menu Editar padrão.
4. `build-app.sh`: rodar a partir de `web/upstream/` apagado e conferir com `codesign --verify --deep --strict`.
5. Abrir o app e verificar com o Professor os critérios 3 a 6 do quick-prd e os riscos da seção 4 do full-prd.
6. Gravar o `verification-report.md`. Consolidar a branch num commit único `[PRD-02]` em `main`, por squash, e publicar.
7. Encerrar com `/encerramento`: contexto v3.0, rastreamento, retomada da sessão 4 (PRD-03, que aguarda a DEC-009).

## Gate de encerramento

> PRD-02 com os seis critérios de aceite verdes: o `FinRPN.app` montado por `build-app.sh` abre o painel com a calculadora funcionando pelo mouse e pelo teclado, a memória se mantém entre aberturas e o estado fica em `~/Library/Application Support/FinRPN/`. Além disso: `verification-report.md` gravado, commit único `[PRD-02]` em `main` publicado, árvore limpa e documentos atualizados.
