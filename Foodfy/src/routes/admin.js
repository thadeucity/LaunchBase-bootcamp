const express = require ('express');
const routes = express.Router();

const multerRecipes = require ('../app/middlewares/multerRecipes');
const multerChefs = require ('../app/middlewares/multerChefs');

const recipes = require('../app/controllers/recipes');
const chefs = require('../app/controllers/chefs');

const { adminOnly, userVerified } = require('../app/middlewares/session');

const users = require('./users');
const session = require('./session');


routes.get('/', userVerified, recipes.adminIndex);
routes.get('/recipes', userVerified, recipes.adminRecipes);
routes.get('/recipes/create',userVerified, recipes.create);
routes.get('/recipes/:id', userVerified, recipes.adminShow);
routes.get('/recipes/:id/edit',  userVerified, recipes.edit);

routes.get('/chefs', userVerified, chefs.adminChefs);
routes.get('/chefs/create', userVerified, adminOnly, chefs.create);
routes.get('/chefs/:id', userVerified, chefs.adminShow);
routes.get('/chefs/:id/edit', userVerified, adminOnly, chefs.edit);

////////////////////   CREATE AND EDIT RECIPES   ////////////////////

routes.post('/recipes', 
  userVerified, 
  multerRecipes.array("photos", 6), 
  recipes.post
);

routes.put('/recipes', 
  userVerified, 
  multerRecipes.array("photos", 6), 
  recipes.put
);

/////////////////////   CREATE AND EDIT CHEFS   /////////////////////

routes.post('/chefs', 
  userVerified, 
  adminOnly,
  multerChefs.array("avatar", 1), 
  chefs.post
);

routes.put('/chefs', 
  userVerified, 
  adminOnly, 
  multerChefs.array("avatar", 1), 
  chefs.put
);

////////////////////////////   SESSION   ////////////////////////////

routes.use('/', session);

////////////////////////////    USERS    ////////////////////////////

routes.use('/users', userVerified, users);


module.exports = routes;