require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Inicializar conexión a la base de datos
connectDB();

const app = express();

// Middlewares globales
app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded
app.use(cookieParser()); // Para leer y enviar la cookie del JWT

app.use('/api/sesiones', require('./routes/sesiones'));
app.use('/api/empleados', require('./routes/empleados'));
app.use('/api/libros', require('./routes/libros'));

// Ruta de prueba básica
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API funcionando correctamente' });
});

// Configuración del puerto y arranque del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor de la librería corriendo en el puerto ${PORT}`);
});