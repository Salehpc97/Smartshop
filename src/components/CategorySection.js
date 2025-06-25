// الملف الجديد: src/components/CategorySection.js

// --- هذا هو الجزء الحاسم ---
// هذا المكون يعتمد على المكون الأصغر، لذلك نقوم باستيراده.
import { createShoppingListItem } from './ShoppingListItem.js';

/**
 * دالة متخصصة لرسم قسم فئة كامل مع كل عناصره.
 * @param {string} categoryName - اسم الفئة.
 * @param {Array} items - مصفوفة العناصر في هذه الفئة.
 * @returns {HTMLDivElement} - عنصر <div> جاهز للعرض.
 */
export function createCategorySection(categoryName, items) {
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';

    const title = document.createElement('h3');
    title.textContent = categoryName;
    categorySection.appendChild(title);

    const itemList = document.createElement('ul');
    items.forEach(item => {
        // نستخدم المكون المستورد هنا لرسم كل عنصر
        const listItemElement = createShoppingListItem(item, categoryName);
        itemList.appendChild(listItemElement);
    });

    categorySection.appendChild(itemList);
    return categorySection;
}
