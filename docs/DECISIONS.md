# Decisões arquiteturais do 12c Widget

> Registro vinculante. Cada decisão só se altera por nova decisão expressa, registrada aqui com número próprio. Versão 1.3, de 01/11/2026 (sessão 2).

# 1 Decisões vigentes

## 1.1 DEC-001 — Base de código: malufloyd/hp12c

O contexto era escolher, entre os emuladores da HP 12c publicados no GitHub, o que servisse de base para um utilitário de Mac. Comparamos oito projetos (`docs/estudos/01-analise-emuladores-hp12c.md`): emuladores de microcódigo (x11-calc, Nonpareil), reimplementações em JavaScript, TypeScript e Elm, e projetos em Java e Android. Escolhemos o malufloyd/hp12c, commit `f1c12e80a9c14757c8bf406386f7ced1f405c3a9`, por ser o único com a 12C Platinum completa (RPN, ALG, UNDO, 400 linhas de programa), aritmética decimal e motor separado da interface, com 200 testes (contagem por leitura; corrigida na sessão 1: a execução da suíte no commit fixado mostra 204 testes, todos verdes). O repositório não declara licença; o Professor Cecílio autorizou o uso em 01/11/2026, sem restrições.

## 1.2 DEC-002 — Código de origem intacto em `web/upstream/`

Para acompanhar correções futuras do autor sem conflito, o código de origem fica em `web/upstream/` exatamente como publicado. Toda adaptação vive em `web/mac/`. Se uma mudança no código de origem for inevitável, ela entra como patch em `web/upstream.patch`, com justificativa neste arquivo. A alternativa descartada foi editar o código diretamente, que tornaria cada atualização um trabalho de comparação manual.

## 1.3 DEC-003 — Produto: painel flutuante, com widget apenas de leitura

O WidgetKit só aceita botões e toggles ligados a App Intents, com recarga da linha do tempo a cada toque, e não hospeda WKWebView. Isso inviabiliza uma calculadora de 39 teclas dentro do widget. Adotamos um app SwiftUI e AppKit com NSPanel flutuante e MenuBarExtra, que roda o motor em WKWebView. O widget da área de trabalho apenas mostra o visor e os registradores e abre o painel. Descartamos o WidgetKit puro (inviável), o porte do motor para Swift (duplicaria a lógica financeira) e Electron ou Tauri (peso e dependências desproporcionais para um utilitário).

## 1.4 DEC-004 — Persistência nativa no App Group

> O local de gravação passa do App Group para `~/Library/Application Support/FinRPN/` pela DEC-016 (seção 1.14); o resto desta decisão continua valendo.

O `localStorage` em WKWebView carregado localmente não é confiável e ficaria invisível para o widget. O estado passa a ser gravado pelo app no contêiner do App Group. Na partida, o Swift injeta o estado salvo por `WKUserScript` (leitura síncrona, compatível com `load(storage)` do código de origem); as gravações seguem por `webkit.messageHandlers` (assíncronas). O adaptador `NativeStorage` implementa o contrato `getItem` e `setItem`, de modo que `storage.js` não muda.

## 1.5 DEC-005 — Carregamento por esquema próprio `hp12c-app://`

> O nome do esquema passou a ser `finrpn-app://` pela DEC-014 (seção 1.12); o resto desta decisão continua valendo.

O código de origem usa módulos ES, que o WebKit tende a bloquear quando a página vem de `file://`. Os arquivos de `web/` são servidos do pacote do app por um `WKURLSchemeHandler`, com tipos MIME corretos. A primeira verificação da fase 2 confirma esse ponto.

## 1.6 DEC-006 — O motor JavaScript é a fonte única de verdade

Nenhum cálculo financeiro, de data ou estatístico é implementado em Swift. O widget lê uma fotografia (`HP12cSnapshot`) publicada pela camada web, e o Swift apenas a transporta e grava.

## 1.7 DEC-007 — A ROM da HP não entra no repositório

O x11-calc, que executa a ROM original, serve somente como oráculo local na verificação. Nenhum arquivo de ROM nem código GPL é copiado para o repositório ou para o produto distribuído.

## 1.8 DEC-008 — Mapeamento do teclado físico

