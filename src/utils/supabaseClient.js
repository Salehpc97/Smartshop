// الملف الجديد: src/utils/supabaseClient.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// بيانات الاعتماد العامة لمشروعك في Supabase
const SUPABASE_URL = 'https://cbjhgxgniouvkeeonylw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiamhneGduaW91dmtlZW9ueWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjkyOTcsImV4cCI6MjA2NTUwNTI5N30.ebN5OdrM67i2gEsXuY-MriVNVtgDiYOCFDhjoZKs0w4';

// نقوم بإنشاء العميل مرة واحدة فقط ونقوم بتصديره ليكون متاحًا للتطبيق كله
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
