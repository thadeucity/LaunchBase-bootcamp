const { unlinkSync } = require('fs');

const LoadContentService = require ('../services/LoadContentService');

const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require ('../models/File');

function isEditable (recipeOwner, user, adminStatus){
  return (recipeOwner == user || adminStatus) ? true : false;
}

module.exports = {
  async index (req, res){

    const paginate = {
      limit: 6,
      offset: 0
    }

    const recipes = await LoadContentService.load('recipes', {paginate});

    return res.render('public/index', {recipes});
  },
  async recipes (req, res){
    let { filter, page = 1, limit = 12 } = req.query;
    const offset = (limit * (page-1));   

    let params = {};
    params.paginate = {limit, offset};
    if(filter) params.search = filter;

    const recipes = await LoadContentService.load('recipes', params);

    let pagination = {
      total: 0,
      page
    }

    if (recipes[0]){
      pagination.total = Math.ceil(recipes[0].total/limit);
    } 

    return res.render('public/recipes', {recipes, pagination, filter});

  },
  async show (req, res){
    const recipe = await LoadContentService.load('recipe', req.params.id);

    return res.render('public/recipe_show', {recipe});
  },
  //////////    ADMIN CONTROLLERS    //////////
  async adminRecipes (req, res){
    const filter = req.query.filter;
    let recipes = [];
    let filtered = false;

    if (filter == 'self'){
      filters = { WHERE: {user_id: req.session.userId }};
      recipes = await Recipe.find({filters});
      filtered = true;

    } else {
      recipes = await Recipe.findAll();
    }

    for (recipe of recipes){
      recipeImg = await Recipe.files(recipe.id);
      recipe.cardImage = recipeImg[0].path.replace('public', '');
    }

    return res.render('admin/recipes/index', {recipes, filtered});
  },
  async adminShow (req, res){
    const recipe = await LoadContentService.load('recipe', req.params.id);

    const editable = isEditable(
      recipe.user_id,
      req.session.userId,
      req.session.admin
    );

    return res.render('admin/recipes/show', {recipe, editable});
  },
  async create (req, res){
    const chefs = await Chef.findAll();
    
    return res.render('admin/recipes/create', {chefs});
  },
  async edit (req, res){
    const recipe = await LoadContentService.load('recipe', req.params.id);
    const chefs = await Chef.findAll();

    return res.render('admin/recipes/edit', {recipe, chefs}); 
  },
  async post (req, res){ // Change to map
    let {title, chef_id, ingredients, preparation, information} = req.body;
    const recipeId = await Recipe.create({
      title,
      user_id: req.session.userId,
      chef_id,
      ingredients,
      preparation,
      information
    });

    for (const [i, file] of req.files.entries()){
      const fileId = await File.create({
        name: `${title}_image_${i}`,
        path: file.path
      });
      await Recipe.linkFile(recipeId, fileId);
    }

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async put (req, res){
    let {title, chef_id, ingredients, preparation, information} = req.body;
    let recipeId = req.body.id;

    await Recipe.update(recipeId,{
      title,
      chef_id,
      ingredients,
      preparation,
      information
    });

    if(req.files.length != 0){
      for (const [i, file] of req.files.entries()){
        fileId = await File.create({
          name: `${title}_image_${i}`,
          path: file.path
        });
        await Recipe.linkFile(recipeId, fileId);
      }
    }

    if (req.body.removed_files){
      const removedFiles = req.body.removed_files.split(',');
      removedFiles.pop();

      for (const removedId of removedFiles){
        try {
          const file = await File.findOne(removedId);
          unlinkSync(file.path);
          await File.delete(removedId);
        } catch (err) {
          console.error(err);
        }
      }

    }

    return res.redirect(`/admin/recipes/${recipeId}`);

  },
  async delete(req, res){
    const files = await Recipe.files(req.body.id);

    try{
      const filesPromise = files.map( file => {
        File.delete(file.id);
        unlinkSync(file.path);
      });
      await Promise.all(filesPromise);
    }catch (err){
      console.error(err);
    }

    await Recipe.delete(req.body.id);
    
    return res.redirect(`/admin/recipes`);
  }
}