const fs = require('fs');
const data = require('../data/data.json');

exports.initial = function (req, res){
  return res.redirect('/admin/recipes');
}

exports.index = function (req, res){
  return res.render('admin/index', {recipeList: data.recipes});
}

exports.show = function (req, res){
  const recipeIndex = req.params.index;
  const recipe = data.recipes[recipeIndex];

  if (!recipe) return res.status(404).render("pages/error404");

  return res.render('admin/show_recipe', {recipe, recipeIndex});
}

exports.create = function (req, res){
  return res.render('admin/new_recipe');
}

exports.post = function (req, res){

  const keys = Object.keys(req.body);

  for (key of keys){
    if(req.body[key] == ""){
      return res.send('Please, fill all fields');
    }
  }

  const {
    image,
    title,
    ingredients,
    preparation,
    information
  } = req.body;

  data.recipes.push({
    image,
    image_banner: image,
    title,
    author: "Victor Alvarenga",
    ingredients,
    preparation,
    information
  });

  fs.writeFile('./data/data.json', JSON.stringify(data, null, 2), function(err){
    if (err) return res.send('Write file error!');

    return res.redirect('/admin');
  });

}

exports.edit = function (req, res){
  const recipeIndex = req.params.index;
  const recipe = data.recipes[recipeIndex];

  if (!recipe) return res.status(404).render("pages/error404");

  return res.render('admin/edit_recipe', {recipe, recipeIndex});
}

exports.put = function (req, res){
  const keys = Object.keys(req.body);
  
  for (key of keys){
    if(req.body[key] == ""){
      return res.send('Please, fill all fields');
    }
  }

  const {
    image,
    title,
    ingredients,
    preparation,
    information,
    id
  } = req.body;
  
  if (id>data.recipes.length-1){
    return res.send('ERROR - Recipe not found');
  }

  recipe = {
    ...data.recipes[id],
    image,
    image_banner: image,
    title,
    author: "Victor Alvarenga",
    ingredients,
    preparation,
    information
  }

  data.recipes[id] = recipe;

  fs.writeFile('./data/data.json', JSON.stringify(data, null, 2), function(err){
    if (err) return res.send('Write file error!');

    return res.redirect(`/admin/recipes/${id}`);
  });

}

exports.delete = function (req, res){
  const { id } = req.body;

  if (id>data.recipes.length-1){
    return res.send('ERROR - Recipe not found');
  }

  data.recipes.splice(id, 1)

  fs.writeFile('./data/data.json', JSON.stringify(data, null, 2), function(err){
    if (err) return res.send('Write file error!');

    return res.redirect('/admin/recipes');
  });

}
