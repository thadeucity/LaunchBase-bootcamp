const fs = require('fs');
const data = require('../data.json');
const { age, convertDate, date } = require('../utils');


// Index
exports.index = function (req, res){
  let teachers = [];
  let teacher = {};

  for (professor of data.professors){
    teacher = {
      ...professor,
      teaching_area: professor.teaching_area.split(',')
    }
    teachers.push(teacher);
  }

  return res.render('teachers/index', {teachers});
}

// Show
exports.show = function (req, res){
  const{ id } = req.params;

  const foundTeacher = data.professors.find(function(teacher){
    return teacher.id == id;
  });

  if (!foundTeacher) return res.send("This professor was not found");

  let teachPlace = [];

  if (foundTeacher.place == 'both'){
    teachPlace = ['Online', 'In Person'];
  } else {
    teachPlace = [foundTeacher.place];
  }

  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    degree: `${foundTeacher.degree_lvl} in ${foundTeacher.degree_area}`,
    place: teachPlace,
    teaching_area: foundTeacher.teaching_area.split(','),
    created_at: convertDate(foundTeacher.created_at)
  }

  return res.render('teachers/show', { teacher });

}

// Create
exports.create = function (req, res) {
  return res.render('teachers/create');
}

// Post
exports.post = function (req, res){

  const keys = Object.keys(req.body);

  
  for (key of keys){
    if(req.body[key] == ""){
      return res.send('Please, fill all fields');
    }
  }

  let {
    avatar_url,
    name,
    birth,
    degree_lvl,
    degree_area,
    place,
    teaching_area
  } = req.body;

  birth = Date.parse(birth);
  const created_at = Date.now();
  const id = Number(data.professors.length) + 1;

  data.professors.push({
    id,
    avatar_url,
    name,
    degree_lvl,
    degree_area,
    place,
    teaching_area,
    birth,
    created_at
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
    if (err) return res.send('Write file error!');

    return res.redirect('/teachers');
  });

}

// Edit
exports.edit = function (req, res){
  const{ id } = req.params;

  const foundTeacher = data.professors.find(function(teacher){
    return teacher.id == id;
  });

  if (!foundTeacher) return res.send("This professor was not found");

  let teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth).iso
  }

  return res.render('teachers/edit', { teacher });
}

// Put
exports.put = function (req, res){
  const { id } = req.body;
  let index = 0;

  const foundTeacher = data.professors.find(function(teacher, foundIndex){
    if (id == teacher.id){
      index = foundIndex;
      return true;
    }
  });

  if (!foundTeacher) return res.send("This professor was not found");

  const teacher = {
    ...foundTeacher,
    ...req.body,
    birth: Date.parse(req.body.birth)
  }

  data.professors[index] = teacher;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write error");

    return res.redirect(`/teachers/${id}`)
  });
}

// Delete
exports.delete = function (req, res){
  const { id } = req.body;

  const filteredTeachers = data.professors.filter(function(teacher){
    return teacher.id != id;
  });

  data.professors = filteredTeachers;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if (err) return res.send("Error writing file");

    return res.redirect("/teachers");
  });
}