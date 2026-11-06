// Підключаємо і розбір аргументів командного рядка
const { loadItems } = require('./data');
const { filterItems, groupCount, stats, topN } = require('./query');

// Функція перетворює сирий рядок з термінала у зручний об'єкт
function parseArgs(args) {
    const result = { _: [] };
    const allowedFlags = ['category', 'min-price', 'max-price', 'by', 'n', 'file'];

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('--')) {
            const key = arg.slice(2);
            if (!allowedFlags.includes(key)) {
                console.error(`Error: Невідомий прапорець --${key}`);
                process.exit(1); // Код 1 для невідомих опцій
            }
            const next = args[i + 1];
            if (next && !next.startsWith('--')) {
                result[key] = next;
                i++;
            } else {
                result[key] = true;
            }
        } else {
            result._.push(arg);
        }
    }
    return result;
}

const argv = parseArgs(process.argv.slice(2));
const command = argv._[0];

if (!command) {
    console.error('Error: Команду не вказано');
    process.exit(1);
}

// Визначаємо шлях до файлу (якщо передано --file, беремо його, інакше стандартний)
let filePath = 'data/items.json';
if (argv.file) {
    filePath = argv.file;
}
// Завантажуємо дані з файлу
let items;
try {
    items = loadItems(filePath);
} catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(4); 
}

// Головний блок обробки команд
try {
    let output;

    // Виконуємо команду відповідно до аргументів
    // list - виводить список товарів, можливо відфільтрованих за категорією та ціною
    // group - групує товари за категорією або роком та рахує кількість у кожній групі
    // stats - виводить статистику по товарах (середня ціна, загальна кількість, загальна вартість)
    // top - виводить топ товарів за ціною або кількістю
    switch (command) {
        case 'list': {
            const category = argv.category;
            const minPrice = argv['min-price'] !== undefined ? Number(argv['min-price']) : undefined;
            const maxPrice = argv['max-price'] !== undefined ? Number(argv['max-price']) : undefined;

            if ((minPrice !== undefined && Number.isNaN(minPrice)) || (maxPrice !== undefined && Number.isNaN(maxPrice))) {
                console.error('Error: Некоректне значення ціни');
                process.exit(3);
            }

            output = filterItems(items, { category, minPrice, maxPrice });
            break;
        }
        case 'group': {
            const by = argv.by;
            if (!by) {
                console.error('Error: Не вказано обов’язкову опцію --by');
                process.exit(2);
            }
            if (by !== 'category' && by !== 'year') {
                console.error('Error: Недопустиме значення для опції --by');
                process.exit(3);
            }
            output = groupCount(items, by);
            break;
        }
        case 'stats': {
            const category = argv.category;
            let targetItems = items;
            if (category) {
                targetItems = filterItems(items, { category });
            }
            output = stats(targetItems);
            break;
        }
        case 'top': {
            const nStr = argv.n;
            const by = argv.by || 'price';

            if (!nStr) {
                console.error('Error: Не вказано обов’язкову опцію --n');
                process.exit(2);
            }

            const n = Number(nStr);
            if (Number.isNaN(n) || n < 1) {
                console.error('Error: Некоректне значення для опції --n');
                process.exit(3);
            }

            if (by !== 'price' && by !== 'quantity') {
                console.error('Error: Недопустиме значення для опції --by у команді top');
                process.exit(3);
            }

            output = topN(items, n, by);
            break;
        }
        default:
            console.error(`Error: Невідома команда "${command}"`);
            process.exit(1);
    }

    // Виводимо результат у форматі JSON у stdout
    console.log(JSON.stringify(output, null, 2));
    process.exit(0);

}

catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(3);
}