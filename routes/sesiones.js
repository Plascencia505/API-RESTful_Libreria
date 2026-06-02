const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');
const sanitizeBody = require('../middlewares/sanitizeMiddleware');

// Sanitizamos las credenciales entrantes antes de procesarlas
router.use(sanitizeBody);

// POST /api/sesiones -> Crea la sesión (Login)
router.post('/', login);

// DELETE /api/sesiones -> Destruye la sesión (Logout)
router.delete('/', logout);

module.exports = router;