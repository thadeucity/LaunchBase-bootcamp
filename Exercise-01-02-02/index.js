const programadores = [
  {
    nome: 'Carlos',
    idade: 32,
    tecnologias: [
      {
        nome: 'C++',
        especialidade: 'Desktop'
      },{
        nome: 'Python',
        especialidade: 'Data Science'
      },{
        nome: 'JavaScript',
        especialidade: 'Web/Mobile'
      }
    ]
  },{
    nome: 'Victor',
    idade: 28,
    tecnologias: [
      {
        nome: 'JavaScript',
        especialidade: 'Web/Mobile'
      },{
        nome: 'Java',
        especialidade: 'Desktop'
      },{
        nome: 'React',
        especialidade: 'Web/Mobile'
      }
    ]   
  }
];

console.log('');


for (programador of programadores){
  console.log(
    `O usuário ${programador.nome} tem ${programador.idade} anos e usa a ` +
    `tecnologia ${programador.tecnologias[0].nome} ` +
    `com especialidade em ${programador.tecnologias[0].especialidade}`
  );
  console.log('');
}