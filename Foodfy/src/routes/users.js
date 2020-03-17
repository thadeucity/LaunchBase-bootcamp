const express = require ('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController');
const UserValidator = require('../app/validators/user');

const { adminOnly } = require('../app/middlewares/session');

//////////    USERS    //////////

routes.get('/', UserController.list);
routes.get('/create', adminOnly, UserController.createForm);
routes.get('/:id/edit', adminOnly, UserController.editForm);

routes.post('/', adminOnly, UserValidator.post, UserController.post);
routes.put('/', adminOnly, UserController.put);
routes.delete('/', adminOnly, UserController.delete);

module.exports = routes;