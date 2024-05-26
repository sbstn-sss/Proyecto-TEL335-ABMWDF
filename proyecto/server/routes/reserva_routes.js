const express = require('express');

const { createReserva, getReservasByFecha, cancelarReserva } = require('../controllers/reservaController');

const router = express.Router();


// alcance de alumno
router.post('/', createReserva); // pendiente que el usuario este autenticado (protect)
router.get('/:cancha/:fecha', getReservasByFecha);
router.delete('/:id', cancelarReserva);

/*
//PROTECT MIDDLEWARE
router.use(protect); // is applied to all following routes!!

router.route('/update-password').patch(updatePassword);
router.route('/update-me').patch(updateMe);
router.route('/delete-me').delete(deleteMe);
router.route('/me').get(getMe, getUserById);


//RESTRICTION MIDDLEWARE
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);

router
  .route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);


*/
module.exports = router;