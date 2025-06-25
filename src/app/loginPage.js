// الملف الجديد: src/app/loginPage.js

// نستورد الدوال التي نحتاجها فقط من خدمة المصادقة
import { signInUser, signInWithGoogle } from '../services/authService.js';

const loginForm = document.getElementById('login-form');
const googleSignInButton = document.getElementById('google-signin-btn');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // الآن نستدعي دالة الخدمة النظيفة
        const { error } = await signInUser(email, password);

        if (error) {
            alert('فشل تسجيل الدخول: ' + error.message);
        } else {
            // التوجيه سيتم معالجته بواسطة onAuthStateChange،
            // ولكن يمكننا توجيهه مباشرة هنا لسرعة الاستجابة.
            window.location.href = '/src/pages/index.html';
        }
    });
}

if (googleSignInButton) {
    googleSignInButton.addEventListener('click', async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            alert('فشل تسجيل الدخول عبر جوجل: ' + error.message);
        }
    });
}
