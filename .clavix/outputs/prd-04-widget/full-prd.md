# PRD-04 — Widget de área de trabalho (FinRPN)

> Sessão 4, 04/11/2026. Decisões: DEC-002, DEC-003, DEC-006, DEC-015, DEC-016, DEC-017 e DEC-018.

# 1 Contexto e decisão de produto

O Professor Cecílio pediu três tamanhos de widget que «mostrem a calculadora» e uma imagem «para que eu clique e ela se abra». O widget do macOS não roda JavaScript nem WKWebView, e o desenho da calculadora é SVG gerado em tempo de execução por `web/upstream/src/ui/calculator-view.js`. O agente architect-review comparou quatro caminhos, e o parecer foi conferido na fonte. Redesenhar a calculadora em Swift, ou sobrepor um visor desenhado em Swift a uma imagem fixa, duplicaria o desenho e envelheceria a cada atualização do upstream. Teclas que funcionem no widget exigiriam rever a DEC-003. O caminho escolhido é a própria página gerar a imagem do seu desenho.

Na DEC-018, o Professor fixou o conteúdo de cada tamanho: o pequeno mostra só o visor, porque nele a calculadora inteira fica com as legendas ilegíveis; o médio e o grande mostram a calculadora inteira, sem registradores em texto; o clique em qualquer um deles abre o painel.

# 2 Sonda medida antes do PRD (04/11/2026)

Um WKWebView **sem janela** carregou `mac/index-mac.html`, recebeu as teclas 1, 2, 3 e ENTER e converteu o `svg.calculator` serializado em PNG por um canvas. A imagem saiu fiel: visor «123.00», selo «Fin / RPN» e legendas com a fonte do sistema. O PNG tinha 728 × 449 px e cerca de 130 KB, e a conversão levou de 42 a 92 ms. O desenho só usa fontes do sistema e estilos inline (as regras de `styles.css` e `mac.css` tratam do tamanho e da animação do visor), por isso a serialização não perde nada. O programa da sonda ficou fora do repositório. O atraso da recarga do widget depende da extensão montada e é medido no Verify.

# 3 Desenho

## 3.1 Camada web

`web/mac/widget-image.js`:

- `renderImages(svg)` serializa o SVG e devolve `{ calc, lcd }` em base64, sem o prefixo `data:`. `calc` é a calculadora inteira a 728 px de largura (o dobro dos 364 pt do widget médio e do grande). `lcd` é o recorte do vidro do visor, a 340 px de largura (o dobro dos 170 pt do pequeno). O retângulo do visor é lido do próprio desenho (`rect[fill="url(#lcdGlass)"]`), e não repetido como número; se ele não for encontrado, a função lança erro.
- `scheduleImage(win, svg)` agenda a publicação com um intervalo mínimo de 300 ms: vale a última chamada, de modo que um programa em execução ou uma sequência rápida de teclas gera uma imagem só. Publica `{ type: 'image', calc, lcd }` pelo manipulador `finrpn`.
- Em `main-mac.js`, `persist()` chama `scheduleImage` depois de `publishSnapshot`. No modo de desenvolvimento (navegador, sem o manipulador nativo), não publica nada, como já ocorre com o `snapshot`.

## 3.2 FinRPNCore

- `Contract.calcImageFile = "calc.png"` e `Contract.lcdImageFile = "lcd.png"`: ponto único dos nomes, lido pelo app e pela extensão.
- `BridgeMessage.image(calc: Data, lcd: Data)`: exige os dois campos em texto, decodifica o base64 e confere a assinatura PNG (os oito primeiros bytes). Qualquer falha lança `BridgeError`.
- `StateStore.saveImages(calc:lcd:)`: grava os dois arquivos de forma atômica.
- `StateStore.homeDirectory()` ou equivalente: o caminho real da pasta, a partir do diretório do usuário obtido por `getpwuid`, porque dentro da sandbox da extensão o `FileManager` devolve o contêiner, e não a pasta do usuário. O app e a extensão usam o mesmo ponto.
- `WidgetImage.load(_ file:, from:) -> WidgetImage.State`, com `.ready(Data)`, `.missing` e `.unreadable(String)`. Arquivo que não começa pela assinatura PNG é `.unreadable`.

## 3.3 App

`BridgeController` trata `.image` gravando pelo `StateStore` e, em seguida, chama `WidgetCenter.shared.reloadAllTimelines()`. A recusa e a falha de gravação seguem para o `os.Logger`, como as demais mensagens.

## 3.4 Extensão

Alvo executável `FinRPNWidget` no `Package.swift`, ligado com `-Xlinker -e -Xlinker _NSExtensionMain` (DEC-015). Um `@main WidgetBundle` com um widget `StaticConfiguration`, nas famílias `.systemSmall`, `.systemMedium` e `.systemLarge`. O provedor lê a imagem certa para a família e entrega uma entrada com política `.never` (a recarga vem do app). A vista mostra a imagem ajustada à área (`aspectRatio(.fit)`), sem fundo próprio além do `containerBackground`. Nos estados `.missing` e `.unreadable`, mostra um texto curto, «Abra o FinRPN para ver a calculadora» ou «Imagem ilegível: <motivo>». O clique abre o app que contém a extensão, e o `applicationShouldHandleReopen` e a partida já mostram o painel; se isso não bastar, registra-se um `widgetURL` com o esquema do app.

`macos/Widget/Info.plist` (`NSExtensionPointIdentifier` = `com.apple.widgetkit-extension`, identificador `com.ceciliodaher.finrpn.widget`) e `macos/Widget/FinRPNWidget.entitlements` (sandbox ligada e `com.apple.security.temporary-exception.files.home-relative-path.read-only` = `/Library/Application Support/FinRPN/`).

## 3.5 Build

`build-app.sh` compila também o produto `FinRPNWidget`, monta `Contents/PlugIns/FinRPNWidget.appex/Contents/{MacOS,Info.plist}`, assina primeiro a `.appex` com os direitos, depois o `.app`, e roda `codesign --verify --deep --strict`.

# 4 Medições do Verify

1. O atraso entre a tecla no painel e o visor novo no widget, com o app em primeiro plano e em segundo plano.
2. O clique no widget com o app aberto (painel fechado) e com o app encerrado.
3. O tamanho dos arquivos `calc.png` e `lcd.png` gravados.
4. O estado `.missing`, visto na tela depois de apagar as imagens.
