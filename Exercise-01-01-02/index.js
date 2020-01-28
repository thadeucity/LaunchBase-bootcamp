const USERS = [
  { 
    nome: 'Silvana',
    sexo: 'F',
    idade: 48,
    contribuicao: 23,
    profissao: 'engenharia'   
  },{ 
    nome: 'Victor',
    sexo: 'M',
    idade: 28,
    contribuicao: 2,
    profissao: 'programador'  
  },{ 
    nome: 'Roberta',
    sexo: 'F',
    idade: 58,
    contribuicao: 26,
    profissao: 'professor' 
  }
];

console.log('');

for (user of USERS) {

  let contribuicaoMinima = 0;
  let regraSoma = 0;
  
  let somaAposentadoria = user.idade + user.contribuicao; 

  if (user.profissao == 'professor'){
    contribuicaoMinima = 25;
    if (user.sexo == 'M'){
      regraSoma = 85;
    } else  {
      regraSoma = 82;
    }
  } else if (user.profissao == 'militar'){
    contribuicaoMinima = 35;
    regraSoma = 85;
  } else if (user.profissao == 'policial'){
    if (user.sexo == 'M'){
      contribuicaoMinima = 30;
      regraSoma = 85;
    } else  {
      contribuicaoMinima = 25;
      regraSoma = 80;
    }
  } else {
    if (user.sexo == 'M'){
      contribuicaoMinima = 35;
      regraSoma = 95;
    } else  {
      contribuicaoMinima = 30;
      regraSoma = 85;
    }
  }

  if (user.contribuicao > contribuicaoMinima){
    if (somaAposentadoria > regraSoma) {
      console.log (`Parabéns ${user.nome}, você já pode ser aposentar`)
    } else {
      let idadeAposent = regraSoma - somaAposentadoria + user.idade;
      console.log (
        `${user.nome}, apesar de você já ter contribuído o tempo ` +
        `mínimo, você só poderá se aposentar com ${idadeAposent} anos`
      );
    }
  } else{
    let tempoParaAposent;    
    let tempoParaMinima = contribuicaoMinima - user.contribuicao;

    if ((tempoParaMinima*2)+user.idade+user.contribuicao >= regraSoma){
      tempoParaAposent = tempoParaMinima;
    } else {
      tempoParaAposent =  
        (regraSoma - user.idade - user.contribuicao)/2;
    }
    console.log (
      `${user.nome}, ainda faltam ${tempoParaAposent}` +
      ` anos para você se aposentar`
    );
  }
  console.log('');
}