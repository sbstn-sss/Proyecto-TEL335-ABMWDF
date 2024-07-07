const Usuario = require('../models/usuario');
const catchAsync = require('../tools/catchAsync');
const AppError = require('../tools/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Usuario.find();
  
  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

exports.getNormalUsers = catchAsync(async (req, res, next) => {

  const users = await Usuario.find({ role: { $ne: 'admin' } });
  
  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});