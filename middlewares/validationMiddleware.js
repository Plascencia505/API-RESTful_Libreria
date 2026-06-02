const { body, validationResult } = require('express-validator');

// Evaluador general de errores
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Reglas específicas para empleados
const validateEmployee = [
  body('no_trabajador').notEmpty().withMessage('El número de trabajador es obligatorio'),
  body('nombre').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('edad').isInt({ min: 18, max: 80 }).withMessage('La edad debe ser un número válido'),
  body('turno').isIn(['medio', 'matutino', 'vespertino', 'completo']).withMessage('Turno no válido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  runValidation
];

// Reglas específicas para libros
const validateBook = [
  body('nombre').notEmpty().withMessage('El nombre del libro es obligatorio'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('inventario').isInt({ min: 0 }).withMessage('El inventario no puede ser negativo'),
  body('genero_literario').isArray({ min: 1 }).withMessage('Debe incluir al menos un género como array'),
  runValidation
];

module.exports = { validateEmployee, validateBook };