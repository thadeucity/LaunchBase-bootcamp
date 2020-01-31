const empresa = {
  nome: 'Rocketseat',
  cor: 'Roxo',
  foco: 'Programação',
  endereco:{
    rua: 'Rua Guilherme Gembala',
    numero: 260,
    complemento: 'Sala 03',
    bairro: 'Jardim América',
    cep: '89160-188',
    cidade: 'Rio do Sul',
    estado: 'SC'
  }
};

console.log(`A empresa ${empresa.nome} está localizada em ` + 
  `${empresa.endereco.rua}, ${empresa.endereco.numero}, ` +
  `${empresa.endereco.complemento}, Bairro ${empresa.endereco.bairro}, ` +
  `CEP ${empresa.endereco.cep}, ${empresa.endereco.cidade}, ` +
  `${empresa.endereco.estado} `
);