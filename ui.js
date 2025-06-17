// ui.js
import eventBus from './eventBus.js';

class UIController {
  constructor() {
    this.itemInput = document.getElementById('itemInput');
    this.categoriesList = document.getElementById('categories');
    this.errorMessageContainer = document.getElementById('error-message-container');
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
  }

  render(shoppingData) {
    this.categoriesList.innerHTML = '';
    for (const category in shoppingData) {
      const categorySection = document.createElement('div');
      categorySection.className = 'category-section';
      const title = document.createElement('h3');
      title.textContent = category;
      categorySection.appendChild(title);
      const itemList = document.createElement('ul');
      shoppingData[category].forEach(item => {
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
    }
  }

  showCustomItemModal(categories) {
    // ... انسخ كل منطق دالة _showCustomItemModal القديمة إلى هنا ...
    // تأكد من أن أي `eventBus.emit` داخلها يعمل بشكل صحيح
  }

  showError(message) { /* ... نفس منطق showError القديم ... */ }
  hideError() { /* ... نفس منطق hideError القديم ... */ }
  clearInput() { this.itemInput.value = ''; this.itemInput.focus(); }
}
export default UIController;
