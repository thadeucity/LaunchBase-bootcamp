const crypto = require('crypto');
const { hash } = require ('bcryptjs');

const mailer = require('../../config/mailer');
const mailBuilder = require ('../../lib/emailBuilder')

const User = require('../model/User');

module.exports={
  listUsers(req, res){
    return res.render('admin/users/index');
  },
  createForm(req,res){
    return res.render('admin/users/create');
  },
  editForm(req,res){
    return res.render('admin/users/edit');
  },
  async createUser(req,res){
    const { name, email } = req.body;

    if (req.body.admin){
      isAdmin = true;
    } else {
      isAdmin = false;
    }

    let data = {
      ...req.body,
      password: crypto.randomBytes(5).toString('hex'),
      isAdmin
    }

    try{

      await mailer.sendMail({
        to: email,
        from: '"Foodfy" no-reply@foodfy.com.br',
        subject: `Bem vindo ao Foodfy - ${name}`,
        text: mailBuilder.welcomeEmail('', name, data.password),
        html: mailBuilder.welcomeEmail('html', name, data.password),
      });

    } catch(err){
      console.error(err);
      return res.render('admin/users/index', {
        error: `Something went wrong, the system was unable to create the user, try again later!`
      });
    }

    const results = await User.create(data);

    if(results.error){
      return res.render('admin/users/create', {
        error: `Something went wrong, the system was unable to create the user try again later!`
      });
    } else {
      return res.render('admin/users/index', {
        success: `Congratulations the user ${name} was successfully created!`
      });
    }
  },
  updateUser(req,res){
    return res.render('admin/users/create');
  },
  deleteUser(req,res){
    return res.render('admin/users/create');
  },
  async changePassword(req, res){
    try{
      const id = req.session.userId;

      password = await hash(req.body.new_password, 8);

      if(req.session.verified){
        await User.update(id, {password}); 
      } else{
        await User.update(id, {password, verified:true});
        req.session.verified = true;
      }

      return res.redirect('/admin');

    } catch (err){
      console.error(err);
      return res.render('session/change-password', {
        error: 'Something went wrong, try again later'
      });
    }
    

  }
}