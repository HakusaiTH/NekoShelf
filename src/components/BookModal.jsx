import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen } from 'lucide-react';

export default function BookModal({
  isOpen,
  onClose,
  onSave,
  editingBook,
  authors = [],
  categories = []
}) {
  const [formData, setFormData] = useState({
    title: '',
    author_id: '',
    category_id: '',
    isbn: '',
    published_year: new Date().getFullYear(),
    total_copies: 5,
    available_copies: 5,
    cover_image: '',
    description: ''
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author_id: editingBook.author_id ? String(editingBook.author_id) : (authors[0]?.id ? String(authors[0].id) : ''),
        category_id: editingBook.category_id ? String(editingBook.category_id) : (categories[0]?.id ? String(categories[0].id) : ''),
        isbn: editingBook.isbn || '',
        published_year: editingBook.published_year || new Date().getFullYear(),
        total_copies: editingBook.total_copies || 5,
        available_copies: editingBook.available_copies ?? editingBook.total_copies ?? 5,
        cover_image: editingBook.cover_image || '',
        description: editingBook.description || ''
      });
    } else {
      setFormData({
        title: '',
        author_id: authors[0]?.id ? String(authors[0].id) : '',
        category_id: categories[0]?.id ? String(categories[0].id) : '',
        isbn: '',
        published_year: new Date().getFullYear(),
        total_copies: 5,
        available_copies: 5,
        cover_image: '',
        description: ''
      });
    }
  }, [editingBook, isOpen, authors, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave({
      ...formData,
      author_id: formData.author_id ? parseInt(formData.author_id) : null,
      category_id: formData.category_id ? parseInt(formData.category_id) : null,
      published_year: parseInt(formData.published_year) || null,
      total_copies: parseInt(formData.total_copies) || 1,
      available_copies: parseInt(formData.available_copies) || parseInt(formData.total_copies) || 1
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-sky-100 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-sky-500" />
            <span>{editingBook ? 'Edit Book Details' : 'Add New Book to Catalog'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Book Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. One Piece Vol. 1"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Author</label>
              <select
                value={formData.author_id}
                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="">-- Choose Author --</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category / Genre</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ISBN Code</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
              <input
                type="number"
                value={formData.published_year}
                onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Copies</label>
              <input
                type="number"
                min="1"
                value={formData.total_copies}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setFormData({
                    ...formData,
                    total_copies: val,
                    available_copies: Math.min(val, formData.available_copies)
                  });
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Book Summary / Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Synopsis of the book..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-sky-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-sky-500/25"
            >
              <Save className="w-4 h-4" />
              <span>Save Book</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
