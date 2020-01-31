const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authenticationController = require('../controller/authenticationController');

// router.param('id', (req, res, next, val) => {
//   if (val > users.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid user id'
//     });
//   }
//   next();
// });

router.post('/signup', authenticationController.signupUser);
router.post('/login', authenticationController.loginUser);
router.post('/forgotPassword', authenticationController.forgotPassword);
router.patch('/resetPassword/:id', authenticationController.resetPassword);
router.patch(
  '/updatePassword',
  authenticationController.sendProtect,
  authenticationController.updatePassword
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authenticationController.sendProtect,
    authenticationController.restrict('admin'),
    userController.deleteUser
  );

module.exports = router;
