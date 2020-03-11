const express = require ('express');
const routes = express.Router();

const multer = require ('../app/middlewares/multerRecipes');

const recipes = require('../app/controllers/RecipeController');
const RecipeValidator = require('../app/validators/recipes');

routes.get('/', recipes.adminIndex);
routes.get('/recipes', recipes.adminRecipes);
routes.get('/recipes/create', recipes.create);
routes.get('/recipes/:id', recipes.adminShow);
routes.get('/recipes/:id/edit', recipes.edit);

routes.post('/recipes', 
  multer.array("photos", 5),
  RecipeValidator.createRecipe,
  recipes.post
);

routes.put('/recipes',  
  multer.array("photos", 5), 
  recipes.put
);

module.exports = routes;