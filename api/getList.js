// /api/getList.js (النسخة النهائية والآمنة)

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // الخطوة 1: استخراج "بطاقة هوية" المستخدم (JWT) من الطلب
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated: No token provided' });
        }

        // الخطوة 2: إنشاء عميل Supabase موثوق "باسم" المستخدم
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY, // نستخدم مفتاح anon العام لأن RLS هو الذي سيقوم بالحماية
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        // الخطوة 3 (الحاسمة): جلب البيانات
        // لاحظ أننا لا نحتاج إلى .eq('user_id', userId)! RLS سيهتم بذلك.
        let { data: shoppingListItems, error } = await supabase
            .from('ShoppingListItems')
            .select('*');

        if (error) throw error;
        
        // --- هذا هو منطقك الذكي والممتاز لإعادة الهيكلة ---
        const shoppingData = {};
        if (shoppingListItems) {
            shoppingListItems.forEach(item => {
                // قد تحتاج إلى التأكد من أن اسم العمود هو 'category' أو 'category_name'
                const category = item.category || item.category_name; 
                if (!shoppingData[category]) {
                    shoppingData[category] = [];
                }
                shoppingData[category].push({ name: item.item_name, category: category });
            });
        }
        // ----------------------------------------------------
        
        res.status(200).json({ data: shoppingData });

    } catch (error) {
        console.error('خطأ في جلب قائمة التسوق:', error.message);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
}
