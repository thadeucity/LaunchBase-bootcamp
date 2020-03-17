const User = require('../models/User');

module.exports = {
  async index(req,res){
    const id = req.session.userId;
    const user = await User.findOne({where: { id }});

    const userfilter = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.render('admin/users/profile', {user: userfilter});
  },
  put(req,res){
    return res.render('admin/users/profile');
  }
}