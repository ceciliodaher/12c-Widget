# Verification Report — PRD-02 Invólucro macOS (FinRPN)

> Sessão 3, 04/11/2026. Verificação na tela pelo Professor Cecílio, com medição dos arquivos gravados.

# 1 Critérios de aceite

| # | Critério | Resultado | Evidência |
|---|---|---|---|
| 1 | `build-app.sh` a partir de `web/upstream/` apagado produz o `.app`; `codesign --verify --deep --strict` passa | ✅ | `web/upstream/` apagado antes do build; o script baixou o motor, compilou em release, montou e assinou ad hoc (`Identifier=com.ceciliodaher.finrpn`, `Signature=adhoc`) e terminou com a verificação estrita sem erro |
| 2 | `swift test`, upstream e `web/tests` verdes | ✅ | upstream 204/204; `web/tests` 30/30; `swift test` 17/17, medido de novo depois da última mudança do `FinRPNCore` |
| 3 | Painel com o selo «Fin / RPN», cálculo pelo mouse e pelo teclado, teclado vindo de outro app | ✅ | Captura de tela do painel flutuante com o selo; `12 ENTER 3 +` = 15,00 pelo mouse e pelo teclado, confirmado pelo Professor, inclusive com o foco vindo de outra janela |
| 4 | Memória contínua entre aberturas, na pasta do app | ✅ | Confirmado pelo Professor depois de ⌘Q e nova abertura; `~/Library/Application Support/FinRPN/` contém `hp12c.state.v1` (pilha 12, 15, 15, 36) e `snapshot.json` com números em texto (`"x":"12"`) |
| 5 | Mensagem de ponte inválida rejeitada e registrada, sem gravar nada | ✅ por teste; ⚠️ log não exercitado no app aberto | `BridgeMessageTests` cobrem as recusas; o `BridgeController` registra a recusa por `os.Logger` (categoria `bridge`) e retorna antes de qualquer gravação. No uso real nenhuma mensagem foi recusada: o log do subsistema ficou vazio na sessão, o que também mostra que a página não enviou mensagem inválida |
| 6 | ⌘C e ⌘V; preferência de som persiste | ✅ | Confirmado pelo Professor: ⌘C copiou X para outro app, ⌘V colou no painel, e o som alternado por ON 2 s se manteve depois de reabrir o app |

# 2 Riscos da seção 4 do full-prd

| Risco | Resultado medido |
|---|---|
| `localStorage` da preferência de som sob esquema próprio | Persiste: o WebKit grava em `~/Library/WebKit/com.ceciliodaher.finrpn/WebsiteData`, e a preferência sobreviveu à reabertura |
| `document.execCommand('copy')` sem gesto | Não medido: o menu Editar cobre ⌘C, e o comando nativo `copy` não tem chamador no PRD-02. Fica para o PRD-03, se a barra de menus o usar |
| Foco de teclado no NSPanel vindo de outro app | Funciona: o painel ativa o app ao receber o clique, e o teclado chega à calculadora |

# 3 Outras observações

- Posição e tamanho lembrados: `NSWindow Frame FinRPNPanel` gravado nas preferências do app; o painel reabriu no mesmo lugar.
- Fechar o painel não encerra o app; o clique no Dock o reabre (confirmado pelo Professor).
- Depois de uma queda do processo da página, o `WebViewHost` recarrega relendo o estado do disco, e não o da abertura. Esse caminho não foi provocado na verificação.
- Os avisos do `ld` sobre caminhos de busca ausentes vêm das Command Line Tools e aparecem em qualquer pacote.
