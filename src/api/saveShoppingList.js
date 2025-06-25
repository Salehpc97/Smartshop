// /api/saveShoppingList.js (النسخة النهائية والآمنة)

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
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

        // الخطوة 3: التحقق من "بطاقة الهوية" والحصول على هوية المستخدم الحقيقية من الخادم
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated: Invalid token' });
        }
        
        const userId = user.id;

        // الخطوة 4: استخراج بيانات قائمة التسوق من الطلب
        const { shoppingList } = req.body;

        // الخطوة 5 (الحاسمة): تنفيذ منطق قاعدة البيانات بأمان
        // أ. حذف جميع العناصر القديمة للمستخدم الذي تم التحقق منه
        // لاحظ أننا لا نحتاج إلى .eq()! RLS سيهتم بذلك.
        const { error: deleteError } = await supabase.from('ShoppingListItems').delete().match({ user_id: userId });
        if (deleteError) throw deleteError;

        // ب. تحويل كائن البيانات إلى مصفوفة منظمة (منطقك الممتاز)
        const itemsToInsert = [];
        for (const category in shoppingList) {
            if (shoppingList[category] && Array.isArray(shoppingList[category])) {
                shoppingList[category].forEach(item => {
                    itemsToInsert.push({
                        item_name: item.name,
                        category: item.category,
                        user_id: userId // نستخدم المعرف الموثوق من الخادم
                    });
                });
            }
        }

        // ج. إذا كانت هناك عناصر جديدة، قم بإضافتها
        if (itemsToInsert.length > 0) {
            const { error: insertError } = await supabase.from('ShoppingListItems').insert(itemsToInsert);
            if (insertError) throw insertError;
        }

        res.status(200).json({ message: 'تم تحديث قائمة التسوق بنجاح!' });

    } catch (error) {
        console.error('خطأ في حفظ قائمة التسوق:', error.message);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
}
