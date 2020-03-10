function usersOnly(req, res, next){

  if(!req.session.userId) return res.redirect('/admin/login');

  next();
}

function userVerified(req, res, next){
  
  if(!req.session.userId) return res.redirect('/admin/login');
  if(!req.session.verified) return res.redirect('/admin/change-password');

  next();

}

module.exports = {
  usersOnly,
  userVerified
};