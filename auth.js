// auth.js (النسخة النهائية مع الاستيراد الصحيح)

// --- الخطوة 1: نستورد الدالة مباشرة من الـ CDN ---
// هذا يضمن أنها ستكون متاحة دائمًا قبل تشغيل بقية الكود
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

// --- الخطوة 2: نقوم بتهيئة العميل وتصديره ---
const SUPABASE_URL = 'https://cbjhgxgniouvkeeonylw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiamhneGduaW91dmtlZW9ueWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjkyOTcsImV4cCI6MjA2NTUwNTI5N30.ebN5OdrM67i2gEsXuY-MriVNVtgDiYOCFDhjoZKs0w4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- الخطوة 3: بقية المنطق يبقى كما هو ---
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
