const express = require ('express');
const nunjucks = require ('nunjucks');

const data = require('./data/data')

const server = express();

server.use(express.static('public'));

server.set('view engine', 'njk');

nunjucks.configure('./views', {
  express:server,
  autoescape: false,
  noCache: true
});

server.get('/', function (req, res){
  return res.render('index', {recipeList: data});
});

server.get('/about', function (req, res){
  return res.render('about');
});

server.get('/recipes', function (req, res){
  return res.render('recipes', {recipeList: data});
});

server.get("/recipes/:index", function (req, res) {
  const recipe = data[req.params.index];

  return res.render('full_recipe', {recipe});
})

server.use(function(req, res) {
  res.status(404).render("error404");
});

server.listen(5000, function() {
  console.log('server is up and running')
});