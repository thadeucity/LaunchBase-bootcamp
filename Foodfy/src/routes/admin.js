const express = require ('express');
const routes = express.Router();

const multerRecipes = require ('../app/middlewares/multerRecipes');
const multerChefs = require ('../app/middlewares/multerChefs');

const recipes = require('../app/controllers/recipes');
const chefs = require('../app/controllers/chefs');
const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');

const SessionValidator = require('../app/validators/session');

const { usersOnly, userVerified } = require('../app/middlewares/session');

const users = require('./users');


routes.get('/', userVerified, recipes.adminIndex);
routes.get('/recipes', userVerified, recipes.adminRecipes);
routes.get('/recipes/create', userVerified, recipes.create);
routes.get('/recipes/:id', userVerified, recipes.adminShow);
routes.get('/recipes/:id/edit', userVerified, recipes.edit);

routes.get('/chefs', userVerified, chefs.adminChefs);
routes.get('/chefs/create', chefs.create);
routes.get('/chefs/:id', chefs.adminShow);
routes.get('/chefs/:id/edit', chefs.edit);

routes.post('/recipes', userVerified, multerRecipes.array("photos", 6), recipes.post);
routes.post('/chefs', userVerified, multerChefs.array("avatar", 1), chefs.post);
routes.put('/recipes', userVerified, multerRecipes.array("photos", 6), recipes.put);
routes.put('/chefs', userVerified, multerChefs.array("avatar", 1), chefs.put);

////////////////////////////   SESSION   ////////////////////////////

routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

routes.get('/change-password', usersOnly, SessionController.changePasswordForm);
routes.post('/change-password', 
  usersOnly,
  SessionValidator.changePassword, 
  UserController.changePassword
);

routes.get('/forgot-password', SessionController.forgotPasswordForm);
routes.get('/reset-password', SessionController.resetPasswordForm);

routes.post('/reset-password', SessionController.resetPassword);

////////////////////////////    USERS    ////////////////////////////

routes.use('/users', users);


module.exports = routes;