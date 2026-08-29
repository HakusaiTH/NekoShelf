import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  BookmarkPlus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Barcode,
  FolderTree,
  User,
  Sparkles
} from 'lucide-react';

export default function BookDetailPage({
  books = [],
  categories = [],
  authors = [],
  userRole = 'admin',
  onBorrowBook,
  onEditBook,
  onDeleteBook
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = books.find((b) => String(b.id) === String(id));

  if (!book) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center text-slate-700 bg-white border border-sky-100 space-y-4">
        <BookOpen className="w-16 h-16 text-sky-400 mx-auto opacity-70" />
        <h2 className="text-xl font-extrabold text-slate-900">Book Not Found</h2>
        <p className="text-xs text-slate-600 font-semibold">
          The requested book ID #{id} does not exist in the library repository.
        </p>
        <button
          onClick={() => navigate('/books')}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
      </div>
    );
  }

  const isAvailable = parseInt(book.available_copies) > 0;
  const categoryName = book.categories?.name || categories.find((c) => String(c.id) === String(book.category_id))?.name || 'Manga';
  const authorName = book.authors?.name || authors.find((a) => String(a.id) === String(book.author_id))?.name || 'Unknown Author';

  const relatedBooks = books.filter(
    (b) => String(b.category_id) === String(book.category_id) && String(b.id) !== String(book.id)
  );

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/books')}
          className="px-4 py-2 bg-white hover:bg-sky-50 text-slate-800 border border-sky-200 rounded-2xl text-xs font-extrabold transition shadow-sm flex items-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-sky-600" />
          <span>Back to Catalog</span>
        </button>

        {userRole === 'admin' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEditBook(book)}
              className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Edit Book</span>
            </button>
            <button
              onClick={() => {
                onDeleteBook(book.id);
                navigate('/books');
              }}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Delete Book</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Full Detail Hero Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-white border border-sky-100 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Book Cover Image Column */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl border border-sky-100 bg-slate-100 group">
              <img
                src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                {isAvailable ? (
                  <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-lg backdrop-blur-md flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-rose-600 text-white shadow-lg backdrop-blur-md flex items-center space-x-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Out of Stock</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Button */}
            {isAvailable ? (
              <button
                onClick={() => onBorrowBook(book)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-400/25 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <BookmarkPlus className="w-5 h-5 text-slate-950" />
                <span>Borrow This Book</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 bg-slate-100 text-slate-400 font-extrabold text-sm rounded-2xl cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Currently Unavailable</span>
              </button>
            )}
          </div>

          {/* Book Information Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-100 text-sky-800 border border-sky-200 inline-flex items-center space-x-1">
                  <FolderTree className="w-3.5 h-3.5 text-sky-600" />
                  <span>{categoryName}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
                  ID: #{book.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {book.title}
              </h1>

              <div className="flex items-center space-x-2 text-sm text-slate-700 font-bold pt-1">
                <User className="w-4 h-4 text-sky-600" />
                <span>Author:</span>
                <span className="text-slate-900 font-extrabold">{authorName}</span>
              </div>
            </div>

            {/* Metric Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
                  <Barcode className="w-3.5 h-3.5 text-sky-600" />
                  <span>ISBN</span>
                </div>
                <div className="text-xs font-mono font-extrabold text-slate-900 truncate">
                  {book.isbn || 'N/A'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Published Year</span>
                </div>
                <div className="text-xs font-extrabold text-slate-900">
                  {book.published_year || 'N/A'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  <span>Available Copies</span>
                </div>
                <div className={`text-xs font-extrabold ${isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {book.available_copies} of {book.total_copies}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Borrow Limit</span>
                </div>
                <div className="text-xs font-extrabold text-slate-900">
                  14 Days Standard
                </div>
              </div>
            </div>

            {/* Synopsis / Description Box */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <span>Synopsis & Overview</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 bg-sky-50/50 p-4 rounded-2xl border border-sky-200 leading-relaxed font-semibold">
                {book.description || 'No detailed synopsis provided for this title.'}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Related Books in Same Category */}
      {relatedBooks.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 bg-white border border-sky-100 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>More in "{categoryName}"</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedBooks.slice(0, 4).map((relBook) => (
              <div
                key={relBook.id}
                onClick={() => navigate(`/books/${relBook.id}`)}
                className="p-3 rounded-2xl border border-sky-100 bg-white hover:border-sky-300 transition flex items-center space-x-3 cursor-pointer group shadow-sm"
              >
                <img
                  src={relBook.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'}
                  alt={relBook.title}
                  className="w-12 h-16 object-cover rounded-xl shrink-0 group-hover:scale-105 transition"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-slate-900 truncate group-hover:text-sky-600 transition">
                    {relBook.title}
                  </div>
                  <div className="text-[11px] text-slate-700 font-semibold truncate">
                    {relBook.authors?.name || ''}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-extrabold mt-1">
                    {relBook.available_copies} available
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
