// /api/saveShoppingList.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // نستقبل قائمة التسوق ومعرف المستخدم من الطلب
        const { shoppingList, userId } = req.body;

        // خطوة حيوية: لحفظ القائمة الجديدة، يجب أولاً حذف القائمة القديمة لهذا المستخدم
        // هذا يمنع تراكم المنتجات المكررة أو المحذوفة.
        const { error: deleteError } = await supabase
            .from('ShoppingListItems') // اسم جدول المنتجات
            .delete()
            .eq('user_id', userId); // احذف فقط للمستخدم الحالي

        if (deleteError) throw deleteError;

        // الآن، إذا كانت القائمة الجديدة ليست فارغة، قم بإضافة جميع عناصرها
        if (shoppingList && shoppingList.length > 0) {
            // تجهيز البيانات لتناسب أعمدة قاعدة البيانات
            const itemsToInsert = shoppingList.map(item => ({
                item_name: item.name,
                category: item.category,
                user_id: userId
            }));
            
            const { error: insertError } = await supabase
                .from('ShoppingListItems')
                .insert(itemsToInsert);

            if (insertError) throw insertError;
        }

        res.status(200).json({ message: 'تم تحديث قائمة التسوق بنجاح!' });

    } catch (error) {
        // هنا تظهر أهمية خبرتك في تصحيح الأخطاء[2]
        console.error('خطأ في حفظ قائمة التسوق:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
};
