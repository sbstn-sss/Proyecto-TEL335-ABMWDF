const express = require('express');

const { createReserva, getReservasByFecha, cancelarReserva, getReservasBySemana, confirmarReserva } = require('../controllers/reservaController');
const { restrictTo, protect } = require('../controllers/authenticationController');

const router = express.Router();

// alcance general
router.get('/:cancha/:fecha', getReservasByFecha);
router.get('/:cancha/semana/:lunes',getReservasBySemana);

router.use(protect);
// alcance de alumno,profe
router.post('/', restrictTo('alumno', 'profesor'), createReserva); 
router.delete('/:id', restrictTo('alumno', 'profesor'), cancelarReserva);



router.patch('/:id', restrictTo('admin'), confirmarReserva);


module.exports = router;