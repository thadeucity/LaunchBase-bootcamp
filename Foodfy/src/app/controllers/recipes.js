const Recipe = require('../model/Recipe');
const File = require ('../model/File');

module.exports = {
  async index (req, res){
    const LIMIT = 6;

    results = await Recipe.mostViewed(LIMIT);
    let recipes = results.rows;

    for (recipe of recipes){
      results = await Recipe.files(recipe.id);
      let srcEnd = results.rows[0].path.replace('public', '');
      recipe.cardImage = `${req.protocol}://${req.headers.host}${srcEnd}`;
    }

    return res.render('public/index', {recipes});

  },
  async recipes (req, res){
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 12;
    let offset = limit * (page-1);

    const params = {
      limit,
      offset,
      filter
    }

    results = await Recipe.paginate(params);

    let recipes = results.rows;

    let pagination = {
      total: 0,
      page
    }

    if (recipes[0]){
      pagination.total = Math.ceil(recipes[0].total/limit);
    }  

    for (recipe of recipes){
      results = await Recipe.files(recipe.id);
      let srcEnd = results.rows[0].path.replace('public', '');
      recipe.cardImage = `${req.protocol}://${req.headers.host}${srcEnd}`;
    }

    return res.render('public/recipes', {recipes, pagination, filter});

  },
  async show (req, res){
    const {id} = req.params;
    let results = await Recipe.find(id);
    const recipe = results.rows[0];

    results = await Recipe.files(recipe.id);

    const files = results.rows.map((file, index) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      name: `${recipe.title} -image_${index}`
    }));


    return res.render('public/recipe_show', {recipe, files});
  },

  async create (req, res){

    let results = await Recipe.chefsList();
    const chefs = results.rows;

    return res.render('admin/recipes/create', {chefs});

  },
  async adminShow (req, res){
    const {id} = req.params;
    let results = await Recipe.find(id);
    const recipe = results.rows[0];

    results = await Recipe.files(recipe.id);

    const files = results.rows.map((file, index) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      name: `${recipe.title} -image_${index}`
    }));


    return res.render('admin/recipes/show', {recipe, files});
  },
  async edit (req, res){
    const {id} = req.params;

    let results = await Recipe.chefsList();
    const chefs = results.rows;

    results = await Recipe.find(id);
    const recipe = results.rows[0];

    results = await Recipe.files(recipe.id);

    const files = results.rows.map((file, index) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      name: `${recipe.title} -image_${index}`
    }));

    return res.render('admin/recipes/edit', {recipe, chefs, files});

  },
  async post (req, res){
    const keys = Object.keys(req.body);
    for (key of keys){
      if(req.body[key] == ""){
        return res.send('Please, fill all fields');
      }
    }

    if(req.files.length == 0){
      return res.send('Please, send at least one image')
    } else if(req.files.length > 5){
      return res.send('Please, send less than 5 images')
    }


    let results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    for (file of req.files){
      results = await File.create({...file});
      await File.relate(results.rows[0].id, recipeId);
    }

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async put (req,res){
    const keys = Object.keys(req.body);
    for (key of keys){
      if(req.body[key] == "" && key != "removed_files"){
        return res.send('Please, fill all fields');
      }
    }

    let results = await Recipe.update(req.body);
    const recipeId = results.rows[0].id;

    if(req.files.length != 0){
      for (file of req.files){
        results = await File.create({...file});
        await File.relate(results.rows[0].id, recipeId);
      }
    }

    if (req.body.removed_files){
      const removedFiles = req.body.removed_files.split(',');
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      for (fileId of removedFiles){
        await File.delete(fileId);
      }
    }

    return res.redirect(`/admin/recipes/${recipeId}`);

  },

  adminIndex (req, res){
    return res.redirect('/admin/recipes')
  },
  async adminRecipes (req, res){
    let results = await Recipe.all();
    let recipes = results.rows;

    for (recipe of recipes){
      results = await Recipe.files(recipe.id);
      let srcEnd = results.rows[0].path.replace('public', '');
      recipe.cardImage = `${req.protocol}://${req.headers.host}${srcEnd}`;
    }

    return res.render('admin/recipes/index', {recipes});
  }

}