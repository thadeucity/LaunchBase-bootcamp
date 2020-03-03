const express = require ('express');
const routes = express.Router();

const recipes = require('../app/controllers/recipes');
const viewer = require('../app/controllers/viewer');
const chefs = require('../app/controllers/chefs');

const admin = require('./admin');


// --------------------- PUBLIC AREA --------------------- //

routes.get('/about', viewer.about);

routes.get('/', recipes.index);
routes.get('/recipes', recipes.recipes);
routes.get('/recipes/:id', recipes.show);

routes.get('/chefs', chefs.chefs);
routes.get('/chefs/:id', chefs.show);

// --------------------- ADMIN AREA --------------------- //

routes.use('/admin', admin);

module.exports = routes;