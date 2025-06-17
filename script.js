// امسح كل محتوى script.js وضع هذا الكود

const { useState, useEffect } = React;

// --- المكون الجديد: النافذة المنبثقة ---
function CustomItemModal({ categories, onAddItem, onClose }) {
  // الحالة الداخلية الخاصة بالنافذة المنبثقة فقط
  const [itemName, setItemName] = useState('');
  // قم بتعيين الفئة الأولى كقيمة افتراضية لتجنب أن تكون فارغة
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(categories)[0] || '');

  function handleConfirm() {
    if (!itemName.trim()) {
      alert('الرجاء إدخال اسم العنصر');
      return;
    }
    onAddItem(itemName, selectedCategory);
  }

  return (
    <div className="custom-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <input 
          type="text" 
          placeholder="اسم العنصر الجديد"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        {/* الآن، هذه القائمة ستعمل لأن البيانات ستكون قد وصلت */}
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {Object.keys(categories).filter(cat => cat !== 'أخرى').map(cat => 
            <option key={cat} value={cat}>{cat}</option>
          )}
        </select>
        <button onClick={handleConfirm}>تأكيد الإضافة</button>
      </div>
    </div>
  );
}

// --- المكون الرئيسي للتطبيق (مع تعديلات هيكلية) ---
function SmartShopApp() {
  // 1. إدارة الحالة
  const [shoppingData, setShoppingData] = useState({});
  const [categories, setCategories] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [userId, setUserId] = useState('bcdd1361-a8dc-4feb-88aa-48d3d2724b5a');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. جلب البيانات الأولية (لم يتغير)
  useEffect(() => {
    async function fetchInitialData() {
        // ... الكود الخاص بـ fetchInitialData هنا ...
        // كمثال، سنستخدم بيانات افتراضية الآن للتأكد من أن كل شيء يعمل
        setCategories({
            'فواكه': ['تفاح', 'موز', 'برتقال'],
            'خضروات': ['جزر', 'خيار', 'طماطم']
        });
    }
    fetchInitialData();
  }, [userId]);

  // 3. دوال لمعالجة الأحداث (يمكنك إضافة المنطق الخاص بها لاحقًا)
  function handleAddItem() { /* ... */ }
  function handleAddCustomItem(itemName, category) {
    console.log(`إضافة عنصر مخصص: ${itemName} في فئة ${category}`);
    // ... هنا تضع منطق الإضافة الكامل ...
    setIsModalOpen(false); // إغلاق النافذة بعد الإضافة
  }

  // 4. وصف الواجهة (هنا الإصلاح الحاسم)
  // كل شيء يجب أن يكون داخل عنصر واحد، مثل هذا الـ <div>
  return (
    <div>
      {/* الجزء الأول: الواجهة الرئيسية */}
      <h1>SmartShope app</h1>
      <div className="ManiScrean">
        <input 
          type="text" 
          placeholder="أدخل عنصرًا..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleAddItem}>إضافة</button>
        {/* هذا الزر الآن يتحكم في حالة النافذة المنبثقة */}
        <button onClick={() => setIsModalOpen(true)}>➕ إضافة عنصر جديد</button>
      </div>
      <div id="categories">
        {/* عرض قائمة التسوق هنا */}
      </div>

      {/* الجزء الثاني: العرض الشرطي للنافذة المنبثقة */}
      {/* سيبقى هذا الجزء مخفيًا حتى تصبح isModalOpen تساوي true */}
      {isModalOpen && (
        <CustomItemModal 
          categories={categories}
          onAddItem={handleAddCustomItem}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

// 5. ربط React بالـ DOM (لم يتغير)
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SmartShopApp />);
