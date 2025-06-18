// app-bootstrap.js (حارس البوابة الرئيسي للتطبيق)

// 1. استيراد عميل Supabase الذي تم تهيئته من auth.js
// تأكد من أن المسار صحيح إذا كان ملف auth.js في مجلد مختلف (مثلاً './js/auth.js')
import { supabase } from './auth.js'; 

// 2. استيراد الكلاس الرئيسي لتطبيقنا
// تأكد من أن المسار صحيح (مثلاً './js/main.js' إذا كان في مجلد 'js')
import App from './main.js';

// دالة للتحقق من جلسة المستخدم وتشغيل التطبيق
async function initializeApplication() {
    try {
        // استعادة جلسة المستخدم الحالية من Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error("Error getting session:", sessionError.message);
            // في حالة وجود خطأ في الجلسة، قم بتوجيه المستخدم لتسجيل الدخول
            window.location.href = 'login.html';
            return;
        }

        if (!session) {
            // إذا لم يكن هناك جلسة، قم بتوجيه المستخدم إلى صفحة تسجيل الدخول
            window.location.href = 'login.html';
        } else {
            // إذا كان هناك جلسة نشطة، قم ببدء تشغيل التطبيق الرئيسي
            // وقم بتمرير كائن المستخدم (session.user) إلى App constructor
            new App(session.user);
        }
    } catch (error) {
        console.error("Failed to initialize application:", error);
        // في حالة وجود أي خطأ غير متوقع، قم بتوجيه المستخدم إلى صفحة تسجيل الدخول
        window.location.href = 'login.html';
    }
}

// ابدأ عملية التحقق فور تحميل هذا السكربت
initializeApplication();
