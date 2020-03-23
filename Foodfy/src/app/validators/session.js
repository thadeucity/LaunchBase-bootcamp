const Messages = require ('../../lib/messages');

const checkForm = require('../services/checkForm');

const User = require ('../models/User');

const { compare } = require('bcryptjs');

function passwordValidation(value, repeat_value){
// checkform.password
}

async function login(req,res,next){
  const { email, password } = req.body;

  const user = await User.find({ where: {email} });

  if(!user) return res.render('session/login', {
    user: req.body,
    error: Messages.fromParams('error', 601)
  });

  const passed = await compare(password, user.password);

  if(!passed) return res.render('session/login', {
    user: req.body,
    error: Messages.fromParams('error', 600)
  });

  req.user = user;

  next();
}

async function changePassword(req, res, next){
  const {email, password, new_password, password_repeat} = req.body;

  const user = await User.find({ where: {email} });

  if(!user) return res.render('session/change-password',{
    user: req.body,
    error: Messages.fromParams('error', 602)
  });

  if(user.id != req.session.userId) return res.render('session/change-password',{
    user: req.body,
    error: Messages.fromParams('error', 603)
  });

  const passed = await compare(password, user.password);

  if(!passed) return res.render('session/change-password', {
    user: req.body,
    error: Messages.fromParams('error', 600)
  });

  if (password == new_password) return res.render('session/change-password', {
    user: req.body,
    error: Messages.fromParams('error', 604)
  });

  const error = checkForm.Password(new_password, password_repeat);

  if (error) return res.render('session/change-password', {
    user: req.body,
    error
  });

  req.user = user;

  next();

}

async function forgotPassword(req, res, next){
  const {email} = req.body;

  const user = await User.find({ where: {email} });

  if(!user) {
    return res.render('session/forgot-password', {
      user: req.body,
      error: Messages.fromParams('error', 605)
    });
  }

  req.user = user;

  next();
}

async function resetPassword(req, res, next){
  const {email, password, password_repeat, token} = req.body;

  const user = await User.find({ where: {email} });

  if(!user) return res.render('session/reset-password',{
    email: req.body.email,
    token: req.body.token,
    error: Messages.fromParams('error', 602)
  });

  if(token != user.reset_token) return res.render('session/reset-password',{
    email: req.body.email,
    token: req.body.token,
    error: Messages.fromParams('error', 606)
  });

  let now = new Date();
  now = now.setHours(now.getHours());

  if(now > user.reset_token_expires) return res.render('session/reset-password',{
    email: req.body.email,
    token: req.body.token,
    error: Messages.fromParams('error', 607)
  });

  const error = checkForm.Password(password, password_repeat);

  if (passwordError) return res.render('session/reset-password', {
    email: req.body.email,
    token: req.body.token,
    error
  });

  req.user = user;

  next();
}


module.exports = {
  login,
  changePassword,
  forgotPassword,
  resetPassword
}