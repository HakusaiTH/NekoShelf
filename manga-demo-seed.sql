-- ============================================================
-- Complete Supabase Schema & Manga Demo Data Seed Script
-- Safe Execution: Uses IF NOT EXISTS & ON CONFLICT DO NOTHING
-- ============================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT REFERENCES public.authors(id) ON DELETE SET NULL,
    category_id INT REFERENCES public.categories(id) ON DELETE SET NULL,
    isbn VARCHAR(50),
    published_year INT,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    cover_image TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.members (
    id SERIAL PRIMARY KEY,
    member_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.loans (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES public.books(id) ON DELETE CASCADE,
    member_id INT REFERENCES public.members(id) ON DELETE CASCADE,
    borrow_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure image column exists if table was created previously
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS image TEXT;

-- 2. Disable Row Level Security (RLS) for public access
ALTER TABLE public.authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans DISABLE ROW LEVEL SECURITY;

-- 3. Seed Manga Authors
INSERT INTO public.authors (id, name, bio, image) VALUES
(1, 'Eiichiro Oda (เอย์อิชิโระ โอดะ)', 'Creator of legendary manga series One Piece detailing the adventures of Monkey D. Luffy.', '/oda_profile.jpg'),
(2, 'Koyoharu Gotouge (โคโยฮารุ โกโทเกะ)', 'Author of Demon Slayer: Kimetsu no Yaiba, a global dark fantasy phenomenon.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
(3, 'Hajime Isayama (ฮาจิเมะ อิซายามะ)', 'Author of Attack on Titan (Shingeki no Kyojin), an epic dark fantasy action manga.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
(4, 'Akira Toriyama (อากิระ โทริยามะ)', 'Legendary creator of Dragon Ball and Dr. Slump.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
(5, 'Gege Akutami (เกเกะ อากูตามิ)', 'Creator of Jujutsu Kaisen, a popular dark fantasy action manga.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'),
(6, 'Masashi Kishimoto (มาซาชิ คิชิโมโตะ)', 'Creator of Naruto, the story of a young ninja aspiring to become Hokage.', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO UPDATE SET image = EXCLUDED.image, name = EXCLUDED.name, bio = EXCLUDED.bio;

-- 4. Seed Categories
INSERT INTO public.categories (id, name, description) VALUES
(1, 'มังงะญี่ปุ่น (Manga)', 'Japanese comic books and graphic novels translated to Thai/English.'),
(2, 'การ์ตูนแอ็กชัน (Shonen Action)', 'Action-packed comic series emphasizing friendship, rivalry, and battle.'),
(3, 'การ์ตูนแฟนตาซี (Fantasy Comic)', 'Comics featuring magical powers, curses, monsters, and alternate worlds.')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Books
INSERT INTO public.books (id, title, author_id, category_id, isbn, published_year, total_copies, available_copies, cover_image, description) VALUES
(1, 'One Piece Vol. 1 - ROMANCE DAWN', 1, 1, '978-616-04-12341', 1997, 10, 8, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80', 'Monkey D. Luffy sets sail into the Grand Line to find the legendary One Piece treasure and become the Pirate King.'),
(2, 'Demon Slayer: Kimetsu no Yaiba Vol. 1', 2, 2, '978-616-04-56789', 2016, 8, 6, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80', 'Tanjiro Kamado joins the Demon Slayer Corps to find a cure for his sister Nezuko and avenge his slaughtered family.'),
(3, 'Attack on Titan Vol. 1', 3, 3, '978-616-04-99999', 2009, 7, 5, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80', 'Humanity lives behind gigantic walls to protect themselves from man-eating Titans. Eren Yeager vows to eradicate them all.'),
(4, 'Dragon Ball Vol. 1', 4, 2, '978-616-04-11111', 1984, 12, 10, 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80', 'Goku and Bulma embark on a grand quest to gather seven magical Dragon Balls capable of summoning the Eternal Shenron.'),
(5, 'Jujutsu Kaisen Vol. 1', 5, 3, '978-616-04-22222', 2018, 6, 4, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', 'Yuji Itadori swallows a cursed finger of Ryomen Sukuna and enrolls in Tokyo Jujutsu High to exorcise deadly curses.'),
(6, 'Naruto Vol. 1', 6, 2, '978-616-04-33333', 1999, 9, 7, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80', 'Naruto Uzumaki, a young ninja who harbors the Nine-Tails spirit, dreams of becoming the Hokage of his village.')
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Members
INSERT INTO public.members (id, member_code, name, email, phone) VALUES
(1, 'MEM001', 'John Doe', 'john.doe@example.com', '+1 555-0192'),
(2, 'MEM002', 'Sarah Connor', 'sarah@example.com', '+1 555-0184'),
(3, 'MEM003', 'Michael Scott', 'michael@example.com', '+1 555-0177')
ON CONFLICT (id) DO NOTHING;
