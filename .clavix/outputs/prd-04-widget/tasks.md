## Tasks — PRD-04 Widget de área de trabalho (FinRPN)

### Phase 0: Baseline
- [x] `web/fetch-upstream.sh`; upstream 204/204, `web/tests` 30/30, `swift test` 17/17
- [x] Tamanhos e conteúdo decididos pelo Professor Cecílio (DEC-018), com parecer do architect-review conferido na fonte
- [x] Sonda: SVG para PNG num WKWebView sem janela (full-prd §2)

### Phase 1: Camada web (TDD)
- [x] `widget-image.js`: recorte do visor lido do desenho, erro se o vidro não existir; teste negativo
- [x] `scheduleImage`: intervalo mínimo, vale a última chamada; sem manipulador nativo, não publica
- [x] `persist()` em `main-mac.js` chama `scheduleImage`
- [x] Gate: suítes JS verdes

### Phase 2: FinRPNCore (TDD)
- [x] `Contract.calcImageFile` e `lcdImageFile`
- [x] `BridgeMessage.image`: recusa de campo ausente, base64 inválido e conteúdo que não é PNG; teste negativo
- [x] `StateStore.saveImages` e o caminho real da pasta, fora do contêiner da sandbox
- [x] `WidgetImage.load`: `.ready`, `.missing` e `.unreadable`
- [x] Gate: `swift test` verde

### Phase 3: App e extensão
- [x] `BridgeController`: `.image` grava e recarrega as linhas do tempo
- [x] Alvo `FinRPNWidget`, `Info.plist` e direitos da extensão
- [x] `build-app.sh`: `.appex` em `Contents/PlugIns`, assinatura de dentro para fora; `codesign --verify --deep --strict` e `pluginkit`
- [x] Gate: o widget aparece na galeria

### Phase 4: Verify
- [x] Critérios 1 a 7 do quick-prd, com as medições da seção 4 do full-prd, na tela com o Professor
- [x] `verification-report.md`; DEC-018 em `docs/DECISIONS.md`; commit `[PRD-04]`; push

### Acréscimos na verificação (a pedido do Professor)
- [x] DEC-019: fechar encerra o app; ativação traz de volta o painel minimizado
- [x] Ícone do app com «Fin» no visor (`upstream.patch`, `tools/make-iconset.swift`, `build-app.sh`), com trava e teste negativo
