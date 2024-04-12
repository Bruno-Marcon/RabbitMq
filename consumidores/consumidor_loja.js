// consumidor_loja.js

const amqp = require('amqplib');
const sqlite3 = require('sqlite3').verbose();

// URL de conexão com o RabbitMQ
const rabbitmqURL = 'amqp://localhost:5672';

// Nome da fila da loja online
const filaLojaOnline = 'fila_loja_online';

// Configurações do banco de dados SQLite
const dbFile = './pedidos.db';
const db = new sqlite3.Database(dbFile);

// Criar tabela de pedidos se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT,
      produto TEXT,
      quantidade INTEGER,
      endereco TEXT,
      data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Função para processar os pedidos recebidos
async function processarPedido() {
  try {
    // Conectar-se ao RabbitMQ
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    // Declarar a fila da loja online
    await channel.assertQueue(filaLojaOnline, { durable: true });

    // Consumir mensagens da fila
    channel.consume(filaLojaOnline, (mensagem) => {
      if (mensagem !== null) {
        // Decodificar e registrar o pedido no banco de dados
        const pedido = JSON.parse(mensagem.content.toString());
        registrarPedido(pedido);
        console.log('Pedido processado:', pedido);

        // Confirmar o processamento da mensagem
        channel.ack(mensagem);
      }
    });
  } catch (error) {
    console.error('Erro ao processar pedido:', error);
  }
}

// Função para registrar o pedido no banco de dados
function registrarPedido(pedido) {
  const { cliente, produto, quantidade, endereco } = pedido;
  db.run(`
    INSERT INTO pedidos (cliente, produto, quantidade, endereco)
    VALUES (?, ?, ?, ?)
  `, [cliente, produto, quantidade, endereco], (err) => {
    if (err) {
      console.error('Erro ao registrar pedido no banco de dados:', err);
    }
  });
}

// Iniciar o processamento de pedidos
processarPedido();
