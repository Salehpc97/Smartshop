// /main.js (النسخة النهائية والكاملة)
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
    // الحالة الجديدة والمهمة للإكمال التلقائي
    this.allItemsForAutocomplete = [];
    
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
      // نقوم بتجميع كل العناصر المعروفة في مصفوفة واحدة
      this.allItemsForAutocomplete = Object.values(this.categories).flat();
      this.ui.render(this.shoppingData);
    } catch (error) {
      console.error("Initialization failed:", error);
      this.ui.showError("فشل تحميل البيانات من الخادم.");
    }
  }

  _getCategory(itemName) {
    const searchTerm = itemName.trim().toLowerCase();
    for (const category in this.categories) {
        const foundItem = this.categories[category].find(item => item.toLowerCase() === searchTerm);
        if (foundItem) return { category, matchedItem: foundItem };
    }
    return { category: 'أخرى', matchedItem: itemName.trim() };
  }

  _subscribeToEvents() {
    // 1. التعامل مع إضافة عنصر
    eventBus.on('ui:addItem', async (itemName) => {
        // ... الكود الحالي لإضافة عنصر هنا ...
    });

    // 2. التعامل مع حذف عنصر
    eventBus.on('ui:deleteItem', async ({ name, category }) => {
        // ... الكود الحالي لحذف عنصر هنا ...
    });
    
    // 3. التعامل مع مسح الكل
    eventBus.on('ui:clearAll', async () => {
        // ... الكود الحالي لمسح الكل هنا ...
    });
    
    // 4. التعامل مع إظهار النافذة المنبثقة
    eventBus.on('ui:showCustomModal', () => {
        this.ui.showCustomItemModal(this.categories);
    });

    // --- هنا قمنا بإعادة بناء منطق الإكمال التلقائي المفقود ---
    eventBus.on('ui:inputChanged', (inputValue) => {
        if (!inputValue) {
            this.ui.clearSuggestions();
            return;
        }
        const suggestions = this.allItemsForAutocomplete.filter(item => 
            item.toLowerCase().startsWith(inputValue.toLowerCase())
        );
        this.ui.renderSuggestions(suggestions.slice(0, 5));
    });

    eventBus.on('ui:suggestionClicked', (suggestion) => {
        this.ui.setInput(suggestion);
        this.ui.clearSuggestions();
    });

    // 5. يمكنك إضافة مستمع هنا لـ 'ui:addCustomItemConfirmed'
    eventBus.on('ui:addCustomItemConfirmed', async ({itemName, selectedCategory}) => {
        // هنا تضع منطق إضافة العنصر المخصص، والتحقق من التكرار، والحفظ في الخادم
        console.log(`تم استلام طلب إضافة: ${itemName} في فئة ${selectedCategory}`);
    });
  }
}

new App();
