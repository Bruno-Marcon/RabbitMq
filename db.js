const sqlite3 = require('sqlite3').verbose();
const dbFile = './pedidos.db';
const db = new sqlite3.Database(dbFile);

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

module.exports = { registrarPedido };
