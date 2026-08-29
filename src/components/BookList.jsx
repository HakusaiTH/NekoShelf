import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Grid,
  List,
  Edit2,
  Trash2,
  BookmarkPlus,
  Eye,
  Filter,
  CheckCircle2,
  XCircle,
  Download
} from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

export default function BookList({
  books = [],
  categories = [],
  authors = [],
  searchQuery = '',
  userRole = 'admin',
  onOpenAddModal,
  onEditBook,
  onDeleteBook,
  onBorrowBook
}) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [detailModalBook, setDetailModalBook] = useState(null);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      !searchQuery ||
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || String(book.category_id) === String(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl bg-white shadow-sm border border-sky-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-sky-500" />
            <span>Books Catalog ({filteredBooks.length})</span>
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            Browse and manage all books stored in the library repository
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Export CSV Button */}
          <button
            onClick={() => {
              const exportData = filteredBooks.map((b) => ({
                'Book ID': b.id,
                'Title': b.title,
                'Author': b.authors?.name || '',
                'Category': b.categories?.name || '',
                'ISBN': b.isbn || '',
                'Published Year': b.published_year || '',
                'Total Copies': b.total_copies,
                'Available Copies': b.available_copies
              }));
              exportToCSV(exportData, `Book_Catalog_Report_${new Date().toISOString().split('T')[0]}.csv`);
            }}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-sky-50 border border-sky-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'table' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Book Button */}
          {userRole === 'admin' && (
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-500/25 transition flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Book</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-700 font-extrabold shrink-0 flex items-center space-x-1 pr-2">
          <Filter className="w-3.5 h-3.5 text-sky-600" />
          <span>Category:</span>
        </span>
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
            selectedCategory === ''
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-slate-900 border border-sky-200'
          }`}
        >
          All ({books.length})
        </button>
        {categories.map((cat) => {
          const count = books.filter((b) => String(b.category_id) === String(cat.id)).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(String(cat.id))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
                String(selectedCategory) === String(cat.id)
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-slate-900 border border-sky-200'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Content Rendering: Grid vs Table */}
      {filteredBooks.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-700 bg-white border border-sky-100">
          <BookOpen className="w-12 h-12 text-sky-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-900">No books found matching search query</h3>
          <p className="text-xs text-slate-600 font-semibold mt-1">Try resetting search keywords or category filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
          {filteredBooks.map((book) => {
            const isAvailable = parseInt(book.available_copies) > 0;
            return (
              <div
                key={book.id}
                className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group transition hover:-translate-y-1 bg-white border border-sky-100 shadow-sm"
              >
                <div>
                  {/* Cover Image & Stock Badge */}
                  <div 
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="relative aspect-[3/4] bg-slate-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3">
                      {isAvailable ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-600 text-white shadow-md backdrop-blur-md flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Available ({book.available_copies}/{book.total_copies})</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-rose-600 text-white shadow-md backdrop-blur-md flex items-center space-x-1">
                          <XCircle className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-white text-sky-800 shadow-md border border-white/60">
                        {book.categories?.name || 'General'}
                      </span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-4 space-y-2 cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
                    <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition">
                      {book.title}
                    </h3>
                    <div className="text-xs text-slate-700 line-clamp-1 font-semibold">
                      By: <span className="text-slate-900 font-extrabold">{book.authors?.name || 'Unknown Author'}</span>
                    </div>
                    {book.isbn && (
                      <div className="text-[11px] text-slate-600 font-mono font-bold">
                        ISBN: {book.isbn}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 pt-0 border-t border-sky-100 mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="p-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl transition cursor-pointer text-xs flex items-center space-x-1 font-bold"
                    title="View Full Details"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Details</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {isAvailable && (
                      <button
                        onClick={() => onBorrowBook(book)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center space-x-1 shadow-sm"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 text-amber-600" />
                        <span>Borrow</span>
                      </button>
                    )}

                    {userRole === 'admin' && (
                      <>
                        <button
                          onClick={() => onEditBook(book)}
                          className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteBook(book.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-panel rounded-3xl overflow-hidden border border-sky-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-sky-50/70 text-slate-700 border-b border-sky-100 font-extrabold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Book Title</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">ISBN</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {filteredBooks.map((book) => {
                  const isAvailable = parseInt(book.available_copies) > 0;
                  return (
                    <tr key={book.id} className="hover:bg-sky-50/40 transition">
                      <td className="py-3.5 px-4">
                        <div 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => navigate(`/books/${book.id}`)}
                        >
                          <img
                            src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'}
                            alt={book.title}
                            className="w-8 h-10 object-cover rounded bg-slate-100 shrink-0 shadow-sm"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm hover:text-sky-600 transition">{book.title}</div>
                            <div className="text-[10px] text-slate-600 font-bold">Year: {book.published_year || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {book.authors?.name || 'Unknown Author'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-extrabold">
                          {book.categories?.name || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">{book.isbn || '-'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-extrabold ${isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {book.available_copies} / {book.total_copies} copies
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/books/${book.id}`)}
                            className="p-1.5 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg transition cursor-pointer"
                            title="Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isAvailable && (
                            <button
                              onClick={() => onBorrowBook(book)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-extrabold transition shadow-sm cursor-pointer"
                            >
                              Borrow
                            </button>
                          )}
                          {userRole === 'admin' && (
                            <>
                              <button
                                onClick={() => onEditBook(book)}
                                className="p-1.5 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg transition cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteBook(book.id)}
                                className="p-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
