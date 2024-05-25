const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Usuario = require('../models/usuario.js');
const sendEmail = require('../tools/email');
const filterObj = require('../tools/filterObj.js');
const catchAsync = require('../tools/catchAsync.js');
const AppError = require('../tools/appError.js');

// token jwt (cookie de autorizacion)
const signToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const verifyToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // cookie expires time is on days
    secure: false, // only works on https
    httpOnly: true // cannot be modified or accessed
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // we create the cookie that can be stored on the browser
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; // to not send the password in the output
  user.__v = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync( async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'password',
    'passwordConfirm',
    'photo',
    'rol',
    'role' //el admin debe asignar un rol especial, como defider o admin
  );

  const newUser = await Usuario.create(filteredBody);
  //console.log(newUser);
  createSendToken(newUser, 201, res);
});



exports.login = catchAsync( async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if req has email and password
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) check if user exists 
  const user = await Usuario.findOne({ email }).select('+password');
  
  if (!user) {
    return next(new AppError('Invalid Credentials', 401));
  }
  // 3) check if password is correct
  const match = await user.checkPassword(password, user.password);
  
  if (!match) {
    return next(new AppError('Invalid Credentials', 401));
  }

  // 4) if everything is ok, send token

  createSendToken(user, 200, res);
});



// protect routes middleware
exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token from the http "Authorization" header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) verification token
  const { id, iat } = verifyToken(token);
  //const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const user = await Usuario.findById(id);

  if (!user) {
    return next(
      new AppError(
        `The token belongs to an user that no longer exists, please log in again`,
        401
      )
    );
  }

  // 4) check if user changed password after token was issued
  // implemented usign an instance method on the model

  if (user.changedPasswordAfter(iat)) {
    // true means password updated after token creation
    return next(
      new AppError(
        'User recently changed his password! Please log in again',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user; // we add user on the req so the get all tours can access to user

  next();
});




exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'profesor', 'alumno'] . role='alumno'
    if (!roles.includes(req.user.role)) {
      // if role == alumno => true
      return next(new AppError('Access denied', 403)); // 403: forbidden
    }

    next();
  };
};


// pendiente reset password, update password

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on posted mail
  const user = await Usuario.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  // 2) generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // to save the reset token fields

  // 3) send it to the user
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}\n If you didn't forget your password, please ignore this email!`;

  try {
    //

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});


exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await Usuario.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() } // if it is expired, the search returns no user
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400)); // bad request
  }

  // 3) Update changedPasswordAt property for the user

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //  user.changedPasswordAt = Date.now(); // put it on a middleware

  await user.save(); // we use save to directly apply the validations and save middlewares

  // 4) log the user in, send JWT

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection

  const user = await Usuario.findById(req.user._id).select('+password');

  // 2) Check if Posted current password is correct
  const match = await user.checkPassword(
    req.body.currentPassword,
    user.password
  );
  if (!match) return next(new AppError('Your current password is wrong', 401));

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log, user in, send JWT

  createSendToken(user, 200, res);
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////
// esto va en el react: (verifica si esta logueado el usuario)
/*
// ONLY FOR RENDER PAGES (NO ERRORS)
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // 1) verify token
    const { id, iat } = verifyToken(req.cookies.jwt);
    //const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 2) check if user still exists
    const currentUser = await Usuario.findById(id);

    if (!currentUser) {
      return next();
    }

    // 43) check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(iat)) {
      return next();
    }

    // THERE IS A LOGGED IN USER
    res.locals.user = currentUser; // global variable for react

    return next();
  }
  next();
});
*/