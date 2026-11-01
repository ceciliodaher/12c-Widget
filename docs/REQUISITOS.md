# Requisitos do 12c Widget

> Documento vivo. Base: malufloyd/hp12c, commit `f1c12e80a9c14757c8bf406386f7ced1f405c3a9` (16/10/2026), uso autorizado pelo Professor Cecílio em 01/11/2026 (DEC-001). Decisões formais em `docs/DECISIONS.md`; fases em `docs/MASTER-PLAN.md`.

# 1 Produto (PRD resumido)

## 1.1 Objetivo

Queremos uma HP 12c Platinum que viva no Mac como um utilitário sempre à mão: abre com um atalho de teclado ou um clique na barra de menus, flutua sobre as demais janelas, aceita o teclado físico e guarda a memória contínua entre usos, como a calculadora de verdade. O motor de cálculo é o do malufloyd, sem alteração de comportamento.

## 1.2 O que entra na versão 1

O núcleo da entrega é o painel flutuante com a calculadora completa e o teclado físico mapeado. Em torno dele vêm o ícone na barra de menus, o atalho global configurável, a memória contínua gravada pelo app nativo, copiar e colar o valor do visor e a opção de abrir junto com o login. O widget de área de trabalho (WidgetKit), que mostra o visor e os registradores financeiros e abre o painel com um clique, fica para a fase 4, porque depende de assinatura com App Group.

## 1.3 O que fica fora

Ficam fora da versão 1 a distribuição na Mac App Store, a sincronização por iCloud, o modo 12C Gold e o registro de passos para aula (ideia aproveitável do mscottsewell, para uma versão futura).

## 1.4 Requisitos não funcionais

O app exige macOS 14 (Sonoma) ou superior, versão em que os widgets passaram a ficar na área de trabalho. Deve abrir o painel em menos de 300 ms depois do atalho, funcionar sem rede e não depender de servidor. A interface do app nativo é em português; o visor e as teclas reproduzem a calculadora original.

