// /js/ui.js (النسخة الكاملة والنهائية مع كل الميزات)
import eventBus from './eventBus.js';

class UIController {
  constructor() {
    this.itemInput = document.getElementById('itemInput');
    this.categoriesList = document.getElementById('categories');
    this.errorMessageContainer = document.getElementById('error-message-container');
    // --- العنصر المفقود الأول: إضافة حاوية الاقتراحات ---
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

    // --- العنصر المفقود الثاني: الاستماع إلى إدخالات المستخدم ---
    this.itemInput.addEventListener('input', () => {
      eventBus.emit('ui:inputChanged', this.itemInput.value);
    });
  }

  render(shoppingData) {
    this.categoriesList.innerHTML = '';
    Object.keys(shoppingData).sort().forEach(category => {
      const categorySection = document.createElement('div');
      categorySection.className = 'category-section';
      const title = document.createElement('h3');
      title.textContent = category;
      categorySection.appendChild(title);
      const itemList = document.createElement('ul');
      (shoppingData[category] || []).forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item.name || item;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'حذف';
        deleteBtn.onclick = () => eventBus.emit('ui:deleteItem', { name: item.name || item, category });
        listItem.appendChild(deleteBtn);
        itemList.appendChild(listItem);
      });
      categorySection.appendChild(itemList);
      this.categoriesList.appendChild(categorySection);
    });
  }

  // --- العنصر المفقود الثالث: دوال إدارة الإكمال التلقائي ---
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

  // --- بقية الدوال (صحيحة وكاملة) ---
  showCustomItemModal(categories) { /* ... الكود الحالي هنا، وهو صحيح ... */ }
  showError(message) { /* ... الكود الحالي هنا، وهو صحيح ... */ }
  hideError() { /* ... الكود الحالي هنا، وهو صحيح ... */ }
  clearInput() { /* ... الكود الحالي هنا، وهو صحيح ... */ }
}

export default UIController;
