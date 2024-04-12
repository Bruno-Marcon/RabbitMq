// produtor.js

const amqp = require('amqplib');

// URL de conexão com o RabbitMQ
const rabbitmqURL = 'amqp://localhost:5672';

// Função para gerar um ID único
function gerarIDUnico() {
  // Gere um ID baseado no timestamp atual
  return Date.now().toString();
}

// Função para gerar dados aleatórios para um pedido
function gerarPedidoAleatorio() {
  // Dados aleatórios para o pedido
  const clientes = ['Cliente A', 'Cliente B', 'Cliente C'];
  const produtos = ['Produto X', 'Produto Y', 'Produto Z'];
  const quantidades = [1, 2, 3];
  const enderecos = ['Rua A, 123', 'Rua B, 456', 'Rua C, 789'];

  // Gerar um pedido aleatório com um ID único
  const pedido = {
    id: gerarIDUnico(), // ID único
    cliente: clientes[Math.floor(Math.random() * clientes.length)],
    produto: produtos[Math.floor(Math.random() * produtos.length)],
    quantidade: quantidades[Math.floor(Math.random() * quantidades.length)],
    endereco: enderecos[Math.floor(Math.random() * enderecos.length)],
  };

  return pedido;
}

// Função para enviar um pedido para a fila da loja online
async function enviarPedido() {
  try {
    // Conectar-se ao RabbitMQ
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    // Declarar a fila da loja online
    const queue = 'fila_loja_online';
    await channel.assertQueue(queue, { durable: true });

    // Gerar dados aleatórios para o pedido
    const pedido = gerarPedidoAleatorio();

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

// Enviar um pedido a cada 5 segundos
setInterval(enviarPedido, 5000);