#!/usr/bin/env node
// Прибираємо кольорове форматування виводу
process.env.FORCE_COLOR = '0';
// Масив аргументів командного рядка, які передаються після назви скрипта
const args = process.argv.slice(2); 

// Довідка 
// Пишеться зверху кода бо користувач може викликати її без будь-яких аргументів
// Також для того, щоб не перевіряти наявність операції та чисел у масиві arrayNumbers
if (args[0] === '--help' || args[0] === '-h') { 
  console.log('Usage: node src/cli.js <operation> [numbers...]');
  console.log('Operations: sum, avg, min, max, median');
  process.exit(0);
}




