const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre del libro es obligatorio'], 
    trim: true 
  },
  autor: { 
    type: String, 
    required: [true, 'El autor es obligatorio'], 
    trim: true 
  },
  año: { 
    type: Number, 
    required: [true, 'El año de publicación es obligatorio'] 
  },
  editorial: { 
    type: String, 
    required: [true, 'La editorial es obligatoria'], 
    trim: true 
  },
  genero_literario: { 
    type: [String], 
    required: [true, 'Debe incluir al menos un género literario'],
    validate: [v => Array.isArray(v) && v.length > 0, 'El arreglo de géneros no puede estar vacío']
  },
  precio: { 
    type: Number, 
    required: [true, 'El precio es obligatorio'], 
    min: [0, 'El precio no puede ser negativo'] 
  },
  inventario: { 
    type: Number, 
    required: [true, 'El inventario es obligatorio'], 
    min: [0, 'El inventario no puede ser negativo'] 
  },
  imagen_url: { 
    type: String, 
    required: [true, 'La URL de la imagen es obligatoria'], 
    trim: true 
  }
}, { 
  timestamps: true // Agrega automáticamente createdAt y updatedAt
});

// Índice para optimizar búsquedas frecuentes por nombre o autor
bookSchema.index({ nombre: 'text', autor: 'text' });

module.exports = mongoose.model('Book', bookSchema);