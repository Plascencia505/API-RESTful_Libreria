const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Crear un entorno Window virtual para que DOMPurify funcione en Node.js
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const sanitizeBody = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Limpia el string de cualquier inyección XSS
        req.body[key] = DOMPurify.sanitize(req.body[key].trim());
      }
    }
  }
  next();
};

module.exports = sanitizeBody;