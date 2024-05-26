const Usuario = require('../models/usuario.js');
const Reserva = require('../models/reserva.js');
const sendEmail = require('../tools/email');
const filterObj = require('../tools/filterObj.js');
const catchAsync = require('../tools/catchAsync.js');
const AppError = require('../tools/appError.js');


// get reservas by dia 

exports.getReservasByFecha = catchAsync(async (req,res,next) =>{
 // PENDIENTE BUSCAR CANCHA POR SLUG de cancha
  // SDS // 
  // sdsd // 
  //dsds//

  // recibe fecha en formato dd-MM-YY
  const reservas = await Reserva.find({dia_reservado: req.params.fecha});

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