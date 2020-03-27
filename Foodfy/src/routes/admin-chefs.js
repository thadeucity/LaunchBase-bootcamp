const express = require ('express');
const routes = express.Router();

const multer = require ('../app/middlewares/multerChefs');

const { adminOnly } = require('../app/middlewares/session');

const ChefController = require('../app/controllers/ChefController');

const ChefValidator = require('../app/validators/chefs');

routes.get('/chefs', ChefController.adminChefs);
routes.get('/chefs/create', adminOnly, ChefController.create);
routes.get('/chefs/:id', ChefController.adminShow);
routes.get('/chefs/:id/edit', adminOnly, ChefController.edit);

routes.post('/chefs', 
  adminOnly,
  multer.array("avatar", 1), 
  ChefValidator.createChef,
  ChefController.post
);

routes.put('/chefs', 
  adminOnly, 
  multer.array("avatar", 1), 
  ChefValidator.updateChef,
  ChefController.put
);

routes.delete('/chefs',
  adminOnly,
  ChefValidator.deleteChef,
  ChefController.delete
);

module.exports = routes;