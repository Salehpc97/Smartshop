// --- الخطوة 1: إنشاء "ناقل الأحداث" أو "محطة الراديو" (EventBus) ---
// هذه الفئة البسيطة هي قلب نظامنا الحدثي.
// مهمتها هي تسجيل "المستمعين" وإعلامهم عند وقوع حدث.
// --- البيانات الافتراضية الأساسية (توضع خارج الفئة لتكون ثابتة) ---
const DEFAULT_CATEGORIES = {
    'فواكه': ['تفاح', 'موز', 'برتقال', 'يوسفي', 'ليمون', 'عنب', 'كمثرى', 'دراق', 'خوخ', 'مشمش', 'تين', 'رمان', 'بطيخ', 'شمام', 'كيوي', 'أناناس', 'مانجو', 'جوافة', 'فراولة', 'توت', 'كرز', 'جريب فروت', 'بابايا', 'تمر', 'بلح', 'جوز الهند', 'رطب', 'افوكادو', 'برقوق'],
    'خضروات': ['جزر', 'خيار', 'طماطم', 'بطاطس', 'بصل', 'ثوم', 'فلفل', 'فلفل رومي', 'فلفل حار', 'خس', 'سبانخ', 'ملفوف', 'قرنبيط', 'بروكلي', 'كوسا', 'باذنجان', 'فجل', 'شمندر', 'كرنب', 'كرفس', 'بقدونس', 'كزبرة', 'شبت', 'نعناع', 'جرجير', 'فاصوليا', 'لوبيا', 'بازلاء', 'ذرة', 'فول', 'عدس', 'بطاطا حلوة', 'يقطين', 'قرع', 'كوسة', 'ورق عنب'],
    'معلبات': ['زيت', 'طماطم معلب', 'معجون طماطم', 'خيار مخلل', 'زيتون', 'تونة', 'سردين', 'فول معلب', 'حمص معلب', 'ذرة معلبة', 'بازلاء معلبة', 'فاصوليا معلبة', 'فطر معلب', 'مربى', 'عسل', 'ماء ورد', 'ماء زهر', 'صلصة', 'كاتشب', 'مايونيز', 'شاي', 'قهوة', 'سكر', 'ملح', 'ارز', 'مكرونة', 'شوربة معلبة', 'مرق دجاج', 'مرق لحم', 'شوربة فورية', 'حليب مكثف', 'حليب مبخر'],
    'أخرى': []
};

// --- ناقل الأحداث (Event Bus) ---
class EventBus {
    constructor() { this.listeners = {};
 }
    on(eventName, callback) {
        if (!this.listeners[eventName]) this.listeners[eventName] = [];
        this.listeners[eventName].push(callback);
    }
    emit(eventName) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => callback());
        }
    }
}

// --- الفئة الرئيسية للتطبيق ---
class SmartShoppingApp {
    constructor() {
        this.userId = 'bcdd1361-a8dc-4feb-88aa-48d3d2724b5a'; // 
        this._getDomElements();
        // **تصحيح مهم**: التحقق من وجود كل العناصر قبل المتابعة
        if (!this.itemInput || !this.addItemBtn || !this.clearAllBtn || !this.addCustomItemBtn) {
            console.error("خطأ فادح: لم يتم العثور على أحد عناصر التحكم الرئيسية. تأكد من تطابق معرفات (IDs) HTML مع الجافا سكربت.");
            return; // أوقف التنفيذ إذا كان هناك عنصر مفقود
        }
        
        this._initializeData();
        this._bindEventListeners();
        this.eventBus = new EventBus();
        this._subscribeToEvents();
    }
    
    _itemExistsInAnyCategory(itemName) {
        for (const category in this.categories) {
            if (this.categories[category].includes(itemName)) {
                return category; // أعد اسم الفئة التي يوجد بها العنصر
            }
        }
        return null; // العنصر غير موجود
    }

