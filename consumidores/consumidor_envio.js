// consumidor_envio.js

const amqp = require('amqplib');

// URL de conexão com o RabbitMQ
const rabbitmqURL = 'amqp://localhost:5672';

// Nome da fila de envio/logística
const filaEnvio = 'fila_envio';

// Função para enviar o pedido processado para a fila de envio/logística
async function enviarPedidoParaEnvio(pedido) {
  try {
    // Conectar-se ao RabbitMQ
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    // Declarar a fila de envio/logística
    await channel.assertQueue(filaEnvio, { durable: true });

    // Enviar o pedido processado para a fila de envio/logística
    channel.sendToQueue(filaEnvio, Buffer.from(JSON.stringify(pedido)), { persistent: true });
    console.log('Pedido enviado para envio/logística:', pedido);

    // Fechar a conexão com o RabbitMQ
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Erro ao enviar pedido para envio/logística:', error);
  }
}

// Exportar a função para ser utilizada por outros módulos
module.exports = enviarPedidoParaEnvio;
