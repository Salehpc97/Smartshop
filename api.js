// /js/api.js (النسخة الكاملة والمتوافقة)
class ApiService {
  constructor(userId) {
    this.userId = userId;
  }

  // المهمة التي يبحث عنها main.js
  async getShoppingList() {
    const response = await fetch(`/api/getList?userId=${this.userId}`);
    if (!response.ok) throw new Error('Failed to fetch shopping list');
    return response.json();
  }

  // المهمة الثانية التي يبحث عنها main.js
  async getCategories() {
    const response = await fetch(`/api/getCategories?userId=${this.userId}`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  // مهمة الحفظ التي ستحتاجها لاحقًا
  async saveShoppingList(shoppingList) {
    const response = await fetch('/api/saveShoppingList', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shoppingList: shoppingList, userId: this.userId }),
    });
    if (!response.ok) throw new Error('Failed to save shopping list');
    return response.json();
  }
  
  // يمكنك إضافة بقية دوال الحفظ هنا بنفس الطريقة
}

// لا تنس التصدير
export default ApiService;
