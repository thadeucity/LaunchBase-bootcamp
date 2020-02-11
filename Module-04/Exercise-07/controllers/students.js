const fs = require('fs');
const data = require('../data.json');
const { age, convertDate, date } = require('../utils');

const studentDegrees = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade',
  '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', 'Freshman',
  'Sophomore', 'Junior', 'Senior'];


// Index
exports.index = function (req, res){
  let students = [];
  let student = {};

  for (pupil of data.pupils){
    student = {
      ...pupil
    }
    students.push(student);
  }

  return res.render('students/index', {students});
}

// Show
exports.show = function (req, res){
  const{ id } = req.params;

  const foundStudent = data.pupils.find(function(student){
    return student.id == id;
  });

  if (!foundStudent) return res.send("This pupil was not found");

  let teachPlace = [];

  if (foundStudent.place == 'both'){
    teachPlace = ['Online', 'In Person'];
  } else {
    teachPlace = [foundStudent.place];
  }

  const student = {
    ...foundStudent,
    birthDay: date(foundStudent.birth).birthDay,
    degree: foundStudent.degree_lvl,
    place: teachPlace,
    created_at: convertDate(foundStudent.created_at)
  }

  return res.render('students/show', { student });

}

// Create
exports.create = function (req, res) {
  return res.render('students/create', {studentDegrees});
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
    email,
    birth,
    degree_lvl,
    place,
    load
  } = req.body;

  birth = Date.parse(birth);

  let id = 1;
  const lastStudent = data.pupils[data.pupils.length - 1];

  if (lastStudent){
    id = lastStudent.id + 1;
  }

  data.pupils.push({
    id,
    avatar_url,
    name,
    email,
    birth,
    degree_lvl,
    place,
    load
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
    if (err) return res.send('Write file error!');

    return res.redirect('/students');
  });

}

// Edit
exports.edit = function (req, res){
  const{ id } = req.params;

  const foundStudent = data.pupils.find(function(student){
    return student.id == id;
  });

  if (!foundStudent) return res.send("This pupil was not found");

  let student = {
    ...foundStudent,
    birth: date(foundStudent.birth).iso
  }

  return res.render('students/edit', { student, studentDegrees });
}

// Put
exports.put = function (req, res){
  const { id } = req.body;
  let index = 0;

  const foundStudent = data.pupils.find(function(student, foundIndex){
    if (id == student.id){
      index = foundIndex;
      return true;
    }
  });

  if (!foundStudent) return res.send("This pupil was not found");

  const student = {
    ...foundStudent,
    ...req.body,
    birth: Date.parse(req.body.birth)
  }

  data.pupils[index] = student;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write error");

    return res.redirect(`/students/${id}`)
  });
}

// Delete
exports.delete = function (req, res){
  const { id } = req.body;

  const filteredStudents = data.pupils.filter(function(student){
    return student.id != id;
  });

  data.pupils = filteredStudents;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if (err) return res.send("Error writing file");

    return res.redirect("/students");
  });
}