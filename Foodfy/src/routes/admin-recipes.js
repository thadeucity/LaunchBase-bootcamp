const express = require ('express');
const routes = express.Router();

const multer = require ('../app/middlewares/multerRecipes');

const { userRestricted } = require('../app/middlewares/session');

const RecipeController = require('../app/controllers/RecipeController');
const RecipeValidator = require('../app/validators/recipes');

routes.get('/recipes', RecipeController.adminRecipes);
routes.get('/recipes/create', RecipeController.create);
routes.get('/recipes/:id', RecipeController.adminShow);

routes.get('/recipes/:id/edit',
  userRestricted,
  RecipeController.edit
);

routes.post('/recipes', 
  multer.array("photos", 5),
  RecipeValidator.createRecipe,
  RecipeController.post
);

routes.put('/recipes',
  userRestricted,
  multer.array("photos", 5),
  RecipeValidator.updateRecipe,
  RecipeController.put
);

routes.delete('/recipes',
  userRestricted,
  RecipeController.delete
);

module.exports = routes;