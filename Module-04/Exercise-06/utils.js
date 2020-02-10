const Intl = require ('intl');

module.exports = {
  age: function (timestamp) {
    const today = new Date();
    const birth = new Date(timestamp);

    let age = today.getUTCFullYear() - birth.getUTCFullYear();
    
    if (
      today.getUTCMonth() < birth.getUTCMonth() ||
        today.getUTCMonth() == birth.getUTCMonth() &&
        today.getUTCDate() < birth.getUTCDate()
      ){
      age--;
    }

    return age;
  },
  convertDate: function (timestamp) {
    return (new Intl.DateTimeFormat('pt-BR').format(timestamp));
  },
  date: function (timestamp){
    const birth = new Date(timestamp);

    const year = birth.getUTCFullYear();
    const month = `0${birth.getUTCMonth()}`.slice(-2);
    const day = `0${birth.getUTCDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  }
}