// api.js
class ApiService {
    constructor(userId) {
      this.userId = userId;
      this.baseUrl = '/api'; // يمكنك تغييره لاحقًا
    }
  
    async getShoppingList() {
      const response = await fetch(`${this.baseUrl}/getList?userId=${this.userId}`);
      if (!response.ok) throw new Error('Failed to fetch list');
      return response.json();
    }
  
    async getCategories() {
      // ... نفس منطق fetch لدالة getCategories
    }
  
    async addItem(item) {
      // ... نفس منطق fetch لدالة addItem
    }
  
    async saveAllData(shoppingData, categories) {
        // يمكنك الاحتفاظ بالدوال القديمة هنا أيضًا
    }
  }
  export default ApiService;
  