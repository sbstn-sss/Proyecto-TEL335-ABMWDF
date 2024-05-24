const express = require('express');


const { login, signup, protect } = require('../controllers/authenticationController');

const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.get('/protected-route', protect, (req, res, next) => {
  console.log('esta autenticado');
  res.status(200).json( {
    message: 'Congrats, you have access!'
  });

});
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