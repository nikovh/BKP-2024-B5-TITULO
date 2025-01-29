require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const { getConnection } = require("./db")

const { Pool }      = require('pg');
const path          = require('path');

// importa la instancia de Firebase Admin y el middleware
const admin         = require('./firebaseAdmin');
const firebaseAuth  = require('./middlewares/firebaseAuth');

const app = express();

// Middlewares globales
app.use(cors());  //habilita CORS
// app.use(cors({
//   origin: "https://conpermisapp-frontend.onrender.com", // Permitir solo este dominio
//   methods: "GET,POST,PUT,DELETE",
//   allowedHeaders: "Content-Type,Authorization"
// }));
app.use(express.json()); //Recibe JSON

// Rutas
const expedienteRoutes    = require('./routes/expedientes');
const formularioRoutes    = require('./routes/formularios');
const usuariosRoutes      = require('./routes/usuarios');
const propietariosRoutes  = require('./routes/propietarios');
const propiedadesRoutes   = require('./routes/propiedades')


// // Usa las rutas en el servidor
// app.use('/expedientes', expedienteRoutes);
// app.use('/formularios', formularioRoutes);
// app.use('/usuarios', usuariosRoutes);
// app.use('/propietarios', propietariosRoutes);
// app.use('/propiedades', propiedadesRoutes)

// Usa las rutas REDNER
app.use('/api/expedientes', expedienteRoutes);
app.use('/api/formularios', formularioRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/propietarios', propietariosRoutes);
app.use('/api/propiedades', propiedadesRoutes)



// // Ruta de prueba LOCAL
// app.get('/', (req, res) => {
//   res.send('API funcionando correctamente');
// });

// // Ejemplo de uso en una ruta protegida
// app.get('/expedientes-protegidos', firebaseAuth, (req, res) => {
//   // Solo se llega aquí si el token de Firebase es válido
//   res.send(`Usuario autenticado con UID: ${req.user.uid}`);
// });

// // Iniciar servidor LOCAL
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en el puerto ${PORT}`);
// });


// POSTGRESQL
// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Necesario para Render
});

// Prueba de conexión
pool.connect()
    .then(() => console.log("✅ Base de datos conectada con éxito"))
    .catch(err => console.error("❌ Error conectando a la base de datos", err));

// Rutas básicas
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente 🚀');
});

// // alt
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
// });

// Puerto dinámico para Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
