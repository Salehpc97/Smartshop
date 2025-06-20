// app-bootstrap.js (النسخة النهائية مع معالجة السباق)

import { supabase } from './auth.js'; 
import App from './main.js';

function startApp(user) {
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
        appWrapper.classList.remove('hidden');
    }
    new App(user);
}

supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
        // إذا كنا في صفحة تسجيل الدخول، قم بتوجيهنا إلى الصفحة الرئيسية
        // هذا سيقوم بإزالة التوكن من الرابط وإكمال عملية تسجيل الدخول
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
            window.location.href = '/index.html';
        } else {
            startApp(session.user);
        }
    } 
    else if (event === 'SIGNED_OUT') {
        window.location.href = '/login.html';
    }
});

async function checkInitialSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
            startApp(session.user);
        }
    } else {
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
            window.location.href = '/login.html';
        }
    }
}

// --- هذا هو الإصلاح الحاسم ---
// لا تقم بتشغيل التحقق الأولي إذا كان الرابط يحتوي على "access_token"،
// لأن هذا يعني أن onAuthStateChange سيتولى المهمة.
if (!window.location.hash.includes('access_token')) {
    checkInitialSession();
}
