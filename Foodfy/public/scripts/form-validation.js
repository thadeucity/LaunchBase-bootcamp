var commonPasswords = [
  '123456','123456789','qwerty','password','111111','12345678','abc123',
  '1234567','password1','12345','abcdef','abcdefg','123abc','senha','senha1'
];

const Validate = {
  apply(input, func, severity){
    setTimeout(function(){
      let results = Validate[func](input.value);
      Validate.clearErrors(input);

      if (results.error) Validate.markField(input);
      if (results.error && severity) Validate.displayError(input, results.error);
    },10);
  },
  markField(input){
    input.parentNode.classList.add('not-passed'); 
  },
  displayError(input, error){
    const div = document.createElement('div');
    div.classList.add('field-error');
    div.innerHTML = error;
    input.parentNode.appendChild(div);
  },
  clearErrors(input){
    const errorDiv = input.parentNode.querySelector('.field-error');
    if (errorDiv) errorDiv.remove();
    input.parentNode.classList.remove('not-passed'); 
  },
  isName(value){
    let error = null;
    const namePattern = /^[a-z]+(([',. -][a-z ])?[a-z ]*)*$/ig;
    let trimmed = value.replace(/\s/g,'');
    if(trimmed.length<4) error = 'The name should be at least 3 characters long';
    if(!namePattern.test(value)) {
      error = 'The name cannot have special characters or numbers';
    } 
    return {
      error,
      value
    };
  },
  isEmail(value){
    let error = null;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) error = 'Invalid Email';

    return {
      error,
      value
    };
  },
  isPasswordSafe(value){
    let error = null;
    const passwordRegex = /^(?=[0-9a-zA-Z#@\$\?]{4,}$)(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).*/;
    if (value.length<4){
      error = 'Your password should be at least 4 characters long';
    }else if (commonPasswords.indexOf(value) >=0 ) {
      error = 'This password is too weak!';
    } else if(!passwordRegex.test(value)){
      error = 'Use at least one letter and one number!';
    }

    return {
      error,
      value
    };
  }
}

