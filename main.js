// /main.js (النسخة الكاملة والمحدثة)
import eventBus from './eventBus.js';
import ApiService from './api.js';
import UIController from './ui.js';

class App {
  constructor() {
    this.userId = 'bcdd1361-a8dc-4feb-88aa-48d3d2724b5a';
    this.api = new ApiService(this.userId);
    this.ui = new UIController();
    this.shoppingData = {};
    this.categories = {};
    
    this._initializeApp();
    this._subscribeToEvents();
  }

  async _initializeApp() {
    try {
      const [listResult, categoriesResult] = await Promise.all([
        this.api.getShoppingList(),
        this.api.getCategories()
      ]);
      this.shoppingData = listResult.data || {};
      this.categories = categoriesResult.data || {};
      this.ui.render(this.shoppingData);
    } catch (error) {
      console.error("Initialization failed:", error);
      this.ui.showError("فشل تحميل البيانات من الخادم.");
    }
  }

  // --- هنا قمنا بإعادة بناء "العقل" الذكي للتطبيق ---
  _getCategory(itemName) {
    const searchTerm = itemName.trim().toLowerCase();
    if (!searchTerm) return { category: 'أخرى', matchedItem: itemName.trim() };

    for (const category in this.categories) {
        const foundItem = this.categories[category].find(item => item.toLowerCase() === searchTerm);
        if (foundItem) return { category, matchedItem: foundItem };
    }
    return { category: 'أخرى', matchedItem: itemName.trim() };
  }

  // --- هنا قمنا بإعادة بناء "العقل" الذكي للتطبيق ---
  
_subscribeToEvents() {
    // 1. التعامل مع إضافة عنصر
    eventBus.on('ui:addItem', async (itemName) => {
        this.ui.hideError();
        if (!itemName) return;
        const { category, matchedItem } = this._getCategory(itemName);

        if (category === 'أخرى' || !matchedItem) {
            this.ui.showError(`العنصر "${itemName}" غير معروف.`);
            return;
        }
        if (this.shoppingData[category] && this.shoppingData[category].some(item => (item.name || item) === matchedItem)) {
            this.ui.showError(`"${matchedItem}" موجود بالفعل في قائمتك.`);
            return;
        }

        this.shoppingData[category] = this.shoppingData[category] || [];
        this.shoppingData[category].push({ name: matchedItem, category });
        this.ui.render(this.shoppingData);
        this.ui.clearInput();

        try {
            await this.api.saveShoppingList(this.shoppingData);
        } catch (error) {
            this.ui.showError("فشل حفظ التغييرات.");
        }
    });

    // 2. التعامل مع حذف عنصر (المنطق الجديد)
    eventBus.on('ui:deleteItem', async ({ name, category }) => {
        if (this.shoppingData[category]) {
            this.shoppingData[category] = this.shoppingData[category].filter(item => (item.name || item) !== name);
            if (this.shoppingData[category].length === 0) {
                delete this.shoppingData[category];
            }
            this.ui.render(this.shoppingData);

            try {
                await this.api.saveShoppingList(this.shoppingData);
            } catch (error) {
                this.ui.showError("فشل حفظ الحذف.");
            }
        }
    });
    
    // 3. التعامل مع مسح الكل
    eventBus.on('ui:clearAll', async () => {
        this.shoppingData = {};
        this.ui.render(this.shoppingData);
        try {
            await this.api.saveShoppingList(this.shoppingData);
        } catch (error) {
            this.ui.showError("فشل مسح القائمة.");
        }
    });
    
    // 4. التعامل مع إظهار النافذة المنبثقة (المنطق الجديد)
    eventBus.on('ui:showCustomModal', () => {
        this.ui.showCustomItemModal(this.categories);
    });

    // 5. يمكنك إضافة مستمع هنا للتعامل مع "تأكيد الإضافة" من النافذة المنبثقة
}

}

new App(); // بدء تشغيل التطبيق
