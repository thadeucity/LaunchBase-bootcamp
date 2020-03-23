const Messages = require ('../../lib/messages');

const Chef = require('../models/Chef');
const User = require('../models/User');

const { unlinkSync } = require('fs');

function deleteFiles(files){
  try {
    files.map(file => unlinkSync(file.path));
    return;  

  } catch (err) {
    console.error(err);
  }
}

function allFields (body, files){
  try {
    const keys = Object.keys(body);
    for (key of keys){
      const exceptions = (
        key == "removed_files" ||
        key == "information"
      );

      if(body[key] == "" && !exceptions){
        deleteFiles(files);
        return Messages.fromParams('error' , 100);
      } 
    }
    return;
    
  } catch (err) {
    console.error(err);
  }
}

function avatar (files, create){
  try {
    if (create){
      if(files.length == 0){
        return Messages.fromParams('error' , 101);
      }  
    }
  
    if(files.length > 1){
      deleteFiles(files);
      return Messages.fromParams('error' , 102);
    }
    return;
    
  } catch (err) {
    console.error(err);
  }
}

function images (files, create){
  try {
    if (create){
      if(files.length == 0){
        return Messages.fromParams('error' , 201);
      }  
    }
  
    if(files.length > 5){
      deleteFiles(files);
      return Messages.fromParams('error' , 202, 5);
    }
    return;
    
  } catch (err) {
    console.error(err);
  }
}

async function name (name, files, id, type){
  try {
    name = name.replace(/(')/g, `''`);

    // Check if another user or chef have already taken the chosen name
    let results = null;
    let error = 999;

    if (type == 'chef') {
      error = 103;
      results = await Chef.find({where: {name}});
    }
    
    if (type == 'user') {
      error = 301;
      results = await User.find({where: {name}});
    }
    
     if(results && results.id != id){
       if(files) deleteFiles(files);
       return Messages.fromParams('error', error, name);
     }

    // Check if it is a valid name
    const trimmed = name.replace(/\s/g,'');
    if(trimmed.length<3){
      return Messages.fromParams('error', 302);
    }

    return;
  
  } catch (err) {
    console.error(err);
  }
}

async function email (email, id){
  try {
    const mailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email.match(mailPattern)) {
      return Messages.fromParams('error', 304);
    }

    const user = await User.find({ where: { email }});

    if(user && user.id != id){
      return Messages.fromParams('error', 305);
    }

    return;

  } catch (err) {
    console.error(err);
  }
  
}

function password(value, repeat_value){
  const commonPasswords = [
    '123456','123456789','qwerty','password','111111','12345678','abc123',
    '1234567','password1','12345','abcdef','abcdefg','123abc','senha','senha1',
    '1234', '1q2w', '1111','2222', '1122', 'senha', 'senha1', 'senha123'
  ];

  const passwordRegex = /^(?=[0-9a-zA-Z#@\$\?]{4,}$)(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).*/;
  
  if (value.length<4){
    return Messages.fromParams('error', 307);

  }else if (commonPasswords.indexOf(value) >=0 ) {
    return Messages.fromParams('error', 308);

  } else if(!passwordRegex.test(value)){
    return Messages.fromParams('error', 309);

  } else if (value != repeat_value){
    return Messages.fromParams('error', 310);

  }

  return;
}

module.exports = {
  allFields,
  avatar,
  images,
  name,
  email,
  password
}