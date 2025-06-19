// /api/getCategories.js (النسخة النهائية والآمنة)

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
        // لاحظ أننا لم نعد بحاجة إلى .eq('user_id', userId)!
        // سياسة RLS التي كتبتها ستقوم بتصفية النتائج تلقائيًا.
        let { data: userCategories, error } = await supabase
            .from('UserCategories')
            .select('categories_data')
            .single(); // .single() لأننا نتوقع سجلًا واحدًا فقط لكل مستخدم

        // هذا هو منطقك الذكي لمعالجة الأخطاء
        if (error && error.code !== 'PGRST116') { // تجاهل خطأ "لم يتم العثور على صفوف"
            throw error;
        }

        res.status(200).json({ data: userCategories ? userCategories.categories_data : null });

    } catch (error) {
        console.error('خطأ في جلب الفئات:', error.message);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
}
