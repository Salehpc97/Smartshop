// /main.js
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
    
    this._subscribeToEvents();
    this._initializeApp();
  }

  async _initializeApp() {
    try {
      const [listResult, categoriesResult] = await Promise.all([
        this.api.getShoppingList(),
        this.api.getCategories()
      ]);
      this.shoppingData = listResult.data || {};
      this.categories = categoriesResult.data || {}; // استخدم البيانات الافتراضية إذا فشل الجلب
      this.ui.render(this.shoppingData);
    } catch (error) {
      console.error("Initialization failed:", error);
      this.ui.showError("فشل تحميل البيانات من الخادم.");
    }
  }

  _subscribeToEvents() {
    eventBus.on('ui:addItem', (itemName) => {
      this.ui.hideError();
      // انقل كل منطق دالة addItem القديمة إلى هنا
      // 1. تحقق من الإدخال
      if (!itemName) return;
      // 2. ابحث عن الفئة
      // 3. تحقق من التكرار
      // 4. قم بتحديث this.shoppingData
      // 5. اطلب من الخادم الحفظ
      this.api.saveShoppingList(this.shoppingData).catch(e => this.ui.showError("فشل الحفظ"));
      // 6. اطلب من الواجهة إعادة الرسم
      this.ui.render(this.shoppingData);
      this.ui.clearInput();
    });

    eventBus.on('ui:clearAll', () => {
        // منطق مسح الكل هنا
    });
  }
}

new App();
