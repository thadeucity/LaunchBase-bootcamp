function usersOnly(req, res, next){
  // if(!req.session.userId) return res.redirect('/admin/login');

  next();
}

function adminOnly(req, res, next){
  // if(!req.session.admin){
  //   return res.render(`admin_layout`, {
  //     error: `Sorry, only Admins can acess this area`
  //   });
  // }
  next();
}

function userVerified(req, res, next){
  // if(!req.session.userId) return res.redirect('/admin/login');
  // if(!req.session.verified) return res.redirect('/admin/change-password');

  next();

}

module.exports = {
  usersOnly,
  adminOnly,
  userVerified
};