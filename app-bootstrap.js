// app-bootstrap.js (النسخة النهائية مع التحكم في العرض)

import { supabase } from './auth.js'; 
import App from './main.js';

async function initializeApplication() {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error("Error getting session:", sessionError.message);
            window.location.href = 'login.html';
            return;
        }

        if (!session) {
            window.location.href = 'login.html';
        } else {
            // --- هذا هو التعديل الحاسم ---
            // قبل تشغيل التطبيق، قم بإظهار المحتوى الرئيسي الذي كان مخفيًا
            const appWrapper = document.querySelector('.app-wrapper');
            if (appWrapper) {
                appWrapper.classList.remove('hidden');
            }
            
            // الآن، قم بتشغيل التطبيق الرئيسي
            new App(session.user);
        }
    } catch (error) {
        console.error("Failed to initialize application:", error);
        window.location.href = 'login.html';
    }
}

initializeApplication();
