const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un usuario debe tener nombre']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Un usuario debe tener un email USM'],
      lowercase: true,
      validate: [validator.isEmail, 'Por favor ingrese un correo valido']
    }, 
    role: {
      type: String,
      default: 'alumno',
      enum: {
        values: ['alumno', 'profesor', 'admin'],
        message: 'El rol solo puede ser: alumno, profesor, admin'
      }
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'Por favor ingrese una contraseña'],
      minlenght: [8, 'La contraseña debe ser de al menos 8 caracteres'], // longitud minima de la contrasena
      select: false // al hacer un get user, no se mostrara la contrasena
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Por favor confirme su contrasena'],

      // este validador solo funciona al crear un usuario (NO AL ACTUALIZARLO)
      validate: {
        validator: function(val) {
          return val === this.password; // valida si la contrasena y el confirmador son iguales
        },
        message: 'Las contrasenas ingresadas son distintas'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: { // especifica si la cuenta es activa o fue desactivada (por el propio alumno o por SUSPENSION PERMANENTEEE)
      type: Boolean,
      default: true,
      select: false // no es un campo obtenido al hacer gets
    }
  },
  {
    toJSON: {virtuals: true},
    toObject: { virtuals: true}
  }
);

// mongoose middlewares

// Middleware de encriptacion
usuarioSchema.pre('save', async function(next){
  // Solo se ejecuta si la contrasena fue modificada (o sea cuando se crea o cuando es actualizada)
  if (!this.isModified('password')) return next(); // no se ejecuta el codigo posterior

  // encriptacion de contrasena
  this.password = await bcrypt.hash(this.password, 12); // el numero es el costo de encriptacion

  this.passwordConfirm = undefined;
  next();
});

usuarioSchema.pre('save', function(next){
  if(!this.isModified('password') || this.isNew) return next(); // si la cuenta es nueva o no se actualizo la contrasena, esto no se ejecuta 
  
  this.passwordChangedAt = Date.now() - 1000; // - 1000 ya que hay un pequeno delay al actualizar este campo
  next();
}); 

// query middleware
usuarioSchema.pre(/^find/, function(next) {
  this.find({ active: {$ne: false} }); // al ejecutar cualquier find de usuarios solo se muestran los usuarios activos.

  next();
});

// methodos: disponibles en cualquier documento usuario

// Comparacion de hash de contrasena ingresada con hash de la contrasena encriptada almacenada en la db
usuarioSchema.methods.checkPassword = async function(
  inputPassword, 
  userPassword
){
  
  return await bcrypt.compare(inputPassword, userPassword); 
};

// checkea si se cambio la contrasena luego de la creacion del token de acceso
usuarioSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // to seconds

    return changedTimestamp > JWTTimestamp;
  }
  // falso si no se ha actualizado la contrasena
  return false;
};

// Genera random token de reseteo de contrasena (olvide mi contrasena)
usuarioSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); // el token de reseteo es informacion critica por lo que debe encriptarse
  //console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  return resetToken; // se guarda el token y es retornado
};


const Usuario = mongoose.model('User', usuarioSchema);

module.exports = Usuario;