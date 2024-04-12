// consumidor_loja.js

const amqp = require('amqplib');

// URL de conexão com o RabbitMQ
const rabbitmqURL = 'amqp://localhost:5672';

// Nome da fila da loja online
const filaLojaOnline = 'fila_loja_online';

// Nome da fila de envio/logística
const filaEnvio = 'fila_envio'; // Nome da fila do consumidor_envio.js

// Função para processar os pedidos recebidos e enviar para o sistema de envio/logística
async function processarPedido() {
  try {
    // Conectar-se ao RabbitMQ
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    // Declarar a fila da loja online
    await channel.assertQueue(filaLojaOnline, { durable: true });

    // Declarar a fila de envio/logística
    await channel.assertQueue(filaEnvio, { durable: true });

    // Consumir mensagens da fila da loja online
    console.log('Aguardando mensagens da fila da loja online...');
    channel.consume(filaLojaOnline, (mensagem) => {
      if (mensagem !== null) {
        // Decodificar e processar o pedido
        const pedido = JSON.parse(mensagem.content.toString());
        console.log('Pedido recebido da fila da loja online:', pedido);

        // Aqui você pode adicionar a lógica para processar o pedido

        // Após processar o pedido, envie-o para a fila de envio/logística
        channel.sendToQueue(filaEnvio, mensagem.content, { persistent: true });
        console.log('Pedido enviado para a fila de envio/logística:', pedido);

        // Confirmar o processamento da mensagem
        channel.ack(mensagem);
      }
    });
  } catch (error) {
    console.error('Erro ao processar pedido:', error);
  }
}

// Iniciar o processamento de pedidos e envio para a fila de envio/logística
processarPedido();
