const data = require('../data/data.json');


//Index Page
exports.index = function (req, res){
  return res.render('pages/index', {recipeList: data.recipes});
}

// About Page
exports.about = function (req, res){
  return res.render('pages/about');
}

// Recipes Page
exports.recipes = function (req, res){
  return res.render('pages/recipes', {recipeList: data.recipes});
}

// Show Recipe
exports.showRecipe = function (req, res){
  const recipe = data.recipes[req.params.index];

  if (!recipe) return res.status(404).render("pages/error404");

  return res.render('pages/full_recipe', {recipe});
}

exports.notFound = function(req, res) {
  return res.status(404).render("pages/error404");
}