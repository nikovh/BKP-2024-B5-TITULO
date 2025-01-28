const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conexión exitosa a la base de datos");
    return pool;
  } catch (err) {
    console.error('Error de conexión:', err);
    throw err;
  }
}

module.exports = { getConnection, sql };