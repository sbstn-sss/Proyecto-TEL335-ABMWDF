const express = require('express');

const { createReserva, getReservasByFecha, cancelarReserva, getReservasBySemana, confirmarReserva } = require('../controllers/reservaController');
const { restrictTo } = require('../controllers/authenticationController');

const router = express.Router();


// alcance de alumno
router.post('/', createReserva); // pendiente que el usuario este autenticado (protect)
router.get('/:cancha/:fecha', getReservasByFecha);
router.get('/:cancha/semana/:lunes',getReservasBySemana);
router.delete('/:id', cancelarReserva);



router.patch('/:id', restrictTo(['admin']), confirmarReserva);


module.exports = router;