const express = require('express');

const { createReserva, getReservasByFecha, cancelarReserva, getReservasBySemana } = require('../controllers/reservaController');

const router = express.Router();


// alcance de alumno
router.post('/', createReserva); // pendiente que el usuario este autenticado (protect)
router.get('/:cancha/:fecha', getReservasByFecha);
router.get('/:cancha/semana/:lunes',getReservasBySemana);
router.delete('/:id', cancelarReserva);


module.exports = router;