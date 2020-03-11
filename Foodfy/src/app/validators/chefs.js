function createChef(req, res, next){
  const keys = Object.keys(req.body);
  for (key of keys){
    if(req.body[key] == ""){
      return res.send('Please, fill all fields');
    }
  }

  if(req.files.length == 0){
    return res.send('Please, send at least one image for the Avatar')
  } else if(req.files.length > 1){
    return res.send('Please, send only one photo for the Avatar')
  }
}

module.exports = {
  createChef
}