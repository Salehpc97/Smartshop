// الملف الجديد: src/services/authService.js

// أولاً، نستورد العميل المركزي الذي أنشأناه للتو
import { supabase } from '../src/utils/supabaseClient.js';

/**
 * خدمة لتسجيل مستخدم جديد.
 */
export async function signUpUser(email, password) {
  return await supabase.auth.signUp({ email, password });
}

/**
 * خدمة لتسجيل دخول مستخدم موجود.
 */
export async function signInUser(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * خدمة لبدء عملية تسجيل الدخول عبر جوجل.
 */
export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
}

/**
 * خدمة لتسجيل خروج المستخدم الحالي.
 */
export async function signOutUser() {
  return await supabase.auth.signOut();
}
