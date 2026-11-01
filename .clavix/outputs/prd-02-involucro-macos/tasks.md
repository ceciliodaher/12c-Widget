## Tasks — PRD-02 Invólucro macOS (FinRPN)

### Phase 0: Baseline
- [ ] `web/fetch-upstream.sh`; upstream 204/204 e `web/tests` 30/30
- [ ] DEC-014, DEC-015 e DEC-016 aprovadas pelo Professor Cecílio

### Phase 1: Camada web
- [ ] Manipulador `hp12c` -> `finrpn` em `native-bridge.js` e nos testes
- [ ] Selo «Fin / RPN» e `aria-label` «FinRPN» no `upstream.patch`, `sw.js` recarimbado, `upstream-patch.test.js` atualizado; teste negativo
- [ ] Título «FinRPN» em `index-mac.html`
- [ ] Gate: suítes JS verdes

### Phase 2: FinRPNCore (TDD)
- [ ] `Contract`, com o teste de lista paralela contra `storage.js` e `native-bridge.js`; teste negativo
- [ ] `StateStore` (ida e volta, null quando não há arquivo, gravação atômica)
- [ ] `BridgeMessage` (save, snapshot, recusas)
- [ ] `SchemeResolver` (tipos MIME, recusa de host, de caminho fora da raiz e de arquivo inexistente)
- [ ] `BootScript` (escape de aspas, barras e quebras de linha; null)
- [ ] Gate: `swift test` verde

### Phase 3: App
- [ ] `Package.swift`, `Info.plist`, `main.swift`, `AppDelegate`
- [ ] `AppSchemeHandler`, `BridgeController`, `WebViewHost`, `PanelController`, menu Editar
- [ ] `build-app.sh` a partir de `web/upstream/` apagado; `codesign --verify`
- [ ] Gate: painel abre e calcula pelo mouse e pelo teclado

### Phase 4: Verify
- [ ] Critérios 1 a 6 do quick-prd, com a memória entre aberturas e as medições da seção 4 do full-prd
- [ ] `verification-report.md`; commit `[PRD-02]`; push
