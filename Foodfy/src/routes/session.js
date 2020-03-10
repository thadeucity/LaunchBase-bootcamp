const express = require ('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');

const SessionValidator = require('../app/validators/session');

const { usersOnly } = require('../app/middlewares/session');

routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', usersOnly, SessionController.logout);

routes.get('/change-password', usersOnly, SessionController.changePasswordForm);
routes.post('/change-password', 
  usersOnly,
  SessionValidator.changePassword, 
  UserController.changePassword
);

routes.get('/forgot-password', SessionController.forgotPasswordForm);
routes.post('/forgot-password',
  SessionValidator.forgotPassword, 
  SessionController.forgotPassword
);

routes.get('/reset-password', SessionController.resetPasswordForm);
routes.post('/reset-password', 
  SessionValidator.resetPassword,
  UserController.resetPassword
);

module.exports = routes;