const errorHandler = (err, req, res, next) => {
  // En desarrollo, mostramos la traza completa en la consola para debuggear
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Si el error tiene un código de estado asignado, lo usamos; si no, por defecto es 500
  const statusCode = err.statusCode || 500;

  // Formato estandarizado de respuesta para el cliente web
  res.status(statusCode).json({
    error: true,
    mensaje: err.message || 'Ocurrió un error interno en el servidor',
    // Solo enviamos el stack trace si estamos en entorno de desarrollo
    ...(process.env.NODE_ENV === 'development' && { detalle: err.stack })
  });
};

module.exports = errorHandler;