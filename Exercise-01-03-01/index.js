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

for (let i = 0; i < users.length; i++){
  let techList = '';
  if (users[i].techs.length === 1){
    techList = users[i].techs[0];
  } else if (users[i].techs.length > 4){
    techList = users[i].techs.slice(0,4).join(', ');
    techList += ' e outras';
  } else{
    techList = users[i].techs.slice(0,(users[i].techs.length-1)).join(', ');
    techList += ' e ';
    techList += users[i].techs[users[i].techs.length-1];
  }
  console.log(`${users[i].name} trabalha com ${techList}`)
}
