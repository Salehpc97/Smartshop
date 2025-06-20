// auth.js (النسخة النهائية مع الاستيراد الصحيح)

// --- هذا هو السطر الحاسم الذي يحل المشكلة ---
// نقوم بإضافة "+esm" إلى نهاية الرابط لنطلب النسخة الوحدوية
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// بقية الكود يبقى كما هو، لأنه الآن سيعمل بشكل صحيح
const SUPABASE_URL = 'https://cbjhgxgniouvkeeonylw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiamhneGduaW91dmtlZW9ueWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjkyOTcsImV4cCI6MjA2NTUwNTI5N30.ebN5OdrM67i2gEsXuY-MriVNVtgDiYOCFDhjoZKs0w4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// بقية منطق نماذج تسجيل الدخول وإنشاء الحساب
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert('خطأ في إنشاء الحساب: ' + error.message);
        } else {
            alert('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.');
            window.location.href = 'login.html';
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert('فشل تسجيل الدخول: ' + error.message);
        } else {
            alert('تم تسجيل الدخول بنجاح!');
            window.location.href = 'index.html';
        }
    });
}

// تسجيل الدخول عبر جوجل

const googleSignInButton = document.getElementById('google-signin-btn');

if (googleSignInButton) {
    googleSignInButton.addEventListener('click', async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            alert('فشل تسجيل الدخول عبر جوجل: ' + error.message);
        }
        // إذا نجح الأمر، ستقوم Supabase بإعادة توجيه المستخدم تلقائيًا
    });
}
