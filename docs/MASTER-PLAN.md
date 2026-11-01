# Plano mestre do 12c Widget

> Bússola do projeto. Versão 1.0, de 01/11/2026. Requisitos em `docs/REQUISITOS.md`; arquitetura em `docs/ARCHITECTURE.md`; decisões em `docs/DECISIONS.md`.

# 1 Plano de implementação

O fluxo segue as etapas PRD, Plan, Implement e Verify. Cada fase termina com uma verificação objetiva antes de a seguinte começar.

## 1.1 Fase 1: camada web adaptada

Copiar o código de origem para `web/upstream/`, criar `web/mac/` com os quatro módulos e rodar os 204 testes originais (eram 200 na primeira versão deste plano, contagem por leitura corrigida na sessão 1) mais os novos. A fase está pronta quando a página abre no Safari em modo de teste, aceita o teclado físico e mantém a memória ao recarregar.

## 1.2 Fase 2: invólucro macOS

Criar o projeto Xcode com `PanelController`, `WebViewHost`, `AppSchemeHandler`, `BridgeController` e `StateStore`. Pronto quando o painel abre, calcula, e a memória contínua sobrevive a fechar e reabrir o app.

## 1.3 Fase 3: conveniências

Barra de menus, atalho global, Ajustes, abrir no login, copiar e colar. Pronto quando o atalho abre e fecha o painel de qualquer aplicativo.

## 1.4 Fase 4: widget de área de trabalho

App Group, `HP12cSnapshot` e a extensão. Pronto quando o widget mostra o visor atualizado depois de um cálculo e abre o painel com um clique.

## 1.5 Fase 5: verificação

A verificação usa três camadas. Primeiro, os 204 testes do código de origem continuam passando. Segundo, um roteiro com os exemplos do manual da 12C Platinum (TVM, IRR, datas, títulos e um programa) é executado no app pelo teclado físico. Terceiro, uma amostra desses cálculos é comparada com o x11-calc, que roda a ROM original, apenas como referência local, fora do produto.

# 2 Riscos e pontos a confirmar

| Risco | Efeito | Tratamento |
|---|---|---|
| Módulos ES bloqueados em `file://` | Página em branco | Esquema próprio `hp12c-app://` (já previsto); testar logo na fase 2 |
| App Group e widget exigem assinatura com equipe Apple | Widget não aparece | Confirmar se há conta Apple Developer; sem ela, as fases 1 a 3 funcionam com assinatura local |
| Foco de teclado em NSPanel flutuante | Teclas não chegam | Subclasse com `canBecomeKey = true`; testar com outro app em primeiro plano |
| Divergência futura do código de origem | Conflitos na atualização | `web/upstream/` intacto e patches documentados |
| Mapeamento de teclas (`docs/ARCHITECTURE.md`, seção 3) | Atalhos pouco naturais | DEC-008 aprovada; DEC-011 acrescentou `y` para yˣ (o `^` é tecla morta no ABNT2) |


# 3 Mapa de PRDs

Cada fase se desdobra em PRDs no fluxo Clavix (PRD, Plan, Implement, Verify), guardados em `.clavix/outputs/`. A tabela registra os previstos; só o PRD-01 está especificado.

| PRD | Fase | Escopo | Situação |
|---|---|---|---|
| PRD-01 | 1 | Camada web para Mac: upstream, ponte, teclado, área de transferência, página de teste | Concluído na sessão 1 (01/11/2026) |
| PRD-02 | 2 | Projeto Xcode, painel, WebView, esquema próprio, ponte e StateStore | Previsto |
| PRD-03 | 3 | Barra de menus, atalho global, Ajustes, abrir no login | Previsto; aguarda DEC-009 |
| PRD-04 | 4 | App Group, snapshot e extensão WidgetKit | Previsto; aguarda DEC-010 |
| PRD-05 | 5 | Roteiro de verificação com exemplos do manual e comparação com x11-calc | Previsto |

# 4 Aprendizados

Seção cumulativa, atualizada ao fim de cada sessão.

- Sessão 0 (01/11/2026): o código de origem já recebe o armazenamento por parâmetro em `load()` e `save()`, o que reduz a adaptação de persistência a um adaptador; o código não tem nenhum tratamento de teclado físico.
- Sessão 1 (01/11/2026): a suíte do upstream tem 204 testes, e não os 200 contados por leitura; contagem só vale executada. O `pwa.test.js` do upstream confere o hash dos arquivos em cache, então qualquer patch em `src/` precisa recarimbar o `sw.js` (`node tools/stamp-sw.mjs`). No ABNT2 o `^` é tecla morta. O PRD-02 precisa rodar `web/fetch-upstream.sh` antes de empacotar `web/` no app, porque `web/upstream/` não está no git (DEC-012).
