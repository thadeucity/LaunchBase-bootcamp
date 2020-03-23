const Messages = require ('../../lib/messages');

const User = require('../models/User');

module.exports = {
  async index(req,res){
    try {
      const id = req.session.userId;
      const user = await User.find({where: { id }});

      const userfilter = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const message = Messages.fromQuery(req.query);

      return res.render('admin/users/profile', {
        user: userfilter,
        error: message.error,
        alert: message.alert,
        success: message.success
      });
      
    } catch (err) {
      console.error(err);
    }
    

  },
  async put(req,res){
    try {
      const {name, email} = req.body,
      id = req.session.userId;

      await User.update(id, {name, email})
      const success = 200; // profile updated
      return res.redirect(`/admin/profile?success=${success}`);

    } catch (err) {
      console.error(err);
    }
    
  }
}