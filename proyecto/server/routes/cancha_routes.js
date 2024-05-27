const express = require('express');
const { getAllCanchas, getOneCancha } = require('../controllers/canchaController');

const router = express.Router();


// alcance de alumno
router.post('/', getAllCanchas); // pendiente que el usuario este autenticado (protect)
router.get('/:cancha', getOneCancha);


module.exports = router;