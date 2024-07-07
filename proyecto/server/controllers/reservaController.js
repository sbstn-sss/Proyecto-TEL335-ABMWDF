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

  //console.log(cancha);

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


exports.getReservasByUsuario = catchAsync(async (req,res,next) =>{
  const user = await Usuario.findOne({rol: req.params.rol});

  if(!user) return next(new AppError('El rol ingresado no existe.', 404));


  const reservas = await Reserva.find({
    rol: req.params.rol
  });

  // no hay error si no se encuentran reservas, quiere decir que esa semana esta disponible del todo
  res.status(200).json({
    status: 'success',
    data: {
      reservas
    }
  });
});

exports.getMyReservas = catchAsync(async (req,res,next) =>{
  const user = req.user;

  const reservas = await Reserva.find({
    rol: user.rol
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
  //console.log(fechas);
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

const getDayName = (date) => {
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return days[date.getDay()];
};

const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

exports.createReserva = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'rol',
    'id_cancha',
    'bloque',
    'dia_reservado',
    'num_semanas'
  );

  // Se busca el usuario por su rol
  const user = await Usuario.findOne({ rol: filteredBody.rol });

  if (!user) {
    return next(new AppError('No existe usuario registrado con ese rol', 401));
  }

  if (user.role === 'profesor') {
    const { dia_reservado, num_semanas } = filteredBody;

    // Convertir la fecha de entrada a un objeto Date
    const [day, month, year] = dia_reservado.split('-');
    const fechaInicial = new Date(year, month - 1, day); // Crear el objeto Date correctamente

    //console.log(fechaInicial);
    const reservas = [];

    for (let i = 0; i < num_semanas; i++) {
      // Crear una nueva fecha para cada semana
      let fechaReserva = new Date(fechaInicial);
      fechaReserva.setDate(fechaInicial.getDate() + 1 + (i * 7)); // Incrementar la fecha en 7 días para cada semana

      // Formatear la fecha en formato dd-MM-YYYY
      const dia_fecha = fechaReserva.getDate().toString().padStart(2, '0');
      const mes_fecha = (fechaReserva.getMonth() + 1).toString().padStart(2, '0');
      const year_fecha = fechaReserva.getFullYear();
      const fechaFormateada = [dia_fecha, mes_fecha, year_fecha].join('-');

      // Crear una reserva para esta fecha
      const reserva = await Reserva.create({
        rol: filteredBody.rol,
        id_cancha: filteredBody.id_cancha,
        bloque: filteredBody.bloque,
        dia_reservado: fechaFormateada
      });

      reservas.push(reserva);
    }

    // Calcular la fecha final sumando (num_semanas - 1) * 7 días a la fecha inicial
    const fechaFinal = new Date(fechaInicial.getTime());
    fechaFinal.setDate(fechaFinal.getDate() + ((num_semanas - 1) * 7));

    // Obtener el nombre del día de la semana de la primera reserva
    const diaSemana = getDayName(fechaInicial);
    const fechaFinalFormateada = formatDate(fechaFinal);

    const message = `Estimado Profesor ${user.name}\n\nEl Bloque ${filteredBody.bloque} del día ${diaSemana}, ha sido registrado durante ${num_semanas} semanas (desde el ${dia_reservado} hasta ${fechaFinalFormateada}).\n\n\nSaludos!`;

    // Envío de correo electrónico
    await sendEmail({
      email: user.email,
      subject: 'Tus reservas han sido registradas',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Notificación enviada al email.',
      data: {
        reservas
      }
    });

  } else {
    // Se registra la reserva para un usuario normal
    const reserva = await Reserva.create(filteredBody); // Al hacer create, se ejecutan las validaciones

    const message = `Estimado ${user.name}\n\nSu reserva ha sido registrada para el Bloque ${reserva.bloque}.\nRecuerda confirmar presencialmente antes del horario seleccionado; de lo contrario, se eliminará la reserva. También, en caso de no poder asistir, puedes cancelar tu reserva.\n\nSaludos!`;

    // Envío de correo electrónico
    await sendEmail({
      email: user.email,
      subject: 'Tu reserva ha sido registrada',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Notificación enviada al email.',
      data: {
        reserva
      }
    });
  }
});

/// metodo solo para el admin
exports.confirmarReserva = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;

  const reserva = await Reserva.findByIdAndUpdate( id, {estado: "confirmada", activa: false}); //
  
  const message =  `Estimado ${user.name}\n\nSu reserva ha sido confirmada para el día de hoy (${reserva.dia_reservado}) Bloque ${reserva.bloque}.\n\nSaludos!`;

  // envío de correo electrónico
  await sendEmail({
    email: user.email,
    subject: 'Tu reserva ha sido confirmada',
    message,
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Notificación enviada al email.',
    data: null
  });
});




exports.cancelarReserva = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const user = req.user;

  const reserva = await Reserva.findOne({_id:id, rol:user.rol, activa:true});
  if(!reserva)return next(new AppError('La reserva no existe o no es cancelable!', 401));


  //console.log(reserva);

  await Reserva.findByIdAndUpdate( reserva._id, {activa: false}); // recibe el id de la reserva y la desactiva logicamente ( no la elimina )
  //console.log(update);

  

  const message =  `Estimado ${user.name}\n\nSu reserva del Bloque ${reserva.bloque} del dia ${reserva.dia_reservado} ha sido cancelada.\n\nSaludos!`;

    // envío de correo electrónico
    await sendEmail({
      email: user.email,
      subject: 'Tu reserva ha sido cancelada',
      message,
    });


  res.status(204).json({
    status: 'success',
    data: null
  });
});

