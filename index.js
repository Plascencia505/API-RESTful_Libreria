require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');

// Inicializar conexión a la base de datos
connectDB();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true, // Permitir cookies en solicitudes CORS
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
};

// Middlewares globales
app.use(cors(corsOptions));
app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded
app.use(cookieParser()); // Para leer y enviar la cookie del JWT

app.use('/api/sesiones', require('./routes/sesiones'));
app.use('/api/empleados', require('./routes/empleados'));
app.use('/api/libros', require('./routes/libros'));

// Middleware de manejo de errores global
app.use(errorHandler);

// Ruta de prueba básica
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API funcionando correctamente' });
});

// Configuración del puerto y arranque del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor de la librería corriendo en el puerto ${PORT}`);
});