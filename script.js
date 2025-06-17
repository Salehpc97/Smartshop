// في script.js

const { useState, useEffect } = React;

function SmartShopApp() {
  // 1. إدارة الحالة
  const [shoppingData, setShoppingData] = useState({});
  const [categories, setCategories] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [userId, setUserId] = useState('bcdd1361-a8dc-4feb-88aa-48d3d2724b5a'); // معرف المستخدم التجريبي

  // 2. useEffect لجلب البيانات الأولية
  useEffect(() => {
    // نعرّف دالة غير متزامنة لجلب البيانات
    async function fetchInitialData() {
      console.log("جاري جلب البيانات الأولية للمستخدم:", userId);
      try {
        // جلب قائمة التسوق الحالية
        const listResponse = await fetch(`/api/getList?userId=${userId}`);
        const listResult = await listResponse.json();
        if (listResult.data) {
          setShoppingData(listResult.data);
        }

        // جلب قائمة الفئات
        const categoriesResponse = await fetch(`/api/getCategories?userId=${userId}`);
        const categoriesResult = await categoriesResponse.json();
        if (categoriesResult.data) {
          setCategories(categoriesResult.data);
        }
        
        console.log("تم جلب البيانات بنجاح!");

      } catch (error) {
        console.error("فشل جلب البيانات الأولية:", error);
      }
    }

    // استدعاء الدالة
    fetchInitialData();
  }, [userId]); // يتم تشغيل هذا التأثير مرة واحدة، أو إذا تغير userId

  // 3. دالة لإضافة عنصر جديد (سنتحدث مع الخادم هنا)
  async function handleAddItem() {
    if (inputValue.trim() === '') return;

    // هذا مجرد مثال بسيط الآن للتعامل مع الفئات
    const category = 'أخرى'; 
    const newItem = { name: inputValue, category: category };

    // تحديث متفائل للواجهة
    const newShoppingData = { ...shoppingData };
    if (!newShoppingData[category]) {
      newShoppingData[category] = [];
    }
    newShoppingData[category].push(newItem.name);
    setShoppingData(newShoppingData);
    setInputValue('');
    
    // الآن، قم بحفظ العنصر الجديد في قاعدة البيانات
    try {
        console.log("جاري حفظ العنصر الجديد في الخادم...");
        await fetch('/api/addItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: newItem, userId: userId })
        });
        console.log("تم حفظ العنصر بنجاح في الخادم.");
    } catch(error) {
        console.error("فشل حفظ العنصر في الخادم:", error);
        // يمكنك هنا إضافة منطق للتراجع عن التحديث المتفائل إذا فشل الحفظ
    }
  }

  function handleClearAll() {
    // في المستقبل، يجب أن تتحدث هذه الدالة أيضًا مع الخادم
    setShoppingData({});
  }

  // 4. وصف الواجهة (لم يتغير)
  return (
    <div>
      {/* ... كل كود JSX هنا يبقى كما هو ... */}
      <h1>SmartShope app</h1>
      
      <div className="ManiScrean">
        <input 
          type="text" 
          placeholder="أدخل عنصرًا..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="error-message"></div>
        
        <button onClick={handleAddItem}>إضافة</button>
        <button onClick={handleClearAll}>مسح الكل</button>
        <button>➕ إضافة عنصر جديد</button>
      </div>
      
      <div id="categories">
        {Object.keys(shoppingData).map(category => (
          <div key={category} className="category-section">
            <h3>{category}</h3>
            <ul>
              {shoppingData[category].map((item, index) => (
                <li key={index}>{item.name || item}</li> // التعامل مع كلا الهيكلين
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. ربط React بالـ DOM (لم يتغير)
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SmartShopApp />);
