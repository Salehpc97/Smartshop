// /api/saveCategories.js (النسخة النهائية والآمنة)

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
        
        // الآن، لدينا المعرف الموثوق: user.id
        const userId = user.id;

        // الخطوة 4: استخراج بيانات الفئات من الطلب
        const { categories } = req.body;

        if (!categories) {
            return res.status(400).json({ message: 'بيانات الفئات مفقودة.' });
        }

        // الخطوة 5: تنفيذ منطق قاعدة البيانات باستخدام الهوية الموثوقة
        const { error } = await supabase
            .from('UserCategories')
            .upsert({ user_id: userId, categories_data: categories }, { onConflict: 'user_id' });
        
        if (error) throw error;
        
        res.status(200).json({ message: 'تم تحديث الفئات بنجاح!' });

    } catch (error) {
        console.error('خطأ في حفظ الفئات:', error.message);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
}
