// امسح كل محتوى script.js وضع هذا الكود

const { useState, useEffect } = React;

// --- المكون الجديد: النافذة المنبثقة ---
// من أفضل الممارسات في React هو فصل الأجزاء المعقدة إلى مكونات خاصة بها.
function CustomItemModal({ categories, onAddItem, onClose }) {
  const [itemName, setItemName] = useState('');
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


// --- المكون الرئيسي للتطبيق (مع تعديلات) ---
function SmartShopApp() {
  // 1. إدارة الحالة
  const [shoppingData, setShoppingData] = useState({});
  const [categories, setCategories] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [userId, setUserId] = useState('bcdd1361-a8dc-4feb-88aa-48d3d2724b5a');
  const [errorMessage, setErrorMessage] =useState('');
  
  // *** الحالة الجديدة للتحكم في النافذة المنبثقة ***
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. جلب البيانات الأولية (لم يتغير)
  useEffect(() => {
    // ... الكود الخاص بـ fetchInitialData هنا ...
  }, [userId]);

  // 3. دوال لمعالجة الأحداث
  async function handleAddItem() {
    // ... الكود الخاص بـ handleAddItem هنا ...
  }
  
  // *** دالة جديدة لإضافة العنصر المخصص القادم من النافذة المنبثقة ***
  async function handleAddCustomItem(itemName, category) {
      // يمكنك هنا إضافة منطق التحقق من التكرار كما في النسخة الأصلية
      console.log(`إضافة عنصر مخصص: ${itemName} في فئة ${category}`);
      
      const newItem = { name: itemName, category: category };
      
      // تحديث متفائل للواجهة
      const newShoppingData = { ...shoppingData };
      if (!newShoppingData[category]) {
        newShoppingData[category] = [];
      }
      newShoppingData[category].push(newItem);
      setShoppingData(newShoppingData);
      
      const newCategories = { ...categories };
      newCategories[category].push(itemName);
      setCategories(newCategories);
      
      setIsModalOpen(false); // إغلاق النافذة بعد الإضافة

      // حفظ كلا التغييرين في قاعدة البيانات
      try {
        await Promise.all([
            fetch('/api/addCustomItem', { // ستحتاج لإنشاء هذه الواجهة
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item: newItem, userId: userId, allCategories: newCategories })
            })
        ]);
      } catch(error) {
        console.error("فشل حفظ العنصر المخصص:", error);
        setErrorMessage("فشل حفظ العنصر المخصص في الخادم.");
      }
  }


  // 4. وصف الواجهة
  return (
    <div>
      {/* ... الواجهة الرئيسية ... */}
      <div className="ManiScrean">
        {/* ... المدخلات والأزرار ... */}
        {/* هذا الزر الآن يتحكم في حالة النافذة المنبثقة */}
        <button onClick={() => setIsModalOpen(true)}>➕ إضافة عنصر جديد</button>
      </div>
      
      {/* ... عرض قائمة التسوق ... */}

      {/* *** العرض الشرطي للنافذة المنبثقة *** */}
      {/* هذا يعني: "إذا كانت isModalOpen تساوي true، قم بعرض مكون النافذة" */}
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

// ... ربط React بالـ DOM ...
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SmartShopApp />);
