// Ця функція фільтрує масив об'єктів items за заданими критеріями: категорією, мінімальною та максимальною ціною
// = {} означає, що якщо аргумент не переданий, то він буде порожнім об'єктом за замовчуванням
function filterItems(items, { category, minPrice, maxPrice } = {}) {
    return items.filter(item => {
        // Якщо користувач вказав категорію, перевіряємо, чи збігається вона з категорією елемента. Якщо ні — виключаємо елемент
        if (category && item.category !== category) return false;
        // Якщо користувач вказав мінімальну ціну, перевіряємо, чи ціна елемента не менша за неї. Якщо менша — виключаємо елемент
        if (minPrice !== undefined && item.price < minPrice) return false;
        // Якщо користувач вказав максимальну ціну, перевіряємо, чи ціна елемента не більша за неї. Якщо більша — виключаємо елемент
        if (maxPrice !== undefined && item.price > maxPrice) return false;
        return true;
    });
}

// Ця функція рахує скільки товарів знаходиться в кожній категорії або в кожному році
function groupCount(items, field) {
    // Використовуємо метод reduce для підрахунку кількості елементів у кожній групі
    return items.reduce((acc, item) => {
        let key;
        if (field === 'year') {
            // Якщо користувач хоче групувати за роком, беремо рік з дати у форматі 'YYYY-MM-DD'. Якщо дати немає, використовуємо 'unknown'
            key = item.date ? item.date.split('-')[0] : 'unknown';
        } else {
            key = item[field];
        }
        
        if (key !== undefined) {
            acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
        // {} - об'єкт, який буде накопичувачем для підрахунку кількості елементів у кожній групі. 
        // Він починається порожнім і заповнюється під час проходження масиву items
    }, {});
}

// Ця функція обчислює статистику по масиву об'єктів items, включаючи кількість елементів, 
// загальну кількість, загальну вартість, середню ціну, мінімальну та максимальну ціну
function stats(items) {
    if (!items || items.length === 0) {
        return {
            count: 0,
            totalQuantity: 0,
            totalValue: 0,
            avgPrice: 0,
            minPrice: null,
            maxPrice: null
        };
    }

    // ініціалізуємо змінні для підрахунку статистики
    let count = items.length;
    let totalQuantity = 0;
    let totalValue = 0;
    let minPrice = items[0].price;
    let maxPrice = items[0].price;
    let priceSum = 0;

    // головний цикл для підрахунку статистики по кожному елементу масиву items
    for (const item of items) {
        totalQuantity += item.quantity;
        totalValue += item.price * item.quantity;
        priceSum += item.price;
        if (item.price < minPrice) minPrice = item.price;
        if (item.price > maxPrice) maxPrice = item.price;
    }

    // повертаємо об'єкт зі статистикою
    return {
        count,
        totalQuantity,
        totalValue: Number(totalValue.toFixed(2)),
        avgPrice: Number((priceSum / count).toFixed(2)),
        minPrice,
        maxPrice
    };
}

// ця функція знаходить топ товарів за заданим полем (за замовчуванням 'price') і повертає масив з n елементів
function topN(items, n, field = 'price') {
    const sorted = [...items].sort((a, b) => {
        if (b[field] !== a[field]) {
            return b[field] - a[field]; // від більшого до меншого
        }
        return a.id - b.id; // якщо значення рівні — сортуємо за id у зростаючому порядку
    });
    return sorted.slice(0, n);
}

// Експортуємо функції для використання в інших модулях
module.exports = {
    filterItems,
    groupCount,
    stats,
    topN
};