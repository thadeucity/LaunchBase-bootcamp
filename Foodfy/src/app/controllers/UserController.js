const crypto = require('crypto');
const { hash } = require ('bcryptjs');

const mailer = require('../../config/mailer');
const mailBuilder = require ('../../lib/emailBuilder')

const User = require('../models/User');

module.exports={
  async list(req, res){
    if (!req.session.admin){
      return res.redirect('/admin/profile')
    }

    let users = await User.all();
    return res.render('admin/users/index', {users, admin:req.session.admin});
  },
  createForm(req,res){
    return res.render('admin/users/create');
  },
  async editForm(req,res){
    const {id} = req.params;

    const user = await User.findOne({where: { id }});

    const userfilter = {
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.is_admin
    };

    return res.render('admin/users/edit', {user: userfilter});
  },
  async post(req,res){
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
        subject: `Welcome to Foodfy - ${name}`,
        text: mailBuilder.welcomeEmail({
          name, 
          password: data.password,
          textOnly: true
        }),
        html: mailBuilder.welcomeEmail({
          name,
          password: data.password
        }),
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
  async put(req,res){
    const { name, email, id } = req.body;

    if (req.body.admin){
      isAdmin = true;
    } else {
      isAdmin = false;
    }

    try{

      await User.update(id, {
        name,
        email,
        is_admin: isAdmin
      }); 

    }catch(err){
      console.error(err);
    }

    return res.redirect('/admin/users');
  },
  delete(req,res){
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

    } catch (err){
      console.error(err);
      return res.render('session/change-password', {
        error: 'Something went wrong, try again later'
      });
    }

    return res.render('session/login', {
      user: req.body,
      success: "Your password was updated!"
    });

  },
  async resetPassword(req,res){
    try{
      const {id} = req.user;
      password = await hash(req.body.password, 8);

      await User.update(id, {password}); 

    } catch (err){
      console.error(err);
      return res.render('session/reset-password', {
        error: 'Something went wrong, try again later'
      });
    }

    return res.render('session/login', {
      user: req.body,
      success: "Your password was updated!"
    });

  }
}