import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DbStatusNotice from './components/DbStatusNotice';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import BookList from './components/BookList';
import BookDetailPage from './components/BookDetailPage';
import BookModal from './components/BookModal';
import AuthorList from './components/AuthorList';
import CategoryList from './components/CategoryList';
import MemberList from './components/MemberList';
import LoanList from './components/LoanList';
import AuthModal from './components/AuthModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

// Fallback Demo Seed Data
const MOCK_AUTHORS = [
  { id: 1, name: 'Eiichiro Oda (เอย์อิชิโระ โอดะ)', image: '/oda_profile.jpg', bio: 'Creator of legendary manga series One Piece detailing the adventures of Monkey D. Luffy.' },
  { id: 2, name: 'Koyoharu Gotouge (โคโยฮารุ โกโทเกะ)', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', bio: 'Author of Demon Slayer: Kimetsu no Yaiba, a global dark fantasy phenomenon.' },
  { id: 3, name: 'Hajime Isayama (ฮาจิเมะ อิซายามะ)', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', bio: 'Author of Attack on Titan (Shingeki no Kyojin), an epic dark fantasy action manga.' },
  { id: 4, name: 'Akira Toriyama (อากิระ โทริยามะ)', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', bio: 'Legendary creator of Dragon Ball and Dr. Slump.' },
  { id: 5, name: 'Gege Akutami (เกเกะ อากูตามิ)', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80', bio: 'Creator of Jujutsu Kaisen, a popular dark fantasy action manga.' },
  { id: 6, name: 'Masashi Kishimoto (มาซาชิ คิชิโมโตะ)', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80', bio: 'Creator of Naruto, the story of a young ninja aspiring to become Hokage.' }
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'มังงะญี่ปุ่น (Manga)', description: 'Japanese comic books and graphic novels translated to Thai/English.' },
  { id: 2, name: 'การ์ตูนแอ็กชัน (Shonen Action)', description: 'Action-packed comic series emphasizing friendship, rivalry, and battle.' },
  { id: 3, name: 'การ์ตูนแฟนตาซี (Fantasy Comic)', description: 'Comics featuring magical powers, curses, monsters, and alternate worlds.' }
];

const MOCK_BOOKS = [
  {
    id: 1,
    title: 'One Piece Vol. 1 - ROMANCE DAWN',
    author_id: 1,
    category_id: 1,
    isbn: '978-616-04-12341',
    published_year: 1997,
    total_copies: 10,
    available_copies: 8,
    cover_image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    description: 'Monkey D. Luffy sets sail into the Grand Line to find the legendary One Piece treasure and become the Pirate King.',
    authors: { name: 'Eiichiro Oda (เอย์อิชิโระ โอดะ)' },
    categories: { name: 'มังงะญี่ปุ่น (Manga)' }
  },
  {
    id: 2,
    title: 'Demon Slayer: Kimetsu no Yaiba Vol. 1',
    author_id: 2,
    category_id: 2,
    isbn: '978-616-04-56789',
    published_year: 2016,
    total_copies: 8,
    available_copies: 6,
    cover_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    description: 'Tanjiro Kamado joins the Demon Slayer Corps to find a cure for his sister Nezuko and avenge his slaughtered family.',
    authors: { name: 'Koyoharu Gotouge (โคโยฮารุ โกโทเกะ)' },
    categories: { name: 'การ์ตูนแอ็กชัน (Shonen Action)' }
  },
  {
    id: 3,
    title: 'Attack on Titan Vol. 1',
    author_id: 3,
    category_id: 3,
    isbn: '978-616-04-99999',
    published_year: 2009,
    total_copies: 7,
    available_copies: 5,
    cover_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    description: 'Humanity lives behind gigantic walls to protect themselves from man-eating Titans. Eren Yeager vows to eradicate them all.',
    authors: { name: 'Hajime Isayama (ฮาจิเมะ อิซายามะ)' },
    categories: { name: 'การ์ตูนแฟนตาซี (Fantasy Comic)' }
  },
  {
    id: 4,
    title: 'Dragon Ball Vol. 1',
    author_id: 4,
    category_id: 2,
    isbn: '978-616-04-11111',
    published_year: 1984,
    total_copies: 12,
    available_copies: 10,
    cover_image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    description: 'Goku and Bulma embark on a grand quest to gather seven magical Dragon Balls capable of summoning the Eternal Shenron.',
    authors: { name: 'Akira Toriyama (อากิระ โทริยามะ)' },
    categories: { name: 'การ์ตูนแอ็กชัน (Shonen Action)' }
  },
  {
    id: 5,
    title: 'Jujutsu Kaisen Vol. 1',
    author_id: 5,
    category_id: 3,
    isbn: '978-616-04-22222',
    published_year: 2018,
    total_copies: 6,
    available_copies: 4,
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Yuji Itadori swallows a cursed finger of Ryomen Sukuna and enrolls in Tokyo Jujutsu High to exorcise deadly curses.',
    authors: { name: 'Gege Akutami (เกเกะ อากูตามิ)' },
    categories: { name: 'การ์ตูนแฟนตาซี (Fantasy Comic)' }
  },
  {
    id: 6,
    title: 'Naruto Vol. 1',
    author_id: 6,
    category_id: 2,
    isbn: '978-616-04-33333',
    published_year: 1999,
    total_copies: 9,
    available_copies: 7,
    cover_image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    description: 'Naruto Uzumaki, a young ninja who harbors the Nine-Tails spirit, dreams of becoming the Hokage of his village.',
    authors: { name: 'Masashi Kishimoto (มาซาชิ คิชิโมโตะ)' },
    categories: { name: 'การ์ตูนแอ็กชัน (Shonen Action)' }
  }
];

const MOCK_MEMBERS = [
  { id: 1, member_code: 'MEM001', name: 'John Doe', email: 'john.doe@example.com', phone: '+1 555-0192' },
  { id: 2, member_code: 'MEM002', name: 'Sarah Connor', email: 'sarah@example.com', phone: '+1 555-0184' },
  { id: 3, member_code: 'MEM003', name: 'Michael Scott', email: 'michael@example.com', phone: '+1 555-0177' }
];

const MOCK_LOANS = [
  {
    id: 1,
    book_id: 1,
    member_id: 1,
    borrow_date: '2026-08-20',
    due_date: '2026-09-03',
    return_date: null,
    books: MOCK_BOOKS[0],
    members: MOCK_MEMBERS[0]
  },
  {
    id: 2,
    book_id: 2,
    member_id: 2,
    borrow_date: '2026-08-10',
    due_date: '2026-08-24',
    return_date: null,
    books: MOCK_BOOKS[1],
    members: MOCK_MEMBERS[1]
  }
];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');

  // User Profile & Authentication State
  const [user, setUser] = useState({
    name: 'Admin Manager',
    email: 'admin@nekoshelf.com',
    role: 'admin'
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  // DB Data State
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState({ connected: true, hasTables: true, isRlsBlocked: false });

  // Modals & Triggers
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [preselectedBookForLoan, setPreselectedBookForLoan] = useState(null);

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0] || 'dashboard';
  const activeTab = ['dashboard', 'books', 'loans', 'members', 'authors', 'categories'].includes(firstSegment) ? firstSegment : 'books';

  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${tabId}`);
    }
  };

  const fetchData = async () => {
    try {
      const { data: booksData, error: booksErr } = await supabase
        .from('books')
        .select(`*, authors(name), categories(name)`)
        .order('id', { ascending: true });

      const { data: authorsData, error: authorsErr } = await supabase
        .from('authors')
        .select('*')
        .order('id', { ascending: true });

      const { data: categoriesData, error: categoriesErr } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      const { data: membersData, error: membersErr } = await supabase
        .from('members')
        .select('*')
        .order('id', { ascending: true });

      const { data: loansData, error: loansErr } = await supabase
        .from('loans')
        .select(`*, books(title, authors(name)), members(name, member_code)`)
        .order('id', { ascending: false });

      const hasError = booksErr || authorsErr || categoriesErr || membersErr || loansErr;
      const isEmpty = !booksData || booksData.length === 0;

      if (hasError || isEmpty) {
        setDbStatus({
          connected: true,
          hasTables: !hasError,
          isRlsBlocked: hasError && (booksErr?.code === '42501' || booksErr?.status === 401)
        });
        setBooks(MOCK_BOOKS);
        setAuthors(MOCK_AUTHORS);
        setCategories(MOCK_CATEGORIES);
        setMembers(MOCK_MEMBERS);
        setLoans(MOCK_LOANS);
      } else {
        setDbStatus({ connected: true, hasTables: true, isRlsBlocked: false });
        setBooks(booksData || []);
        setAuthors(authorsData || []);
        setCategories(categoriesData || []);
        setMembers(membersData || []);
        setLoans(loansData || []);
      }
    } catch (e) {
      setDbStatus({ connected: false, hasTables: false, isRlsBlocked: false });
      setBooks(MOCK_BOOKS);
      setAuthors(MOCK_AUTHORS);
      setCategories(MOCK_CATEGORIES);
      setMembers(MOCK_MEMBERS);
      setLoans(MOCK_LOANS);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAuth = (modeType) => {
    if (modeType === 'signout') {
      setUser(null);
      showToast('Signed out successfully.');
    } else {
      setAuthMode(modeType);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (userProfile) => {
    setUser(userProfile);
    showToast(`Welcome back, ${userProfile.name}!`);
  };

  const handleSaveBook = async (bookData) => {
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        if (editingBook) {
          const { error } = await supabase.from('books').update(bookData).eq('id', editingBook.id);
          if (error) throw error;
          showToast('Book updated successfully!');
        } else {
          const { error } = await supabase.from('books').insert([bookData]);
          if (error) throw error;
          showToast('New book added to library repository!');
        }
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      if (editingBook) {
        setBooks(
          books.map((b) =>
            b.id === editingBook.id
              ? {
                  ...b,
                  ...bookData,
                  authors: authors.find((a) => String(a.id) === String(bookData.author_id)) || { name: 'Author' },
                  categories: categories.find((c) => String(c.id) === String(bookData.category_id)) || { name: 'Category' }
                }
              : b
          )
        );
        showToast('Book updated successfully (Demo Mode)');
      } else {
        const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
        const newBook = {
          id: newId,
          ...bookData,
          authors: authors.find((a) => String(a.id) === String(bookData.author_id)) || { name: 'Author' },
          categories: categories.find((c) => String(c.id) === String(bookData.category_id)) || { name: 'Category' }
        };
        setBooks([...books, newBook]);
        showToast('New book added successfully (Demo Mode)');
      }
    }
    setIsBookModalOpen(false);
    setEditingBook(null);
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('books').delete().eq('id', id);
        if (error) throw error;
        showToast('Book deleted successfully');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setBooks(books.filter((b) => b.id !== id));
      showToast('Book deleted successfully (Demo Mode)');
    }
  };

  const handleAddAuthor = async (authorData) => {
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('authors').insert([authorData]);
        if (error) throw error;
        showToast('Author added successfully');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      const newId = authors.length > 0 ? Math.max(...authors.map((a) => a.id)) + 1 : 1;
      setAuthors([...authors, { id: newId, ...authorData }]);
      showToast('Author added successfully (Demo Mode)');
    }
  };

  const handleEditAuthor = async (id, authorData) => {
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('authors').update(authorData).eq('id', id);
        if (error) throw error;
        showToast('Author updated successfully');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setAuthors(authors.map((a) => (a.id === id ? { ...a, ...authorData } : a)));
      showToast('Author updated successfully (Demo Mode)');
    }
  };

  const handleDeleteAuthor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this author?')) return;
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('authors').delete().eq('id', id);
        if (error) throw error;
        showToast('Author removed');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setAuthors(authors.filter((a) => a.id !== id));
      showToast('Author removed (Demo Mode)');
    }
  };

  const handleAddCategory = async (catData) => {
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('categories').insert([catData]);
        if (error) throw error;
        showToast('Category created successfully');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      const newId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
      setCategories([...categories, { id: newId, ...catData }]);
      showToast('Category created successfully (Demo Mode)');
    }
  };

  const handleEditCategory = async (id, catData) => {
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('categories').update(catData).eq('id', id);
        if (error) throw error;
        showToast('Category updated successfully');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setCategories(categories.map((c) => (c.id === id ? { ...c, ...catData } : c)));
      showToast('Category updated successfully (Demo Mode)');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        showToast('Category removed');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setCategories(categories.filter((c) => c.id !== id));
      showToast('Category removed (Demo Mode)');
    }
  };

  const handleAddMember = async (memberData) => {
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('members').insert([memberData]);
        if (error) throw error;
        showToast('Member registered successfully');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      const newId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
      setMembers([...members, { id: newId, ...memberData }]);
      showToast('Member registered successfully (Demo Mode)');
    }
  };

  const handleEditMember = async (id, memberData) => {
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('members').update(memberData).eq('id', id);
        if (error) throw error;
        showToast('Member updated successfully');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setMembers(members.map((m) => (m.id === id ? { ...m, ...memberData } : m)));
      showToast('Member updated successfully (Demo Mode)');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) throw error;
        showToast('Member removed');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setMembers(members.filter((m) => m.id !== id));
      showToast('Member removed (Demo Mode)');
    }
  };

  const handleAddLoan = async (loanData) => {
    const targetBook = books.find((b) => String(b.id) === String(loanData.book_id));
    if (!targetBook || targetBook.available_copies <= 0) {
      showToast('This book has no available copies left.', 'error');
      return;
    }

    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error: loanErr } = await supabase.from('loans').insert([loanData]);
        if (loanErr) throw loanErr;

        const updatedAvailable = Math.max(0, targetBook.available_copies - 1);
        await supabase.from('books').update({ available_copies: updatedAvailable }).eq('id', targetBook.id);

        showToast('Loan issued successfully!');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      const newId = loans.length > 0 ? Math.max(...loans.map((l) => l.id)) + 1 : 1;
      const targetMember = members.find((m) => String(m.id) === String(loanData.member_id));
      const newLoan = {
        id: newId,
        ...loanData,
        return_date: null,
        books: targetBook,
        members: targetMember
      };

      setLoans([newLoan, ...loans]);
      setBooks(
        books.map((b) =>
          b.id === targetBook.id ? { ...b, available_copies: Math.max(0, b.available_copies - 1) } : b
        )
      );
      showToast('Loan issued successfully! (Demo Mode)');
    }
  };

  const handleReturnBook = async (loanId) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    const returnDateToday = new Date().toISOString().split('T')[0];

    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error: loanErr } = await supabase
          .from('loans')
          .update({ return_date: returnDateToday })
          .eq('id', loanId);
        if (loanErr) throw loanErr;

        const targetBook = books.find((b) => String(b.id) === String(targetLoan.book_id));
        if (targetBook) {
          const updatedAvailable = Math.min(targetBook.total_copies, targetBook.available_copies + 1);
          await supabase.from('books').update({ available_copies: updatedAvailable }).eq('id', targetBook.id);
        }

        showToast('Book marked as returned successfully!');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setLoans(loans.map((l) => (l.id === loanId ? { ...l, return_date: returnDateToday } : l)));
      setBooks(
        books.map((b) =>
          String(b.id) === String(targetLoan.book_id)
            ? { ...b, available_copies: Math.min(b.total_copies, b.available_copies + 1) }
            : b
        )
      );
      showToast('Book marked as returned! (Demo Mode)');
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (!window.confirm('Are you sure you want to delete this loan record?')) return;
    if (dbStatus.hasTables && !dbStatus.isRlsBlocked) {
      try {
        const { error } = await supabase.from('loans').delete().eq('id', loanId);
        if (error) throw error;
        showToast('Loan record deleted');
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setLoans(loans.filter((l) => l.id !== loanId));
      showToast('Loan record deleted (Demo Mode)');
    }
  };

  const handleSeedLocalData = async () => {
    try {
      const { error: aErr } = await supabase.from('authors').insert(MOCK_AUTHORS);
      const { error: cErr } = await supabase.from('categories').insert(MOCK_CATEGORIES);
      if (!aErr && !cErr) {
        showToast('Sample data seeded into Supabase successfully!');
        fetchData();
      } else {
        showToast('Please copy SQL to disable RLS and seed data.', 'error');
      }
    } catch (e) {
      showToast('Execute SQL in Supabase SQL Editor.', 'error');
    }
  };

  const handleQuickAction = (action) => {
    if (action === 'newLoan') {
      setPreselectedBookForLoan(null);
      setIsLoanModalOpen(true);
    } else if (action === 'addBook') {
      setEditingBook(null);
      setIsBookModalOpen(true);
    }
  };

  const handleBorrowBookDirect = (book) => {
    setPreselectedBookForLoan(book);
    setIsLoanModalOpen(true);
  };

  const userRole = user?.role || 'admin';
  const activeLoansCount = loans.filter((l) => !l.return_date).length;

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/60 text-slate-800 selection:bg-sky-500 selection:text-white w-full">
      
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Layout Body */}
      <div className="flex-1 w-full flex flex-col md:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          userRole={userRole}
          counts={{
            books: books.length,
            activeLoans: activeLoansCount,
            members: members.length,
            authors: authors.length,
            categories: categories.length
          }}
          onQuickAction={handleQuickAction}
        />

        {/* Right Main Content Panel */}
        <main className="flex-1 min-w-0">
          
          {/* Database Status Notice */}
          <DbStatusNotice
            dbStatus={dbStatus}
            onRetry={fetchData}
            onSeedLocalData={handleSeedLocalData}
          />

          {/* Router Views */}
          <Routes>
            <Route
              path="/"
              element={
                userRole === 'user' ? (
                  <UserDashboard
                    user={user}
                    books={books}
                    loans={loans}
                    categories={categories}
                    setActiveTab={handleTabChange}
                    onBorrowBook={handleBorrowBookDirect}
                    onReturnBook={handleReturnBook}
                    onOpenAuth={handleOpenAuth}
                  />
                ) : (
                  <Dashboard
                    books={books}
                    loans={loans}
                    members={members}
                    authors={authors}
                    categories={categories}
                    setActiveTab={handleTabChange}
                    onOpenLoanModal={() => handleQuickAction('newLoan')}
                    onOpenBookModal={() => handleQuickAction('addBook')}
                    onOpenMemberModal={() => handleTabChange('members')}
                    onReturnBook={handleReturnBook}
                  />
                )
              }
            />

            <Route
              path="/books"
              element={
                <BookList
                  books={books}
                  categories={categories}
                  authors={authors}
                  searchQuery={searchQuery}
                  userRole={userRole}
                  onOpenAddModal={() => {
                    setEditingBook(null);
                    setIsBookModalOpen(true);
                  }}
                  onEditBook={(book) => {
                    setEditingBook(book);
                    setIsBookModalOpen(true);
                  }}
                  onDeleteBook={handleDeleteBook}
                  onBorrowBook={handleBorrowBookDirect}
                />
              }
            />

            {/* Dedicated Full Book Details Route: /books/:id */}
            <Route
              path="/books/:id"
              element={
                <BookDetailPage
                  books={books}
                  categories={categories}
                  authors={authors}
                  userRole={userRole}
                  onBorrowBook={handleBorrowBookDirect}
                  onEditBook={(book) => {
                    setEditingBook(book);
                    setIsBookModalOpen(true);
                  }}
                  onDeleteBook={handleDeleteBook}
                />
              }
            />

            <Route
              path="/loans"
              element={
                <LoanList
                  loans={loans}
                  books={books}
                  members={members}
                  userRole={userRole}
                  onAddLoan={handleAddLoan}
                  onReturnBook={handleReturnBook}
                  onDeleteLoan={handleDeleteLoan}
                  isOpenLoanModal={isLoanModalOpen}
                  onCloseLoanModal={() => {
                    setIsLoanModalOpen(false);
                    setPreselectedBookForLoan(null);
                  }}
                  preselectedBook={preselectedBookForLoan}
                />
              }
            />

            <Route
              path="/members"
              element={
                userRole === 'admin' ? (
                  <MemberList
                    members={members}
                    loans={loans}
                    userRole={userRole}
                    onAddMember={handleAddMember}
                    onEditMember={handleEditMember}
                    onDeleteMember={handleDeleteMember}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/authors"
              element={
                <AuthorList
                  authors={authors}
                  books={books}
                  userRole={userRole}
                  onAddAuthor={handleAddAuthor}
                  onEditAuthor={handleEditAuthor}
                  onDeleteAuthor={handleDeleteAuthor}
                />
              }
            />

            <Route
              path="/categories"
              element={
                <CategoryList
                  categories={categories}
                  books={books}
                  userRole={userRole}
                  onAddCategory={handleAddCategory}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </main>
      </div>

      {/* Global Book Add/Edit Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
        editingBook={editingBook}
        authors={authors}
        categories={categories}
      />

      {/* Sign In & Sign Up Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* Global Toast Notification Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center space-x-2.5 text-xs font-bold border ${
              toast.type === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-rose-500/10'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-500/10'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
