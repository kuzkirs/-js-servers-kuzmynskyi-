// Модуль для завантаження даних з JSON файлу
const fs = require('fs');


 // Завантажує дані з JSON файлу
function loadItems(file) {
    // Перевіряє, чи існує файл. fs.existsSync - перевіряє, чи існує файл на диску. 
    // Повертає true, якщо файл є, і false, якщо його немає.
    if (!fs.existsSync(file)) {
        // throw — команда, яка навмисно створює помилку. Вона зупиняє виконання програми і виводить повідомлення про помилку.
        throw new Error(`File not found: ${file}`);
    }
    
    // Читає вміст файлу
    let content;

    // try { ... } catch (err) { ... } — конструкція для обробки помилок. 
    // Код у блоці try виконується, і якщо виникає помилка, виконання переходить до блоку catch, де можна обробити помилку.
    try {
        // fs.readFileSync(file, 'utf-8') - читає вміст файлу синхронно (тобто програма чекає, поки файл буде прочитано). 
        // Параметр 'utf-8' означає, що вміст файлу буде прочитано як текст у кодуванні UTF-8.
        content = fs.readFileSync(file, 'utf-8');
    } catch (err) {
        throw new Error(`Cannot read file: ${err.message}`);
    }

    // Перетворює текстовий вміст файлу у масив об'єктів
    let data;
    try {
        // JSON.parse(content) - перетворює текст у форматі JSON у JavaScript об'єкт або масив.
        data = JSON.parse(content);
    } catch (err) {
        throw new Error(`Invalid JSON format`);
    }

    // Перевіряє, чи дані є масивом
    // Array.isArray(data) - перевіряє, чи є data масивом. Повертає true, якщо це масив, і false, якщо ні.
    if (!Array.isArray(data)) {
        throw new Error(`Data must be an array`);
    }

    // Повертає готовий масив з продуктами
    return data;
}
 // Експортує функцію loadItems для використання в інших модулях
module.exports = { loadItems };