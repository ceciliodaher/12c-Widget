#!/bin/sh
# Monta macos/build/FinRPN.app sem Xcode (DEC-015): baixa o motor, compila em release, copia a camada web,
# monta o widget em Contents/PlugIns (PRD-04) e assina ad hoc, de dentro para fora.
set -eu
cd "$(dirname "$0")"
../web/fetch-upstream.sh
swift build -c release --product FinRPN
swift build -c release --product FinRPNWidget
bin=$(swift build -c release --show-bin-path)
app=build/FinRPN.app
web=$app/Contents/Resources/web
appex=$app/Contents/PlugIns/FinRPNWidget.appex
rm -rf "$app"
mkdir -p "$app/Contents/MacOS" "$web/upstream" "$appex/Contents/MacOS"
cp Info.plist "$app/Contents/Info.plist"
cp "$bin/FinRPN" "$app/Contents/MacOS/FinRPN"
cp -R ../web/mac "$web/mac"
cp -R ../web/upstream/src ../web/upstream/vendor "$web/upstream/"
# Ícone: icon.svg do upstream (com «Fin» pelo upstream.patch) -> PNG 1024 pelo QuickLook -> grade do macOS -> .icns
icon=$(mktemp -d)
qlmanage -t -s 1024 -o "$icon" ../web/upstream/icons/icon.svg >/dev/null
[ -f "$icon/icon.svg.png" ] || { echo "ERRO: qlmanage não renderizou icon.svg" >&2; exit 1; }
swift tools/make-iconset.swift "$icon/icon.svg.png" "$icon/FinRPN.iconset"
mkdir -p "$app/Contents/Resources"
iconutil -c icns -o "$app/Contents/Resources/FinRPN.icns" "$icon/FinRPN.iconset"
rm -rf "$icon"
cp Widget/Info.plist "$appex/Contents/Info.plist"
cp "$bin/FinRPNWidget" "$appex/Contents/MacOS/FinRPNWidget"
for k in CFBundleShortVersionString CFBundleVersion; do   # versão do widget = versão do app, fonte única
  /usr/libexec/PlistBuddy -c "Add :$k string $(/usr/libexec/PlistBuddy -c "Print :$k" Info.plist)" "$appex/Contents/Info.plist"
done
codesign --force --sign - --entitlements Widget/FinRPNWidget.entitlements "$appex"
codesign --force --sign - "$app"
codesign --verify --deep --strict "$app"
echo "pronto: $(pwd)/$app"
