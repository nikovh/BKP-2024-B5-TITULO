require('dotenv').config();
const express       = require('express');
const cors          = require('cors');

// importa la instancia de Firebase Admin y el middleware
const admin         = require('./firebaseAdmin');
const firebaseAuth  = require('./middlewares/firebaseAuth');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
const expedienteRoutes    = require('./routes/expedientes');
const formularioRoutes    = require('./routes/formularios');
const usuariosRoutes      = require('./routes/usuarios');
const propietariosRoutes  = require('./routes/propietarios');
const propiedadesRoutes   = require('./routes/propiedades')


// Usa las rutas en el servidor
app.use('/expedientes', expedienteRoutes);
app.use('/formularios', formularioRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/propietarios', propietariosRoutes);
app.use('/propiedades', propiedadesRoutes)
// app.use('auth', authRoutes)


// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Ejemplo de uso en una ruta protegida
app.get('/expedientes-protegidos', firebaseAuth, (req, res) => {
  // Solo se llega aquí si el token de Firebase es válido
  res.send(`Usuario autenticado con UID: ${req.user.uid}`);
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});