    _getDomElements() {

        this.itemInput = document.getElementById('itemInput');
        this.addItemBtn = document.getElementById('addItem');
        this.errorMessageContainer = document.getElementById('error-message-container');

        this.clearAllBtn = document.getElementById('clearAll');
        this.categoriesList = document.getElementById('categories');
        this.suggestionsContainer = document.getElementById('suggestions-container');
        this.addCustomItemBtn = document.getElementById('addCustomItem');
    }

    // دالة لعرض رسالة الخطأ
_showError(message) {
    this.errorMessageContainer.textContent = message;
    this.errorMessageContainer.classList.add('visible');
}

// دالة لإخفاء رسالة الخطأ
_hideError() {
    this.errorMessageContainer.classList.remove('visible');
}

// الدالة قبل التعديل ---
    /*_initializeData() {
        const savedCategories = localStorage.getItem('categories');
        this.categories = savedCategories ? JSON.parse(savedCategories) : structuredClone(DEFAULT_CATEGORIES);
        this.allItemsForAutocomplete = Object.values(this.categories).flat();
        this.shoppingData = JSON.parse(localStorage.getItem('shoppingList')) || { 'فواكه': [], 'خضروات': [], 'معلبات': [], 'أخرى': [] };
    }
*/
// الدالة بعد التعديل ---
// الكود المعدل والمقترح لدالة _initializeData
async _initializeData() {
    // عرض رسالة تحميل للمستخدم
    this.categoriesList.innerHTML = '<li>جاري تحميل القائمة...</li>';

    try {
        // إنشاء مصفوفة من الوعود (Promises) لجلب البيانات بشكل متزامن
        const [shoppingListResponse, categoriesResponse] = await Promise.all([
            fetch(`/api/getList?userId=${this.userId}`),
            fetch(`/api/getCategories?userId=${this.userId}`)
        ]);

        if (!shoppingListResponse.ok || !categoriesResponse.ok) {
            throw new Error('فشل في جلب البيانات الأولية من الخادم');
        }

        const shoppingListData = await shoppingListResponse.json();
        const categoriesData = await categoriesResponse.json();

        // تحديث بيانات التطبيق بالبيانات القادمة من الخادم
        this.shoppingData = shoppingListData.data || { 'فواكه': [], 'خضروات': [], 'معلبات':[], 'أخرى': [] };
        this.categories = categoriesData.data || structuredClone(DEFAULT_CATEGORIES);
        
    } catch (error) {
        console.error("خطأ في تهيئة البيانات:", error);
        // في حالة الفشل، عد إلى البيانات الافتراضية
        this.shoppingData = { 'فواكه': [], 'خضروات': [], 'معلبات':[], 'أخرى': [] };
        this.categories = structuredClone(DEFAULT_CATEGORIES);
    } finally {
        // تحديث قائمة الإكمال التلقائي وعرض البيانات على الشاشة
        this.allItemsForAutocomplete = Object.values(this.categories).flat();
        this.render(); // عرض البيانات بعد اكتمال التحميل
    }
}

    _bindEventListeners() {
        this.addItemBtn.addEventListener('click', this.addItem.bind(this));
        this.clearAllBtn.addEventListener('click', this.clearAllItems.bind(this));
        this.itemInput.addEventListener('input', this._showSuggestions.bind(this));
        this.itemInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') this.addItem();
        });
        this.categoriesList.addEventListener('click', this._handleListClick.bind(this));
        this.addCustomItemBtn.addEventListener('click', () => this._showCustomItemModal());
    }

    // الشكل الصحيح والنهائي الذي يجمع كل شيء
