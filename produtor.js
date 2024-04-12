// produtor.js

const amqp = require('amqplib');

// URL de conexão com o RabbitMQ
const rabbitmqURL = 'amqp://localhost:5672';

// Função para enviar um pedido para a fila da loja online
async function enviarPedido() {
  try {
    // Conectar-se ao RabbitMQ
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    // Declarar a fila da loja online
    const queue = 'fila_loja_online';
    await channel.assertQueue(queue, { durable: true });

    // Dados do pedido (simulação)
    const pedido = {
      cliente: 'Cliente X',
      produto: 'Produto Y',
      quantidade: 1,
      endereco: 'Rua Z, 123',
      // Adicione mais informações do pedido conforme necessário
    };

    // Enviar o pedido para a fila
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(pedido)), { persistent: true });
    console.log('Pedido enviado:', pedido);

    // Fechar a conexão com o RabbitMQ
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Erro ao enviar pedido:', error);
  }
}

// Enviar um pedido a cada intervalo de tempo (em milissegundos)
const intervalo = 5000; // 5 segundos
setInterval(enviarPedido, intervalo);
