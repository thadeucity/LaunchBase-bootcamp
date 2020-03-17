const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require ('../models/File');



module.exports = {
  async chefs (req, res){
    let avatarFile = null;
    let chefs = await Chef.findAll();

    for (chef of chefs){
      avatarFile = await Chef.avatar(chef.id);

      if(avatarFile){   
        chef.avatar = avatarFile.path.replace('public', '');
      }
    }    
    
    return res.render('public/chefs', {chefs});
  },
  async show (req, res){
    const {id} = req.params;

    const chef = await Chef.findOne(id);

    const recipes = await Recipe.find({filters: {WHERE: {chef_id: id}}});

    const avatar = await Chef.avatar(id);

    if (avatar){
      chef.avatar = avatar.path.replace('public', '');
    }

    let recipeImg = null;

    for (recipe of recipes){
      recipeImg = await Recipe.files(recipe.id);
      recipe.cardImage = recipeImg[0].path.replace('public', '');
    }

    return res.render('public/chefs_show', {chef, recipes});

  },
  async adminChefs (req, res){
    let chefs = await Chef.all();

    const enable = req.session.admin;

    let avatarFile = null;

    for (chef of chefs){
      avatarFile = await Chef.avatar(chef.id);

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

    const chef = await Chef.find(id);

    if (!chef){
      return res.render('admin_layout', {
        error: `The chef you are looking for doesn't exist!`
      });
    }

    let results = await Chef.findRecipes(id);
    let recipes = results.rows;

    let avatar = await Chef.avatar(id);

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
    let error = null;
    if (req.query) error = req.query.error;
    return res.render('admin/chefs/create', {error});
  },
  async edit (req, res){
    let error = null;
    const {id} = req.params;
    if (req.query) error = req.query.error;

    const chef = await Chef.find(id);

    let avatar = await Chef.avatar(chef.id);

    if (avatar){
      avatar.path.replace('public', '');
      chef.avatar = `${req.headers.host}${avatar.path}`;
    }

    return res.render('admin/chefs/edit', {chef, error});
  },
  async post (req, res){
    try {
      let results = null;
      const chefId = await Chef.create(req.body);
  
      for (file of req.files){
        results = await File.create({...file});
        await File.relateChef(results.rows[0].id, chefId);
      }
    } catch (err) {
      console.error(err);
      return res.render('admin/chefs/create', {
        chef: req.body,
        error: 'Something went wrong, try again later'
      });
    }

    return res.redirect(`/admin/chefs/${chefId}`);
  },
  async put (req, res){
    if (req.files.length >= 1){
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
  
    const chef = await Chef.update(req.body);
    return res.redirect(`/admin/chefs/${chef.id}`);
  },
  async delete (req, res){
    
  }
}