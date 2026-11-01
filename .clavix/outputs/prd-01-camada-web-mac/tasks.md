## Tasks — PRD-01 Camada web para Mac

### Phase 0: Baseline
- [x] `git init` na raiz do projeto, se ainda não houver repositório; criar branch `feat/prd-01-camada-web-mac`
- [x] Clonar malufloyd/hp12c, fazer checkout de `f1c12e80a9c14757c8bf406386f7ced1f405c3a9`, copiar sem `.git` para `web/upstream/`
- [x] Criar `web/UPSTREAM.md` com origem, commit, data e autorização (DEC-001)
- [x] Rodar a suíte do upstream e registrar o número exato de testes (passed, failed)
- [x] Gate: `diff -r` vazio e suíte do upstream verde

### Phase 1: Ponte e página
- [x] `native-bridge.js` com `NativeStorage`, detecção de modo, `publishSnapshot`, `onNativeCommand`
- [x] `web/tests/native-bridge.test.js`
- [x] `mac.css` e `index-mac.html`
- [x] `main-mac.js` com entrada por ponteiro e persistência pela ponte
- [x] Gate: página abre no Safari, calcula pelo mouse e mantém a memória ao recarregar

### Phase 2: Teclado
- [x] Confirmar a DEC-008 com o Professor Cecílio; se não houver resposta, implementar a proposta e registrar a pendência
- [x] `keyboard.js` com `KEYMAP`, `KeyboardController` e `translate`
- [x] `web/tests/keyboard.test.js`
- [x] Gate: todas as teclas do `KEYMAP` acionam a tecla certa no navegador, com realce visual

### Phase 3: Área de transferência
- [x] `clipboard.js` com `copyX`, `pasteToKeys` e `PasteFormatError`
- [x] `web/tests/clipboard.test.js`
- [x] Gate: ⌘C e ⌘V funcionam no Safari; texto inválido mostra aviso e não altera X

### Phase 4: Verify
- [x] `web/tests/integration.test.js`
- [x] Rodar a suíte do upstream (mesmo número da baseline, zero falhas)
- [x] Rodar a suíte de `web/tests/` (zero falhas)
- [x] Gravar `verification-report.md` com os números exatos
- [x] Commit `[PRD-01] Camada web para Mac`, merge fast-forward, apagar a branch (sem push)
