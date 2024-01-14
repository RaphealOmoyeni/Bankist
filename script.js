'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
let labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      
      <div class="movements__value">€${Math.abs(mov)}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const user = 'Steven Thomas Williams'; // stw

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `€${incomes}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `€${Math.abs(out)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map((mov, i, arr) => {
      return (mov * acc.interestRate) / 100;
    })
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `€${interest}`;
};

// calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handler

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting and reloading
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  console.log(amount, receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount?.username
  ) {
    // Doing the transfer
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movements
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  // Clear fields
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    // console.log('confirmed');

    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// console.log(accounts);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));

// // Splice
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join(' - '));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
// console.log('Jonas John'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You just deposited $${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} You just withdrew $${Math.abs(movement)}`);
//   }
// }
// console.log('------- FOR EACH --------');
// movements.forEach(function (mov, i, array) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1} You just deposited $${mov}`);
//   } else {
//     console.log(`Movement ${i + 1} You just withdrew $${Math.abs(mov)}`);
//   }
// });

// Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// Challenge 1

// const checkDogs = function (juliaDogs, kateDogs) {
//   const allDogs = juliaDogs.slice(1, -2).concat(kateDogs);

//   allDogs.forEach(function (allDog, i, array) {
//     if (allDog >= 3) {
//       console.log(`Dog number ${i + 1} is an Adult and is ${allDog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a Puppy 🐶`);
//     }
//   });
// };
// const juliaDogsAge = [3, 5, 2, 12, 7];
// const kateDogsAge = [4, 1, 15, 8, 3];

// checkDogs(juliaDogsAge, kateDogsAge);

// Map Method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUsd);
// }
// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescriptions);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     depositsFor.push(mov);
//   }
// }
// console.log(depositsFor);

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });

// console.log(withdrawals);

// const withdrawalSecond = [];

// for (const mov of movements) {
//   if (mov < 0) {
//     withdrawalSecond.push(mov);
//   }
// }

// console.log(withdrawalSecond);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

// // accumulator -> SNOWBALL
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// // labelBalance.innerHTML = `$${balance}`;

// // Maximum value
// const maximum = movements.reduce(function (acc, cur, i, arr) {
//   if (cur > acc) {
//     return cur;
//   } else return acc;
// }, movements[0]);
// console.log(maximum);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calAverageHumanAge = function (ages) {
//   const humanAges = ages.map(function (ages, i) {
//     if (ages <= 2) {
//       return 2 * ages;
//     } else {
//       return 16 + ages * 4;
//     }
//   });
//   const humanAgesFilter = humanAges.filter(function (ages) {
//     return ages >= 18;
//   });

//   const averageAges = humanAgesFilter.reduce(function (acc, cur, i, arr) {
//     const sum = acc + cur;
//     return sum;
//   }, 0);

//   const calculateAvg = averageAges / humanAgesFilter.length;
//   console.log(calculateAvg);
// };

// calAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// PIPELINE
// const eurToUsd = 1.1;
// console.log(movements);
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     return mov * eurToUsd;
//   })
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// const calcAverageHumanAge = function (ages) {
//   const averageNew = ages
//     .map((mov, i, arr) => (mov <= 2 ? 2 * mov : 16 + mov * 4))
//     .filter(mov => mov > 18)
//     .reduce((acc, mov, i, arr) => acc + mov / arr.length, 0);
//   console.log(averageNew);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// Find method returns the first element that satisfy the condition
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// console.log(movements);

// // Equality
// console.log(movements.includes(-130));

// // SOME: Condition

// console.log(movements.some(mov => mov === -130));
// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Seperate callback
// const deposit = mov => mov < 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(3));

// // Flat
// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overalBalance);

// // FlatMap
// const overalBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);

// // Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// // Numbers
// console.log(movements);

// // return < 0, A, B (keep order)
// // return > 0, B, A (switch order)

// // Ascending
// // movements.sort((a, b) => {
// //   if (a > b) {
// //     return 1;
// //   }
// //   if (a < b) {
// //     return -1;
// //   }
// // });

// movements.sort((a, b) => a - b);

// console.log(movements);

// // Descending
// // movements.sort((a, b) => {
// //   if (a > b) {
// //     return -1;
// //   }
// //   if (a < b) {
// //     return 1;
// //   }
// // });

// movements.sort((a, b) => b - a);

// console.log(movements);

// // Don't use the sort method for arrays that has combination of strings and numbers

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// const x = new Array(7);
// console.log(x);
// // console.log(x.map(() => 5));

// // x.fill(1);

// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );

//   console.log(movementsUI);

//   const movementsUI2 = [...document.querySelectorAll('movements__value')];

//   console.log(movementsUI2);
// });

////////////////////////////////////////////
// Array Methods Practice
// 1.
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(bankDepositSum);

// // 2.
// const numDeposits10001 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// console.log(numDeposits10001);

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

// console.log(numDeposits1000);

// // Prefixed ++ Operator
// let a = 10;
// console.log(++a);
// console.log(a);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (acu, cur) => {
//       // cur > 0 ? (acu.deposits += cur) : (acu.withdrawals += cur);
//       acu[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return acu;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// // 4.
// // this is a nice title -> This Is a Nice Title

// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exeptions = ['a', 'an', 'and', 'the', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exeptions.includes(word) ? word : capitalize(word)))
//     .join(' ');

//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

/////////////////////////////////////////////
///////// CODING CHALLENGE 4 //////////

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
const createRecommended = function (dog) {
  dog.forEach(function (dogg) {
    dogg.recommended = Math.trunc(dogg.weight ** 0.75 * 28);
  });
};

createRecommended(dogs);
console.log(dogs);

// 2.
const checkSarahDog = function (dogs) {
  const sarahDog = dogs.find(acc => acc.owners.includes('Sarah'));
  console.log(sarahDog);
  if (sarahDog.curFood > sarahDog.recommended * 1.1) {
    console.log('Sarah"s Dog is eating too much');
  }
  if (sarahDog.curFood < sarahDog.recommended * 0.9) {
    console.log('Sarah"s Dog is eating too little food');
  }
};
checkSarahDog(dogs);

// 3.

const ownersEatTooMuch = dogs.find(acc => acc.curFood > acc.recommended * 1.1);

const ownersEatTooLittle = dogs.find(
  acc => acc.curFood < acc.recommended * 0.9
);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4.
console.log(`${ownersEatTooLittle.owners.join(' and ')} Dog eat too little`);
console.log(`${ownersEatTooMuch.owners.join(' and ')} Dog eat too much`);

// 5.
console.log(dogs.some(mov => mov.curFood === mov.recommended));

// 6.
console.log(
  dogs.some(
    mov =>
      mov.curFood > mov.recommended * 0.9 && mov.curFood < mov.recommended * 1.1
  )
);

// 7.
const okayArray = dogs.filter(
  mov =>
    mov.curFood > mov.recommended * 0.9 && mov.curFood < mov.recommended * 1.1
);

console.log(okayArray);

// 8.
const newDogs = dogs.slice().sort((a, b) => {
  if (a.recommended > b.recommended) {
    return 1;
  }
  if (a.recommended < b.recommended) {
    return -1;
  }
});

console.log(newDogs);
