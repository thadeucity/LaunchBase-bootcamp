const users = [
  {
    name: 'Salvio',
    revenue: [115.3, 48.7, 98.3, 14.5],
    expenses: [85.3, 13.5, 19.9]
  },
  {
    name: 'Marcio',
    revenue: [24.6, 214.3, 45.3],
    expenses: [185.3, 12.1, 120.0]
  },
  {
    name: 'Lucia',
    revenue: [9.8, 120.3, 340.2, 45.3],
    expenses: [450.2, 29.9]
  }
];

function calculateBalance (revenue, expenses){

  let totalRevenue = addNumbers(revenue);
  let totalExpenses = addNumbers(expenses);

  return ((totalRevenue - totalExpenses).toFixed(2));

}

function addNumbers (numbers){
  let sum = 0;
  for (let i=0; i<numbers.length; i++){
    sum += numbers[i];
  }
  return sum;
}

for (let i=0; i<users.length; i++){
  let balance = calculateBalance(users[i].revenue, users[i].expenses);
  let isPositive = (balance >= 0) ? 'POSITIVO' : 'NEGATIVO';
  console.log(`${users[i].name} possui saldo ${isPositive} de ${balance}` + '\n');
}