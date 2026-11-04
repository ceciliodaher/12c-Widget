# Quick-PRD — PRD-04 Widget de área de trabalho (FinRPN)

## Problema
O FinRPN só aparece quando o painel está aberto. O Professor Cecílio quer ver a calculadora na área de trabalho e abri-la com um clique.

## Solução proposta
Uma extensão WidgetKit somente leitura (DEC-003), montada por `macos/build-app.sh` em `Contents/PlugIns`, sem Xcode (DEC-015). A própria página converte o desenho SVG da calculadora em duas imagens PNG: a calculadora inteira e o recorte do visor. As imagens seguem pela ponte, e o app as grava em `~/Library/Application Support/FinRPN/` (DEC-016). Depois de gravar, o app pede a recarga do widget, e o widget só exibe as imagens. O desenho continua num único lugar, o upstream (DEC-002), e o Swift não desenha nem calcula nada (DEC-006). O conteúdo de cada tamanho é a DEC-018.

## Escopo
- **Dentro**: módulo `web/mac/widget-image.js` (SVG para PNG, com intervalo mínimo entre gravações) e a mensagem `image` da ponte; `Contract`, `BridgeMessage` e `StateStore` estendidos no `FinRPNCore`, com testes; `WidgetImage`, que lê a imagem e devolve um estado explícito; recarga da linha do tempo no `BridgeController`; o alvo `FinRPNWidget` (pequeno com o visor, médio e grande com a calculadora), com `Info.plist` e direitos; a montagem e a assinatura da `.appex` no `build-app.sh`.
- **Fora**: teclas que funcionem no widget (rejeitadas pela DEC-003); registradores em texto (o Professor recusou na DEC-018); barra de menus, atalho e Ajustes (PRD-03).

## Critérios de aceite
1. `macos/build-app.sh` produz o `FinRPN.app` com `Contents/PlugIns/FinRPNWidget.appex`; `codesign --verify --deep --strict` passa, e `pluginkit -m -p com.apple.widgetkit-extension` lista a extensão.
2. As suítes passam com zero falhas: upstream 204, `web/tests` e `swift test`, com os números medidos.
3. O widget aparece na galeria nos tamanhos pequeno, médio e grande. O pequeno mostra o visor, e o médio e o grande mostram a calculadora inteira, com o selo «Fin / RPN».
4. Depois de um cálculo no painel, o widget mostra o visor novo. O atraso fica medido e registrado no relatório.
5. Um clique no widget abre o painel, com o app aberto e com o app fechado.
6. Sem imagem gravada, ou com uma imagem ilegível, o widget mostra um aviso explícito, e não uma calculadora inventada (teste e tela).
7. Uma mensagem `image` inválida (falta de campo, base64 inválido, conteúdo que não é PNG) é recusada sem gravar nada (teste, com teste negativo).
