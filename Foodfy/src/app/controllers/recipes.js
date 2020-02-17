const Recipe = require('../model/Recipe');

module.exports = {
  index (req, res){
    const LIMIT = 6;

    Recipe.mostViewed(LIMIT, function(recipes){
      return res.render('public/index', {recipes});
    });
  },
  recipes (req, res){
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 4;
    let offset = limit * (page-1);

    const params = {
      limit,
      offset,
      filter
    }

    Recipe.paginate(params, function(recipes){
      let pagination = {
        total: 0,
        page
      }
      if (recipes[0]){
        pagination.total = Math.ceil(recipes[0].total/limit);
      }  
      return res.render('public/recipes', {recipes, pagination, filter});
    });
  },
  show (req, res){
    const {id} = req.params;

    Recipe.find(id, function(recipe){
      return res.render('public/recipe_show', {recipe});
    });
  
  },

  create (req, res){
    Recipe.chefsList(function(chefs){
      return res.render('admin/recipes/create', {chefs});
    });
  },
  adminShow (req, res){
    const {id} = req.params;

    Recipe.find(id, function(recipe){
      return res.render('admin/recipes/show', {recipe});
    });  
  },
  edit (req, res){
    const {id} = req.params;

    Recipe.chefsList(function(chefs){

      Recipe.find(id, function(recipe){
        return res.render('admin/recipes/edit', {recipe, chefs});
      }); 

    }); 
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
  put (req,res){
    const keys = Object.keys(req.body);
    for (key of keys){
      if(req.body[key] == ""){
        return res.send('Please, fill all fields');
      }
    }

    Recipe.update(req.body, function(recipe){
      return res.redirect(`/admin/recipes/${recipe.id}`);
    });
  },

  adminIndex (req, res){
    return res.redirect('/admin/recipes')
  },
  adminRecipes (req, res){
    Recipe.all(function(recipes){
      return res.render('admin/recipes/index', {recipes});
    });
  }

}