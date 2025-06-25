// /js/ui.js (النسخة الكاملة والنهائية مع كل الميزات)
import eventBus from '../eventBus.js';
import { createCategorySection } from '../src/components/CategorySection.js';

class UIController {
  constructor() {
    this.itemInput = document.getElementById('itemInput');
    this.categoriesList = document.getElementById('categories');
    this.errorMessageContainer = document.getElementById('error-message-container');
    this.suggestionsContainer = document.getElementById('suggestions-container');
    this._bindGlobalEvents();
  }

  _bindGlobalEvents() {
    document.getElementById('addItem').addEventListener('click', () => {
      eventBus.emit('ui:addItem', this.itemInput.value);
    });
    document.getElementById('clearAll').addEventListener('click', () => {
      eventBus.emit('ui:clearAll');
    });
    document.getElementById('addCustomItem').addEventListener('click', () => {
      eventBus.emit('ui:showCustomModal');
    });
    // الاستماع إلى إدخالات المستخدم لتشغيل الإكمال التلقائي
    this.itemInput.addEventListener('input', () => {
      eventBus.emit('ui:inputChanged', this.itemInput.value);
    });

    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) { // تحقق إذا كان الزر موجودًا في HTML
        logoutButton.addEventListener('click', () => {
            eventBus.emit('ui:logout');
        });
    }

  }

    /**
   * دالة render أصبحت الآن أنظف وأبسط بكثير.
   * وظيفتها هي "تجميع" المكونات فقط.
   */
    render(shoppingData) {
      // 1. مسح اللوحة (نفس الخطوة)
      this.categoriesList.innerHTML = '';
  
      // 2. المرور على الفئات واستدعاء مكون الرسم لكل فئة
      Object.keys(shoppingData).sort().forEach(categoryName => {
        const items = shoppingData[categoryName] || [];
        
        // استدعاء مكوننا الخارجي لرسم القسم بأكمله
        const categoryElement = createCategorySection(categoryName, items);
        
        // إضافة المكون الجاهز إلى الصفحة
        this.categoriesList.appendChild(categoryElement);
      });
    }

  // دالة أخرى لإنشاء عنصر القسم (القسم الجديد)
  renderSuggestions(suggestions) {
    this.suggestionsContainer.innerHTML = '';
    if (suggestions.length === 0) return;
    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.textContent = suggestion;
        div.className = 'suggestion-item';
        div.onclick = () => eventBus.emit('ui:suggestionClicked', suggestion);
        this.suggestionsContainer.appendChild(div);
    });
  }

  clearSuggestions() {
    this.suggestionsContainer.innerHTML = '';
  }
  
  setInput(value) {
    this.itemInput.value = value;
  }

  showCustomItemModal(categories) {
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => modal.remove();
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'اسم العنصر الجديد';
    const categorySelect = document.createElement('select');
    for (const category in categories) {
      if (category !== 'أخرى') {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      }
    }
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'تأكيد الإضافة';
    confirmBtn.onclick = () => {
      const itemName = nameInput.value.trim();
      const selectedCategory = categorySelect.value;
      if (!itemName) return alert('الرجاء إدخال اسم العنصر');
      eventBus.emit('ui:addCustomItemConfirmed', { itemName, selectedCategory });
      modal.remove();
    };
    modalContent.append(closeBtn, nameInput, categorySelect, confirmBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }

  showError(message) {
    this.errorMessageContainer.textContent = message;
    this.errorMessageContainer.style.visibility = 'visible';
    this.errorMessageContainer.style.opacity = '1';
  }

  hideError() {
    this.errorMessageContainer.style.opacity = '0';
    setTimeout(() => this.errorMessageContainer.style.visibility = 'hidden', 300);
  }
  
  clearInput() {
    this.itemInput.value = '';
    this.itemInput.focus();
  }
}

export default UIController;
