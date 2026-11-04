# Verification Report — PRD-04 Widget de área de trabalho (FinRPN)

> Sessão 4, 04/11/2026. Verificação na tela pelo Professor Cecílio, com medição nos registros do sistema e nos arquivos gravados.

# 1 Critérios de aceite

| # | Critério | Resultado | Evidência |
|---|---|---|---|
| 1 | `build-app.sh` produz o `.app` com `Contents/PlugIns/FinRPNWidget.appex`; `codesign --verify --deep --strict` e `pluginkit` | ✅ | Verificação estrita sem erro; os direitos da `.appex` mostram a sandbox e a exceção de leitura restrita a `/Library/Application Support/FinRPN/`; `pluginkit -m -p com.apple.widgetkit-extension` lista `com.ceciliodaher.finrpn.widget(0.4.0)` |
| 2 | Suítes verdes, com os números medidos | ✅ | upstream 204/204; `web/tests` 39/39; `swift test` 24/24, medidos depois da última mudança |
| 3 | Widget na galeria nos três tamanhos; o pequeno mostra o visor, o médio e o grande a calculadora com o selo «Fin / RPN» | ✅ | Confirmado pelo Professor («Apareceu e o widget está visível»; «Tudo certo»). As imagens gravadas foram abertas e conferidas: `lcd.png` (recorte do visor) e `calc.png` (728 × 449 px, com o selo) |
| 4 | Visor novo no widget depois de um cálculo; atraso medido | ✅ em primeiro plano; ⚠️ segundo plano não medido | Imagens gravadas às 20:05:34,764 e 34,765; a extensão registrou `linha do tempo systemMedium: ready(130623 bytes)` às 20:05:34,777, ou seja, 13 ms depois. Medido com o app recém-aberto, em primeiro plano |
| 5 | Clique no widget abre o painel, com o app aberto e com o app fechado | ✅ depois da DEC-019 | Na primeira tentativa, com o painel minimizado, o clique ativou o app sem trazer o painel. O Professor decidiu que fechar encerra o app (DEC-019), e a ativação passou a trazer de volta o painel minimizado. Confirmado pelo Professor nos dois casos |
| 6 | Sem imagem, ou com imagem ilegível, o widget mostra aviso explícito | ✅ por teste; ⚠️ não visto na tela | `WidgetImageTests` cobrem ausente, ilegível (conteúdo que não é PNG e arquivo sem permissão) e pronto; o teste negativo (ilegível tratado como pronto) reprova. As imagens não foram apagadas durante a verificação na tela |
| 7 | Mensagem `image` inválida recusada sem gravar nada | ✅ | `imageInvalidaERecusada` cobre campo ausente, campo que não é texto, base64 inválido, conteúdo vazio e conteúdo que não é PNG; o teste negativo (assinatura PNG desligada) reprova |

# 2 Medições da seção 4 do full-prd

| Medição | Resultado |
|---|---|
| Atraso entre a gravação e a leitura pelo widget | 13 ms em primeiro plano; segundo plano não medido |
| Clique com o app aberto e com o app encerrado | Funciona nos dois casos depois da DEC-019 |
| Tamanho das imagens | `calc.png` com cerca de 130 KB; `lcd.png` entre 3 e 6 KB, conforme o visor |
| Estado `.missing` na tela | Não exercitado na tela; coberto por teste |

# 3 Outras observações

- **Sandbox e caminho da pasta.** O teste de `StateStore.defaultDirectory()` não distingue o caso da sandbox, porque fora dela o resultado é o mesmo. A prova é o registro da própria extensão, em sandbox, lendo `calc.png` com 130.623 bytes da pasta real do usuário.
- **Imagem na partida.** As imagens só eram gravadas depois da primeira tecla; a página passou a publicá-las também ao abrir, para o widget não mostrar o aviso com o app aberto.
- **Registro do widget.** O primeiro `log show` voltou vazio por dois motivos, nenhum deles defeito do widget: mensagens de nível info do `Logger` não ficam guardadas (o registro passou a nível notice), e o processo da extensão em execução era de uma montagem anterior. Encerrado esse processo, o sistema subiu o binário novo.
- **Ícone do app (acréscimo de escopo, a pedido do Professor).** O `icon.svg` do upstream mostra «12C», marca da HP; o `upstream.patch` troca por «Fin» em sete segmentos, com o título FinRPN, e o `upstream-patch.test.js` trava a troca (teste negativo reprova). O `build-app.sh` renderiza o SVG pelo QuickLook, aplica a grade de ícone do macOS (`macos/tools/make-iconset.swift`) e gera o `FinRPN.icns`. O Professor confirmou o ícone no Dock.
- **Versão.** App e widget em 0.4.0; a versão do widget é copiada do `Info.plist` do app na montagem.
- **Dock.** O Professor notou que, fechado, o app não fica entre os apps recentes do Dock. A instalação em Aplicativos fica para o PRD-05 (pacote de instalação).
