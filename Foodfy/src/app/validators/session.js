const User = require ('../model/User');

const { compare } = require('bcryptjs');

function passwordValidation(value, repeat_value){
  const commonPasswords = [
    '123456','123456789','qwerty','password','111111','12345678','abc123',
    '1234567','password1','12345','abcdef','abcdefg','123abc','senha','senha1'
  ];

  let error = null;
  const passwordRegex = /^(?=[0-9a-zA-Z#@\$\?]{4,}$)(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).*/;
  if (value.length<4){
    error = 'The new password should be at least 4 characters long';
  }else if (commonPasswords.indexOf(value) >=0 ) {
    error = 'The new password is too weak!';
  } else if(!passwordRegex.test(value)){
    error = 'Use at least one letter and one number in your new password!';
  } else if (value != repeat_value){
    error = `The New Password and Repeat New Password fields doesn't match`;
  }

  return error;
}

async function login(req,res,next){
  const { email, password } = req.body;

  const user = await User.findOne({ where: {email} });

  if(!user) return res.render('session/login', {
    user: req.body,
    error: 'User not registered'
  });

  const passed = await compare(password, user.password);

  if(!passed) return res.render('session/login', {
    user: req.body,
    error: 'Wrong password!'
  });

  req.user = user;

  next();
}

async function changePassword(req, res, next){
  const {email, password, new_password, password_repeat} = req.body;

  const user = await User.findOne({ where: {email} });

  if(!user) return res.render('session/change-password',{
    user: req.body,
    error: 'Wrong e-mail'
  });

  if(user.id != req.session.userId) return res.render('session/change-password',{
    user: req.body,
    error: 'The required email does not match with your account e-mail'
  });

  const passed = await compare(password, user.password);

  if(!passed) return res.render('session/change-password', {
    user: req.body,
    error: 'Wrong password!'
  });

  if (password == new_password) return res.render('session/change-password', {
    user: req.body,
    error: 'You cannot use the same password again'
  });

  passwordError = passwordValidation(new_password, password_repeat);

  if (passwordError) return res.render('session/change-password', {
    user: req.body,
    error: passwordError
  });

  req.user = user;

  next();

}

async function forgotPassword(req, res, next){
  const {email} = req.body;

  const user = await User.findOne({ where: {email} });

  if(!user) {
    return res.render('session/forgot-password', {
      user: req.body,
      error: 'Email not registered'
    });
  }

  req.user = user;

  next();
}

async function resetPassword(req, res, next){
  const {email, password, password_repeat, token} = req.body;

  const user = await User.findOne({ where: {email} });

  if(!user) return res.render('session/reset-password',{
    user: req.body,
    error: 'Wrong e-mail'
  });

  if(token != user.reset_token) return res.render('session/reset-password',{
    user: req.body,
    error: 'Invalid token! Request a new password recovery'
  });

  let now = new Date();
  now = now.setHours(now.getHours());

  if(now > user.reset_token_expires) return res.render('session/reset-password',{
    user: req.body,
    error: 'Expired Token! Request a new password recovery'
  });

  passwordError = passwordValidation(password, password_repeat);

  if (passwordError) return res.render('session/reset-password', {
    user: req.body,
    error: passwordError
  });

  req.user = user;

  next();
}

async function userMatch (req, res, next){
  
}


module.exports = {
  login,
  changePassword,
  forgotPassword,
  resetPassword
}