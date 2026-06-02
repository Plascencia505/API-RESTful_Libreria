const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.AES_SECRET_KEY; // Debe tener exactamente 32 bytes
const IV_LENGTH = 12; // Longitud recomendada para GCM

/**
 * Encripta un texto plano usando AES-256-GCM.
 * @param {string|number} text - El dato a encriptar (dirección, teléfono, salario).
 * @returns {string} Cadena formateada como iv:authTag:ciphertext
 */
const encrypt = (text) => {
  if (text === undefined || text === null) return '';

  // Forzar la conversión a string por si el salario o teléfono llegan como números
  const stringText = text.toString();

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);

  let encrypted = cipher.update(stringText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  // Retornamos los tres elementos necesarios para la desencriptación en un solo string
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

/**
 * Desencripta una cadena formateada como iv:authTag:ciphertext.
 * @param {string} encryptedText - El string almacenado en la base de datos.
 * @returns {string} El texto original descifrado.
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return '';

  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('El formato del texto cifrado es inválido.');
    }

    const [ivHex, authTagHex, ciphertextHex] = parts;

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Error crítico al desencriptar datos:', error.message);
    return 'Error de lectura de datos protegidos';
  }
};

module.exports = { encrypt, decrypt };