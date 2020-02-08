const fs = require('fs');
const data = require('./data.json');
const { age, convertDate, date } = require('./utils');

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

exports.edit = function (req, res){
  const{ id } = req.params;

  const foundTeacher = data.professors.find(function(teacher){
    return teacher.id == id;
  });

  if (!foundTeacher) return res.send("This professor was not found");

  let teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth)
  }

  return res.render('teachers/edit', { teacher });
}

