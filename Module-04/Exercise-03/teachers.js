const fs = require('fs');
const data = require('./data.json');

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