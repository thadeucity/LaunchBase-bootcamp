function errorMsg (code, data){
  let message = ``; 
  switch (code) {
    case 100:
      message = '    Please fill all fields!    ';
      break;

    case 101:
      message = 'Please, send one photo for the Chef!';
      break;

    case 102:
      message = 'Please, send only one photo for the Chef!';
      break;

    case 103:
      message = `There is already another Chef called ${data} registered in the database!`
      break;

    case 201:
      message = 'Please upload at least one photo for the Recipe!';
      break;

    case 202:
      message = `Please upload less than ${data} photos for the Recipe!`;
      break;

    case 203:
      message = `Only admins or the user that created the recipe can edit or delete it!`;
      break;

    case 300:
      message = 'Foodfy is the system standart chef and cannot be edited or deleted!';
      break;

    case 301:
      message = `There is already another User called ${data} registered in the database!`; 
      break;

    case 302:
      message = 'The name should be at least 3 characters long!';  
      break;

    case 303:
      message = 'The name cannot have special characters or numbers!';  
      break;

    case 304:
      message = 'You entered an invalid Email!';
      break;

    case 305:
      message = 'There is already another User using the entered e-mail!';
      break;

    case 306:
      message = 'You cannot delete yourself!';
      break;

    case 307:
      message = 'The new password should be at least 4 characters long!';
      break;

    case 308:
      message = 'The new password is too weak!';
      break;

    case 309:
      message = 'Use at least one letter and one number in your new password!';
      break;

    case 310:
      message = `The New Password and Repeat New Password fields doesn't match!`;
      break;

    case 600:
      message = 'Wrong Password!';
      break;

    case 601:
      message = 'User not registered!'
      break;

    case 602:
      message = 'Wrong e-mail!';
      break;

    case 603:
      message = `This email doesn't match with your account e-mail!`;
      break;

    case 604:
      message = 'Unfortunately you cannot use the same password again';
      break;

    case 605:
      message = 'Email not registered';
      break;

    case 606:
      message = 'Invalid token! Request a new password recovery';
      break;

    case 607:
      message = 'Expired Token! Request a new password recovery';
      break;
      
    default:
      message = 'An unknown error occoured!'
      break;
  }
  return message;
}

function successMsg (code, data){
  let message = ``; 
  switch (code) {
    case 200:
      message = 'Your profile was successfuly updated';
      break;

      default:
        break;
  }
  return message;
}

function alertMsg (code, data){

}

function fromQuery(query, data){
  let results = {};
  const {success, alert, error } = query;

  if (success) results.success = successMsg(parseInt(success), data);
  if (alert) results.alert = alertMsg(parseInt(alert), data);
  if (error) results.error = errorMsg(parseInt(error), data);

  return results;
}

function fromParams(type, code, data){
  let message = ``;
  switch (type) {
    case 'success':
      message = successMsg(code, data);
      break;
    case 'alert':
      message = alertMsg(code, data);
      break;
    case 'error':
      message = errorMsg(code, data);
      break;
    default:
      break;
  }

  return message;
}

module.exports = {
fromQuery,
fromParams,
}