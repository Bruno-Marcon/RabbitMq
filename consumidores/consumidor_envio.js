// consumidor_envio.js

const amqp = require('amqplib');

// URL de conexão com o RabbitMQ
const rabbitmqURL = 'amqp://localhost:5672';

// Nome da fila de envio/logística
const filaEnvio = 'fila_envio';

// Função para consumir mensagens da fila de envio/logística
async function consumirMensagens() {
  try {
    // Conectar-se ao RabbitMQ
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    // Declarar a fila de envio/logística
    await channel.assertQueue(filaEnvio, { durable: true });

    // Consumir mensagens da fila de envio/logística
    console.log('Aguardando mensagens da fila de envio/logística...');
    channel.consume(filaEnvio, (mensagem) => {
      if (mensagem !== null) {
        // Processar mensagem da fila de envio/logística
        const pedido = JSON.parse(mensagem.content.toString());
        console.log('Pedido recebido da fila de envio/logística:', pedido);
        
        // Aqui você pode adicionar a lógica para processar o pedido recebido

        // Confirmar o processamento da mensagem
        channel.ack(mensagem);
      }
    });
  } catch (error) {
    console.error('Erro ao consumir mensagens da fila de envio/logística:', error);
  }
}

// Iniciar a consumação de mensagens da fila de envio/logística
consumirMensagens();
