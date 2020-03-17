function createChef(req, res, next){
  const keys = Object.keys(req.body);
  for (key of keys){
    if(req.body[key] == ""){
      let error = 'Please fill all fields';
      return res.redirect(`/admin/chefs/create?error=${error}`);
    }
  }

  if(req.files.length == 0){
    return res.send('Please, send at least one image for the Avatar')
  } else if(req.files.length > 1){
    return res.send('Please, send only one photo for the Avatar')
  }
  next();
}

function updateChef(req, res, next){
  const keys = Object.keys(req.body);
  for (key of keys){
    if(req.body[key] == ""){
      let error = 'Please fill all fields';
      return res.redirect(`/admin/chefs/${req.body.id}/edit?error=${error}`);
    }
  }

  if (req.files){
    if(req.files.length > 1){
      let error = 'Please send only one photo';
      return res.redirect(`/admin/chefs/${req.body.id}/edit?error=${error}`);
    }
  }
  next();
}


module.exports = {
  createChef,
  updateChef
}