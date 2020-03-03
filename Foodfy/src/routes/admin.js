const express = require ('express');
const routes = express.Router();

const multerRecipes = require ('../app/middlewares/multerRecipes');
const multerChefs = require ('../app/middlewares/multerChefs');

const recipes = require('../app/controllers/recipes');
const chefs = require('../app/controllers/chefs');
const SessionController = require('../app/controllers/SessionController');

routes.get('/', recipes.adminIndex);
routes.get('/recipes', recipes.adminRecipes);
routes.get('/recipes/create', recipes.create);
routes.get('/recipes/:id', recipes.adminShow);
routes.get('/recipes/:id/edit', recipes.edit);

routes.get('/chefs', chefs.adminChefs);
routes.get('/chefs/create', chefs.create);
routes.get('/chefs/:id', chefs.adminShow);
routes.get('/chefs/:id/edit', chefs.edit);

routes.post('/recipes', multerRecipes.array("photos", 6), recipes.post);
routes.post('/chefs', multerChefs.array("avatar", 1), chefs.post);

routes.put('/recipes', multerRecipes.array("photos", 6), recipes.put);
routes.put('/chefs', multerChefs.array("avatar", 1), chefs.put);

////////////////////////////   SESSION   ////////////////////////////

routes.get('/login', SessionController.login);
routes.get('/reset-password', SessionController.resetPasswordForm);

module.exports = routes;