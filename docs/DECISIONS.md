# Decisões arquiteturais do 12c Widget

> Registro vinculante. Cada decisão só se altera por nova decisão expressa, registrada aqui com número próprio. Versão 1.2, de 01/11/2026 (sessão 1).

# 1 Decisões vigentes

## 1.1 DEC-001 — Base de código: malufloyd/hp12c

O contexto era escolher, entre os emuladores da HP 12c publicados no GitHub, o que servisse de base para um utilitário de Mac. Comparamos oito projetos (`docs/estudos/01-analise-emuladores-hp12c.md`): emuladores de microcódigo (x11-calc, Nonpareil), reimplementações em JavaScript, TypeScript e Elm, e projetos em Java e Android. Escolhemos o malufloyd/hp12c, commit `f1c12e80a9c14757c8bf406386f7ced1f405c3a9`, por ser o único com a 12C Platinum completa (RPN, ALG, UNDO, 400 linhas de programa), aritmética decimal e motor separado da interface, com 200 testes (contagem por leitura; corrigida na sessão 1: a execução da suíte no commit fixado mostra 204 testes, todos verdes). O repositório não declara licença; o Professor Cecílio autorizou o uso em 01/11/2026, sem restrições.

## 1.2 DEC-002 — Código de origem intacto em `web/upstream/`

Para acompanhar correções futuras do autor sem conflito, o código de origem fica em `web/upstream/` exatamente como publicado. Toda adaptação vive em `web/mac/`. Se uma mudança no código de origem for inevitável, ela entra como patch em `web/upstream.patch`, com justificativa neste arquivo. A alternativa descartada foi editar o código diretamente, que tornaria cada atualização um trabalho de comparação manual.

## 1.3 DEC-003 — Produto: painel flutuante, com widget apenas de leitura

O WidgetKit só aceita botões e toggles ligados a App Intents, com recarga da linha do tempo a cada toque, e não hospeda WKWebView. Isso inviabiliza uma calculadora de 39 teclas dentro do widget. Adotamos um app SwiftUI e AppKit com NSPanel flutuante e MenuBarExtra, que roda o motor em WKWebView. O widget da área de trabalho apenas mostra o visor e os registradores e abre o painel. Descartamos o WidgetKit puro (inviável), o porte do motor para Swift (duplicaria a lógica financeira) e Electron ou Tauri (peso e dependências desproporcionais para um utilitário).

## 1.4 DEC-004 — Persistência nativa no App Group

O `localStorage` em WKWebView carregado localmente não é confiável e ficaria invisível para o widget. O estado passa a ser gravado pelo app no contêiner do App Group. Na partida, o Swift injeta o estado salvo por `WKUserScript` (leitura síncrona, compatível com `load(storage)` do código de origem); as gravações seguem por `webkit.messageHandlers` (assíncronas). O adaptador `NativeStorage` implementa o contrato `getItem` e `setItem`, de modo que `storage.js` não muda.

## 1.5 DEC-005 — Carregamento por esquema próprio `hp12c-app://`

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

«HP», «Hewlett-Packard», «HP 12c», «12C» e o logotipo hp são marcas da HP Inc. e de suas afiliadas. O patch `web/upstream.patch` troca o selo «hp 12C» por «12c / RPN», a faixa «HEWLETT·PACKARD» por «FINANCIAL·CALCULATOR» e o `aria-label` por «12c», e recarimba o `sw.js` para manter verde o teste de cache do upstream. O projeto passa a se chamar **12c Widget**; nomes técnicos do Xcode viram `Widget12c` (identificador Swift não começa por algarismo). Identificadores internos herdados do motor (`hp12c.state.v1`, `window.__hp12c`) e os já decididos (`hp12c-app://`, manipulador `hp12c`) ficam como estão, porque não são exibidos ao usuário. O aviso de marcas está no `LICENSE` e no `README.md`. A trava é `web/tests/upstream-patch.test.js`.

# 2 Decisões pendentes

As duas decisões a seguir dependem do Professor Cecílio e bloqueiam fases específicas: a DEC-009, a fase 3; a DEC-010, a fase 4. A DEC-008 foi decidida na sessão 1 (seção 1.8).

| Número | Assunto | Proposta | Bloqueia |
|---|---|---|---|
| DEC-009 | Atalho global padrão | A definir; configurável nos Ajustes | Fase 3 |
| DEC-010 | Conta Apple Developer para App Group | Sem conta, as fases 1 a 3 seguem com assinatura local | Fase 4 |
