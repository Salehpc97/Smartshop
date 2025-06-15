// /api/saveCategories.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { categories, userId } = req.body;

        // سنقوم هنا بتحديث بيانات الفئات للمستخدم.
        // نفترض أن لديك جدول اسمه 'UserCategories' يخزن الفئات لكل مستخدم
        // الـ Upsert تقوم بالتحديث إذا كان السجل موجودًا، أو بالإضافة إذا لم يكن موجودًا.
        const { error } = await supabase
            .from('UserCategories') // اسم جدول الفئات المخصصة
            .upsert({ user_id: userId, categories_data: categories }, { onConflict: 'user_id' });

        if (error) throw error;
        
        res.status(200).json({ message: 'تم تحديث الفئات بنجاح!' });

    } catch (error) {
        console.error('خطأ في حفظ الفئات:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
};
