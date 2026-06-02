const express = require('express');
const router = express.Router();
const sanitizeBody = require('../middlewares/sanitizeMiddleware');
const { validateBook } = require('../middlewares/validationMiddleware');
const { verifySession, requireRole } = require('../middlewares/authMiddleware');

router.use(sanitizeBody);

// GET /api/libros -> Obtiene el catálogo
// router.get('/', obtenerLibros);

// POST /api/libros -> Agrega un nuevo libro al inventario
// router.post('/', verifySession, requireRole('gerente', 'bibliotecario'), validateBook, registrarLibro);

module.exports = router;