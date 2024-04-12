const amqp = require('amqplib');
const rabbitmqURL = 'amqp://localhost:5672';
const filaLojaOnline = 'fila_loja_online';
const filaEnvio = 'fila_envio';
const { registrarPedido } = require('../db');


async function processarPedido() {
    try {
      const connection = await amqp.connect(rabbitmqURL);
      const channel = await connection.createChannel();
  
      await channel.assertQueue(filaLojaOnline, { durable: true });
  
      await channel.assertQueue(filaEnvio, { durable: true });
  
      console.log('Aguardando mensagens da fila da loja online...');
      channel.consume(filaLojaOnline, async (mensagem) => {
        if (mensagem !== null) {
          const pedido = JSON.parse(mensagem.content.toString());
          console.log('Pedido recebido da fila da loja online:', pedido);
  
          channel.sendToQueue(filaEnvio, mensagem.content, { persistent: true });
          console.log('Pedido enviado para a fila de envio/logística:', pedido);
  
          registrarPedido(pedido);
          console.log('Pedido registrado no banco de dados:', pedido);
  
          channel.ack(mensagem);
        }
      });
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
    }
  }

processarPedido();
