const Recipe = require('../model/Recipe');

module.exports = {
  index (req, res){
    const LIMIT = 6;

    Recipe.mostViewed(LIMIT, function(recipes){
      return res.render('public/index', {recipes});
    });
  },
  recipes (req, res){
    return res.render('public/recipes');
  },
  show (req, res){
    const {id} = req.params;

    Recipe.find(id, function(recipe){
      return res.render('public/recipe_show', {recipe});
    });
  
  },

  create (req, res){
    return res.render('admin/recipes/create');
  },
  post (req, res){
    const keys = Object.keys(req.body);
    for (key of keys){
      if(req.body[key] == ""){
        return res.send('Please, fill all fields');
      }
    }

    Recipe.create(req.body, function(recipe){
      return res.render('admin/recipes/index');
    });
  },

  adminIndex (req, res){


    return res.redirect('/admin/recipes')
  },
  adminRecipes (req, res){
    return res.render('admin/recipes/index');
  }

}