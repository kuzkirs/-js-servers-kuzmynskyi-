// self-study/sr3/compare.js
const { loadAll } = require('../../src/fetcher'); // Шлях до нашого модуля з Етапу 3

const urls = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/users/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/posts/999999' // Спеціально неіснуючий ресурс для перевірки помилок
];

async function runBenchmark() {
    console.log('ЗАПУСК ПОРІВНЯННЯ АСИНХРОННИХ ЗАПИТІВ\n');

    const runs = 3;
    const parallelTimes = [];
    const sequentialTimes = [];

    // Тестуємо паралельний режим (3 рази)
    console.log('--- Паралельний режим (Parallel) ---');
    for (let i = 1; i <= runs; i++) {
        const start = performance.now();
        const results = await loadAll(urls, { mode: 'parallel', timeout: 3000 });
        const end = performance.now();
        
        const duration = end - start;
        parallelTimes.push(duration);
        console.log(`Запуск ${i}: ${duration.toFixed(2)} мс`);
        
        // Виводимо статус обробки помилок на першому запуску, щоб переконатися, що неіснуючий URL не зупинив решту
        if (i === 1) {
            console.log('Результати завантаження (перевірка ізоляції помилок):');
            results.forEach(r => {
                console.log(`  - URL: ${r.url.split('/').pop()} | ok: ${r.ok} ${r.error ? `| error: ${r.error}` : ''}`);
            });
        }
    }

    console.log('\n--- Послідовний режим (Sequential) ---');
    // Тестуємо послідовний режим (3 рази)
    for (let i = 1; i <= runs; i++) {
        const start = performance.now();
        const results = await loadAll(urls, { mode: 'sequential', timeout: 3000 });
        const end = performance.now();
        
        const duration = end - start;
        sequentialTimes.push(duration);
        console.log(`Запуск ${i}: ${duration.toFixed(2)} мс`);
    }

    // Рахуємо середні значення
    const avgParallel = parallelTimes.reduce((a, b) => a + b, 0) / runs;
    const avgSequential = sequentialTimes.reduce((a, b) => a + b, 0) / runs;

    console.log('\nПІДСУМОК');
    console.log(`Середній час (паралельно):   ${avgParallel.toFixed(2)} мс`);
    console.log(`Середній час (послідовно):  ${avgSequential.toFixed(2)} мс`);
}

runBenchmark();