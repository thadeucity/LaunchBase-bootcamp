const User = require ('../model/User');
const { compare } = require('bcryptjs');

function checkAllFields(body){
  //check if has all fields
  const keys = Object.keys(body);
  for (key of keys){
    if(body[key] == "") {
      return 'Please fill all fields!';
    }
  }
}

function isEmailValid(value){
  const mailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!value.match(mailPattern)) {
    return 'Invalid Email!';
  }
}

function isNameValid(value){
  const namePattern = /^[a-z]+(([',. -][a-z ])?[a-z ]*)*$/ig;
  const trimmed = value.replace(/\s/g,'');
  if(trimmed.length<4){
    return 'The name should be at least 3 characters long';
  }
  if(!namePattern.test(value)){
    return 'The name cannot have special characters or numbers';
  }
}

async function post(req,res,next){
  const {name, email} = req.body;
  const baseError = 'Unable to save user! ';

  // Check if the Form is complete
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields){
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + fillAllFields
    });
  }

  const user = await User.findOne({
    where: { email }
  });
  if (user) return res.render("admin/users/create", {
    user: req.body,
    error: baseError + 'Someone is already registered with this e-mail'
  });

  //Check if the User entered a valid Username
  const invalidName = isNameValid(name);
  if (invalidName){
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + invalidName
    });
  }

  // Check if the User entered a valid email address
  const invalidEmail = isEmailValid(email);
  if (invalidEmail){
    return res.render("admin/users/create", {
      user: req.body,
      error: baseError + invalidEmail
    });
  }

  next();
}

module.exports = {
  post
}