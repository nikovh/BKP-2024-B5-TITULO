// const sql = require('mssql');

// const dbConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   port: parseInt(process.env.DB_PORT),
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };

// async function getConnection() {
//   try {
//     const pool = await sql.connect(dbConfig);
//     console.log("Conexión exitosa a la base de datos");
//     return pool;
//   } catch (err) {
//     console.error('Error de conexión:', err);
//     throw err;
//   }
// }

// module.exports = { getConnection, sql };

 
// version PostgreSQL
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres', 
  logging: false, // Desactiva logs en producción
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // 🔹 Necesario en Render para evitar errores SSL
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conexión exitosa a PostgreSQL');
  } catch (error) {
    console.error('🔴 Error al conectar a PostgreSQL:', error);
  }
};

module.exports = { sequelize, connectDB };
