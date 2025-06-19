

// api.js (النسخة المحدثة التي ترسل "بطاقة الهوية")
import { supabase } from './auth.js';

class ApiService {
  constructor(userId) {
    this.userId = userId;
  }

  // دالة مساعدة للحصول على "بطاقة الهوية"
  async _getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    };
  }

  async getShoppingList() {
    const headers = await this._getAuthHeaders();
    const response = await fetch(`/api/getList?userId=${this.userId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch list');
    return response.json();
  }
  
  async getCategories() {
    const response = await fetch(`/api/getCategories?userId=${this.userId}`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  async saveShoppingList(shoppingList) {
    const headers = await this._getAuthHeaders();
    const response = await fetch('/api/saveShoppingList', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ shoppingList, userId: this.userId }),
    });
    if (!response.ok) throw new Error('Failed to save list');
    return response.json();
  }
}
export default ApiService;
