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
        const { shoppingList, userId } = req.body;

        // الخطوة أ: حذف جميع العناصر القديمة لهذا المستخدم
        await supabase.from('ShoppingListItems').delete().eq('user_id', userId);

        // الخطوة ب (التحويل الذكي): تحويل الكائن إلى مصفوفة قابلة للحفظ
        const itemsToInsert = [];
        for (const category in shoppingList) {
            if (shoppingList.hasOwnProperty(category)) {
                shoppingList[category].forEach(itemName => {
                    itemsToInsert.push({
                        item_name: itemName,
                        category: category,
                        user_id: userId
                    });
                });
            }
        }

        // الخطوة ج: إذا كانت هناك عناصر جديدة، قم بإضافتها
        if (itemsToInsert.length > 0) {
            const { error: insertError } = await supabase
                .from('ShoppingListItems')
                .insert(itemsToInsert);

            if (insertError) throw insertError;
        }

        res.status(200).json({ message: 'تم تحديث قائمة التسوق بنجاح!' });

    } catch (error) {
        console.error('خطأ في حفظ قائمة التسوق:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
};


