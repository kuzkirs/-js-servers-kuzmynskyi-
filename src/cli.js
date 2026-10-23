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




