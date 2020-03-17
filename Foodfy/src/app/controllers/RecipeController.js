const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require ('../models/File');

module.exports = {
  async index (req, res){

    const paginate = {
      limit: 6,
      offset: 0
    }

    const recipes = await Recipe.find({paginate});

    for (recipe of recipes){
      recipeImg = await Recipe.files(recipe.id);
      recipe.cardImage = recipeImg[0].path.replace('public', '');
    }

    return res.render('public/index', {recipes});
  },
  async recipes (req, res){
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 12;
    offset = (limit * (page-1));

    let params = {};

    params.paginate = {limit, offset};

    if(filter) params.search = filter;

    const recipes = await Recipe.find(params);

    let pagination = {
      total: 0,
      page
    }

    if (recipes[0]){
      pagination.total = Math.ceil(recipes[0].total/limit);
    }  

    for (recipe of recipes){
      recipeImg = await Recipe.files(recipe.id);
      recipe.cardImage = recipeImg[0].path.replace('public', '');
    }

    return res.render('public/recipes', {recipes, pagination, filter});

  },
  async show (req, res){
    const {id} = req.params;
    const recipe = await Recipe.findOne(id);

    let files = await Recipe.files(recipe.id);

    files = files.map((file, index) => ({
      ...file,
      src: `${file.path.replace('public', '')}`,
      name: `${recipe.title} -image_${index}`
    }));

    return res.render('public/recipe_show', {recipe, files});
  },

  async adminRecipes (req, res){
    const recipes = await Recipe.findAll();

    for (recipe of recipes){
      recipeImg = await Recipe.files(recipe.id);
      recipe.cardImage = recipeImg[0].path.replace('public', '');
    }

    return res.render('admin/recipes/index', {recipes});
  },
  async adminShow (req, res){
    const {id} = req.params;
    const recipe = await Recipe.findOne(id);

    let files = await Recipe.files(recipe.id);

    files = files.map((file, index) => ({
      ...file,
      src: `${file.path.replace('public', '')}`,
      name: `${recipe.title} -image_${index}`
    }));


    return res.render('admin/recipes/show', {recipe, files});
  },
  async create (req, res){
    const chefs = await Chef.findAll();
    return res.render('admin/recipes/create', {chefs});
  },
  async edit (req, res){
    const {id} = req.params;

    const chefs = await Chef.findAll();
    const recipe = await Recipe.findOne(id);
    let files = await Recipe.files(recipe.id);

    files = files.map((file, index) => ({
      ...file,
      src: `${file.path.replace('public', '')}`,
      name: `${recipe.title} -image_${index}`
    }));

    return res.render('admin/recipes/edit', { recipe, chefs, files });
  },
  async post (req, res){
    let {title, chef_id, ingredients, preparation, information} = req.body;
    const recipeId = await Recipe.create({
      title,
      user_id: 1,
      chef_id,
      ingredients: `{${ingredients}}`,
      preparation: `{${preparation}}`,
      information
    });

    let fileId = 0;

    for (const [i, file] of req.files.entries()){
      fileId = await File.create({
        name: `${title}_image_${i}`,
        path: file.path
      });
      await Recipe.linkFile(recipeId, fileId);
    }

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async put (req,res){
    let recipeId = null;
    let results = null;

    recipeId = await Recipe.update({
      title,
      chef_id,
      ingredients: `{${ingredients}}`,
      preparation: `{${preparation}}`,
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
        await File.delete(removedId);
      }
    }

    return res.redirect(`/admin/recipes/${recipeId}`);

  },
  adminIndex (req, res){
    return res.redirect('/admin/recipes')
  }
}