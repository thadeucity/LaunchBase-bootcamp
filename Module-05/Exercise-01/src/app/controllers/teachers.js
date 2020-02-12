const Teacher = require('../model/Teacher');
const { age, date } = require('../../lib/utils');

module.exports = {
  index(req, res){
    Teacher.all(function(teachers){
      for (teacher of teachers){
        teacher.teaching_area = teacher.teaching_area.split(',');
      }
      return res.render('teachers/index', {teachers});
    });
  },

  show(req, res){
    Teacher.find(req.params.id, function(teacher){
      if (!teacher) res.send("This professor was not found");

      teacher.age = age(teacher.birth);
      teacher.degree = `${teacher.degree_lvl} in ${teacher.degree_area}`;

      if (teacher.place == 'both') {
        teacher.place = ['Online', 'In Person'];
      } else{
        teacher.place = [teacher.place];
      }

      teacher.teaching_area = teacher.teaching_area.split(',');
      teacher.created_at = date(teacher.created_at).format;

      return res.render('teachers/show', { teacher });
    });
  },

  create(req, res) {
    return res.render('teachers/create');
  },

  post(req, res){
    const keys = Object.keys(req.body);

    for (key of keys){
      if(req.body[key] == "") return res.send('Please, fill all fields');
    }

    Teacher.create(req.body, function(teacher){
      return res.redirect(`/teachers/${teacher.id}`);
    });
  },

  edit(req, res){
    Teacher.find(req.params.id, function(teacher){
      if (!teacher) res.send("This professor was not found");
      teacher.birth = date(teacher.birth).iso;
      return res.render('teachers/edit', { teacher });
    });
  },

  put(req, res){
    const keys = Object.keys(req.body);

    for (key of keys){
      if(req.body[key] == "") return res.send('Please, fill all fields');
    }

    Teacher.update(req.body, function(){
      return res.redirect(`/teachers/${req.body.id}`);
    });
  },

  delete(req, res){
    Teacher.delete(req.body.id, function(){
      return res.redirect(`/teachers`);
    });
  }

}