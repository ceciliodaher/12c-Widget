# 12c Widget

Utilitário pessoal para macOS 14 ou superior que traz para o Mac uma calculadora financeira RPN que emula a HP 12c Platinum, com painel flutuante, teclado físico, memória contínua e um widget que mostra o visor. O motor de cálculo é o do projeto [malufloyd/hp12c](https://github.com/malufloyd/hp12c), rodando em WKWebView.

## Marcas

«HP», «Hewlett-Packard», «HP 12c» e «12C», assim como o logotipo hp, são marcas da HP Inc. e de suas afiliadas (HP Development Company, L.P.). As calculadoras HP são fabricadas e vendidas sob licença pela Moravia Consulting e pela Royal Consumer Information Products. Este projeto é um emulador independente, pessoal e sem fins comerciais, e não tem vínculo, patrocínio nem endosso da HP Inc., da Moravia ou da Royal. Os nomes servem apenas para identificar a calculadora emulada.

## Licença

O código escrito para este projeto (`web/mac/`, `web/tests/`, `macos/` e a documentação) está sob a licença MIT (`LICENSE`). O motor do malufloyd/hp12c **não** faz parte deste repositório nem está coberto por essa licença: o script `web/fetch-upstream.sh` o baixa na versão fixada e aplica `web/upstream.patch`, que retira a marca HP do desenho (`web/UPSTREAM.md`). A licença MIT não concede direito algum sobre as marcas citadas acima.

## Uso local

Primeiro, `web/fetch-upstream.sh` (exige git e acesso ao GitHub). Testes: `node --test 'web/tests/**/*.test.js'` e, em `web/upstream/`, `node --test 'tests/**/*.test.js'`. Página no navegador: `cd web && python3 -m http.server 8123` e abrir `http://localhost:8123/mac/index-mac.html`.
