const Messages = require ('../../lib/messages');

const checkForm = require('../services/checkForm');

const User = require ('../models/User');
const { compare } = require('bcryptjs');

//////////////////  EXPORTABLE FUNCTIONS  //////////////////

async function createUser(req,res,next){
  const {name, email} = req.body;
  const baseError = 'Unable to save user! ';

  // Check if the Form is complete
  let error = checkForm.allFields(req.body, req.files);
  if (error){
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + error
    });
  }

  error = await checkForm.name(name, null, null, 'user');
  if (error) {
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + error
    });
  }

  error = await checkForm.email(email);
  if (error) {
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + error
    });
  }

  next();
}

async function editUser(req,res,next){
  const {name, email, id} = req.body;
  const baseError = 'Unable to update user! ';

  // Check if the Form is complete
  let error = checkForm.allFields(req.body, req.files);
  if (error){
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + error
    });
  }

  error = await checkForm.name(name, null, id, 'user');
  if (error) {
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + error
    });
  }

  error = await checkForm.email(email, id);
  if (error) {
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + error
    });
  }

  next();
}

async function putProfile (req,res,next){
  const {name, email, password} = req.body,
        id = req.session.userId,
        baseError = 'Unable to update your profile! ';

  let error = checkForm.allFields(req.body, req.files);
  if (error){
    return res.render("admin/users/profile", {
      user: req.body,
      error: baseError + error
    });
  }

  error = await checkForm.name(name, null, id, 'user');
  if (error) {
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + error
    });
  }

  error = await checkForm.email(email, id);
  if (error) {
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + error
    });
  }

  const user = await User.findOne(id);

  const passed = await compare(password, user.password);

  if (!passed){
    error = Messages.fromParams('error', 600); // Wrong password
    return res.render("admin/users/profile", {
      user: req.body,
      error: baseError + error
    });
  }

  req.user = user;

  next();
}

async function deleteUser (req,res,next){
  const id = req.body.id,
        baseError = 'Unable to delete User! ';
  
  if (req.session.userId == id){
    return res.render("admin/users/index", {
      user: req.body,
      error: baseError + Messages.fromParams('error', 306) // cannot delete yourself
    });
  }

  next();
}

module.exports = {
  createUser,
  editUser,
  putProfile,
  deleteUser
}