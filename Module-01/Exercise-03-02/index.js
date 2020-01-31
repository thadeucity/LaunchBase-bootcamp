const users = [
  {
    name: 'Carlos',
    techs: ['HTML', 'CSS']
  },{
    name: 'Victor',
    techs: ['HTML', 'CSS', 'JavaScript', 'Java']
  },{
    name: 'Jasmine',
    techs: ['JavaScript', 'CSS']
  },{
    name: 'Tuane',
    techs: ['HTML', 'Node.js']
  },{
    name: 'Bill',
    techs: ['Node.js', 'React JS', 'React Native', 'HTML', 'CSS', 'Java', 'C#']
  },{
    name: 'Jackson',
    techs: ['Cobol', 'Assembly']
  },{
    name: 'Marcos',
    techs: ['Phyton']
  },
];

function checkIfUserKnowsTech (user, wanted) {

  let found = false;
  for (tech of user.techs){
    if (tech.toUpperCase() === wanted.toUpperCase()){
      found = true;
      break;
    }
  }
  return found;
}

var searchTech = 'CSS';

for (let i=0; i<users.length; i++){
  if (checkIfUserKnowsTech(users[i], searchTech)){
    console.log('');
    console.log(`${users[i].name} trabalha com ${searchTech}`);
  }
}

