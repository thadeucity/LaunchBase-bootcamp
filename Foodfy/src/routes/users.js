const express = require ('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController');
const UserValidator = require('../app/validators/user');

const { adminOnly } = require('../app/middlewares/session');

//////////    USERS    //////////

routes.get('/', UserController.list);
routes.get('/create', adminOnly, UserController.createForm);
routes.get('/:id/edit', adminOnly, UserController.editForm);

routes.post('/', adminOnly, UserValidator.createUser, UserController.post);
routes.put('/', adminOnly, UserValidator.editUser, UserController.put);
routes.delete('/', adminOnly, UserValidator.deleteUser, UserController.delete);

module.exports = routes;