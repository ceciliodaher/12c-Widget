# Código de origem em `web/upstream/`

| Campo | Valor |
|---|---|
| Origem | https://github.com/malufloyd/hp12c |
| Commit | `f1c12e80a9c14757c8bf406386f7ced1f405c3a9` (16/10/2026), fixado em `web/upstream.env` |
| Autorização | O repositório não declara licença. O Professor Cecílio autorizou o uso em 01/11/2026 (DEC-001); como a redistribuição depende do autor, a pasta não vai para o repositório público (DEC-012). |
| Patch | `web/upstream.patch`: troca o selo «hp 12C» e a faixa «HEWLETT·PACKARD» por «Fin / RPN» e «FINANCIAL·CALCULATOR», muda o `aria-label` para «FinRPN» e recarimba o `sw.js` (DEC-013, DEC-014) |
| Dependência embutida | `vendor/decimal.mjs`, decimal.js v10.4.3 (MIT) |
| Suíte | 204 testes, 204 verdes, 0 falhas, com o patch aplicado (Node 22.14.0) |

# Instalação

Depois de clonar este repositório, rode `web/fetch-upstream.sh`. Ele baixa a origem, confere o commit, aplica o patch e instala `web/upstream/`, que o `.gitignore` mantém fora do git. Sem esse passo, a página e os testes não rodam, e o teste `upstream-patch.test.js` acusa a ausência do patch.

Se o repositório do autor sair do ar, há uma cópia privada (git bundle, histórico completo) fora do repositório, na máquina do Professor Cecílio: `~/Documents/git/hp12c-upstream-backup/hp12c-f1c12e80.bundle`. Para usá-la, indique-a de propósito: `UPSTREAM_REPO=<caminho do bundle> web/fetch-upstream.sh`. Essa cópia não se publica.

A pasta não se edita à mão (DEC-002); toda mudança no código de origem passa por `web/upstream.patch`, com DEC própria.
