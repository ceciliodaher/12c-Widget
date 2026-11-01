# Full-PRD — PRD-02 Invólucro macOS (FinRPN)

# 1 Contexto

Fase 2 do `docs/MASTER-PLAN.md`. Aplicam-se DEC-004 (injeção síncrona na partida e gravação assíncrona), DEC-005 (esquema próprio), DEC-006 (nenhum cálculo no Swift), DEC-014 (nome FinRPN), DEC-015 (SwiftPM e script, sem Xcode) e DEC-016 (estado na pasta do app). O contrato da ponte do lado JS está em `web/mac/native-bridge.js` e na seção 3 do full-prd do PRD-01, e o Swift o segue sem alterá-lo, salvo o nome do manipulador.

# 2 Estrutura

```
macos/
  Package.swift            FinRPNCore (biblioteca), FinRPN (executável), FinRPNCoreTests
  Info.plist               identidade do app (com.ceciliodaher.finrpn), versionado como arquivo
  build-app.sh             fetch-upstream, swift build -c release, montagem do .app, codesign ad hoc
  Sources/FinRPNCore/
    Contract.swift         nomes do esquema, do manipulador e das chaves de estado (ponto único no Swift)
    StateStore.swift       leitura e gravação atômica do estado e da fotografia
    BridgeMessage.swift    validação das mensagens save e snapshot
    SchemeResolver.swift   URL do esquema -> arquivo do pacote e tipo MIME, com recusa de caminho fora da raiz
    BootScript.swift       fonte do WKUserScript que define window.__HP12C_BOOT__
  Sources/FinRPN/
    main.swift, AppDelegate.swift, PanelController.swift, WebViewHost.swift,
    AppSchemeHandler.swift, BridgeController.swift
  Tests/FinRPNCoreTests/   Swift Testing
```

# 3 Contratos

| Ponto | Contrato |
|---|---|
| Esquema | `finrpn-app://app/<caminho>`; raiz = `Contents/Resources/web/`; página `mac/index-mac.html`. Host diferente de `app`, caminho que escapa da raiz, arquivo inexistente ou extensão sem tipo conhecido: erro, registrado no log. Tipos: html, js, mjs, css, svg, json, png. |
| Partida | `WKUserScript` no início do documento: `window.__HP12C_BOOT__ = {"hp12c.state.v1": <texto ou null>}`, montado por `JSONSerialization` (nunca por concatenação de texto). |
| Mensagem `save` | `{type:'save', key, value}`; `key` ∈ {`hp12c.state.v1`, `hp12c.state.bad`}; `value` texto. Grava `<key>` como arquivo, de forma atômica. |
| Mensagem `snapshot` | `{type:'snapshot', text, ann, x, fin}`, números como texto. Grava `snapshot.json` (consumido pelo widget no PRD-04). |
| Mensagem inválida | Rejeitada, registrada por `os.Logger`, nada gravado. |
| Estado ilegível | Tratado pelo motor (`Pr Error` e cópia em `hp12c.state.bad`); o Swift não interpreta o conteúdo. |
| Painel | NSPanel com `canBecomeKey`, flutuante, em todos os espaços de trabalho, proporção 1280:790, posição e tamanho lembrados por `setFrameAutosaveName`. Fechar o painel não encerra o app; clicar no ícone do Dock reabre. |
| Área de transferência | Menu Editar padrão (Copiar, Colar): o WKWebView dispara os eventos `copy` e `paste` do documento, já tratados em `main-mac.js`. |

As chaves de estado vêm do `storage.js` do motor. Como o Swift precisa conhecê-las para validar, um teste lê `web/upstream/src/storage.js` e `web/mac/native-bridge.js` e confere se `Contract.swift` bate com eles (lista paralela travada).

# 4 Riscos a medir

| Risco | Como medir |
|---|---|
| `localStorage` da preferência de som não persistir sob esquema próprio | Ligar o som, sair, reabrir; registrar o resultado no verification-report |
| `document.execCommand('copy')` do comando nativo `copy` sem gesto | O menu Editar torna o comando desnecessário no PRD-02; registrar se ele funciona |
| Foco de teclado no NSPanel vindo de outro app | Teste manual com outro app em primeiro plano |
