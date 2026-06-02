const Employee = require('../models/Employee');
const { decrypt } = require('../services/cryptoService');

const registrarEmpleado = async (req, res) => {
  try {
    // Los datos ya vienen sanitizados y validados por los middlewares
    const nuevoEmpleado = new Employee(req.body);
    
    // Al hacer save(), se disparan los hooks de AES-256-GCM y Argon2
    await nuevoEmpleado.save(); 

    res.status(201).json({ mensaje: 'Empleado registrado exitosamente' });
  } catch (error) {
    // Manejo de error por número de trabajador duplicado (código 11000 de Mongo)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El número de trabajador ya está registrado' });
    }
    res.status(500).json({ error: 'Error al registrar el empleado' });
  }
};

const obtenerEmpleados = async (req, res) => {
  try {
    // Obtenemos los empleados excluyendo la contraseña por seguridad
    const empleados = await Employee.find().select('-password');

    // Mapeamos los resultados para descifrar los campos sensibles al vuelo
    const empleadosLimpios = empleados.map(emp => {
      const obj = emp.toObject();
      obj.direccion = decrypt(obj.direccion);
      obj.telefono = decrypt(obj.telefono);
      obj.salario = decrypt(obj.salario);
      return obj;
    });

    res.status(200).json(empleadosLimpios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el listado de empleados' });
  }
};

module.exports = { registrarEmpleado, obtenerEmpleados };