#!/usr/bin/env node
// Прибираємо кольорове форматування виводу
process.env.FORCE_COLOR = '0';
// Масив аргументів командного рядка, які передаються після назви скрипта
const args = process.argv.slice(2); 

// Перевірка на наявність аргументів командного рядка
if (args.length === 0) {
  console.error('Error: No arguments provided');
  process.exit(1);
}
// Довідка 
// Пишеться зверху кода бо користувач може викликати її без будь-яких аргументів
// Також для того, щоб не перевіряти наявність операції та чисел у масиві arrayNumbers
if (args[0] === '--help' || args[0] === '-h') { 
  console.log('Usage: node src/cli.js <operation> [numbers...]');
  console.log('Operations: sum, avg, min, max, median');
  process.exit(0);
}

// Задаємо операцію, яку користувач хоче виконати (перший аргумент командного рядка)
const operation = args[0];

// Перевірка на наявність операції у списку допустимих операцій
const validOperations = ['sum', 'avg', 'min', 'max', 'median'];
if (!validOperations.includes(operation)) {
  console.error('Error: Unknown operation');
  process.exit(1); 
}

// Масив чисел, які передаються після операції
const arrayNumbers = args.slice(1); 

// Перевірка на наявність чисел у масиві arrayNumbers
if (arrayNumbers.length === 0) {
  console.error('Error: No numbers provided');
  process.exit(2); 
}

// Перевірка на некоректні числа (текст, букви, порожні значення або нескінченність)
for (const arg of arrayNumbers) {
  const num = Number(arg);
  
  // Додаємо перевірку: isNaN(num) - не число, arg.trim() === '' - порожній рядок та isFinite(num) - наявність нескінченності
  if (isNaN(num) || arg.trim() === '' || !isFinite(num)) {
    console.error(`Error: Invalid number '${arg}'`);
    process.exit(3);
  }
}
// process.exit(n); 
// n = 0 - успішне обчислення, довідка
// n = 1 - немає аргументів, невідома операція (регістр має значення: SUM - помилка)
// n = 2 - операцію вказано, але не передано жодного числа
// n = 3 - хоча б один аргумент не є коректним числом


// Cума
if (operation === 'sum') { 
  let totalSum = 0;
    // Цикл для проходу по числам у масиві arrayNumbers
  for (let i = 0; i < arrayNumbers.length; i++) {
    // Перетворюємо текст на число та додаємо до суми
    totalSum = totalSum + Number(arrayNumbers[i]);   
  }
  // Додатково використовуємо Number для скидання лишніх нулів після десяткової крапки 
  // Використовуємо toFixed(2) для округлення до двох десяткових знаків
  console.log(Number(totalSum.toFixed(2)));
  process.exit(0);
}

// Середнє арифметичне
if (operation === 'avg') { 
  let totalSum = 0;
  for (let i = 0; i < arrayNumbers.length; i++) {
    totalSum = totalSum + Number(arrayNumbers[i]);
  }
  // Обчислюємо середнє арифметичне шляхом ділення суми на кількість елементів у масиві 
  let average = totalSum / arrayNumbers.length;

  console.log(Number(average.toFixed(2)));
  process.exit(0);
}

 // Мінімум
if (operation === 'min'){
  let min = Number(arrayNumbers[0]);
  for (let i = 1; i < arrayNumbers.length; i++) {
    const numMin = Number(arrayNumbers[i]);
    // Підбираємо мінімальне значення серед чисел у масиві
    if (numMin < min) {
      min = numMin;
    }
  }
  console.log(Number(min.toFixed(2)));
  process.exit(0);
}


// Максимум
if (operation === 'max'){ 
  let max = Number(arrayNumbers[0]);
  for (let i = 1; i < arrayNumbers.length; i++) {
    const numMax = Number(arrayNumbers[i]);
    // Підбираємо максимальне значення серед чисел у масиві
    if (numMax > max) {
      max = numMax;
    }
  }
  console.log(Number(max.toFixed(2)));
  process.exit(0);
}

// Медіана (для парної кількості - середнє двох центральних)
if (operation === 'median'){ 

  let median = Number(arrayNumbers[0]);
  // Метод сортування масиву чисел у порядку зростання, використовуючи функцію порівняння (a, b) => a - b
  const sortedNumbers = arrayNumbers.map(Number).sort((a, b) => a - b);
  median = sortedNumbers;
  // Парна кількість елементів у масиві
if (sortedNumbers.length % 2 === 0) {      
  // Перший з двох центральних
  const mid1 = sortedNumbers.length / 2 - 1; 
  // Другий з двох центральних
  const mid2 = sortedNumbers.length / 2;     
  // Сума двох центральних елементів, поділена на 2, щоб отримати середнє значення
  median = (sortedNumbers[mid1] + sortedNumbers[mid2]) / 2;
  console.log(Number(median.toFixed(2)));

} else {    
  // Непарна кількість елементів у масиві, а також використання Math.floor для знаходження індексу середнього елемента
  const mid = Math.floor(sortedNumbers.length / 2); 
  console.log(Number(sortedNumbers[mid].toFixed(2)));
}

process.exit(0);
}  

