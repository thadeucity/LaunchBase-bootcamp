const express = require ('express');
const routes = express.Router();

const multer = require ('../app/middlewares/multerChefs');

const ChefController = require('../app/controllers/ChefController');

const { adminOnly } = require('../app/middlewares/session');

routes.get('/chefs', ChefController.adminChefs);
routes.get('/chefs/create', adminOnly, ChefController.create);
routes.get('/chefs/:id', ChefController.adminShow);
routes.get('/chefs/:id/edit', adminOnly, ChefController.edit);

routes.post('/chefs', 
adminOnly,
multer.array("avatar", 1), 
ChefController.post
);

routes.put('/chefs', 
adminOnly, 
multer.array("avatar", 1), 
ChefController.put
);

module.exports = routes;