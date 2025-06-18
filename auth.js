// auth.js (النسخة المصححة للتصدير)

// 1. تهيئة "حارس البوابة"
// تأكد من استبدال هذه القيم بالقيم الحقيقية من مشروعك على Supabase
const SUPABASE_URL = 'https://cbjhgxgniouvkeeonylw.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiamhneGduaW91dmtlZW9ueWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjkyOTcsImV4cCI6MjA2NTUwNTI5N30.ebN5OdrM67i2gEsXuY-MriVNVtgDiYOCFDhjoZKs0w4';

// ************* هذا هو السطر الذي يحتاج إلى تصحيح وتغيير *************
// يجب أن نستخدم 'window.supabase' (المتغير العام الذي توفره مكتبة Supabase من CDN)
// ويجب أن نقوم بتصدير العميل باستخدام 'export const'
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// *******************************************************************

// 2. البحث عن نماذج تسجيل الدخول وإنشاء الحساب في الصفحة الحالية
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// 3. ربط حدث "إنشاء الحساب" إذا كان النموذج موجودًا في الصفحة
if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // استخدام دالة signUp من عميل Supabase الذي تم تصديره
        const { error } = await supabase.auth.signUp({ // استخدم 'supabase' بدلاً من 'supabaseClient'
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

        // استخدام دالة signInWithPassword من عميل Supabase الذي تم تصديره
        const { error } = await supabase.auth.signInWithPassword({ // استخدم 'supabase' بدلاً من 'supabaseClient'
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
