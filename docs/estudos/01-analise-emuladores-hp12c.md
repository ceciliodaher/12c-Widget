# 1 Análise comparativa dos emuladores da HP 12c no GitHub

Levantamento feito em 1º de novembro de 2026, por busca no GitHub e leitura do código-fonte dos repositórios (clonagem rasa). Os testes automatizados de cada projeto foram contados, mas não executados: a avaliação é estática. Contagens de estrelas e datas de último commit refletem o dia da consulta ✅.

## 1.1 Como lemos o universo de projetos

A busca por "hp12c", "hp-12c" e "12c calculator" devolve dezenas de repositórios, mas a maioria é exercício acadêmico ou protótipo de uma única tela, sem programação, sem datas e sem títulos. Separamos o que restou em duas famílias, porque elas respondem a perguntas diferentes. A primeira emula o microcódigo original da calculadora, executando a ROM da HP, e por isso reproduz o comportamento real até nos arredondamentos. A segunda reimplementa as funções a partir do manual, em linguagem moderna, o que facilita muito a integração com uma interface nova, ao custo de depender da disciplina do autor para chegar à fidelidade.

## 1.2 Quadro comparativo

| Repositório | Família | Modelo | Linguagem | Licença | Programação | Aritmética | Testes | Último commit |
|---|---|---|---|---|---|---|---|---|
| mike632t/x11-calc | Microcódigo (ROM HP) | 12C Gold + 25 modelos | C / X11 | GPL-3.0 | Completa (original) | BCD original | — | 2026 ✅ |
| brouhaha/nonpareil | Microcódigo (ROM HP) | 12C Gold + Voyager | C / GTK | GPL-2.0 + CC-BY-SA | Completa (original) | BCD original | — | 27/02/2025 ✅ |
| malufloyd/hp12c | Reimplementação | 12C Platinum (RPN e ALG) | JavaScript puro | **Sem licença** | 400 linhas, GTO, testes | decimal.js, 34 dígitos, arredonda a 10 | 200 | 16/10/2026 ✅ |
| juscilan/12c | Reimplementação | 12C Gold | TypeScript + Svelte 5 | **Sem licença** | 99 passos | ponto flutuante com ajustes | 101 | 01/10/2026 ✅ |
| mscottsewell/HP12c | Reimplementação didática | 12C Gold | JavaScript | **Sem licença** | **Não implementada** | ponto flutuante (IEEE 754) | 122 | 12/01/2026 ✅ |
| performance/HP12c | Reimplementação | 12C Gold | Elm | MIT | Parcial | ponto flutuante | 47 | 28/05/2025 ✅ |
| fabiolimace/finanx-12c | Reimplementação | 12C Gold | Java (Swing) | MIT | Sim | — | — | 28/02/2026 ✅ |
| gfso2000/hp12c_emulator | Binário Android | 12C Platinum | só APK | Sem licença | — | — | — | 20/05/2020 ✅ |

Fonte: repositórios no GitHub, arquivos README, LICENSE, package.json e código-fonte, consultados em 01/11/2026.

O quadro mostra que nenhum projeto reúne, ao mesmo tempo, fidelidade máxima, licença permissiva e tecnologia pronta para o Mac. Os emuladores de microcódigo são os mais fiéis, mas trazem a ROM da HP e licença GPL. Entre as reimplementações, a mais completa é a de malufloyd, que é justamente uma das que não declaram licença.

## 1.3 Leitura de cada candidato

### 1.3.1 x11-calc e Nonpareil

Os dois executam a ROM original da HP 12C sobre um simulador do processador Voyager. Na prática, isso equivale a ter a calculadora física dentro do computador: TVM, IRR, datas e programação se comportam como no aparelho, inclusive nos erros. O x11-calc está ativo (versão 0.26 em março de 2026, com reescrita do teclado) e compila no macOS, porém depende de X11, o que exige XQuartz. O Nonpareil é a referência histórica de Eric Smith, mas está praticamente parado e a porta para Mac nunca foi concluída. Há dois impedimentos para um produto: a ROM é propriedade intelectual da HP, e a GPL obriga a abrir todo o código derivado. Servem muito bem como **oráculo de testes**, ou seja, como a "calculadora de verdade" contra a qual conferimos os resultados do nosso motor.

### 1.3.2 malufloyd/hp12c

