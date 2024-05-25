const mongoose = require('mongoose');
const Usuario = require('./usuario');
const AppError = require('../tools/appError');

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
    hora_final_bloque: Date, // se guardan automaticamente, para hacer comparaciones de fecha luego.
    tipo_usuario: String
  },
  {
    toJSON: {virtuals: true},
    toObject: { virtuals: true}
  }
);


// validaciones
// 1) pre guardado: la reserva debe ser en el futuro
// 2) pre guardado: la reserva debe pertenecer a la franja horaria de la cancha 
// 4) pre guardado: guardar hora_inicio, hora_fin del bloque. // por conveniencia (no se calculara a cada rato luego)
// 3) pre guardado: si el reservante es alumno no se puede reservar mas alla de 14 dias

reservaSchema.pre('save', async function(next){ // se guarda el tipo de usuario para hacer las validaciones mas faciles
  
  // usuario 
  const user = await Usuario.findOne({rol: this.rol});

  if(!user) return next(new AppError('No existe usuario con el rol ingresado', 404));


  this.tipo_usuario = user.role;

  next();
});

reservaSchema.pre('save', function(next){ // asignacion de las horas
  const fixedDate = new Date(1970,0,1);
  const horaInicio = new Date(fixedDate);
  const horaFinal = new Date(fixedDate);

  switch (this.bloque) {
    case '1-2':
      horaInicio.setHours(8, 15, 0); // Establece la hora a las 8:15 AM
      horaFinal.setHours(9, 25, 0); // Establece la hora a las 9:25 AM
      
      break;

    case '3-4':
      horaInicio.setHours(9, 35, 0);
      horaFinal.setHours(10, 45, 0);
      
      break;

    case '5-6':
      horaInicio.setHours(10, 55, 0);
      horaFinal.setHours(12, 5, 0);
      
      break;

    case '7-8':
      horaInicio.setHours(12, 15, 0);
      horaFinal.setHours(13, 25, 0);
      
      break;

    case '9-10':
      horaInicio.setHours(14, 30, 0);
      horaFinal.setHours(15, 40, 0);
      
      break;

    case '11-12':
      horaInicio.setHours(15, 50, 0);
      horaFinal.setHours(17, 0, 0);
      
      break;

    case '13-14':
      horaInicio.setHours(17, 10, 0);
      horaFinal.setHours(18, 20, 0);
      
      break;

    case '15-16':
      horaInicio.setHours(18, 30, 0);
      horaFinal.setHours(19, 40, 0);
      
      break;

    case '17-18':
      horaInicio.setHours(19, 50, 0);
      horaFinal.setHours(21, 0, 0);
      
      break;

    case '19-20':
      horaInicio.setHours(21, 10, 0);
      horaFinal.setHours(22, 20, 0);
      
      break;

    default:
      horaInicio.setHours(23, 0, 0);
      horaFinal.setHours(23, 59, 0);
      
      break;
  }

  this.hora_inicio_bloque = horaInicio;
  this.hora_final_bloque = horaFinal;
  next();
}); 

reservaSchema.pre('save', async function(next){  // Validacion si la reserva fue realizada en una hora adecuada
  const hours = this.fecha.getHours();
  const minutes = this.fecha.getMinutes();
  const seconds = this.fecha.getSeconds();

  const fecha_act_format = new Date(1970, 0, 1, hours, minutes, seconds);

  if (this.hora_final_bloque < fecha_act_format) {
    return next(new AppError('Reserva realizada en una hora invalida', 401));
  }

  next();
});

reservaSchema.pre('save', function(next){ // validacion de que si el usuario es alumno, que no se reserve para fechas muy futuras(14 dias) o para dias pasados
  //pendiente
  //utiL:
  //this.fecha.getDate();
  //this.fecha.getFullYear();
  //this.fecha.getMonth();
  next();
});


const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;

