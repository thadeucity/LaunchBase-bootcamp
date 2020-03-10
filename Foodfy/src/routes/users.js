const express = require ('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController');
const ProfileController = require('../app/controllers/ProfileController');

const UserValidator = require('../app/validators/user');

const { adminOnly } = require('../app/middlewares/session');


routes.get('/', UserController.listUsers);
routes.get('/create', adminOnly, UserController.createForm);
routes.get('/edit', adminOnly, UserController.editForm);

routes.post('/', adminOnly, UserValidator.post, UserController.createUser);
routes.put('/', adminOnly, UserController.updateUser);
routes.delete('/', adminOnly, UserController.deleteUser);


//////////    PROFILE    //////////

routes.get('/profile', ProfileController.profile);
routes.put('/profile', ProfileController.updateProfile);

module.exports = routes;