const USERS = [
  { 
    name: 'Carlos',
    weight: 84,
    height: 1.88
  },{ 
    name: 'Victor',
    weight: 85,
    height: 1.73
  },{ 
    name: 'Jonas',
    weight: 55,
    height: 1.77
  }
];


for (user of USERS) {
  let imc = imcCalculator(user.height, user.weight);

  console.log (`O IMC de ${user.name} é de ` + imc.toFixed(2));

  if (imc < 17){
    console.log(`${user.name} está muito abaixo do peso`);
  } else if (imc >= 17 && imc < 18.5){
    console.log(`${user.name} está abaixo do peso`);
  } else if (imc >= 18.5 && imc < 25){
    console.log(`${user.name} está com um peso normal`);
  } else if (imc >= 25 && imc < 30){
    console.log(`${user.name} está acima do peso`);
  } else if (imc >= 30 && imc < 35){
    console.log(`${user.name} está em Obsidade I`);
  } else if (imc >= 35 && imc < 40){
    console.log(`${user.name} está em Obsidade II (Severa)`);
  } else {
    console.log(`${user.name} está em Obesidade III (Mórbida)`);
  }

  console.log('');
}

// Calcula e retorna o IMC do usuário
function imcCalculator(height, weight){
  return weight/(height*height);
}