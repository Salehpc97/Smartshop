// امسح كل محتوى script.js وضع هذا الكود

// استيراد "الخطافات" (Hooks) التي سنحتاجها من React
const { useState, useEffect } = React;

// هذا هو المكون الرئيسي الذي يحتوي على كل شيء
function SmartShopApp() {
  // 1. إدارة الحالة: هنا نعلن عن كل البيانات التي ستتغير
  const [shoppingData, setShoppingData] = useState({}); // لتخزين قائمة التسوق
  const [categories, setCategories] = useState({});     // لتخزين قائمة الفئات الرئيسية
  const [inputValue, setInputValue] = useState('');     // لتخزين قيمة حقل الإدخال
  const [errorMessage, setErrorMessage] = useState(''); // لتخزين رسائل الخطأ

  // 2. جلب البيانات الأولية (بديل لـ _initializeData)
  // useEffect هو "خطاف" يتم تشغيله بعد رسم المكون
  useEffect(() => {
    // هذه الدالة سيتم تشغيلها مرة واحدة فقط عند بدء تشغيل التطبيق
    async function fetchInitialData() {
      // يمكنك هنا وضع الكود الذي يجلب البيانات من الخادم
      // fetch(`/api/getList?userId=...`)
      // fetch(`/api/getCategories?userId=...`)
      console.log("التطبيق جاهز، يمكننا جلب البيانات الأولية هنا.");
      // كمثال، سنستخدم البيانات الافتراضية الآن
      setCategories({
          'فواكه': ['تفاح', 'موز', 'برتقال'],
          'خضروات': ['جزر', 'خيار', 'طماطم'],
          'أخرى': []
      });
    }
    fetchInitialData();
  }, []); // المصفوفة الفارغة تعني "شغّل هذا مرة واحدة فقط عند البداية"

  // 3. دوال لمعالجة الأحداث
  function handleAddItem() {
    if (inputValue.trim() === '') return;
    
    // هذا مجرد مثال بسيط الآن، سنضيف المنطق المعقد لاحقًا
    const category = 'أخرى'; // مثال بسيط
    
    // الطريقة الصحيحة لتحديث الحالة في React (إنشاء نسخة جديدة)
    const newShoppingData = { ...shoppingData };
    if (!newShoppingData[category]) {
      newShoppingData[category] = [];
    }
    newShoppingData[category].push(inputValue);
    
    setShoppingData(newShoppingData); // تحديث الحالة، React ستعيد الرسم تلقائيًا
    setInputValue(''); // إفراغ حقل الإدخال
    setErrorMessage(''); // مسح أي رسالة خطأ سابقة
  }

  function handleClearAll() {
    setShoppingData({}); // ببساطة قم بتفريغ الحالة
  }

  // 4. وصف الواجهة باستخدام JSX (ترجمة لملف HTML القديم)
  return (
    <div>
      <h1>SmartShope app</h1>
      
      <div className="ManiScrean"> {/* ملاحظة: class تصبح className في JSX */}
        <input 
          type="text" 
          id="itemInput" 
          placeholder="أدخل عنصرًا..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="error-message">{errorMessage}</div>
        
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
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. ربط تطبيق React بنقطة الدخول في HTML
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SmartShopApp />);
