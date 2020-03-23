const checkForm = require('../services/checkForm');

const { unlinkSync } = require('fs');

const errorPage = 'admin/errors/invalid-form';

async function createChef(req, res, next){
  try {
    let error = checkForm.avatar(req.files, true);
    if (error) return res.render('admin/chefs/create', {
      chef: req.body,
      error
    });

    error = checkForm.allFields(req.body, req.files);
    if (error) return res.render(errorPage, {error});
  
    error = await checkForm.name(req.body.name, req.files, null, 'chef');
    if (error) return res.render(errorPage, {error});
  
    next();   
  } catch (err) {
    console.error(err)
  }
}

async function updateChef(req, res, next){
  try {
    if (req.body.id == 1){
      let error = 300 // Foodfy chef cannot be edited or deleted
      req.files.map(file => unlinkSync(file.path));
      return res.redirect(`/admin/chefs/1/edit?error=${error}`);
    }

    let error = checkForm.allFields(req.body, req.files);
    if (error) return res.render(errorPage, {error});
  
    error = checkForm.avatar(req.files);
    if (error) return res.render(errorPage, {error});
  
    error = await checkForm.name(req.body.name, req.files, req.body.id, 'chef');
    if (error) return res.render(errorPage, {error});
  
    next();
    
  } catch (err) {
    console.error(err);
  }

}

function deleteChef(req, res, next){
  try {
    if (req.body.id == 1){
      let error = 300 // Foodfy chef cannot be edited or deleted
      return res.redirect(`/admin/chefs/1/edit?error=${error}`);
    }
  
    next();
  } catch (err) {
    console.error(err);
  }
}


module.exports = {
  createChef,
  updateChef,
  deleteChef
}