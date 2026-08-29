-- ============================================================
-- SAFE SQL UPDATE SCRIPT (ไม่พังโครงสร้างหรือข้อมูลเดิม)
-- Safe Schema Update: Add image column & update manga authors
-- ============================================================

-- 1. เพิ่มคอลัมน์ image ในตาราง authors (ถ้ายังไม่มี) โดยไม่กระทบคอลัมน์เดิม
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS image TEXT;

-- 2. ปลดล็อก RLS (Row Level Security) ทุกตารางเพื่อให้ API เข้าถึงข้อมูลได้
ALTER TABLE public.authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans DISABLE ROW LEVEL SECURITY;

-- 3. อัปเดตรูปภาพโปรไฟล์ให้ผู้เขียนที่มีอยู่แล้วอย่างปลอดภัย
UPDATE public.authors
SET image = '/oda_profile.jpg'
WHERE id = 1 OR name LIKE '%Oda%';

UPDATE public.authors
SET image = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
WHERE id = 2 OR name LIKE '%Gotouge%';

UPDATE public.authors
SET image = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
WHERE id = 3 OR name LIKE '%Isayama%';

UPDATE public.authors
SET image = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
WHERE id = 4 OR name LIKE '%Toriyama%';

UPDATE public.authors
SET image = 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'
WHERE id = 5 OR name LIKE '%Akutami%';

UPDATE public.authors
SET image = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'
WHERE id = 6 OR name LIKE '%Kishimoto%';
