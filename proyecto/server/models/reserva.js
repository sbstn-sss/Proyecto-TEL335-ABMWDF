const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema(
  {
    rol: {
      type: String, // referencia al rol del reservante
      ref: 'Usuario',
      required: [true, 'Una reserva esta asociada a un Usuario']
    },
    bloque: {
      type: String,
      enum: {
        values: ['1-2', '3-4', '5-6', '7-8','9-10','11-12','13-14','15-16','17-18','19-20'], // pendiente decidir si agregar bloque del almuerzo
        message: 'Ingrese un bloque valido'
      },
      required: [true, 'Una reserva necesita obligatoriamente un bloque.']
    },
    dia_reservado: {
      type: Date,
      required: [true, 'Una reserva debe tener una fecha']
    },
    fecha: {
      type: Date,
      default: Date.now()
    },
    estado: {
      type: String,
      default: 'sin-confirmar',
      enum: {
        values: ['confirmada', 'sin-confirmar'], 
        message: 'Ingrese un valor valido'
      }
    },
    activa: { // activa es false si la reserva fue cancelada o no fue confirmada
      type: Boolean,
      default: true
    },
    hora_inicio_bloque: Date,
    hora_final_bloque: Date  // se guardan automaticamente, para hacer comparaciones de fecha luego.
  },
  {
    toJSON: {virtuals: true},
    toObject: { virtuals: true}
  }
);


// validaciones
// 1) pre guardado: la reserva debe ser en el futuro
// 2) pre guardado: la reserva debe pertenecer a la franja horaria de la cancha 
// 4) pre guardado: guardar hora_inicio, hora_fin del bloque.
// 3) pre guardado: si el reservante es alumno no se puede reservar mas alla de 14 dias



const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;

