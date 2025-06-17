// ui.js
import eventBus from './eventBus.js';

class UIController {
  constructor() {
    this.itemInput = document.getElementById('itemInput');
    this.categoriesContainer = document.getElementById('categories');
    // ... بقية عناصر الـ DOM ...
    this._bindEvents();
  }

  _bindEvents() {
    // ربط الأحداث التي تؤثر فقط على الواجهة
    document.getElementById('addItem').addEventListener('click', () => {
      eventBus.emit('ui:addItemClicked', this.itemInput.value);
      this.itemInput.value = '';
    });
  }

  render(shoppingData) {
    // انقل كل منطق الرسم من دالة render القديمة إلى هنا
    this.categoriesContainer.innerHTML = '';
    // ...
  }
  
  showError(message) {
      // ... منطق عرض رسائل الخطأ
  }
}
export default UIController;
