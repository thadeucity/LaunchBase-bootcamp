const data = require('../data/data.json');

module.exports = {
  index (req, res){
    return res.render('pages/index', {recipeList: data.recipes});
  },

  about (req, res){
    return res.render('pages/about');
  },

  recipes (req, res){
    return res.render('pages/recipes', {recipeList: data.recipes});
  },

  showRecipe (req, res){
    const recipe = data.recipes[req.params.index];
  
    if (!recipe) return res.status(404).render("pages/error404");
  
    return res.render('pages/full_recipe', {recipe});
  },

  notFound (req, res) {
    return res.status(404).render("pages/error404");
  }
}; 