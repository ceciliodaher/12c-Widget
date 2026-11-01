#!/bin/sh
# Baixa o código de origem na versão fixada (upstream.env), confere o commit, aplica upstream.patch (DEC-013)
# e instala em web/upstream/. A pasta não vai para o git (DEC-012); rode este script depois de clonar.
set -eu
cd "$(dirname "$0")"
override_repo=${UPSTREAM_REPO:-}
. ./upstream.env
# Cópia privada (git bundle), só quando indicada de propósito: UPSTREAM_REPO=/caminho/hp12c.bundle ./fetch-upstream.sh
[ -n "$override_repo" ] && UPSTREAM_REPO=$override_repo && echo "origem indicada: $UPSTREAM_REPO"
: "${UPSTREAM_REPO:?UPSTREAM_REPO ausente em upstream.env}" "${UPSTREAM_COMMIT:?UPSTREAM_COMMIT ausente em upstream.env}"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git clone -q "$UPSTREAM_REPO" "$tmp/src"
git -C "$tmp/src" checkout -q "$UPSTREAM_COMMIT"
got=$(git -C "$tmp/src" rev-parse HEAD)
[ "$got" = "$UPSTREAM_COMMIT" ] || { echo "ERRO: commit $got difere do fixado $UPSTREAM_COMMIT" >&2; exit 1; }
rm -rf "$tmp/src/.git"
(cd "$tmp/src" && git apply --whitespace=error "$OLDPWD/upstream.patch")
rm -rf upstream
mv "$tmp/src" upstream
echo "web/upstream/ instalado: $UPSTREAM_COMMIT + upstream.patch"
