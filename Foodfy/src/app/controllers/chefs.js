const Chef = require('../model/Chef');

module.exports = {
  adminChefs (req, res){
    return res.render('admin/chefs/index');
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