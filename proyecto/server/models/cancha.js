const mongoose = require('mongoose');
const slugify = require('slugify');

const canchaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Una cancha debe tener nombre']
    },
    slug: String,
    campus:{
      type: String,
      required: [true, 'Una cancha debe tener campus.'] // luego se valida
    },
    photo: String,
    franja_horaria: { // formato: '1-2:17-18'
      type: String,
      required: [true, 'Una cancha debe tener una franja horaria.']
    }

  },
  {
    toJSON: {virtuals: true},
    toObject: { virtuals: true}
  }
);


canchaSchema.pre('save', function(next) {
  this.slug = slugify(this.nombre, { lower: true });

  next();
});

const Cancha = mongoose.model('Cancha', canchaSchema);

module.exports = Cancha;

