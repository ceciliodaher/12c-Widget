# Quick-PRD — PRD-01 Camada web para Mac

## Problema
O código do malufloyd/hp12c foi feito para iPhone: não aceita teclado físico, grava a memória em `localStorage` e traz regras de rotação e de área segura que não servem a um painel de Mac.

## Solução proposta
Trazer o código de origem intacto para `web/upstream/` e construir em `web/mac/` um novo ponto de entrada, que reaproveita motor e desenho, com quatro módulos novos: ponte nativa (com adaptador de armazenamento), teclado físico, área de transferência e folha de estilo para Mac. Tudo testável no navegador, antes de existir o app nativo.

## Escopo
- **Dentro**: cópia do código de origem no commit fixado; `index-mac.html`, `main-mac.js`, `native-bridge.js`, `keyboard.js`, `clipboard.js`, `mac.css`; testes dos módulos novos; modo de desenvolvimento no navegador.
- **Fora**: qualquer código Swift ou Xcode (PRD-02); atalho global e barra de menus (PRD-03); widget (PRD-04); qualquer alteração em `web/upstream/`.

## Critérios de aceite
1. `diff -r` entre `web/upstream/` e o clone do commit `f1c12e80a9c14757c8bf406386f7ced1f405c3a9` (sem `.git`) é vazio.
2. A suíte do código de origem passa com o mesmo número de testes da baseline, zero falhas.
3. A suíte de `web/tests/` passa com zero falhas e cobre os casos listados no full-prd.
4. Servida por `python3 -m http.server` a partir de `web/`, a página `mac/index-mac.html` abre no Safari, calcula pelo mouse e pelo teclado físico, e mantém a memória ao recarregar (modo de desenvolvimento).
5. ⌘C copia X; ⌘V cola um número válido e rejeita, com aviso no visor, um texto inválido.
