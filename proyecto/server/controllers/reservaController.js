const Usuario = require('../models/usuario.js');
const Reserva = require('../models/reserva.js');
const sendEmail = require('../tools/email');
const filterObj = require('../tools/filterObj.js');
const catchAsync = require('../tools/catchAsync.js');
const AppError = require('../tools/appError.js');
const Cancha = require('../models/cancha.js');


const getDiasSemana = (lunes) => {
  const fechas = [];

  [dia,mes,year] = lunes.split('-');

  const lunesDate = new Date(year, mes - 1, dia);
  //console.log(lunesDate.getDay());
  if(lunesDate.getDay() != 1) return fechas; // quiere decir que la fecha ingresada no es lunes.

  let fecha = new Date(lunesDate);
  let dia_fecha, mes_fecha, year_fecha;


  for(let i = 0; i < 5; i++){
    if(i != 0) fecha.setDate(fecha.getDate() + 1); // le sumo uno al dia
    dia_fecha = fecha.getDate().toString().padStart(2, '0'); // Añade un cero al principio si es menor a 10
    mes_fecha = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Añade un cero al principio si es menor a 10
    year_fecha = fecha.getFullYear();

    fechas.push([dia_fecha, mes_fecha, year_fecha].join('-'));
  }
  return fechas;
}


// get reservas by dia 

exports.getReservasByFecha = catchAsync(async (req,res,next) =>{
  const cancha = await Cancha.findOne({slug: req.params.cancha});

  if(!cancha) return next(new AppError('La cancha ingresada no existe.', 404));

  console.log(cancha);

  // recibe fecha en formato dd-MM-YY
  const reservas = await Reserva.find({
    id_cancha: cancha._id, 
    dia_reservado: req.params.fecha
  });

  // no hay error si no se encuentran reservas, quiere decir que esa semana esta disponible del todo
  res.status(200).json({
    status: 'success',
    data: {
      reservas
    }
  });

});

// implementar get by semana. ( recibe de parametro el lunes de esa semana ( retorna todas las reservas de ese lunes, hasta el viernes ))
exports.getReservasBySemana = catchAsync(async (req,res,next) =>{
  const cancha = await Cancha.findOne({slug: req.params.cancha});

  if(!cancha) return next(new AppError('La cancha ingresada no existe.', 404));

  //console.log(cancha);

  const fechas = getDiasSemana(req.params.lunes);
  console.log(fechas);
  // recibe fecha en formato dd-MM-YY
  const reservas = await Reserva.find({id_cancha: cancha._id, dia_reservado: {$in: fechas}});

  // no hay error si no se encuentran reservas, quiere decir que esa semana esta disponible del todo
  res.status(200).json({
    status: 'success',
    data: {
      reservas
    }
  });

});

exports.createReserva = catchAsync(async (req,res,next) => {
  const filteredBody = filterObj(
    req.body,
    'rol',
    'id_cancha',
    'bloque',
    'dia_reservado'
  );
  // se registra la reserva
  const reserva = await Reserva.create(filteredBody); // al hacer create, se ejecutan las validaciones

  // se busca el usuario por su rol
  
  const user = await Usuario.findOne({rol: filteredBody.rol});

  if (!user) {
    return next(new AppError('No existe usuario registrado con ese rol', 401));
  }

  const message = `Estimado ${user.name}\n Su reserva ha sido confirmada para el Bloque ${reserva.bloque}.\nRecuerda confirmar presencialmente antes del horario seleccionado de lo contrario se eliminara la reserva.\n Tambien, en caso de no poder asistir puedes cancelar tu reserva.\n\nSaludos!`;

  try {
    //

    await sendEmail({
      email: user.email,
      subject: 'Tu reserva ha sido registrada',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Notificacion enviada al email.'
    });
  } catch (err) {
    return next(
      new AppError(
        'Hubo un error mientras se enviaba el email. Intente nuevamente!',
        500
      )
    );
  }
});

exports.cancelarReserva = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  await Reserva.findByIdAndUpdate({id: req.body.id}, {activa: false}); // recibe el id de la reserva y la desactiva logicamente ( no la elimina )
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});