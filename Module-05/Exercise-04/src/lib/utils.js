const Intl = require ('intl');

module.exports = {
  age(timestamp) {
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
  date(timestamp){
    const birth = new Date(timestamp);

    const year = birth.getUTCFullYear();
    const month = `0${birth.getUTCMonth()+1}`.slice(-2);
    const day = `0${birth.getUTCDate()}`.slice(-2);

    return {
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`,
      format: `${day}/${month}/${year}`,
      day,
      month,
      year
    }
  }
}
