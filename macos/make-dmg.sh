#!/bin/sh
# Gera macos/build/FinRPN-<versão>.dmg (PRD-05): o app montado por build-app.sh, um atalho para Aplicativos,
# LICENSE.txt e LEIA-ME.txt. Sem conta Apple paga não há assinatura nem notarização (ver o LEIA-ME).
set -eu
cd "$(dirname "$0")"
./build-app.sh
ver=$(/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" Info.plist)
stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT
cp -R build/FinRPN.app "$stage/"
ln -s /Applications "$stage/Aplicativos"
cp ../LICENSE "$stage/LICENSE.txt"
marcas=$(awk '/^## Marcas$/{on=1; next} /^## /{on=0} on' ../README.md | sed '/^$/d')
[ -n "$marcas" ] || { echo "ERRO: seção «## Marcas» não encontrada no README.md" >&2; exit 1; }
cat > "$stage/LEIA-ME.txt" <<TXT
FinRPN $ver

Instalar: arraste o FinRPN para a pasta Aplicativos. Depois de abri-lo, se quiser o ícone sempre no Dock, clique nele com o botão direito e escolha Opções, Manter no Dock. Fechar a calculadora encerra o app; o clique no widget ou no ícone abre de novo, com o último valor.

Widget: clique com o botão direito na área de trabalho, escolha Editar Widgets e procure FinRPN. O pequeno mostra o visor; o médio e o grande, a calculadora.

Primeira abertura noutro Mac: o app não tem assinatura da Apple. Se o macOS recusar, abra Ajustes do Sistema, Privacidade e Segurança, e clique em Abrir Mesmo Assim.

Desinstalar: mande o FinRPN de Aplicativos para o Lixo. A memória da calculadora fica em ~/Library/Application Support/FinRPN/; apague essa pasta se quiser removê-la também.

Licença: o código do projeto está sob a licença MIT (LICENSE.txt). O motor de cálculo, do projeto malufloyd/hp12c, vai dentro do app e não está coberto por essa licença; este pacote é para uso pessoal.

Marcas
$marcas
TXT
dmg=build/FinRPN-$ver.dmg
rm -f "$dmg"
hdiutil create -quiet -volname "FinRPN $ver" -srcfolder "$stage" -format UDZO -fs HFS+ "$dmg"
hdiutil verify -quiet "$dmg"
echo "pronto: $(pwd)/$dmg"
