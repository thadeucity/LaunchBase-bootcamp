const Recipe = require('../models/Recipe');

async function createRecipe (req, res, next) {
  let chefs = null;

  const keys = Object.keys(req.body);
  for (key of keys){
    if(req.body[key] == ""){
      chefs = await Recipe.chefsList();
      return res.render('admin/recipes/create', {
        chefs,
        recipe: req.body,
        error: 'Please fill all fields'
      });
    }
  }

  

  if(req.files.length == 0){
    chefs = await Recipe.chefsList();
    return res.render('admin/recipes/create', {
      chefs,
      recipe: req.body,
      error: 'Please upload at least one photo'
    });

  } else if(req.files.length > 5){
    chefs = await Recipe.chefsList();
    return res.render('admin/recipes/create', {
      chefs,
      recipe: req.body,
      error: 'Please upload less than 5 photos'
    });
  }

  next();
}

async function updateRecipe (req, res, next){
  let chefs = null;

  const keys = Object.keys(req.body);
  for (key of keys){
    if(req.body[key] == "" && key != "removed_files"){
      return res.render('admin/recipes/edit', {
        chefs,
        recipe: req.body,
        error: 'Please fill all fields'
      });
    }
  }

  next();
}


module.exports = {
 createRecipe,
 updateRecipe
}