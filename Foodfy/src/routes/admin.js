const express = require ('express');
const routes = express.Router();

const ProfileController = require('../app/controllers/ProfileController');
const UserValidator = require('../app/validators/user');

const { userVerified, usersOnly } = require('../app/middlewares/session');

const users = require('./users');
const session = require('./session');
const recipes = require('./admin-recipes');
const chefs = require('./admin-chefs');

////////////////////////////   SESSION   ////////////////////////////

routes.use('/', session);

////////////////////////////   PROFILE   ////////////////////////////

routes.get('/', (req,res) => res.redirect('/admin/profile'));

routes.get('/profile', usersOnly, ProfileController.index);
routes.put('/profile', usersOnly, UserValidator.putProfile, ProfileController.put);

/////////////////////////////   CHEFS   /////////////////////////////

routes.use('/', userVerified, chefs);

////////////////////////////   RECIPES   ////////////////////////////

routes.use('/', userVerified, recipes);

////////////////////////////    USERS    ////////////////////////////

routes.use('/users', userVerified, users);

///////////////////////    UNKNOWN ERRORS    ////////////////////////
routes.use(function(error, req, res, next) {
  return res.render('admin_layout', {
    error: 'An unexpected error occurred, sorry for the inconvenience!'
  });
});

module.exports = routes;