const fs = require('fs');
const readline = require('readline');

//Аналізує файл логів потоково та повертає статистику.

function analyzeLog(file) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(file)) {
            return reject(new Error('File does not exist'));
        }

        // Створюємо читаючий потік (ReadStream) для файлу з кодуванням UTF-8
        const stream = fs.createReadStream(file, { encoding: 'utf-8' });
        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity // Коректно обробляє будь-які переводи рядків (\n або \r\n)
        });

        // Ініціалізуємо лічильники та змінні для збору статистики
        let lines = 0;
        let invalid = 0;
        const levels = { INFO: 0, WARN: 0, ERROR: 0 };
        let first = null;
        let last = null;
        const errorMessagesCount = {};

        rl.on('line', (line) => {
            if (!line.trim()) {
                return;
            }

            // Формат: <timestamp> <LEVEL> <message>
            // Підтримує дати як з мілісекундами (наприклад, .000Z), так і без них (Z)
            const match = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)\s+(INFO|WARN|ERROR)\s+(.+)$/);

            if (!match) {
                invalid++;
                return;
            }

            const [, timestamp, level, message] = match;

            if (levels[level] !== undefined) {
                levels[level]++;
            }

            lines++;

            if (!first) {
                first = timestamp;
            }
            last = timestamp;

            if (level === 'ERROR') {
                const trimmedMsg = message.trim();
                errorMessagesCount[trimmedMsg] = (errorMessagesCount[trimmedMsg] || 0) + 1;
            }
        });
        // Подія 'close' спрацьовує, коли файл повністю прочитано до кінця
        rl.on('close', () => {
            // Перетворюємо об'єкт помилок на масив пар [message, count], сортуємо та обрізаємо
            const topErrors = Object.entries(errorMessagesCount)
                .map(([message, count]) => ({ message, count }))
                .sort((a, b) => {
                    // Первинне сортування: за кількістю повторень (від найбільшої до найменшої)
                    if (b.count !== a.count) {
                        return b.count - a.count;
                    }
                    // Вторинне сортування (якщо кількість однакова): за алфавітом (localeCompare)
                    return a.message.localeCompare(b.message);
                })
                // Беремо лише топ-3 найчастіші помилки
                .slice(0, 3);
                
            // Повертаємо (резолвимо) повністю сформований об'єкт статистики
            resolve({
                lines,
                invalid,
                levels,
                first,
                last,
                topErrors
            });
        });

        // Обробка помилок читання самого потоку файлу
        stream.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = {
    analyzeLog
};