// auth.js (النسخة النهائية والمحسّنة)

// 1. تهيئة "حارس البوابة"
// تأكد من استبدال هذه القيم بالقيم الحقيقية من مشروعك على Supabase
const SUPABASE_URL = 'https://cbjhgxgniouvkeeonylw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiamhneGduaW91dmtlZW9ueWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjkyOTcsImV4cCI6MjA2NTUwNTI5N30.ebN5OdrM67i2gEsXuY-MriVNVtgDiYOCFDhjoZKs0w4';

// الطريقة الصحيحة لتهيئة العميل باستخدام المكتبة
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. البحث عن نماذج تسجيل الدخول وإنشاء الحساب في الصفحة الحالية
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// 3. ربط حدث "إنشاء الحساب" إذا كان النموذج موجودًا في الصفحة
if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // استخدام دالة signUp من Supabase
        const { error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert('خطأ في إنشاء الحساب: ' + error.message);
        } else {
            alert('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.');
            window.location.href = 'login.html'; // توجيه المستخدم لصفحة تسجيل الدخول
        }
    });
}

// 4. ربط حدث "تسجيل الدخول" إذا كان النموذج موجودًا في الصفحة
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // استخدام دالة signInWithPassword من Supabase
        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert('فشل تسجيل الدخول: ' + error.message);
        } else {
            // عند النجاح، يتم تخزين "الجلسة" تلقائيًا في المتصفح
            alert('تم تسجيل الدخول بنجاح!');
            window.location.href = 'index.html'; // توجيه المستخدم إلى التطبيق الرئيسي
        }
    });
}
