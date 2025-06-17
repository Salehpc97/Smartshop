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

  // --- هنا قمنا بملء "دليل التعليمات" للمدير ---
  _subscribeToEvents() {
    eventBus.on('ui:addItem', async (itemName) => {
      this.ui.hideError();
      if (!itemName) return;

      const { category, matchedItem } = this._getCategory(itemName);

      if (category === 'أخرى') {
        this.ui.showError(`العنصر "${itemName}" غير معروف. حاول إضافته كعنصر مخصص.`);
        return;
      }
      
      if (this.shoppingData[category] && this.shoppingData[category].some(item => (item.name || item) === matchedItem)) {
        this.ui.showError(`"${matchedItem}" موجود بالفعل في قائمتك.`);
        return;
      }

      // تحديث البيانات المحلية
      this.shoppingData[category] = this.shoppingData[category] || [];
      this.shoppingData[category].push({ name: matchedItem, category });

      // إعادة رسم الواجهة فورًا (تجربة مستخدم أفضل)
      this.ui.render(this.shoppingData);
      this.ui.clearInput();

      // محاولة الحفظ في الخادم في الخلفية
      try {
        await this.api.saveShoppingList(this.shoppingData);
      } catch (error) {
        console.error("Save failed:", error);
        this.ui.showError("فشل حفظ التغييرات في الخادم.");
        // يمكنك هنا إضافة منطق للتراجع عن التغيير إذا فشل الحفظ
      }
    });

    eventBus.on('ui:clearAll', async () => {
      this.shoppingData = {};
      this.ui.render(this.shoppingData);
      try {
        await this.api.saveShoppingList(this.shoppingData);
      } catch (error) {
        console.error("Clear failed:", error);
        this.ui.showError("فشل مسح القائمة في الخادم.");
      }
    });
    
    // يمكنك إضافة مستمع لـ ui:showCustomModal هنا بنفس الطريقة
  }
}

new App(); // بدء تشغيل التطبيق
