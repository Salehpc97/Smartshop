// الملف الجديد: src/components/ShoppingListItem.js

// هذا المكون يحتاج إلى حافلة الأحداث لإبلاغ التطبيق عند النقر على "حذف"
import eventBus from '../utils/eventBus.js';

/**
 * دالة متخصصة لرسم عنصر قائمة تسوق واحد (<li>).
 * @param {object} item - كائن العنصر.
 * @param {string} categoryName - اسم الفئة التي ينتمي إليها.
 * @returns {HTMLLIElement} - عنصر <li> جاهز للعرض.
 */
export function createShoppingListItem(item, categoryName) {
    const listItem = document.createElement('li');
    listItem.textContent = item.name || item;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.className = 'delete-item';

    // ربط حدث النقر لإصدار إشارة عبر حافلة الأحداث
    deleteBtn.onclick = () => {
        eventBus.emit('ui:deleteItem', { name: item.name || item, category: categoryName });
    };

    listItem.appendChild(deleteBtn);
    return listItem;
}
