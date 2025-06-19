// /js/api.js (النسخة النهائية والآمنة بالكامل)
import { supabase } from './auth.js';

class ApiService {
  constructor(userId) {
    // لم نعد بحاجة إلى تخزين userId هنا، ولكن يمكن إبقاؤه إذا كان هناك استخدام مستقبلي
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
      'Authorization': `Bearer ${session.access_token}`, // هذه هي "بطاقة الهوية"
    };
  }

  // --- تم تحديث كل الدوال الآن لتكون آمنة ومتسقة ---

  async getShoppingList() {
    const headers = await this._getAuthHeaders();
    // لم نعد بحاجة لإرسال userId في الرابط. الخادم سيعرف المستخدم من "بطاقة الهوية".
    const response = await fetch(`/api/getList`, { headers });
    if (!response.ok) throw new Error('Failed to fetch list');
    return response.json();
  }
  
  async getCategories() {
    // تم إصلاح الثغرة الأمنية هنا بإضافة "بطاقة الهوية"
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
      // لم نعد بحاجة لإرسال userId. الخادم سيعرف المستخدم من "بطاقة الهوية".
      body: JSON.stringify({ shoppingList }),
    });
    if (!response.ok) throw new Error('Failed to save list');
    return response.json();
  }

  // قم بإضافة أي دوال حفظ أخرى هنا بنفس النمط الآمن
  // على سبيل المثال: saveCategories
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
}

export default ApiService;
