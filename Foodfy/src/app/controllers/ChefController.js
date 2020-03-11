const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require ('../models/File');

module.exports = {
  async chefs (req, res){
    let chefs = await Chef.all();

    for (chef of chefs){
      results = await Chef.files(chef.id);
      let avatarFile = results.rows[0];

      if(avatarFile){
        avatarFile.path.replace('public', '');
        chef.avatar = `${req.headers.host}${avatarFile.path}`;
      }
    }    
    
    return res.render('public/chefs', {chefs});
  },
  async show (req, res){

    const {id} = req.params;

    results = await Chef.find(id);
    const chef = results.rows[0];

    results = await Chef.findRecipes(id);
    let recipes = results.rows;

    results = await Chef.files(id);
    let avatar = results.rows[0];

    if (avatar){
      avatar.path.replace('public', '');
      chef.avatar = `${req.headers.host}${avatar.path}`;
    }

    for (recipe of recipes){
      results = await Recipe.files(recipe.id);
      let srcEnd = results.rows[0].path.replace('public', '');
      recipe.cardImage = `${req.protocol}://${req.headers.host}${srcEnd}`;
    }

    return res.render('public/chefs_show', {chef, recipes});

  },
  async adminChefs (req, res){
    let chefs = await Chef.all();

    const enable = req.session.admin;

    for (chef of chefs){
      results = await Chef.files(chef.id);
      let avatarFile = results.rows[0];

      if(avatarFile){
        avatarFile.path.replace('public', '');
        chef.avatar = `${req.headers.host}${avatarFile.path}`;
      }
    }
    
    return res.render('admin/chefs/index', {chefs, enable});
  },
  async adminShow (req, res){
    const {id} = req.params;

    const enable = req.session.admin;

    results = await Chef.find(id);
    const chef = results.rows[0];

    if (!chef){
      return res.render('admin_layout', {
        error: `The chef you are looking for doesn't exist!`
      });
    }

    results = await Chef.findRecipes(id);
    let recipes = results.rows;

    results = await Chef.files(id);
    let avatar = results.rows[0];

    if (avatar){
      avatar.path.replace('public', '');
      chef.avatar = `${req.headers.host}${avatar.path}`;
    }

    for (recipe of recipes){
      results = await Recipe.files(recipe.id);
      let srcEnd = results.rows[0].path.replace('public', '');
      recipe.cardImage = `${req.protocol}://${req.headers.host}${srcEnd}`;
    }

    return res.render('admin/chefs/show', {chef, recipes, enable});
  },
  create (req, res){
    return res.render('admin/chefs/create');
  },
  async edit (req, res){
    const {id} = req.params;

    let results = await Chef.find(id);
    const chef = results.rows[0];
    
    return res.render('admin/chefs/edit', {chef});

  },
  async post (req, res){
    

    let results = await Chef.create(req.body);
    const chefId = results.rows[0].id;

    for (file of req.files){
      results = await File.create({...file});
      await File.relateChef(results.rows[0].id, chefId);
    }

    return res.redirect(`/admin/chefs/${chefId}`);

  },
  async put (req, res){
    const keys = Object.keys(req.body);
    for (key of keys){
      if(req.body[key] == ""){
        return res.send('Please, fill all fields');
      }
    }

    if (req.files){
      if(req.files.length > 1){
        return res.send('Please, send only one photo for the Avatar')
      } else if (req.files.length = 1){
        await File.deleteAvatar(req.body.id);
        for (file of req.files){
          results = await File.create({...file});
          await File.relateChef(results.rows[0].id, req.body.id);
        }
      }
    }

    const result = await Chef.update(req.body);
    const chef = result.rows[0];

    return res.redirect(`/admin/chefs/${chef.id}`);

  }
}