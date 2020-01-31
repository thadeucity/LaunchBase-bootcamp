const users = [
  {
    name: 'Mariana',
    transactions: [],
    balance: 0
  },{
    name: 'Victor',
    transactions: [],
    balance: 0
  },{
    name: 'Sergio',
    transactions: [],
    balance: 0
  }
];

const testTransactions = [
  {
    user: 'Mariana',
    transactionInfo: { type: 'credit', value: 50 }
  },{
    user: 'Mariana',
    transactionInfo: { type: 'credit', value: 120 }
  },{
    user: 'Mariana',
    transactionInfo: { type: 'debit', value: 80 }
  },{
    user: 'Mariana',
    transactionInfo: { type: 'debit', value: 30 }
  },
  
  {
    user: 'Victor',
    transactionInfo: { type: 'credit', value: 500 }
  },{
    user: 'Victor',
    transactionInfo: { type: 'credit', value: 20 }
  },{
    user: 'Victor',
    transactionInfo: { type: 'debit', value: 30 }
  },{
    user: 'Victor',
    transactionInfo: { type: 'debit', value: 45 }
  },
  
  {
    user: 'Sergio',
    transactionInfo: { type: 'credit', value: 200 }
  },{
    user: 'Sergio',
    transactionInfo: { type: 'credit', value: 150 }
  },{
    user: 'Sergio',
    transactionInfo: { type: 'debit', value: 90 }
  },{
    user: 'Sergio',
    transactionInfo: { type: 'debit', value: 310 }
  }

];

const testTransfers = [
  {
    sender: 'Sergio',
    receiver: 'Victor',
    amount: 150
  },{
    sender: 'Victor',
    receiver: 'Sergio',
    amount: 50
  } 
];

function findUser (userName){
  let index = -1;
  for (let i=0; i<users.length; i++){
    if (userName.toLowerCase() == users[i].name.toLowerCase()){
      index = i;
      break;
    }
  }

  if (index < 0){
    console.log (`invalid input, username: "${userName}" not found`);
  }

  return index;
}

function createTransaction (transaction, user) {
  let operationValue = transaction.value;
  let userIndex = findUser(user);

  if (userIndex >= 0){
    users[userIndex].transactions.push(transaction);
    if (transaction.type.toLowerCase() === "debit"){
      operationValue *= -1;
    }
  
    updateBalance(operationValue, userIndex);
  } 
}

function createMoneyTransfer (sender, receiver, amount){
  let senderIndex = findUser(sender);
  let receiverIndex = findUser(receiver);
  if (senderIndex >= 0 && receiverIndex >= 0){
    if (amount <= 0){
      console.log (
        'invalid transaction, the amount transfered' + 
        'should be greater than $0.00'
      );
      return;
    }
    createTransaction ({type:'debit', value: amount}, sender);
    createTransaction ({type:'credit', value: amount}, receiver);
  }
}

function updateBalance (value, userIndex){
  users[userIndex].balance += value; 
}

function getHigherTransactionByType (type, user){
  let userIndex = findUser(user);
  if (userIndex >= 0){
    if (type.toLowerCase() != 'credit' && type.toLowerCase() != 'debit' ){
      console.log (`invalid input, transaction type: "${type}" is not valid`);
      return;
    }
    let user = users[userIndex];
    let higher = {value: 0};
    for (let i=0; i<user.transactions.length; i++){
      if (user.transactions[i].type.toLowerCase() == type.toLowerCase()){
        if (user.transactions[i].value > higher.value) {
          higher = user.transactions[i];
        }
      }
    }
    return higher;
  } else {
    return {type:type, value:0 };
  }
}

function getAverageTransactionValue(user){
  let userIndex = findUser(user);
  if (userIndex >= 0){
    let user = users[userIndex];
    let totalTransactioValue = 0;
    for (let i = 0; i< user.transactions.length; i++){
      totalTransactioValue += user.transactions[i].value;
    }
    return (totalTransactioValue/user.transactions.length);
  } else {
    return 0;
  }
  
}

function getTransactionsCount (user){
  let userIndex = findUser(user);
  let transactionCount = {credit: 0, debit: 0};
  if (userIndex >= 0){
    let transactions = users[userIndex].transactions;
    for (let i=0; i< transactions.length; i++){
      if (transactions[i].type.toLowerCase() == 'debit'){
        transactionCount.debit ++;
      } else {
        transactionCount.credit ++;
      }
    }
  }
  return transactionCount;
}

function printUsersStatus (){
  for (let user of users){
    console.log(`${user.name} balance: ${user.balance}`);
    let highestCredit = getHigherTransactionByType('credit', user.name);
    let highestDebit = getHigherTransactionByType('debit', user.name);
    console.log(`${user.name}'s highest transaction: `, highestCredit);
    console.log(`${user.name}'s highest transaction: `, highestDebit);
    console.log(
      `${user.name}'s average transaction value: `,
      getAverageTransactionValue(user.name)
    );
    console.log(
      `${user.name}'s transaction count: `,
      getTransactionsCount(user.name)
    );
  }
}


// Do the Transactions

for (let transaction of testTransactions){
  createTransaction(transaction.transactionInfo, transaction.user);
}

for (let transfer of testTransfers){
  createMoneyTransfer (transfer.sender, transfer.receiver, transfer.amount);
}

printUsersStatus();