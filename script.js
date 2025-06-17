// امسح كل محتوى script.js وضع هذا الكود

const { useState, useEffect } = React;

function SmartShopApp() {
  // 1. إدارة الحالة: نفس المتغيرات التي كانت خصائص في الكلاس القديم
  const [shoppingData, setShoppingData] = useState({});
  const [categories, setCategories] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [userId, setUserId] = useState('bcdd1361-a8dc-4feb-88aa-48d3d2724b5a');
  const [errorMessage, setErrorMessage] = useState('');

  // 2. جلب البيانات الأولية (بديل لدالة _initializeData)
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [listResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/getList?userId=${userId}`),
          fetch(`/api/getCategories?userId=${userId}`)
        ]);
        const listResult = await listResponse.json();
        const categoriesResult = await categoriesResponse.json();
        if (listResult.data) setShoppingData(listResult.data);
        if (categoriesResult.data) setCategories(categoriesResult.data);
      } catch (error) {
        console.error("فشل جلب البيانات الأولية:", error);
        setErrorMessage("فشل تحميل البيانات من الخادم.");
      }
    }
    fetchInitialData();
  }, [userId]);

  // 3. إعادة بناء "العقل" - منطق التصنيف (ترجمة لدالة _getCategory)
  function getCategoryForItem(itemName) {
    const searchTerm = itemName.trim().toLowerCase();
    if (!searchTerm) return { category: 'أخرى', matchedItem: itemName.trim() };
    for (const category in categories) {
        const foundItem = categories[category].find(item => item.toLowerCase() === searchTerm);
        if (foundItem) return { category, matchedItem: foundItem };
    }
    // يمكنك إضافة منطق البحث بالبداية هنا إذا أردت
    return { category: 'أخرى', matchedItem: itemName.trim() };
  }

  // 4. دالة إضافة ذكية ومحسّنة (ترجمة لدالة addItem)
  async function handleAddItem() {
    setErrorMessage(''); // إخفاء أي خطأ قديم
    if (inputValue.trim() === '') return;

    const { category, matchedItem } = getCategoryForItem(inputValue);

    // إذا لم يكن العنصر موجودًا في قائمة الفئات الرئيسية
    if (category === 'أخرى') {
      setErrorMessage(`العنصر "${inputValue}" غير معروف. حاول إضافته كعنصر مخصص.`);
      return;
    }

    // التحقق من أن العنصر ليس مكررًا في قائمة التسوق الحالية
    if (shoppingData[category] && shoppingData[category].some(item => (item.name || item) === matchedItem)) {
        setErrorMessage(`"${matchedItem}" موجود بالفعل في قائمتك.`);
        return;
    }

    const newItem = { name: matchedItem, category: category };

    // تحديث متفائل للواجهة
    const newShoppingData = { ...shoppingData };
    if (!newShoppingData[category]) {
      newShoppingData[category] = [];
    }
    newShoppingData[category].push(newItem);
    setShoppingData(newShoppingData);
    setInputValue('');
    
    // حفظ العنصر في قاعدة البيانات
    try {
        await fetch('/api/addItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: newItem, userId: userId })
        });
    } catch(error) {
        console.error("فشل حفظ العنصر:", error);
        setErrorMessage("فشل حفظ العنصر في الخادم. حاول مرة أخرى.");
        // هنا يمكنك إضافة منطق للتراجع عن التحديث المتفائل
    }
  }

  // ... يمكنك إضافة بقية الدوال مثل handleClearAll و handleAddCustom هنا ...

  // 5. وصف الواجهة (مع تعديل بسيط لعرض رسالة الخطأ)
  return (
    <div>
      <h1>SmartShope app</h1>
      <div className="ManiScrean">
        <input 
          type="text" 
          placeholder="أدخل عنصرًا..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {/* عرض رسالة الخطأ فقط إذا كانت موجودة */}
        {errorMessage && <div className="error-message" style={{visibility: 'visible', opacity: 1}}>{errorMessage}</div>}
        <button onClick={handleAddItem}>إضافة</button>
        {/* ... بقية الأزرار ... */}
      </div>
      
      <div id="categories">
        {Object.keys(shoppingData).map(category => (
          <div key={category} className="category-section">
            <h3>{category}</h3>
            <ul>
              {shoppingData[category].map((item, index) => (
                <li key={index}>{item.name || item}</li> // التعامل مع الهياكل المختلفة
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. ربط React بالـ DOM (لم يتغير)
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SmartShopApp />);