O código de origem não trata o teclado físico. Adotamos a tabela proposta na seção 3 de `docs/ARCHITECTURE.md`, sem alterações: as teclas óbvias fazem o que se espera (dígitos, ponto ou vírgula, Return, operações, Esc para CLx, ⌫ para g ←) e as funções usam a inicial do nome em inglês (`n` `i` `p` `m` `v`, `c` CHS, `e` EEX, `s` STO, `r` RCL, `x` x≷y, `d` R↓, `^` yˣ, `%`, `o` ON, `f` e `g` como prefixos), com ⌘C e ⌘V para copiar X e colar número. A tabela vive em `KEYMAP`, em `web/mac/keyboard.js`, como fonte única. Aprovada pelo Professor Cecílio em 01/11/2026, sessão 1.

## 1.9 DEC-011 — Tecla `y` para yˣ

No teclado ABNT2 do Mac, o `^` da DEC-008 é tecla morta e não chega ao navegador como `^`; o Professor Cecílio constatou isso no Safari em 01/11/2026. Acrescentamos `y` (inicial de yˣ, pela regra da própria DEC-008) e mantivemos o `^` para teclados em que ele funciona. Nenhuma outra linha da tabela muda.

## 1.10 DEC-012 — Código de origem fora do repositório público

O malufloyd/hp12c não declara licença; o uso está autorizado (DEC-001), mas publicar a cópia depende do autor. O repositório público (`ceciliodaher/12c-Widget`, licença MIT apenas para o código do projeto) não contém `web/upstream/`. O script `web/fetch-upstream.sh` baixa a origem no commit fixado em `web/upstream.env`, confere o commit e aplica `web/upstream.patch`. Para não depender da permanência do repositório do autor, há uma cópia privada em git bundle fora do repositório (`web/UPSTREAM.md`), usada só quando indicada de propósito. Altera a DEC-002 apenas quanto ao versionamento: a pasta continua sem edição manual.

## 1.11 DEC-013 — Sem a marca HP no desenho e no nome

> O selo, o `aria-label`, os nomes técnicos e o esquema foram substituídos pela DEC-014 (seção 1.12). Continua valendo a troca da faixa «HEWLETT·PACKARD» e a manutenção dos identificadores internos do motor.

«HP», «Hewlett-Packard», «HP 12c», «12C» e o logotipo hp são marcas da HP Inc. e de suas afiliadas. O patch `web/upstream.patch` troca o selo «hp 12C» por «12c / RPN», a faixa «HEWLETT·PACKARD» por «FINANCIAL·CALCULATOR» e o `aria-label` por «12c», e recarimba o `sw.js` para manter verde o teste de cache do upstream. O projeto passa a se chamar **12c Widget**; nomes técnicos do Xcode viram `Widget12c` (identificador Swift não começa por algarismo). Identificadores internos herdados do motor (`hp12c.state.v1`, `window.__hp12c`) e os já decididos (`hp12c-app://`, manipulador `hp12c`) ficam como estão, porque não são exibidos ao usuário. O aviso de marcas está no `LICENSE` e no `README.md`. A trava é `web/tests/upstream-patch.test.js`.

## 1.12 DEC-014 — Nome neutro FinRPN no app, nos identificadores e no selo

**Fato.** Consulta ao USPTO em 01/11/2026 (busca oficial e TSDR): «12C» sozinho é marca registrada da HP, com o registro 4.858.892, em caracteres padrão, na classe 9, para *calculators; calculator software*. O titular é a HP Hewlett Packard Group LLC, e o registro está ativo, renovado em 10/11/2025. Há também o 4.862.804 («HP 12C» com desenho, mesmos produtos) e a série 85369597 («HP 12C», que inclui *calculator emulator mobile application*). A retomada da sessão 1 dizia que só «HP 12C» tinha registro confirmado, e isso estava incompleto: o aviso de marcas do `LICENSE` e do `README.md`, que atribui «12C» à HP, estava certo e continua como está. O INPI não foi consultado. Uma primeira busca no USPTO pelo endereço devolveu «nenhum resultado», e era um falso zero: só a busca de controle por «HP 12C», digitada no campo, mostrou o registro.

**Decisão do Professor Cecílio (01/11/2026).** O app e tudo o que nasce no PRD-02 recebem o nome neutro **FinRPN**: nome exibido, nome técnico do projeto nativo, bundle `com.ceciliodaher.finrpn`, esquema `finrpn-app://` e manipulador de mensagens `finrpn`. O selo do desenho passa de «12c / RPN» para o nome novo, e o `aria-label`, para «FinRPN». A faixa «FINANCIAL·CALCULATOR» fica como está. O selo mantém a composição de moldura, círculo e retângulo, que lembra o desenho do registro 4.862.804. Perguntado se o formato também deveria mudar, o Professor Cecílio decidiu mantê-lo, trocando só as palavras (01/11/2026). A troca do selo vai no `web/upstream.patch`, com o `sw.js` recarimbado, e a trava continua sendo `web/tests/upstream-patch.test.js`.

