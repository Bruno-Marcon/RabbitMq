const amqp = require('amqplib');

const rabbitmqURL = 'amqp://localhost:5672';

const filaEnvio = 'fila_envio';

async function consumirMensagens() {
  try {
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    await channel.assertQueue(filaEnvio, { durable: true });

    console.log('Aguardando mensagens da fila de envio/logística...');
    channel.consume(filaEnvio, (mensagem) => {
      if (mensagem !== null) {
        const pedido = JSON.parse(mensagem.content.toString());
        console.log('Pedido recebido da fila de envio/logística:', pedido);
        
        channel.ack(mensagem);
      }
    });
  } catch (error) {
    console.error('Erro ao consumir mensagens da fila de envio/logística:', error);
  }
}

consumirMensagens();
