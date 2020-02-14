const Chef = require('../model/Chef');

module.exports = {
  adminChefs (req, res){
    Chef.all(function(chefs){
      return res.render('admin/chefs/index', {chefs});
    });
  },
  adminShow (req, res){
    const {id} = req.params;

    Chef.find( id, function(chef){
      return res.render('admin/chefs/show', {chef});
    });
  },
  create (req, res){
    return res.render('admin/chefs/create');
  },
  post (req, res){
    const keys = Object.keys(req.body);
    for (key of keys){
      if(req.body[key] == ""){
        return res.send('Please, fill all fields');
      }
    }

    Chef.create(req.body, function(chef){
      return res.render('admin/chefs/index');
    });
  }
}