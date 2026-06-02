const express = require('express');
const router = express.Router();
const { registrarEmpleado, obtenerEmpleados } = require('../controllers/employeeController');
const sanitizeBody = require('../middlewares/sanitizeMiddleware');
const { validateEmployee } = require('../middlewares/validationMiddleware');
const { verifySession, requireRole } = require('../middlewares/authMiddleware');

// Aplicamos sanitización a todos los payloads que entren a esta ruta
router.use(sanitizeBody);

// POST /api/empleados -> Registra un nuevo empleado
// Solo accesible para roles administrativos
router.post('/', 
  verifySession, 
  requireRole('gerente', 'admin'), 
  validateEmployee, 
  registrarEmpleado
);

// GET /api/empleados -> Obtiene la lista de empleados (con datos descifrados)
// Accesible para administración y recursos humanos
router.get('/', 
  verifySession, 
  requireRole('gerente', 'admin', 'recursos_humanos'), 
  obtenerEmpleados
);

module.exports = router;