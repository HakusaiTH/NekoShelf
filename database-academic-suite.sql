-- ==============================================================================
-- DATABASE SYSTEMS ACADEMIC SUITE (สำหรับนำเสนออาจารย์วิชา Database)
-- Includes: Triggers, Stored Functions, Views, Indexes & Overdue Fine Calculation
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. DATABASE INDEXING (เพิ่มประสิทธิภาพ Query Performance)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_books_isbn ON public.books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books(title);
CREATE INDEX IF NOT EXISTS idx_loans_member ON public.loans(member_id);
CREATE INDEX IF NOT EXISTS idx_loans_book ON public.loans(book_id);
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON public.loans(due_date);

-- ------------------------------------------------------------------------------
-- 2. OVERDUE FINE CALCULATOR FUNCTION (ฟังก์ชันคำนวณค่าปรับ 10 บาท/วัน)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_calculate_overdue_fine(
    p_due_date DATE,
    p_return_date DATE
)
RETURNS NUMERIC AS $$
DECLARE
    v_target_date DATE;
    v_days_late INT;
    v_daily_rate NUMERIC := 10.0; -- ค่าปรับวันละ 10 บาท
BEGIN
    v_target_date := COALESCE(p_return_date, CURRENT_DATE);
    
    IF v_target_date > p_due_date THEN
        v_days_late := (v_target_date - p_due_date);
        RETURN v_days_late * v_daily_rate;
    ELSE
        RETURN 0.0;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ------------------------------------------------------------------------------
-- 3. DATABASE VIEWS (SQL Views สำหรับดึงข้อมูลสรุปขั้นสูง)
-- ------------------------------------------------------------------------------

-- View A: รายละเอียดการยืมหนังสือแบบ JOIN 4 ตารางพร้อมคำนวณค่าปรับ
CREATE OR REPLACE VIEW public.view_active_loans_details AS
SELECT 
    l.id AS loan_id,
    l.borrow_date,
    l.due_date,
    l.return_date,
    b.id AS book_id,
    b.title AS book_title,
    b.isbn,
    b.cover_image,
    a.name AS author_name,
    c.name AS category_name,
    m.id AS member_id,
    m.member_code,
    m.name AS member_name,
    m.email AS member_email,
    public.fn_calculate_overdue_fine(l.due_date, l.return_date) AS calculated_fine,
    CASE 
        WHEN l.return_date IS NOT NULL THEN 'RETURNED'
        WHEN CURRENT_DATE > l.due_date THEN 'OVERDUE'
        ELSE 'ACTIVE'
    END AS status
FROM public.loans l
JOIN public.books b ON l.book_id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
LEFT JOIN public.categories c ON b.category_id = c.id
JOIN public.members m ON l.member_id = m.id;

-- View B: สรุปสถิติจำนวนครั้งที่หนังสือถูกยืม (Most Popular Books View)
CREATE OR REPLACE VIEW public.view_book_borrowing_stats AS
SELECT 
    b.id AS book_id,
    b.title,
    b.total_copies,
    b.available_copies,
    COUNT(l.id) AS total_times_borrowed
FROM public.books b
LEFT JOIN public.loans l ON b.id = l.book_id
GROUP BY b.id, b.title, b.total_copies, b.available_copies
ORDER BY total_times_borrowed DESC;

-- ------------------------------------------------------------------------------
-- 4. DATABASE TRIGGERS (ระบบอัตโนมัติตัด/คืนสต็อกที่ตัว Database)
-- ------------------------------------------------------------------------------

-- Trigger Function: ตัดสต็อกเมื่อมีการยืมหนังสือ
CREATE OR REPLACE FUNCTION public.fn_trg_decrement_book_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.books
    SET available_copies = GREATEST(0, available_copies - 1)
    WHERE id = NEW.book_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_decrement_book_stock ON public.loans;
CREATE TRIGGER trg_decrement_book_stock
AFTER INSERT ON public.loans
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_decrement_book_stock();

-- Trigger Function: คืนสต็อกเมื่ออัปเดตวันส่งคืนหนังสือ
CREATE OR REPLACE FUNCTION public.fn_trg_increment_book_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.return_date IS NULL AND NEW.return_date IS NOT NULL THEN
        UPDATE public.books
        SET available_copies = LEAST(total_copies, available_copies + 1)
        WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_book_stock ON public.loans;
CREATE TRIGGER trg_increment_book_stock
AFTER UPDATE ON public.loans
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_increment_book_stock();

-- ------------------------------------------------------------------------------
-- 5. AUDIT LOGS TABLE (ตารางประวัติกิจกรรมฝั่ง DB)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    record_id INT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;
