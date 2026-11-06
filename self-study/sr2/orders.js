const fs = require('fs');

// 1) Читає JSON-файл і повертає масив замовлень
function loadOrders(file) {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
}

// 2) Рахує загальну суму одного замовлення (price x qty по всіх товарах)
function orderTotal(order) {
    return order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// 3) Знаходить замовлення за id або повертає undefined
function findOrder(orders, id) {
    return orders.find(order => order.id === id);
}

// 4) Повертає замовлення із заданим статусом
function byStatus(orders, status) {
    return orders.filter(order => order.status === status);
}

// 5) Повертає список міст без повторів, відсортований за алфавітом
function cities(orders) {
    return [...new Set(orders.map(order => order.city))].sort((a, b) => a.localeCompare(b));
}

// 6) Об'єкт «місто - сума всіх замовлень, крім cancelled»
function revenueByCity(orders) {
    return orders
        .filter(order => order.status !== 'cancelled')
        .reduce((acc, order) => {
            const total = orderTotal(order);
            acc[order.city] = (acc[order.city] || 0) + total;
            return acc;
        }, {});
}

// 7) Середня сума замовлення (без урахування cancelled), округлена до 2 знаків
function averageOrder(orders) {
    const activeOrders = orders.filter(order => order.status !== 'cancelled');
    if (activeOrders.length === 0) return 0;
    
    const totalSum = activeOrders.reduce((sum, order) => sum + orderTotal(order), 0);
    return Number((totalSum / activeOrders.length).toFixed(2));
}

// 8) Повертає масив з n покупців, які витратили найбільше: { customer, total } за спаданням
function topCustomers(orders, n) {
    // Рахуємо суми витрат для кожного покупця (ігноруємо cancelled)
    const spentMap = orders
        .filter(order => order.status !== 'cancelled')
        .reduce((acc, order) => {
            acc[order.customer] = (acc[order.customer] || 0) + orderTotal(order);
            return acc;
        }, {});

    // Перетворюємо об'єкт у масив об'єктів, сортуємо за спаданням і беремо перші n
    return Object.entries(spentMap)
        .map(([customer, total]) => ({ customer, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, n);
}

// 9) Назва товару з найбільшою сумарною кількістю проданих одиниць (усі замовлення)
function bestSeller(orders) {
    // Збираємо всі товари з усіх замовлень через flatMap
    const itemsMap = orders.flatMap(order => order.items).reduce((acc, item) => {
        acc[item.title] = (acc[item.title] || 0) + item.qty;
        return acc;
    }, {});

    // Знаходимо товар із максимальним продажем
    const entries = Object.entries(itemsMap);
    if (entries.length === 0) return null;

    const best = entries.reduce((max, current) => current[1] > max[1] ? current : max);
    return best[0];
}

// 10) Замовлення за вказаний місяць ('РРРР-ММ'), від найновішого до найстарішого
function inMonth(orders, yearMonth) {
    return orders
        .filter(order => order.date.startsWith(yearMonth))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}
// Експортуємо функції для використання в інших модулях
module.exports = {
    loadOrders,
    orderTotal,
    findOrder,
    byStatus,
    cities,
    revenueByCity,
    averageOrder,
    topCustomers,
    bestSeller,
    inMonth
};