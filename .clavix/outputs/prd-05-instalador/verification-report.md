# Verification Report — PRD-05 Pacote de instalação (FinRPN)

> Sessão 4, 04/11/2026. Verificação na máquina e na tela pelo Professor Cecílio.

# 1 Critérios de aceite

| # | Critério | Resultado | Evidência |
|---|---|---|---|
| 1 | `make-dmg.sh` gera `FinRPN-0.4.0.dmg`; `hdiutil verify` passa | ✅ | `macos/build/FinRPN-0.4.0.dmg` gerado; `hdiutil verify` sem erro |
| 2 | Disco com app, atalho para Aplicativos, `LICENSE.txt` e `LEIA-ME.txt` com a seção Marcas igual à do `README.md` | ✅ | Disco montado: `FinRPN.app`, `Aplicativos -> /Applications`, `LICENSE.txt`, `LEIA-ME.txt`; `diff` entre a seção do README e a do LEIA-ME sem diferença |
| 3 | Instalado em `/Applications`, o app abre e o widget passa a ser servido por essa cópia, sem registro duplicado | ✅ | `ditto` do disco montado para `/Applications`; `codesign --verify --deep --strict` sem erro; registro de `macos/build/FinRPN.app` removido por `lsregister -u`; `pluginkit` lista um único `com.ceciliodaher.finrpn.widget(0.4.0)`, em `/Applications/FinRPN.app/Contents/PlugIns/`; o Professor fixou o ícone no Dock |

# 2 Observações

- **Instalação oferecida pelo macOS.** Ao abrir o `.dmg` com dois cliques, o próprio macOS ofereceu instalar o app e falhou com «Could not install. Nothing was changed. You can still drag the app to Applications.». No mesmo instante o app já estava instalado e aberto em `/Applications`. A hipótese é que o sistema não sobrescreve um app aberto, mas ela não foi medida: o Professor dispensou a repetição do teste com Aplicativos vazio. Arrastar o app continua funcionando, e é o que o LEIA-ME instrui.
- **Cópia de desenvolvimento.** Abrir `macos/build/FinRPN.app` volta a registrá-la no LaunchServices, e o widget pode aparecer em dobro na galeria. Depois de testar uma montagem, rode `lsregister -u` sobre ela ou instale pelo `.dmg`.
- **Licença.** O `.dmg` leva o motor do malufloyd/hp12c, sem licença e fora do repositório (DEC-012). O pacote fica em `macos/build/`, fora do git, e é para uso pessoal, o que o LEIA-ME diz.
