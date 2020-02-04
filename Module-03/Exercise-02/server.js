const express = require ('express');
const nunjucks = require ('nunjucks');

const menuItems = require('./data/menu-items');
const coursesList = require('./data/courses');

const server = express();

server.use(express.static('public'));

server.set('view engine', 'njk');

nunjucks.configure('./views', {
  express:server,
  autoescape: false,
  noCache: true
});

server.get('/', function(req, res){
  return res.render('about', {menuItems});
});

server.get('/contents', function(req, res){
  return res.render('contents', {menuItems, coursesList});
});

server.get("/courses/:id", function(req, res) {
  const id = req.params.id;

  const course = coursesList.find(function(course){
    return course.name == id;
  });

  if (!course) {
    return res.status(404).render("error404", {menuItems});
  }

  return res.render('course', {menuItems, course});
});


server.use(function(req, res) {
  res.status(404).render("error404", {menuItems});
});

server.listen(5000, function() {
  console.log('server is up and running')
});