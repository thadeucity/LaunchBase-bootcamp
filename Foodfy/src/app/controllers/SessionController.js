const User = require ('../models/User');
const crypto = require('crypto');

const mailer = require('../../config/mailer');
const mailBuilder = require ('../../lib/emailBuilder');


module.exports={
  loginForm(req, res){
    return res.render('session/login');
  },
  login(req,res){
    req.session.userId = req.user.id;
    req.session.admin = req.user.is_admin;
    req.session.verified = req.user.is_verified;

    return res.redirect('/admin');
  },
  logout(req,res){
    req.session.destroy();
    return res.redirect('/admin');
  },
  changePasswordForm(req,res){
    if (!req.session.verified) {
      return res.render('session/change-password', {
        alert: 'Before start using the admin interface, please ' +
          'activate your account by changing your password'
      });
    } else {
      return res.render('session/change-password');
    }
  },
  forgotPasswordForm(req,res){
    return res.render('session/forgot-password');
  },
  async forgotPassword(req, res){
    const user = req.user;

    try{
      const token = crypto.randomBytes(20).toString('hex');

      let tokenExpireDate = new Date();
      tokenExpireDate = tokenExpireDate.setHours(tokenExpireDate.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: tokenExpireDate
      });

      await mailer.sendMail({
        to: user.email,
        from: '"Foodfy" no-reply@foodfy.com.br',
        subject: `Foodfy - Password Reset`,
        text: mailBuilder.resetPasswordEmail({
          name: user.name,
          email: user.email,
          token,
          textOnly: true
        }),
        html: mailBuilder.resetPasswordEmail({
          name: user.name,
          email: user.email,
          token,
        }),
        
      });

    } catch(err){
      return res.render('session/forgot-password', {
        error: `Something went wrong, the system was unable to send the password recovery email, try again later!`
      });
    }

    return res.render('session/forgot-password', {
      success: `The email to recover your password was sent to you, check your mail`
    });
  },
  resetPasswordForm(req,res){
    return res.render('session/reset-password', {
      email: req.query.email,
      token: req.query.token
    });
  }
}