// المسار: /api/addItem.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
    try {
        const { item, userId } = req.body;
        await supabase.from('ShoppingListItems').insert({
            item_name: item.name,
            category: item.category,
            user_id: userId
        });
        res.status(200).json({ message: 'Item added successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

