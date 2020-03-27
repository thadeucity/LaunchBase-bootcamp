const crypto = require('crypto');
const { hash } = require ('bcryptjs');

const mailer = require('../../config/mailer');
const mailBuilder = require ('../../lib/emailBuilder')

const User = require('../models/User');
const Recipe = require('../models/Recipe');

module.exports={
  async list(req, res){
    if (!req.session.admin){
      return res.redirect('/admin/profile')
    }

    let users = await User.findAll();
    return res.render('admin/users/index', {users, admin:req.session.admin});
  },
  createForm(req,res){
    return res.render('admin/users/create');
  },
  async editForm(req,res){
    const user = await User.findOne(req.params.id);

    const userfilter = {
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.is_admin
    };

    return res.render('admin/users/edit', {user: userfilter});
  },
  async post(req,res){
    try{
      const { name, email } = req.body;

      if (req.body.admin){
        is_admin = true;
      } else {
        is_admin = false;
      }
  
      let password = crypto.randomBytes(5).toString('hex');

      await mailer.sendMail({
        to: email,
        from: '"Foodfy" no-reply@foodfy.com.br',
        subject: `Welcome to Foodfy - ${name}`,
        text: mailBuilder.welcomeEmail({
          name, 
          password,
          textOnly: true
        }),
        html: mailBuilder.welcomeEmail({
          name,
          password
        }),
      });

      password = await hash(password, 8);

      const userId = await User.create({
        name,
        email,
        is_admin,
        password
      });

      return res.render('admin/users/index', {
        success: `Congratulations the user ${name} was successfully created!`
      });

    } catch(err){
      console.error(err);
      return res.render('admin/users/index', {
        error: `Something went wrong, the system was unable to create the user, try again later!`
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
  async changePassword(req, res){
    try{
      const {id} = req.user;

      password = await hash(req.body.new_password, 8);

      if(req.session.verified){
        await User.update(id, {password}); 
      } else{
        await User.update(id, {password, is_verified:true});
      }

      req.session.destroy();

      return res.render('session/login', {
        user: req.body,
        success: "Your password was updated!"
      });

    } catch (err){
      console.error(err);
    }

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

  },
  async delete(req,res){
    const {id} = req.body;

    const filters = {
      WHERE: {user_id:id}
    }
    
    const userRecipes = await Recipe.find({filters});

    recipesPromise = userRecipes.map(recipe => {
      return Recipe.update(recipe.id,{
        user_id : req.session.userId      
      })
    });

    await Promise.all(recipesPromise);
    await User.delete(id);

    return res.redirect('/admin/users');
  }
}