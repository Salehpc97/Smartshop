// /api/getList.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    // هذه الدالة تجلب البيانات، لذلك يجب أن يكون الطلب من نوع GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // نستخرج معرف المستخدم من رابط الطلب (Query Parameter)
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'معرف المستخدم مطلوب' });
        }

        // جلب جميع المنتجات التي تطابق معرف المستخدم من قاعدة البيانات
        let { data: shoppingListItems, error } = await supabase
            .from('ShoppingListItems')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        
        // إعادة هيكلة البيانات لتناسب الشكل الذي يتوقعه الكود في script.js
        const shoppingData = {};
        if (shoppingListItems) {
            shoppingListItems.forEach(item => {
                if (!shoppingData[item.category]) {
                    shoppingData[item.category] = [];
                }
                shoppingData[item.category].push({ name: item.item_name, category: item.category });
            });
        }
        
        // إرسال البيانات المنسقة إلى الواجهة الأمامية
        res.status(200).json({ data: shoppingData });

    } catch (error) {
        console.error('خطأ في جلب قائمة التسوق:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
};
