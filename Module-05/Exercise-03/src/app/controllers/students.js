const Student = require('../model/Student');
const { date } = require('../../lib/utils');

var studentDegrees = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', 
  '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', 'Freshman', 
  'Sophomore', 'Junior', 'Senior'];

module.exports = {
  index(req, res){
    Student.all(function(students){
      return res.render('students/index', {students});
    });
  },

  show(req, res){
    Student.find(req.params.id, function(student){
      if (!student) res.send("This student was not found");

      student.birthDay = date(student.birth).birthDay;
      student.degree = student.degree_lvl;

      if (student.place == 'both') {
        student.place = ['Online', 'In Person'];
      } else{
        student.place = [student.place];
      }

      return res.render('students/show', { student });
    });
  },

  create(req, res) {
    Student.teacherSelectOptions(function(list){
      return res.render('students/create', {studentDegrees, teachers_list: list});
    });
    
  },

  post(req, res){
    const keys = Object.keys(req.body);

    for (key of keys){
      if(req.body[key] == "") return res.send('Please, fill all fields');
    }

    Student.create(req.body, function(student){
      return res.redirect(`/students/${student.id}`);
    });
  },

  edit(req, res){
    Student.find(req.params.id, function(student){
      if (!student) res.send("This student was not found");
      student.birth = date(student.birth).iso;
      Student.teacherSelectOptions(function(list){
        return res.render('students/edit', { student, studentDegrees,  teachers_list: list});
      });
    });
  },

  put(req, res){
    const keys = Object.keys(req.body);

    for (key of keys){
      if(req.body[key] == "") return res.send('Please, fill all fields');
    }

    Student.update(req.body, function(){
      return res.redirect(`/students/${req.body.id}`);
    });
  },

  delete(req, res){
    Student.delete(req.body.id, function(){
      return res.redirect(`/students`);
    });
  }

}