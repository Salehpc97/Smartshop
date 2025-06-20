// app-bootstrap.js (النسخة النهائية مع معالجة OAuth)

import { supabase } from './auth.js'; 
import App from './main.js';

// دالة لتشغيل التطبيق الرئيسي
function startApp(user) {
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
        appWrapper.classList.remove('hidden');
    }
    new App(user);
}

// --- هذا هو التعديل الحاسم ---
// نستمع الآن إلى أي تغيير في حالة المصادقة
supabase.auth.onAuthStateChange(async (event, session) => {
    // إذا كان الحدث هو تسجيل دخول ناجح (من جوجل أو غيره)
    if (event === 'SIGNED_IN' && session) {
        // إذا كنا في صفحة تسجيل الدخول، قم بتوجيهنا إلى الصفحة الرئيسية
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
            window.location.href = '/index.html';
        } else {
            // إذا كنا بالفعل في الصفحة الرئيسية، قم بتشغيل التطبيق
            startApp(session.user);
        }
    } 
    // إذا كان الحدث هو تسجيل خروج
    else if (event === 'SIGNED_OUT') {
        window.location.href = '/login.html';
    }
});

// --- نقوم أيضًا بالتحقق من الجلسة الحالية عند تحميل الصفحة ---
async function checkInitialSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        // إذا وجدنا جلسة ونحن لسنا في صفحة المصادقة، قم بتشغيل التطبيق
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
            startApp(session.user);
        }
    } else {
        // إذا لم نجد جلسة ونحن لسنا في صفحة المصادقة، قم بالتوجيه إلى تسجيل الدخول
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
            window.location.href = '/login.html';
        }
    }
}

// قم بتشغيل التحقق الأولي
checkInitialSession();
