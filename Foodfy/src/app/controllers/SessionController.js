module.exports={
  login(req, res){
    res.render('session/login');
  },
  resetPasswordForm(req,res){
    res.render('session/reset-password');
  }
}