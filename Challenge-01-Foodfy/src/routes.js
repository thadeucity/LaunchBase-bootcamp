const express = require ('express');
const routes = express.Router();
const recipes = require('./app/controllers/recipes');
const viewer = require('./app/controllers/viewer');
const chefs = require('./app/controllers/chefs');

routes.get('/', viewer.index);
routes.get('/about', viewer.about);
routes.get('/recipes', viewer.recipes);
routes.get("/recipes/:index", viewer.showRecipe);

routes.get("/admin", recipes.initial); // Mostrar a lista de receitas
routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:index", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:index/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.get("/admin/chefs", chefs.index); // Mostrar a lista de receitas

routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes", recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

routes.use(viewer.notFound);

module.exports = routes;