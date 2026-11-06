const path = require('path');
// Модуль для роботи з файлами та шляхами
const {
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
} = require('./orders');

// Шлях до файлу з замовленнями, незалежно від того, де запускається скрипт, він завжди буде в папці self-study/sr2
const filePath = path.join(__dirname, 'orders.json');
const orders = loadOrders(filePath);
// Виводимо результати виконання функцій у консоль
console.log('=== 1. Завантажені замовлення (всього):', orders.length);
console.log('=== 2. Сума першого замовлення:', orderTotal(orders[0]));
console.log('=== 3. Пошук замовлення за id (id: 3):', findOrder(orders, 3));
console.log('=== 4. Замовлення зі статусом "paid":', byStatus(orders, 'paid').map(o => o.id));
console.log('=== 5. Унікальні міста за алфавітом:', cities(orders));
console.log('=== 6. Виручка за містами (без скасованих):', revenueByCity(orders));
console.log('=== 7. Середня сума замовлення:', averageOrder(orders));
console.log('=== 8. Топ-3 покупці за сумою витрат:', topCustomers(orders, 3));
console.log('=== 9. Бестселер (найпопулярніший товар):', bestSeller(orders));
console.log('=== 10. Замовлення за 2026-05 (від найновіших):', inMonth(orders, '2026-05').map(o => ({ id: o.id, date: o.date }))); 