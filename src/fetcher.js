//Завантажує JSON за вказаною URL-адресою з підтримкою таймауту та повторних спроб.
async function fetchJson(url, { timeout = 2000, retries = 0 } = {}) {
    let attemptsLeft = retries;

    while (true) {
        try {
            // Використовуємо AbortSignal.timeout для обмеження часу запиту
            const response = await fetch(url, {
                signal: AbortSignal.timeout(timeout)
            });

            // Якщо статус 4xx (наприклад, 404, 400), кидаємо помилку без повторів
            if (response.status >= 400 && response.status < 500) {
                throw new Error(`HTTP ${response.status}`);
            }

            // Якщо статус 5xx (або інші помилки серверу), це підстава для повторної спроби (якщо є спроби)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            // Перевіряємо чи тіло відповіді є валідним JSON
            const data = await response.json();
            return data;
        } catch (error) {
            // Визначаємо, чи це помилка 4xx (її не повторюємо)
            const isClientError = error.message.startsWith('HTTP 4');

            // Якщо спроби скінчилися або це помилка 4xx, викидаємо помилку остаточно
            if (attemptsLeft <= 0 || isClientError) {
                throw error;
            }

            attemptsLeft--;
            // Можна додати невелику паузу перед наступною спробою, якщо потрібно, але поки робимо за логікою тестів
        }
    }
}

// Завантажує кілька адрес (urls) у паралельному чи послідовному режимі.
// Ніколи не кидає глобальну помилку, а повертає масив об'єктів { url, ok, data } або { url, ok: false, error }.
 
async function loadAll(urls, { mode = 'parallel', timeout = 2000, retries = 0 } = {}) {
    if (mode === 'sequential') {
        // Послідовний режим - виконуємо запити один за одним по черзі
        const results = [];
        for (const url of urls) {
            try {
                const data = await fetchJson(url, { timeout, retries });
                results.push({ url, ok: true, data });
            } catch (err) {
                results.push({ url, ok: false, error: err.message });
            }
        }
        return results;
    } else {
        // Паралельний режим (за замовчуванням) - запускаємо всі запити одночасно через Promise.all
        const promises = urls.map(async (url) => {
            try {
                const data = await fetchJson(url, { timeout, retries });
                return { url, ok: true, data };
            } catch (err) {
                return { url, ok: false, error: err.message };
            }
        });

        return await Promise.all(promises);
    }
}

module.exports = {
    fetchJson,
    loadAll
};