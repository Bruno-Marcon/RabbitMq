const amqp = require('amqplib');

const rabbitmqURL = 'amqp://localhost:5672';

function gerarIDUnico() {
  return Date.now().toString();
}

function gerarPedidoAleatorio() {
  const clientes = ['Cliente A', 'Cliente B', 'Cliente C'];
  const produtos = ['Produto X', 'Produto Y', 'Produto Z'];
  const quantidades = [1, 2, 3];
  const enderecos = ['Rua A, 123', 'Rua B, 456', 'Rua C, 789'];

  const pedido = {
    id: gerarIDUnico(), // ID único
    cliente: clientes[Math.floor(Math.random() * clientes.length)],
    produto: produtos[Math.floor(Math.random() * produtos.length)],
    quantidade: quantidades[Math.floor(Math.random() * quantidades.length)],
    endereco: enderecos[Math.floor(Math.random() * enderecos.length)],
  };

  return pedido;
}

async function enviarPedido() {
  try {
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();
    const queue = 'fila_loja_online';
    await channel.assertQueue(queue, { durable: true });

    const pedido = gerarPedidoAleatorio();

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(pedido)), { persistent: true });
    console.log('Pedido enviado:', pedido);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Erro ao enviar pedido:', error);
  }
}

setInterval(enviarPedido, 100);