// /main.js (النسخة النهائية والكاملة مع دعم المصادقة)
import eventBus from '../src/utils/eventBus.js';
import ApiService from '../services/apiService.js';
import UIController from './UIController.js';
// لا نحتاج لـ 'supabase' هنا مباشرة

class App {
  // تم التعديل: constructor يقبل كائن المستخدم
  constructor(user) { 
    this.user = user;
    this.userId = user.id; // استخدام معرف المستخدم الحقيقي
    this.api = new ApiService(this.userId);
    this.ui = new UIController();
    this.shoppingData = {};
    this.categories = {};
    this.allItemsForAutocomplete = [];
    
    this._initializeApp();
    this._subscribeToEvents();
  }

  async _initializeApp() {
    try {
      const [listResult, categoriesResult] = await Promise.all([
        this.api.getShoppingList(), this.api.getCategories()
      ]);
      this.shoppingData = listResult.data || {};
      this.categories = categoriesResult.data || {};
      this.allItemsForAutocomplete = Object.values(this.categories).flat();
      this.ui.render(this.shoppingData);
    } catch (error) {
      this.ui.showError("فشل تحميل البيانات.");
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

  _saveData = async () => {
    try {
        await this.api.saveShoppingList(this.shoppingData);
    } catch (error) {
        this.ui.showError("فشل حفظ التغييرات.");
    }
  }

  _subscribeToEvents() {
    
    eventBus.on('ui:deleteItem', async ({ name, category }) => {
      if (this.shoppingData[category]) {
        this.shoppingData[category] = this.shoppingData[category].filter(item => (item.name || item) !== name);
        if (this.shoppingData[category].length === 0) {
          delete this.shoppingData[category];
        }
        this.ui.render(this.shoppingData);
        this._saveData();
      }
    });

    eventBus.on('ui:clearAll', async () => {
      this.shoppingData = {};
      this.ui.render(this.shoppingData);
      this._saveData();
    });

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

    eventBus.on('ui:showCustomModal', () => {
      this.ui.showCustomItemModal(this.categories);
    });

    // في ملف main.js، داخل دالة _subscribeToEvents()
eventBus.on('ui:addCustomItemConfirmed', async ({itemName, selectedCategory}) => {
  // --- هذا هو الإصلاح الحاسم ---
  // إذا كان العنصر موجودًا بالفعل، أظهر الرسالة وأوقف التنفيذ فورًا
  if (this.allItemsForAutocomplete.includes(itemName)) {
      alert(`العنصر "${itemName}" موجود بالفعل في النظام.`);
      return; // هذه الجملة هي مفتاح الحل، فهي تمنع استكمال الكود
  }
  // ---------------------------------

  // بقية الكود لن يتم تنفيذه إلا إذا كان العنصر جديدًا
  if (!this.categories[selectedCategory]) {
      this.categories[selectedCategory] = [];
  }
  this.categories[selectedCategory].push(itemName);
  this.allItemsForAutocomplete.push(itemName);

  if (!this.shoppingData[selectedCategory]) {
      this.shoppingData[selectedCategory] = [];
  }
  this.shoppingData[selectedCategory].push({ name: itemName, category: selectedCategory });
  
  this.ui.render(this.shoppingData);
  
  try {
      await Promise.all([
          this.api.saveShoppingList(this.shoppingData),
          this.api.saveCategories(this.categories)
      ]);
  } catch (error) {
      this.ui.showError("فشل حفظ العنصر المخصص.");
  }
});

    // --- إضافة مستمع لحدث تسجيل الخروج ---
    eventBus.on('ui:logout', async () => {
        // بما أن App لا يعرف supabase مباشرة، يجب أن نجلبها
        const { supabase } = await import('../src/utils/auth.js'); 
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert('حدث خطأ أثناء تسجيل الخروج: ' + error.message);
        } else {
            // توجيه المستخدم إلى صفحة تسجيل الدخول بعد الخروج بنجاح
            window.location.href = 'login.html';
        }
    });
  }
}

// تم التعديل: تصدير الكلاس بدلاً من إنشائه مباشرة
export default App;
