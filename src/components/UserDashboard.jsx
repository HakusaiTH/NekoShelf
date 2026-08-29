import React from 'react';
import {
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  BookmarkPlus,
  ArrowRight
} from 'lucide-react';

export default function UserDashboard({
  user,
  books = [],
  loans = [],
  members = [],
  categories = [],
  setActiveTab,
  onBorrowBook,
  onReturnBook
}) {
  const userName = user?.name || 'Reader';

  // Find member record matching current logged in user
  const currentMember = members.find(
    (m) => (user?.email && m.email === user.email) || (user?.name && m.name === user.name)
  );

  const myActiveLoans = loans.filter((l) => {
    if (l.return_date) return false;
    if (currentMember) {
      return String(l.member_id) === String(currentMember.id);
    }
    if (l.members) {
      return (user?.email && l.members.email === user.email) || (user?.name && l.members.name === user.name);
    }
    return true;
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner for Reader */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-100 via-sky-50 to-blue-100 border border-sky-200/90 shadow-md shadow-sky-500/5">
        <div className="ambient-glow bg-sky-300 -top-10 -left-10 w-48 h-48 opacity-25"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white border border-sky-200 text-slate-900 backdrop-blur-md inline-flex items-center space-x-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Reader Member Portal</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back, {userName}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 max-w-xl font-semibold leading-relaxed">
              Explore our latest manga and book collection, manage your active borrowed books, and track due dates.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setActiveTab('books')}
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-sky-500/25 flex items-center space-x-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>Browse Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reader Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div
          onClick={() => setActiveTab('loans')}
          className="glass-card rounded-3xl p-5 bg-white cursor-pointer transition hover:-translate-y-0.5 border border-sky-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              My Borrowed Books
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold">
              <BookmarkCheck className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {myActiveLoans.length} <span className="text-xs text-slate-600 font-bold">active loans</span>
          </div>
          <div className="mt-1 text-xs text-slate-600 font-semibold">
            {myActiveLoans.filter(l => l.due_date < today).length > 0 ? (
              <span className="text-rose-600 font-extrabold">⚠️ Has overdue book</span>
            ) : (
              'All due dates in good standing'
            )}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('books')}
          className="glass-card rounded-3xl p-5 bg-white cursor-pointer transition hover:-translate-y-0.5 border border-sky-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              Available Titles
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-extrabold">
              <BookOpen className="w-5 h-5 text-sky-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {books.filter(b => b.available_copies > 0).length} <span className="text-xs text-slate-600 font-bold">ready to borrow</span>
          </div>
          <div className="mt-1 text-xs text-slate-600 font-semibold">
            Out of {books.length} total catalog books
          </div>
        </div>

        <div
          onClick={() => setActiveTab('categories')}
          className="glass-card rounded-3xl p-5 bg-white cursor-pointer transition hover:-translate-y-0.5 border border-sky-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              Book Genres
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {categories.length} <span className="text-xs text-slate-600 font-bold">genres</span>
          </div>
          <div className="mt-1 text-xs text-slate-600 font-semibold">
            Manga, Action, Fantasy & more
          </div>
        </div>

      </div>

      {/* Reader Active Borrowed Books Section */}
      <div className="glass-panel rounded-3xl p-6 bg-white border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <BookmarkCheck className="w-5 h-5 text-amber-500" />
              <span>My Active Borrowed Books</span>
            </h3>
            <p className="text-xs text-slate-600 font-semibold">Books you currently have checked out</p>
          </div>
          <button
            onClick={() => setActiveTab('loans')}
            className="text-xs text-sky-600 hover:text-sky-700 font-extrabold flex items-center space-x-1"
          >
            <span>View All ({myActiveLoans.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myActiveLoans.length === 0 ? (
          <div className="py-10 text-center text-slate-700 text-xs font-bold">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            You currently have no borrowed books. Explore our catalog below to borrow your first book!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myActiveLoans.map((loan) => {
              const isOverdue = loan.due_date && loan.due_date < today;
              const bookObj = books.find((b) => String(b.id) === String(loan.book_id)) || loan.books || {};
              const bookTitle = bookObj.title || loan.books?.title || `Book #${loan.book_id}`;
              const bookCover = bookObj.cover_image || loan.books?.cover_image || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&q=80';
              const authorName = bookObj.authors?.name || loan.books?.authors?.name || '';

              return (
                <div
                  key={loan.id}
                  className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={bookCover}
                      alt={bookTitle}
                      className="w-12 h-16 object-cover rounded-xl shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-slate-900 truncate">
                        {bookTitle}
                      </div>
                      <div className="text-xs text-slate-700 font-semibold">
                        {authorName}
                      </div>
                      <div className="mt-1 text-[11px] font-mono flex items-center space-x-2">
                        <span className="text-slate-600 font-bold">Due: <strong className="text-slate-900 font-extrabold">{loan.due_date}</strong></span>
                        {isOverdue ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                            Overdue
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                            Borrowed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onReturnBook(loan.id)}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-extrabold transition shrink-0 cursor-pointer shadow-sm"
                  >
                    Return
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Manga & Books to Borrow */}
      <div className="glass-panel rounded-3xl p-6 bg-white border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <span>Recommended Manga & Books</span>
            </h3>
            <p className="text-xs text-slate-600 font-semibold">Click borrow to instantly request a book copy</p>
          </div>
          <button
            onClick={() => setActiveTab('books')}
            className="text-xs text-sky-600 hover:text-sky-700 font-extrabold flex items-center space-x-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {books.slice(0, 6).map((book) => {
            const isAvailable = parseInt(book.available_copies) > 0;
            return (
              <div
                key={book.id}
                className="p-3.5 rounded-2xl border border-sky-100 bg-white hover:border-sky-300 transition flex items-center space-x-3.5 group shadow-sm"
              >
                <img
                  src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                  alt={book.title}
                  className="w-14 h-20 object-cover rounded-xl shrink-0 shadow-sm group-hover:scale-105 transition"
                />
                <div className="flex-1 min-w-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 text-sky-800">
                    {book.categories?.name || 'Manga'}
                  </span>
                  <div className="text-xs font-extrabold text-slate-900 truncate mt-1">{book.title}</div>
                  <div className="text-[11px] text-slate-700 font-semibold truncate">{book.authors?.name}</div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold ${isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {isAvailable ? `${book.available_copies} left` : 'Out of stock'}
                    </span>

                    {isAvailable && (
                      <button
                        onClick={() => onBorrowBook(book)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-extrabold transition flex items-center space-x-1 cursor-pointer shadow-sm"
                      >
                        <BookmarkPlus className="w-3 h-3 text-amber-600" />
                        <span>Borrow</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
