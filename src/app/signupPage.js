// الملف الجديد: src/app/signupPage.js

// 1. نبدأ باستيراد الدالة المتخصصة فقط التي نحتاجها من خدمة المصادقة.
import { signUpUser } from '../services/authService.js';

// 2. نبحث في ملف HTML عن نموذج إنشاء الحساب.
const signupForm = document.getElementById('signup-form');

// 3. نتأكد من وجود النموذج قبل إضافة أي منطق له.
if (signupForm) {
    // 4. نضيف مستمعًا ينتظر حدث "تقديم" النموذج من قبل المستخدم.
    signupForm.addEventListener('submit', async (event) => {
        // 5. نمنع السلوك الافتراضي للمتصفح (الذي هو إعادة تحميل الصفحة).
        event.preventDefault();

        // 6. نحصل على القيم التي أدخلها المستخدم من حقول الإدخال.
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // 7. هنا يكمن التحسين الجوهري: نستدعي دالتنا النظيفة من الخدمة.
        const { error } = await signUpUser(email, password);

        // 8. نتعامل مع النتيجة.
        if (error) {
            // إذا حدث خطأ، نعرض رسالة واضحة للمستخدم.
            alert('خطأ في إنشاء الحساب: ' + error.message);
        } else {
            // إذا نجح الأمر، نخبر المستخدم ونقوم بتوجيهه إلى صفحة تسجيل الدخول.
            alert('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.');
            window.location.href = './login.html'; // توجيه إلى صفحة تسجيل الدخول
        }
    });
}
