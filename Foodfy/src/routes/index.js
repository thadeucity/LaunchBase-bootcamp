const express = require ('express');
const routes = express.Router();

const RecipeController = require('../app/controllers/RecipeController');
const ChefController = require('../app/controllers/ChefController');
const ViewerController = require('../app/controllers/ViewerController');

const admin = require('./admin');

// --------------------- PUBLIC AREA --------------------- //

routes.get('/about', ViewerController.about);

routes.get('/', RecipeController.index);
routes.get('/recipes', RecipeController.recipes);
routes.get('/recipes/:id', RecipeController.show);

routes.get('/chefs', ChefController.chefs);
routes.get('/chefs/:id', ChefController.show);

// --------------------- ADMIN AREA --------------------- //

routes.use('/admin', admin);

module.exports = routes;