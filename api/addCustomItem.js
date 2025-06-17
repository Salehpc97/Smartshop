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
    } catch (error) { res.status(500).json({ message: error.message }); }
};
