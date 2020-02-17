const Chef = require('../model/Chef');

module.exports = {
  chefs (req, res){
    Chef.all(function(chefs){
      return res.render('public/chefs', {chefs});
    });
  },
  show (req, res){
    const {id} = req.params;

    Chef.find( id, function(chef){
      Chef.findRecipes (id, function(recipes){
        return res.render('public/chefs_show', {chef, recipes});
      });
    });
  },
  adminChefs (req, res){
    Chef.all(function(chefs){
      return res.render('admin/chefs/index', {chefs});
    });
  },
  adminShow (req, res){
    const {id} = req.params;

    Chef.find( id, function(chef){
      Chef.findRecipes (id, function(recipes){
        return res.render('admin/chefs/show', {chef, recipes});
      });
    });
  },
  create (req, res){
    return res.render('admin/chefs/create');
  },
  edit (req, res){
    const {id} = req.params;

    Chef.find( id, function(chef){
      return res.render('admin/chefs/edit', {chef});
    });
  },
  post (req, res){
    const keys = Object.keys(req.body);
    for (key of keys){
      if(req.body[key] == ""){
        return res.send('Please, fill all fields');
      }
    }

    Chef.create(req.body, function(chef){
      return res.redirect(`/admin/chefs/${chef.id}`);
    });
  },
  put (req, res){
    const keys = Object.keys(req.body);
    for (key of keys){
      if(req.body[key] == ""){
        return res.send('Please, fill all fields');
      }
    }

    Chef.update(req.body, function(chef){
      return res.redirect(`/admin/chefs/${chef.id}`);
    });
  }
}