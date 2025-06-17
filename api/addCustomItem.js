// المسار: /api/addCustomItem.js (ملف جديد)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
    try {
        const { item, userId, allCategories } = req.body;
        
        // المهمة أ: إضافة العنصر الجديد إلى قائمة التسوق
        await supabase.from('ShoppingListItems').insert({
            item_name: item.name,
            category: item.category,
            user_id: userId
        });
        
        // المهمة ب: تحديث قائمة الفئات بالكامل
        await supabase.from('UserCategories').upsert({
            user_id: userId,
            categories_data: allCategories
        }, { onConflict: 'user_id' });
        
        res.status(200).json({ message: 'Custom item and categories updated successfully' });
   // هذا الكود يوضع بدل كتلة catch الحالية في كلا الملفين: addItem.js و addCustomItem.js
} catch (error) {
    console.error('API Error:', error);

    // === هذا هو الجزء الذكي ===
    // إذا كان الخطأ هو خطأ تكرار من قاعدة البيانات
    if (error.code === '23505') { 
        return res.status(409).json({ message: 'هذا العنصر موجود بالفعل في القائمة.' });
    }
    // =========================

    // لأي خطأ آخر، أرسل خطأ خادم عام
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
}

};
