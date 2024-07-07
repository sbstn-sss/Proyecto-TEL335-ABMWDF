const express = require('express');


const { login, signup, protect, restrictTo } = require('../controllers/authenticationController');
const {getMyReservas } = require('../controllers/reservaController');
const { getAllUsers, getNormalUsers } = require('../controllers/userController');

const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);

router.delete('/logout', (req, res, next) => {
  res.clearCookie('jwt', { path: '/' });
  res.sendStatus(204); 
});

router.use(protect);
// alcance de alumno,profe
router.get('/reservas/mine', getMyReservas);

// alcance de admin

router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.get('/normal/', getNormalUsers);

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