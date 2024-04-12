// db.js

const sqlite3 = require('sqlite3').verbose();

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

// Função para registrar um pedido no banco de dados
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

// Exportar a função para ser utilizada por outros módulos
module.exports = { registrarPedido };
