const mongoose = require('mongoose');
const argon2 = require('argon2');
const { encrypt } = require('../services/cryptoService'); // Importamos la función de encriptación

const employeeSchema = new mongoose.Schema({
  no_trabajador: { 
    type: String, 
    required: [true, 'El número de trabajador es obligatorio'], 
    unique: true, 
    trim: true 
  },
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'], 
    trim: true 
  },
  edad: { 
    type: Number, 
    required: [true, 'La edad es obligatoria'] 
  },
  sexo: { 
    type: String, 
    required: [true, 'El sexo es obligatorio'] 
  },
  puesto: { 
    type: String, 
    required: [true, 'El puesto es obligatorio'], 
    trim: true 
  },
  direccion: { 
    type: String, 
    required: [true, 'La dirección es obligatoria'] // Almacenará el ciphertext
  },
  telefono: { 
    type: String, 
    required: [true, 'El teléfono es obligatorio'] // Almacenará el ciphertext
  },
  antiguedad_semanas: { 
    type: Number, 
    required: [true, 'La antigüedad es obligatoria'],
    min: [0, 'La antigüedad no puede ser negativa'] 
  },
  salario: { 
    type: String, 
    required: [true, 'El salario es obligatorio'] // Almacenará el ciphertext
  },
  turno: { 
    type: String, 
    required: [true, 'El turno es obligatorio'],
    enum: {
      values: ['medio', 'matutino', 'vespertino', 'completo'],
      message: '{VALUE} no es un turno válido'
    }
  },
  password: { 
    type: String, 
    required: [true, 'La contraseña es obligatoria'] 
  }
}, { 
  timestamps: true 
});

// Encriptar campos sensibles antes de guardar
employeeSchema.pre('save', async function (next) {
  // Encriptar campos sensibles
  if (this.isModified('direccion')) this.direccion = encrypt(this.direccion);
  if (this.isModified('telefono')) this.telefono = encrypt(this.telefono);
  if (this.isModified('salario')) this.salario = encrypt(this.salario);
  next();
});

// Hacer hashing de la contraseña antes de guardar
employeeSchema.pre('save', async function (next) {
  // Solo ejecuta el hashing si la contraseña fue modificada o es nueva
  if (!this.isModified('password')) return next();

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Employee', employeeSchema);