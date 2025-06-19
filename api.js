// /js/api.js (النسخة النهائية والكاملة بالكامل)
import { supabase } from './auth.js';

class ApiService {
  constructor(userId) {
    this.userId = userId;
  }

  // دالة مساعدة للحصول على "بطاقة الهوية" وإضافتها إلى كل طلب
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

  // --- الدوال الموجودة (تم تأمينها بالفعل) ---

  async getShoppingList() {
    const headers = await this._getAuthHeaders();
    const response = await fetch(`/api/getList`, { headers });
    if (!response.ok) throw new Error('Failed to fetch list');
    return response.json();
  }
  
  async getCategories() {
    const headers = await this._getAuthHeaders();
    const response = await fetch(`/api/getCategories`, { headers });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  async saveShoppingList(shoppingList) {
    const headers = await this._getAuthHeaders();
    const response = await fetch('/api/saveShoppingList', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ shoppingList }),
    });
    if (!response.ok) throw new Error('Failed to save list');
    return response.json();
  }

  async saveCategories(categories) {
    const headers = await this._getAuthHeaders();
    const response = await fetch('/api/saveCategories', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ categories }),
    });
    if (!response.ok) throw new Error('Failed to save categories');
    return response.json();
  }

  // --- الدوال المفقودة (تمت إضافتها وتأمينها) ---

  async addItem(item) {
    const headers = await this._getAuthHeaders();
    const response = await fetch('/api/addItem', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ item })
    });
    if (!response.ok) throw new Error('Failed to add item');
    return response.json();
  }

  async addCustomItem(item, allCategories) {
    const headers = await this._getAuthHeaders();
    const response = await fetch('/api/addCustomItem', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ item, allCategories })
    });
    if (!response.ok) throw new Error('Failed to add custom item');
    return response.json();
  }
}

export default ApiService;
