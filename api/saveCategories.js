// /api/saveCategories.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    // === جهاز التنصت الذي زرعناه ===
    console.log("تم استدعاء saveCategories. جسم الطلب (req.body):", req.body);
    // ==================================

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { categories, userId } = req.body;

        // إضافة تحقق إضافي للتأكد من وجود البيانات
        if (!categories || !userId) {
            console.log("بيانات ناقصة في الطلب. لن يتم الحفظ.");
            return res.status(400).json({ message: 'بيانات ناقصة: الفئات أو معرف المستخدم مفقود.' });
        }

        const { error } = await supabase
            .from('UserCategories')
            .upsert({ user_id: userId, categories_data: categories }, { onConflict: 'user_id' });

        if (error) {
            // إذا حدث خطأ في قاعدة البيانات، قم بتسجيله وإرساله
            console.error("خطأ من Supabase:", error);
            throw error;
        }
        
        console.log("تم الحفظ بنجاح للمستخدم:", userId);
        res.status(200).json({ message: 'تم تحديث الفئات بنجاح!' });

    } catch (error) {
        console.error('خطأ في حفظ الفئات:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
};
