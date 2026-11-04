# Retomada Sessão 5 — PRD-03, conveniências

## ▶️ Prompt de arranque (copiar e colar)

```
Diretório: /Users/ceciliodaher/Documents/git/HP-12c-Widget (projeto 12c Widget; o app se chama FinRPN, DEC-014).
Leia, nesta ordem: docs/handoffs/RETOMADA-sessao-5-conveniencias.md, CLAUDE.md, .claude/context.md (v4.0),
docs/DECISIONS.md (v1.5: DEC-003, 009, 015, 016, 018 e 019), docs/MASTER-PLAN.md (v1.3, fase 3),
.clavix/outputs/prd-04-widget/verification-report.md.
Estado: PRD-04 (widget) e PRD-05 (pacote .dmg) concluídos e publicados; main = origin/main no último commit [S4].
O FinRPN 0.4.0 está instalado em /Applications, com o widget e o ícone fixo no Dock.
Antes de mexer: web/fetch-upstream.sh e as três suítes (upstream 204, web/tests 39, swift test 24, com o comando do CLAUDE.md §5).
Tarefa: decidir com o Professor a DEC-009 (atalho global padrão) e então especificar (quick-prd, full-prd, tasks em
.clavix/outputs/prd-03-conveniencias/) e executar o PRD-03: item na barra de menus, atalho global que abre e fecha o painel
de qualquer app, Ajustes e abrir no login. Rever com o Professor como o item da barra de menus convive com a DEC-019
(fechar o painel encerra o app).
Restrições: sem Xcode (DEC-015); nunca editar web/upstream/ (mudança só por web/upstream.patch); nenhum cálculo fora do motor
(DEC-006); registros do sistema só com /usr/bin/log; push só de main; nunca usar /compact.
```

## Estado ao fim desta sessão

- **Git:** `main` = `origin/main`, árvore limpa. Commits da sessão: `7b8f585 [PRD-04]`, `c79f70a [PRD-05]`, `ed0a5cf [S4]` (governança) e o commit `[S4]` desta retomada. Nenhuma outra branch.
- **Suítes medidas no encerramento (em `main`, depois do último commit de código):** upstream 204/204, `web/tests` 39/39, `swift test` 24/24.
- **Produção:** não há publicação. O app 0.4.0 está instalado em `/Applications/FinRPN.app` a partir de `macos/build/FinRPN-0.4.0.dmg` (fora do git). O registro da cópia de `macos/build/` foi removido.
- **Gates atingidos:**
  - PRD-04: sete critérios verificados na tela pelo Professor Cecílio e nos registros; DEC-018 e DEC-019.
  - PRD-05: três critérios verificados.
  - Relatórios em `.clavix/outputs/prd-04-widget/` e `.clavix/outputs/prd-05-instalador/`.
- **Gates deferidos, com a razão:**
  - **Atraso do widget com o app em segundo plano:** não medido, porque só se mediu com o app recém-aberto. Em primeiro plano, foi de 6 a 13 ms.
  - **Aviso «Abra o FinRPN…» na tela:** coberto por teste, mas não visto, porque as imagens não foram apagadas durante a verificação.
  - **Instalação oferecida pelo próprio macOS ao abrir o `.dmg`:** falhou com o app já instalado e aberto. O Professor dispensou repetir o teste com Aplicativos vazio.
- **Pendente do Professor:** DEC-009 (atalho global), que bloqueia o PRD-03.

## Pontos técnicos para o PRD-03

- **Barra de menus e DEC-019.** A DEC-003 previa `MenuBarExtra`. Com fechar encerrando o app (DEC-019), um item na barra de menus só existe enquanto o app roda. Pergunte ao Professor se o item da barra deve manter o app vivo ao fechar o painel, o que exigiria rever a DEC-019, ou se fica como está.
- **Atalho global.** O plano prevê o pacote KeyboardShortcuts (MIT). Confirme se ele compila por SwiftPM sem Xcode antes de escrever o PRD; se não compilar, `NSEvent.addGlobalMonitorForEvents` exige permissão de Acessibilidade, e `RegisterEventHotKey` (Carbon) não exige.
- **Abrir no login.** `SMAppService.mainApp.register()` (macOS 13 ou posterior) funciona com o app em `/Applications`. Medir com a assinatura ad hoc.
- **Cópia de desenvolvimento.** Abrir `macos/build/FinRPN.app` a registra de novo e duplica o widget na galeria. Teste pela cópia instalada (`macos/make-dmg.sh` e arrastar) ou rode `lsregister -u` depois.
- **Comando `copy` sem gesto.** Ficou sem medir desde o PRD-02. Medir se a barra de menus usar o comando.

## Roteiro de execução

1. Rodar `web/fetch-upstream.sh` e as três suítes, e confirmar 204, 39 e 24.
2. Decidir com o Professor a DEC-009 e a convivência da barra de menus com a DEC-019, numa pergunta só, já com o parecer de um agente.
3. Escrever quick-prd, full-prd e tasks do PRD-03 em `.clavix/outputs/prd-03-conveniencias/`.
4. Fazer uma sonda do atalho global sem Xcode (KeyboardShortcuts ou Carbon).
5. Implementar com TDD no `FinRPNCore` o que for lógica pura (por exemplo, a validação do atalho guardado), com teste negativo.
6. Montar e instalar pelo `.dmg`, e verificar na tela com o Professor: o atalho abre e fecha o painel vindo de outro app, os Ajustes guardam a escolha, e o app abre no login.
7. Gravar `verification-report.md`, fazer o commit único `[PRD-03]` em `main` com push, e rodar `/encerramento`.

## Gate de encerramento

> PRD-03 com os critérios de aceite verdes: o atalho global abre e fecha o painel a partir de qualquer app, o item da barra de menus e os Ajustes funcionam, e o app abre no login, verificado na cópia instalada em `/Applications`. Além disso: suítes verdes com o número medido, `verification-report.md` gravado, DEC-009 registrada, commit único `[PRD-03]` em `main` publicado, árvore limpa e documentos atualizados.