**Fica para depois.** O repositório público `github.com/ceciliodaher/12c-Widget`, o título do `README.md` e os documentos continuam como «12c Widget» até a renomeação do repositório, que será feita depois. A pasta local também mantém o nome. Os identificadores internos do motor (`hp12c.state.v1`, `window.__hp12c`, o cache `hp12c-` do `sw.js`) ficam como estão, porque pertencem ao código de origem e não são exibidos.

**Referência.** No GitHub, os emuladores mais cautelosos (TouchFin, MM-B1, cardputer-fin-calc) usam nome próprio e citam a 12C só na descrição. Os demais usam a marca, com ou sem aviso.

## 1.13 DEC-015 — Build por SwiftPM e script, sem Xcode (aprovada em 01/11/2026)

**Fato medido em 01/11/2026.** A máquina tem só as Command Line Tools (Swift 6.4.2, SDK do macOS 27.2). O `xcodebuild`, o `actool` e o `ibtool` são atalhos que exigem o Xcode. Duas sondagens passaram sem ele. Na primeira, um pacote SwiftPM abriu um NSPanel com WKWebView, serviu a página por esquema próprio, executou um módulo ES e recebeu mensagem pela ponte. Na segunda, uma extensão WidgetKit montada por script e assinada localmente (ad hoc) foi registrada pelo `pluginkit`, aparece na galeria de widgets e desenhou o conteúdo, com a confirmação visual do Professor Cecílio. A extensão travava ao iniciar (`EXC_BREAKPOINT` em `_EXRunningExtension._shared`, 14 falhas) até ser ligada com `-Xlinker -e -Xlinker _NSExtensionMain`, como faz o Xcode; com essa única mudança, foram 0 falhas.

**Decisão.** O código nativo vive em `macos/` como pacote SwiftPM. O script `macos/build-app.sh` baixa o motor (`web/fetch-upstream.sh`), compila, monta o `FinRPN.app` (com `Info.plist` versionado como arquivo, os recursos `web/` e, no PRD-04, a extensão em `Contents/PlugIns`) e assina de forma local. O Xcode só entra se uma necessidade futura o exigir, com DEC própria. Substitui o `Widget12c.xcodeproj` da arquitetura e o comando `xcodebuild` do `CLAUDE.md`. Parecer técnico do agente architect-review na sessão 2, conferido na fonte.

## 1.14 DEC-016 — Estado na pasta do app, lido pelo widget por exceção de leitura (aprovada em 01/11/2026)

**Fato medido em 01/11/2026.** Sem conta Apple paga, a assinatura local não tem Team ID, e o App Group da DEC-004 dependeria dela (DEC-010). Na sonda do widget, a extensão, rodando em sandbox, leu um arquivo gravado em `~/Library/Application Support/<app>/` por meio da permissão `com.apple.security.temporary-exception.files.home-relative-path.read-only`, restrita a essa pasta, e o conteúdo apareceu no widget.

**Decisão.** O `StateStore` grava o estado e a fotografia em `~/Library/Application Support/FinRPN/`, cujo caminho é definido num único ponto do código. O widget do PRD-04 lê essa pasta com a exceção de leitura. Substitui o App Group na DEC-004; o resto da DEC-004 (injeção síncrona na partida e gravação assíncrona por mensagem) continua valendo. Com isso, a DEC-010 deixa de bloquear o PRD-04. Limite conhecido: exceção temporária de sandbox não é aceita na Mac App Store, que está fora do escopo deste projeto pessoal.

# 2 Decisões pendentes

As duas decisões a seguir dependem do Professor Cecílio e bloqueiam fases específicas: a DEC-009, a fase 3; a DEC-010, a fase 4. A DEC-008 foi decidida na sessão 1 (seção 1.8).

| Número | Assunto | Proposta | Bloqueia |
|---|---|---|---|
| DEC-009 | Atalho global padrão | A definir; configurável nos Ajustes | Fase 3 |
| DEC-010 | Conta Apple Developer para App Group | Resolvida pela DEC-016 (01/11/2026): o widget funciona com assinatura local, sem conta paga | Nenhuma |
