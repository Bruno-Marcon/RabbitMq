Documentação: Implementação de Integração entre Loja Online, RabbitMQ, SQLite e Sistema de Envio
Objetivo:
Este projeto visa implementar uma integração entre uma loja online, um sistema de mensagens baseado no RabbitMQ, um banco de dados SQLite e um sistema de envio/logística.

Requisitos do Sistema:
Processamento de Pedidos:
Quando um pedido é feito na loja online, ele deve ser enviado para um sistema que o processe e o registre no banco de dados da loja.
Agendamento de Entrega:
Após o processamento do pedido, ele deve ser enviado para o sistema de envio/logística para que a entrega seja agendada.
Tecnologias Utilizadas:
Node.js: Plataforma de execução de código JavaScript do lado do servidor.
RabbitMQ: Sistema de mensagens de código aberto que suporta diversos protocolos de mensagens.
SQLite: Banco de dados relacional embutido.
amqplib: Biblioteca Node.js para interagir com o RabbitMQ.
sqlite3: Driver SQLite para Node.js.
Passos de Implementação:
Preparação do Ambiente:

Instalação do RabbitMQ, Node.js e configuração do ambiente de desenvolvimento.
Instalação dos pacotes amqplib e sqlite3 via npm.
Definição das Filas no RabbitMQ:

Criação de duas filas no RabbitMQ: uma para receber pedidos da loja online e outra para enviar pedidos processados para o sistema de envio.
Produtores de Mensagens:

Desenvolvimento de um programa para simular a loja online e enviar pedidos para a fila correspondente no RabbitMQ.
Consumidores de Mensagens:

Criação de dois programas como consumidores de mensagens:
O primeiro consumidor processará os pedidos recebidos da fila da loja online e os registrará no banco de dados da loja.
O segundo consumidor receberá pedidos processados da fila e os enviará para o sistema de envio/logística.
Integração com Banco de Dados e Sistema de Envio:

Implementação da integração dos consumidores com o banco de dados da loja e o sistema de envio/logística usando bibliotecas específicas.
Estrutura do Projeto:
produtor.js: Script para simular a loja online e enviar pedidos para o RabbitMQ.
consumidor_loja.js: Consumidor de mensagens responsável por processar os pedidos e registrá-los no banco de dados da loja.
consumidor_envio.js: Consumidor de mensagens responsável por enviar os pedidos processados para o sistema de envio/logística.
db.js: Configuração e funções de acesso ao banco de dados SQLite.
Execução do Projeto:
Inicie o RabbitMQ.
Execute os consumidores de mensagens (consumidor_loja.js e consumidor_envio.js).
Execute o produtor de mensagens (produtor.js) para simular a loja online e enviar pedidos.
Considerações Finais:
Este projeto fornece uma estrutura básica para a implementação de um sistema de integração entre uma loja online, RabbitMQ, SQLite e um sistema de envio/logística. As funcionalidades podem ser expandidas e aprimoradas conforme necessário.