É a reimplementação mais completa que encontramos. Cobre a 12C Platinum inteira: RPN e ALG, UNDO, TVM, amortização, NPV e IRR, títulos, depreciação, datas, estatística e programação com 400 linhas. O motor fica em `src/engine/` sem depender da interface, e usa decimal.js com 34 dígitos internos e arredondamento a 10 dígitos significativos, o que aproxima o resultado da aritmética decimal da calculadora em vez de carregar os desvios do ponto flutuante binário. Traz 200 testes construídos sobre os exemplos do manual e uma referência de teclas com indicação de fonte para cada item. É HTML, CSS e JavaScript sem etapa de build, o que encaixa diretamente em um WKWebView no Mac. O ponto fraco é jurídico: o repositório não tem arquivo de licença, de modo que, pela lei de direito autoral, todos os direitos ficam reservados ao autor. Também é um projeto recente, de autor único, ainda sem histórico de uso.

### 1.3.3 juscilan/12c

Tem a arquitetura mais limpa: um `engine.ts` independente do Svelte, acionado por `press(id)`, com módulos separados para TVM, finanças, datas e estatística, e 101 testes guiados pelo manual. Documenta as erratas do próprio manual da HP, o que revela cuidado com fidelidade. Limita-se à 12C Gold (99 passos, sem ALG) e usa ponto flutuante. Também não declara licença.

### 1.3.4 mscottsewell/HP12c

Foi feito para sala de aula, com gravação passo a passo das teclas e FAQ embutido, recurso interessante para o seu uso docente. O próprio arquivo KNOWN_LIMITATIONS declara que a programação (P/R, SST, GTO, testes condicionais) não foi implementada e que a aritmética é IEEE 754. O código concentra quase tudo em um único arquivo de 3.138 linhas. Sem licença.

### 1.3.5 performance/HP12c e Finanx 12c

São os únicos completos o suficiente com licença MIT. O primeiro está em Elm, linguagem que exigiria reescrita ou manutenção de um ecossistema pouco usual. O segundo está em Java Swing e o próprio autor avisa que não o recomenda para cálculos profissionais. Ambos servem como consulta, não como base.

## 1.4 Restrição técnica do "widget" no macOS

Antes da escolha, precisamos alinhar o que "widget" significa hoje no Mac. O Dashboard, que hospedava widgets em HTML, deixou de existir no macOS Catalina. Os widgets atuais usam WidgetKit e, segundo a documentação da Apple, aceitam apenas botões e toggles ligados a App Intents; cada toque executa a ação em outro processo e provoca o recarregamento da linha do tempo do widget ✅. Isso não comporta uma calculadora de 39 teclas com resposta imediata, e o widget não pode hospedar um WKWebView com o motor em JavaScript.

A solução prática é um aplicativo leve em SwiftUI que se comporta como widget: um painel flutuante (NSPanel) que fica sobre as janelas, abre por atalho de teclado ou pelo ícone na barra de menus (MenuBarExtra), com o motor JavaScript rodando em um WKWebView. Como complemento opcional, um widget WidgetKit pequeno pode exibir o último resultado ou os registradores financeiros e abrir o painel com um clique.

## 1.5 Recomendação

Pelo critério de completude, o melhor emulador é o **malufloyd/hp12c**: é o único que entrega a 12C Platinum inteira, com aritmética decimal, motor separado da interface e bateria de testes baseada no manual, já em JavaScript puro, que é o formato mais fácil de embutir em um painel para Mac. Pelo critério jurídico, porém, não podemos copiá-lo sem autorização. Propomos três caminhos, em ordem de preferência.

O primeiro é pedir ao autor, por issue no GitHub, que publique o projeto sob licença MIT. Se aceitar, o motor dele vira a base, e a contribuição do nosso projeto fica no invólucro macOS e na identidade visual. O segundo, se não houver resposta, é escrever um motor próprio usando o malufloyd e o juscilan apenas como referência de comportamento (sem copiar código), com decimal.js (licença MIT) na aritmética e a mesma divisão em módulos. O terceiro é usar o x11-calc com a ROM da HP somente como oráculo nos testes de regressão, nunca dentro do produto distribuído.

Em síntese, a melhor referência funcional é o malufloyd/hp12c, o melhor oráculo de fidelidade é o x11-calc, e o produto adequado ao Mac é um painel flutuante em SwiftUI com WKWebView, e não um widget WidgetKit puro.

## 1.6 Fontes

- https://github.com/malufloyd/hp12c
- https://github.com/juscilan/12c
- https://github.com/mscottsewell/HP12c
- https://github.com/mike632t/x11-calc
- https://github.com/brouhaha/nonpareil
- https://github.com/performance/HP12c
- https://github.com/fabiolimace/finanx-12c
- https://github.com/gfso2000/hp12c_emulator
- Apple, Adding interactivity to widgets and Live Activities: https://developer.apple.com/documentation/widgetkit/adding-interactivity-to-widgets-and-live-activities
