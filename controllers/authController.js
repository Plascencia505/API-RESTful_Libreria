const Employee = require('../models/Employee');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { no_trabajador, password } = req.body;
    
    // Buscar al empleado por su número interno
    const empleado = await Employee.findOne({ no_trabajador });
    if (!empleado) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar la contraseña contra el hash de Argon2
    const validPassword = await argon2.verify(empleado.password, password);
    if (!validPassword) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Generar el token de sesión
    const token = jwt.sign(
      { id: empleado._id, no_trabajador: empleado.no_trabajador, puesto: empleado.puesto },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Configurar la cookie HttpOnly
    res.cookie('sesion_libreria', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutos
    });

    res.status(200).json({ mensaje: 'Autenticación exitosa', puesto: empleado.puesto });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al procesar el login' });
  }
};

const logout = (req, res) => {
  // Limpiar la cookie para destruir la sesión
  res.clearCookie('sesion_libreria');
  res.status(200).json({ mensaje: 'Sesión cerrada correctamente' });
};

module.exports = { login, logout };