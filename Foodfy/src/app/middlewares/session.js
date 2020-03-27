const Recipe = require('../models/Recipe');

function usersOnly(req, res, next){
  if (!req.session.userId) return res.redirect('/admin/login');
  next();
}

function userVerified(req, res, next){
  if (!req.session.userId) return res.redirect('/admin/login');
  if (!req.session.verified) return res.redirect('/admin/change-password');
  next();
}

function adminOnly(req, res, next){     /////////////////////////////////////////////////// MUDAR REDIRECT DE ADMIN
  if (!req.session.userId) return res.redirect('/admin/login');
  if (!req.session.verified) return res.redirect('/admin/change-password');
  if (!req.session.admin) return res.render('admin_layout', {
    error: `Sorry, only Admins can acess this area`
  });
  next();
}

function userRestricted(req, res, next){
  const recipe = Recipe.findOne(req.params.id);
  if ( !req.session.admin || req.session.userId != recipe.user_id ){
    let error = 203; // Only admins or the user that created the recipe ...
    return res.redirect(`/admin/recipes/${req.params.id}?error=${error}`);
  }
  next();
}

module.exports = {
  usersOnly,
  adminOnly,
  userVerified,
  userRestricted
};