module.exports={
  loginForm(req, res){
    return res.render('session/login');
  },
  login(req,res){
    req.session.userId = req.user.id;
    req.session.admin = req.user.is_admin;
    req.session.verified = req.user.verified;

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
  resetPasswordForm(req,res){
    return res.render('session/reset-password', {
      email: req.query.email,
      token: req.query.token
    });
  },
  resetPassword(req,res){
    return res.send(req.body);
  }
}