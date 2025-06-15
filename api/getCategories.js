// /api/getCategories.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'معرف المستخدم مطلوب' });
        }
        
        // جلب بيانات الفئات الخاصة بالمستخدم
        let { data: userCategories, error } = await supabase
            .from('UserCategories')
            .select('categories_data')
            .eq('user_id', userId)
            .single(); // .single() لأننا نتوقع سجلًا واحدًا فقط لكل مستخدم

        if (error && error.code !== 'PGRST116') { // تجاهل خطأ "لم يتم العثور على صفوف"
            throw error;
        }

        res.status(200).json({ data: userCategories ? userCategories.categories_data : null });

    } catch (error) {
        console.error('خطأ في جلب الفئات:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
};
