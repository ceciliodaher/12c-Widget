# Quick-PRD — PRD-05 Pacote de instalação (FinRPN)

## Problema
O FinRPN roda de `macos/build/`, uma pasta de desenvolvimento. O Professor Cecílio quer instalá-lo em Aplicativos com um pacote de instalação completo.

## Solução proposta
`macos/make-dmg.sh` monta o app por `build-app.sh` e gera `macos/build/FinRPN-<versão>.dmg` com `hdiutil`. O disco traz o app, um atalho para Aplicativos, `LICENSE.txt` e um `LEIA-ME.txt`, este com instalação, desinstalação, onde fica o estado, a primeira abertura noutro Mac e a seção Marcas extraída do `README.md`. O formato `.dmg` foi escolhido pelo Professor, com parecer do architect-review conferido na máquina: sem conta Apple paga, o `.pkg` não pode ser assinado, não tem desinstalação e traz o risco de realocação.

## Escopo
- **Dentro**: `make-dmg.sh`; o texto do LEIA-ME; a instalação nesta máquina, com o registro da cópia de `macos/build/` removido para o widget não aparecer em dobro.
- **Fora**: `.pkg`, assinatura e notarização (exigem conta paga); manter o ícone no Dock com o app fechado (o Professor usa «Opções, Manter no Dock», porque fechar encerra o app pela DEC-019).
- **Limite**: o `.dmg` leva o motor do malufloyd/hp12c, que não tem licença e fica fora do repositório (DEC-012). O pacote é para instalação pessoal e não é publicado.

## Critérios de aceite
1. `macos/make-dmg.sh` gera `FinRPN-0.4.0.dmg`, e `hdiutil verify` passa.
2. O disco montado mostra o app com o ícone, o atalho para Aplicativos, `LICENSE.txt` e `LEIA-ME.txt`, este com a seção Marcas igual à do `README.md`.
3. Instalado em `/Applications`, o app abre, calcula, mantém o estado, e o widget passa a ser servido pela cópia de `/Applications` (`pluginkit`), sem registro duplicado.
