const Cancha = require('../models/cancha');
const catchAsync = require('../tools/catchAsync');

exports.getAllCanchas = catchAsync(async (req, res, next) => {
  const canchas = await Cancha.find();
  
  res.status(200).json({
    status: 'success',
    data: {
      canchas
    }
  });
});

exports.getOneCancha = catchAsync(async (req, res, next) => {
  // recibe parametro: req.params.cancha (slug)
  const cancha = await Cancha.find({slug: req.params.cancha});

  if(!cancha) return next(new AppError('La cancha ingresada no existe.', 404));
  
  res.status(200).json({
    status: 'success',
    data: {
      cancha
    }
  });
});


