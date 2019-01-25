const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const authRouter = express.Router();

function router(nav) {
  const {
    signUp,
    viewProfile,
    profileMiddleware,
    signIn,
    logout
  } = authController(nav);

  authRouter.route('/signUp')
    .post(signUp);

  authRouter.route('/profile')
    .all(profileMiddleware)
    .get(viewProfile);

  authRouter.route('/signIn')
    .get(signIn)
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  authRouter.route('/logout')
    .get(logout);
  return authRouter;
}

module.exports = router;
