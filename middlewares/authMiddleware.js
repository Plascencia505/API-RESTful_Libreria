const jwt = require('jsonwebtoken');

const verifySession = (req, res, next) => {
  // Leer el token desde la cookie
  const token = req.cookies.sesion_libreria;

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Sesión expirada o no iniciada.' });
  }

  try {
    // Verificar firma y expiración
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Estrategia de "Rolling Session": Emitir un nuevo token
    const newToken = jwt.sign(
      { id: decoded.id, no_trabajador: decoded.no_trabajador, puesto: decoded.puesto },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Actualizar la cookie con el nuevo tiempo de vida
    res.cookie('sesion_libreria', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutos
    });

    // Inyectar los datos del usuario en la request para uso en los controladores
    req.empleado = decoded;
    next();
  } catch (error) {
    // Si el JWT expiró o fue manipulado, limpiamos la cookie
    res.clearCookie('sesion_libreria');
    return res.status(401).json({ mensaje: 'Sesión inválida o ha superado el límite de inactividad.' });
  }
};

// Middleware adicional para Control de Acceso Basado en Roles (RBAC)
const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.empleado || !rolesPermitidos.includes(req.empleado.puesto)) {
      return res.status(403).json({ mensaje: 'No tienes los permisos necesarios para realizar esta acción.' });
    }
    next();
  };
};

module.exports = { verifySession, requireRole };