_subscribeToEvents() {
    // هذا هو "المستمع" الوحيد الذي ينتظر إشارة 'dataChanged'
    this.eventBus.on('dataChanged', () => {
        // رسالة للتحقق في سجلات المتصفح
        console.log("تم استقبال حدث dataChanged. جاري مزامنة كل البيانات مع الخادم...");

        // الخطوة أ: قم بحفظ قائمة التسوق المحدثة
        this._saveShoppingData();

        // الخطوة ب: قم بحفظ الفئات المحدثة
        this._saveCategories();

        // الخطوة ج: قم بتحديث العرض على الشاشة
        this.render();
    });
}

    // --- هنا التعديل الرئيسي لمنع التكرار الشامل ---
    _itemExistsInAnyCategory(itemName) {
        const normalizedItem = itemName.toLowerCase();
        for (const [category, items] of Object.entries(this.categories)) {
            if (items.map(i => i.toLowerCase()).includes(normalizedItem)) {
                return category;
            }
        }
        return null;
    }

    /*_saveCategories() {
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }
*/
async _saveCategories() {
    if (!this.userId) {
        console.error("لا يمكن حفظ الفئات: لم يتم تحديد هوية المستخدم.");
        return;
    }

    try {
        const response = await fetch('/api/saveCategories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                categories: this.categories,
                userId: this.userId
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const result = await response.json();
        console.log(result.message);

    } catch (error) {
        console.error("فشل في مزامنة الفئات مع الخادم:", error);
    }
}

    /*_saveShoppingData() {
        localStorage.setItem('shoppingList', JSON.stringify(this.shoppingData));
    }
    */
    async _saveShoppingData() {
        // نتحقق من وجود معرف للمستخدم قبل محاولة الحفظ
        if (!this.userId) {
            console.error("لا يمكن الحفظ: لم يتم تحديد هوية المستخدم.");
            return;
        }
    
        try {
            // نستدعي الدالة الخادمة التي أنشأناها على Vercel[1]
            const response = await fetch('/api/saveShoppingList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shoppingList: this.shoppingData, // نرسل القائمة الحالية
                    userId: this.userId             // نرسل معرف المستخدم
                }),
            });
    
            if (!response.ok) {
                // إذا فشل الخادم، اعرض رسالة خطأ
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
    
            const result = await response.json();
            console.log(result.message); // "تم تحديث قائمة التسوق بنجاح!"
    
        } catch (error) {
            console.error("فشل في مزامنة قائمة التسوق مع الخادم:", error);
            // هنا يمكنك عرض رسالة للمستخدم تفيد بوجود مشكلة في الحفظ
        }
    }
    
    render() {
        this.categoriesList.innerHTML = '';
        for (const [category, items] of Object.entries(this.shoppingData)) {
            if (items.length === 0) continue;
            const section = this._createCategorySection(category, items);
            this.categoriesList.appendChild(section);
        }
    }

    _showCustomItemModal() {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <input type="text" id="newItemName" placeholder="اسم العنصر الجديد">
                <select id="categorySelect">
                    ${Object.keys(this.categories).filter(cat => cat !== 'أخرى').map(cat => 
                        `<option value="${cat}">${cat}</option>`
                    ).join('')}
                </select>
                <button id="confirmAddCustom">تأكيد الإضافة</button>
            </div>
        `;
        document.body.appendChild(modal);
        this._setupModalEvents();
    }

    _setupModalEvents() {
        document.querySelector('.close').addEventListener('click', () => {
            document.querySelector('.custom-modal').remove();
        });
        document.getElementById('confirmAddCustom').addEventListener('click', () => {
            this._addCustomItem();
        });
    }

// النسخة النهائية والمحسّنة لدالة addItem
// في script.js: استبدل دالة addItem الحالية بهذه النسخة المصححة
addItem() {
    this._hideError(); // إخفاء أي خطأ قديم
    const userInput = this.itemInput.value.trim();
    if (userInput === '') return;

    const { category, matchedItem } = this._getCategory(userInput);

    if (matchedItem) {
        // التحقق الذكي: هل العنصر موجود بالفعل في قائمة التسوق الحالية؟
        if (this.shoppingData[category] && this.shoppingData[category].includes(matchedItem)) {
            this._showError(`"${matchedItem}" موجود بالفعل في قائمتك.`);
            return; // أوقف العملية هنا
        }

        // إذا لم يكن مكررًا، قم بإضافته وأطلق الإشارة
        this.shoppingData[category] = this.shoppingData[category] || [];
        this.shoppingData[category].push(matchedItem);
        this.eventBus.emit('dataChanged'); // استخدم النظام الحالي للحفظ والمزامنة

    } else {
        // إذا كان العنصر غير موجود على الإطلاق، اقترح إضافته كعنصر مخصص
        this._showError("عنصر غير معروف. حاول إضافته عبر 'إضافة عنصر مخصص'.");
    }

    this.itemInput.value = '';
    this.suggestionsContainer.innerHTML = '';
    this.itemInput.focus();
}

// في script.js: استبدل دالة _addCustomItem الحالية بهذه النسخة المصححة
_addCustomItem() {
    this._hideError();
    const itemName = document.getElementById('newItemName').value.trim();
    const selectedCategory = document.getElementById('categorySelect').value;
    if (!itemName) return alert('الرجاء إدخال اسم العنصر');

    // الجدار الأول: التحقق من وجود العنصر في قائمة الفئات الرئيسية
    const existingCategory = this._itemExistsInAnyCategory(itemName);
    if (existingCategory) {
        return alert(`هذا العنصر موجود بالفعل في فئة "${existingCategory}"!`);
    }

    // تحديث البيانات محليًا أولاً
    this.categories[selectedCategory].push(itemName);
    this.allItemsForAutocomplete.push(itemName);
    this.shoppingData[selectedCategory] = this.shoppingData[selectedCategory] || [];
    this.shoppingData[selectedCategory].push(itemName);

    // إطلاق الإشارة لمركز القيادة ليتولى الحفظ
    this.eventBus.emit('dataChanged');
    
    alert(`تمت إضافة '${itemName}' إلى فئة '${selectedCategory}' بنجاح!`);
    document.querySelector('.custom-modal').remove();
}


    clearAllItems() {
        this.shoppingData = { 'فواكه': [], 'خضروات': [], 'معلبات':[], 'أخرى': [] };
        this.eventBus.emit('dataChanged');
    }

    _handleListClick(event) {
        if (event.target.classList.contains('delete-item')) {
            const category = event.target.dataset.category;
            const item = event.target.dataset.item;
            this.shoppingData[category] = this.shoppingData[category].filter(i => i !== item);
            this.eventBus.emit('dataChanged');
        }
    }

    _getCategory(userInput) {
        const searchTerm = userInput.trim().toLowerCase();
        if (!searchTerm) return { category: 'أخرى', matchedItem: userInput.trim() };
        for (const [category, items] of Object.entries(this.categories)) {
            const foundItem = items.find(catItem => catItem.toLowerCase() === searchTerm);
            if (foundItem) return { category, matchedItem: foundItem };
        }
        for (const [category, items] of Object.entries(this.categories)) {
            const foundItem = items.find(catItem => catItem.toLowerCase().startsWith(searchTerm));
            if (foundItem) return { category, matchedItem: foundItem };
        }
        return { category: 'أخرى', matchedItem: userInput.trim() };
    }

    _createCategorySection(category, items) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'category-section';
        const title = document.createElement('h3');
        title.textContent = category;
        sectionDiv.appendChild(title);
        const ul = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&times;';
            deleteBtn.className = 'delete-item';
            deleteBtn.dataset.item = item;
            deleteBtn.dataset.category = category;
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });
        sectionDiv.appendChild(ul);
        return sectionDiv;
    }

    _showSuggestions() {
        const searchTerm = this.itemInput.value.trim().toLowerCase();
        this.suggestionsContainer.innerHTML = '';
        if (searchTerm.length === 0) return;
        const filteredItems = this.allItemsForAutocomplete.filter(item =>
            item.toLowerCase().startsWith(searchTerm)
        );
        filteredItems.forEach(item => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'suggestion-item';
            suggestionDiv.textContent = item;
            suggestionDiv.addEventListener('click', () => {
                this.itemInput.value = item;
                this.suggestionsContainer.innerHTML = '';
                this.addItemBtn.focus();
            });
            this.suggestionsContainer.appendChild(suggestionDiv);
        });
    }
}

// --- تشغيل التطبيق بعد تحميل الصفحة بالكامل ---
document.addEventListener('DOMContentLoaded', () => {
    new SmartShoppingApp();
});
