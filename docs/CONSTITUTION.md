# Constituição do 12c Widget

> Princípios não negociáveis. Valem para qualquer sessão, humana ou do agente, e prevalecem sobre conveniência de implementação.

# 1 Princípios

## 1.1 Fidelidade ao motor

O comportamento de cálculo é o do código de origem. ⛔ Nunca editar `web/upstream/` diretamente (DEC-002). ⛔ Nunca reimplementar em Swift ou em `web/mac/` qualquer função financeira, de data, estatística ou de programação (DEC-006). Se o motor tiver um erro, ele é corrigido por patch documentado e coberto por teste antes da correção.

## 1.2 Zero fallbacks silenciosos

A memória contínua é o dado mais sensível do usuário. ⛔ Nunca substituir um estado ilegível por um estado vazio sem aviso: o comportamento correto é o do código de origem, que guarda a cópia ilegível e mostra `Pr Error`. ⛔ Nunca aceitar mensagem da ponte com formato inválido: ela é rejeitada e registrada em log. Construções como `valor || 0` e `?? padrão` são proibidas em caminhos de estado e de cálculo. Falhas de E/S no Swift lançam erro tipado e mantêm a última cópia válida.

## 1.3 Código

O código segue SOLID, DRY e KISS, com nomes descritivos, funções de responsabilidade única, tratamento de erros e validação de entrada. Antes de implementar código extenso, apresenta-se a estrutura de classes e métodos. Textos de interface em português com acentuação correta; visor e teclas reproduzem a calculadora original.

## 1.4 Repositório

⛔ Nunca commitar com suíte vermelha. ⛔ Nunca fazer push para remoto sem autorização expressa do Professor Cecílio. ⛔ Nenhum arquivo de ROM da HP nem código GPL no repositório (DEC-007). Um commit por PRD concluído, com o prefixo `[PRD-NN]`.
