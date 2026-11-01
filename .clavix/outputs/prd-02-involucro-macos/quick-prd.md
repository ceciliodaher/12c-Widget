# Quick-PRD — PRD-02 Invólucro macOS (FinRPN)

## Problema
A camada web do PRD-01 só roda no navegador. Falta o app nativo que a carrega num painel flutuante do Mac e guarda a memória contínua fora do WebKit.

## Solução proposta
Pacote SwiftPM em `macos/` (DEC-015) com uma biblioteca de lógica testável (`FinRPNCore`) e o executável do app (`FinRPN`). O app abre um NSPanel flutuante com um WKWebView, serve `web/` do pacote do app pelo esquema `finrpn-app://` (DEC-005, DEC-014), injeta o estado salvo na partida e grava cada mudança em `~/Library/Application Support/FinRPN/` (DEC-004, DEC-016). O script `macos/build-app.sh` baixa o motor, compila, monta e assina o `FinRPN.app`. O selo do desenho passa a «Fin / RPN» (DEC-014).

## Escopo
- **Dentro**: `Package.swift`, `Info.plist`, `build-app.sh`; `FinRPNCore` (contrato, StateStore, mensagens da ponte, resolução do esquema, script de partida) com testes; app com AppDelegate, PanelController, WebViewHost, AppSchemeHandler e BridgeController; menu Editar padrão para ⌘C e ⌘V; troca do manipulador `hp12c` por `finrpn` em `web/mac/`; selo e `aria-label` no `web/upstream.patch`; título da página.
- **Fora**: barra de menus, atalho global, Ajustes e abrir no login (PRD-03); extensão WidgetKit (PRD-04); renomeação do repositório e dos documentos (DEC-014).

## Critérios de aceite
1. `macos/build-app.sh`, a partir de `web/upstream/` apagado, produz `macos/build/FinRPN.app`, e `codesign --verify --deep --strict` passa.
2. `swift test` em `macos/` passa com zero falhas; upstream 204/204 e `web/tests` com zero falhas.
3. Aberto o app, o painel flutuante mostra a calculadora com o selo «Fin / RPN», calcula pelo mouse e pelo teclado físico e recebe o teclado mesmo vindo de outro app.
4. A memória contínua sobrevive a sair do app e abri-lo de novo (arquivo em `~/Library/Application Support/FinRPN/`).
5. Mensagem de ponte inválida é rejeitada e registrada, sem gravar nada (teste e log).
6. ⌘C copia X e ⌘V cola dentro do app; a preferência de som (ON segurado 2 s) sobrevive a reabrir o app, ou o comportamento real fica medido e registrado.
