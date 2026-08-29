import React, { useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2, BookOpen, X, Save } from 'lucide-react';

export default function CategoryList({
  categories = [],
  books = [],
  userRole = 'admin',
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name || '', description: category.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      onEditCategory(editingCategory.id, formData);
    } else {
      onAddCategory(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-3xl bg-white shadow-sm border border-sky-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <FolderTree className="w-6 h-6 text-sky-500" />
            <span>Book Categories ({categories.length})</span>
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            Organize catalog titles into genres and subject classifications
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-500/25 transition flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        )}
      </div>

      {/* Category Cards Grid */}
      {categories.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-700 bg-white border border-sky-100 font-bold">
          <FolderTree className="w-12 h-12 text-sky-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-900">No categories created yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => {
            const categoryBooks = books.filter((b) => String(b.category_id) === String(category.id));
            return (
              <div
                key={category.id}
                className="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition border-l-4 border-l-sky-500 bg-white border border-sky-100 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{category.name}</h3>
                      <span className="text-[11px] text-sky-700 font-extrabold flex items-center space-x-1 mt-0.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{categoryBooks.length} books in this genre</span>
                      </span>
                    </div>

                    {userRole === 'admin' && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(category.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-800 bg-sky-50/70 p-3.5 rounded-2xl border border-sky-200 leading-relaxed font-semibold">
                    {category.description || 'No description available for this genre.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-sky-100 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingCategory ? 'Edit Category Details' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Action Manga"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Genre overview and characteristics..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-sky-500/25"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
