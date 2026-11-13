const { loadAll } = require('./fetcher');
const { analyzeLog } = require('./logstats');

async function main() {
    // Отримуємо аргументи командного рядка, відсікаючи шлях до node та самого файлу скрипта
    const args = process.argv.slice(2);
    const command = args[0];

    // Валідація команди: якщо команда відсутня або невідома -> код виходу 1
    if (!command || (command !== 'fetch' && command !== 'log')) {
        console.error('Error: Unknown or missing command');
        process.exit(1);
    }

    // Логіка: fetch (завантаження даних з URL-адрес)
    if (command === 'fetch') {
        let mode = 'parallel';
        let timeout = 2000;
        let retries = 0;
        const urls = [];

        // Проходимо циклом по всіх аргументах, починаючи з індекса 1 (після команди fetch)
        for (let i = 1; i < args.length; i++) {
            const arg = args[i];
            if (arg === '--sequential') {
                // Перемикаємо режим на послідовний
                mode = 'sequential';
            } else if (arg === '--timeout') {
                // Отримуємо значення, що йде одразу після прапорця --timeout
                const nextVal = args[i + 1];
                const parsed = Number(nextVal);
                // Перевірка на валідність: чи є числом, чи є цілим і чи не менше 1 (код виходу 3)
                if (!nextVal || isNaN(parsed) || parsed < 1 || !Number.isInteger(parsed)) {
                    console.error('Error: Invalid --timeout value');
                    process.exit(3);
                }
                timeout = parsed;
                i++;
            } else if (arg === '--retries') {
                // Отримуємо значення, що йде одразу після прапорця --retries
                const nextVal = args[i + 1];
                const parsed = Number(nextVal);
                // Перевірка на валідність: чи є цілим числом >= 0 (код виходу 3)
                if (!nextVal || isNaN(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
                    console.error('Error: Invalid --retries value');
                    process.exit(3);
                }
                retries = parsed;
                i++;
            } else if (arg.startsWith('--')) {
                // Будь-який інший невідомий прапорець вважається помилкою (код виходу 1)
                console.error(`Error: Unknown option ${arg}`);
                process.exit(1);
            } else {
                // Якщо це не прапорець, значить це URL-адреса
                urls.push(arg);
            }
        }

        // Якщо немає жодної адреси (код 2)
        if (urls.length === 0) {
            console.error('Error: No URLs provided for fetch');
            process.exit(2);
        }

        try {
            // Викликаємо функцію loadAll з модуля fetcher із переданими параметрами
            const results = await loadAll(urls, { mode, timeout, retries });
            console.log(JSON.stringify(results, null, 2));

            // Якщо хоча б один запит завершився невдало (ok: false) -> код виходу 5
            const hasError = results.some(r => !r.ok);
            // Якщо є помилки — виходимо з кодом 5, якщо все успішно — з кодом 0
            process.exit(hasError ? 5 : 0);
        } catch (err) {
            // Навіть при глобальній помилці виконання запитів виводимо код 5
            console.error(`Error: ${err.message}`);
            process.exit(5);
        }

    // Логіка: log (аналіз лог-файлу потоком)
    } else if (command === 'log') {
        const filePath = args[1];

        // Якщо не вказано шлях до файлу (код 2)
        if (!filePath) {
            console.error('Error: No log file path provided');
            process.exit(2);
        }

        try {
            const stats = await analyzeLog(filePath);
            // Виводимо зібрану статистику у форматі JSON
            console.log(JSON.stringify(stats, null, 2));
            process.exit(0);
        } catch (err) {
            // Якщо файл журналу не існує (код 4)
            console.error(`Error: ${err.message}`);
            process.exit(4);
        }
    }
}
// Запускаємо головну функцію
main();