const User = require ('../model/User');

const { compare } = require('bcryptjs');

function passwordValidation(value){
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

  if (password_repeat != new_password) return res.render('session/change-password', {
    user: req.body,
    error: `The New Password and Repeat New Password fields doesn't match`
  });

  passwordError = passwordValidation(new_password);

  if (passwordError) return res.render('session/change-password', {
    user: req.body,
    error: passwordError
  });

  next();

}



module.exports = {
  login,
  changePassword
}