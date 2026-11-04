## Tasks — PRD-05 Pacote de instalação (FinRPN)

### Phase 0: Decisão
- [x] Formato `.dmg` escolhido pelo Professor Cecílio, com parecer do architect-review conferido na máquina (ferramentas presentes, nenhuma identidade de assinatura, widget registrado a partir de `macos/build/`)

### Phase 1: Implement
- [x] `macos/make-dmg.sh`: `build-app.sh`, app, atalho para Aplicativos, `LICENSE.txt`, `LEIA-ME.txt` com a seção Marcas extraída do `README.md` (falha alto se ela não existir), `hdiutil create` e `verify`

### Phase 2: Verify
- [x] Critérios 1 a 3 do quick-prd; `verification-report.md`; commit `[PRD-05]`; push
