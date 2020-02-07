const express = require ('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(routes);

server.set('view engine', 'njk');

nunjucks.configure('./views', {
  express:server,
  autoescape: false,
  noCache: true
});

server.listen(5000, function() {
  console.log('server is up and running')
});


//npm init -y
//npm install express
//npm install -D nodemon
//npm install nunjucks
//npm install browser-sync npm-run-all -D