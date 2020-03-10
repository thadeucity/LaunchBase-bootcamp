const express = require ('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController');
const ProfileController = require('../app/controllers/ProfileController');

const UserValidator = require('../app/validators/user');


routes.get('/', UserController.listUsers);
routes.get('/create', UserController.createForm);
routes.get('/edit', UserController.editForm);

routes.post('/', UserValidator.post, UserController.createUser);
routes.put('/', UserController.updateUser);
routes.delete('/', UserController.deleteUser);


//////////    PROFILE    //////////

routes.get('/profile', ProfileController.profile);
routes.put('/profile', ProfileController.updateProfile);

module.exports = routes;