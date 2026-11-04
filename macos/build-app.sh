#!/bin/sh
# Monta macos/build/FinRPN.app sem Xcode (DEC-015): baixa o motor, compila em release, copia a camada web e assina ad hoc.
set -eu
cd "$(dirname "$0")"
../web/fetch-upstream.sh
swift build -c release --product FinRPN
bin=$(swift build -c release --show-bin-path)
app=build/FinRPN.app
web=$app/Contents/Resources/web
rm -rf "$app"
mkdir -p "$app/Contents/MacOS" "$web/upstream"
cp Info.plist "$app/Contents/Info.plist"
cp "$bin/FinRPN" "$app/Contents/MacOS/FinRPN"
cp -R ../web/mac "$web/mac"
cp -R ../web/upstream/src ../web/upstream/vendor "$web/upstream/"
codesign --force --sign - "$app"
codesign --verify --deep --strict "$app"
echo "pronto: $(pwd)/$app"
