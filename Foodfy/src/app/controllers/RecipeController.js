const Recipe = require('../models/Recipe');
const File = require ('../models/File');

function userRelated(recipeUserId, userId, admin){
  if(admin || recipeUserId == userId){
    return true;
  } else {
    return false;
  }
}

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

    const recipe = await Recipe.find(id);

    let results = await Recipe.files(recipe.id);

    const files = results.rows.map((file, index) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      name: `${recipe.title} -image_${index}`
    }));


    return res.render('public/recipe_show', {recipe, files});
  },

  async create (req, res){

    const chefs = await Recipe.chefsList();

    return res.render('admin/recipes/create', {chefs});

  },
  async adminShow (req, res){
    const {id} = req.params;
    const recipe = await Recipe.find(id);

    if(!recipe){
      return res.render('admin_layout', {
        error: `The recipe you are looking for doesn't exist!`
      });
    }

    const enable = userRelated (recipe.user_id, req.session.userId);

    let results = await Recipe.files(recipe.id);

    const files = results.rows.map((file, index) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      name: `${recipe.title} -image_${index}`
    }));


    return res.render('admin/recipes/show', {recipe, files, enable});
  },
  async edit (req, res){
    const {id} = req.params;

    const chefs = await Recipe.chefsList();

    const recipe = await Recipe.find(id);

    const enable = userRelated (recipe.user_id, req.session.userId, req.session.admin);
    if(!enable) return res.render('admin_layout', {
      error: 'Only admins or the recipe creator can edit a recipe'
    });

    let results = await Recipe.files(recipe.id);

    const files = results.rows.map((file, index) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      name: `${recipe.title} -image_${index}`
    }));

    return res.render('admin/recipes/edit', { recipe, chefs, files });

  },
  async post (req, res){
    try{

      let results = await Recipe.create(req.body, req.session.userId);
      const recipeId = results.rows[0].id;

      for (file of req.files){
        results = await File.create({...file});
        await File.relate(results.rows[0].id, recipeId);
      }

    } catch (err){
      console.error(err);
      return res.render('admin/recipes/create', {
        chefs,
        recipe: req.body,
        error: 'Something went wrong, try again later'
      });
    }

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async put (req,res){
    let recipeId = null;
    let results = null;
    try {
      const recipe = await Recipe.find(req.body.id);

      const enable = userRelated (recipe.user_id, req.session.userId, req.session.admin);
      if(!enable) return res.render('admin_layout', {
        error: 'Only admins or the recipe creator can edit a recipe'
      });

      recipeId = await Recipe.update(req.body, req.session.userId);

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

    } catch (err) {
      console.error(err);
      if(!enable) return res.render('admin_layout', {
        error: 'something unpredictable happened, try again later!'
      });
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