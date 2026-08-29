import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, BookOpen, X, Save, Image } from 'lucide-react';

export default function AuthorList({
  authors = [],
  books = [],
  userRole = 'admin',
  onAddAuthor,
  onEditAuthor,
  onDeleteAuthor
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState({ name: '', bio: '', image: '' });

  const handleOpenAdd = () => {
    setEditingAuthor(null);
    setFormData({ name: '', bio: '', image: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name || '',
      bio: author.bio || '',
      image: author.image || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingAuthor) {
      onEditAuthor(editingAuthor.id, formData);
    } else {
      onAddAuthor(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-3xl bg-white shadow-sm border border-sky-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Users className="w-6 h-6 text-sky-500" />
            <span>Authors Directory ({authors.length})</span>
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            Manage author profiles, portraits, and writer biographies in the library catalog
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-500/25 transition flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Author</span>
          </button>
        )}
      </div>

      {/* Author Cards Grid */}
      {authors.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-700 bg-white border border-sky-100 font-bold">
          <Users className="w-12 h-12 text-sky-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-900">No author profiles recorded yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {authors.map((author) => {
            const authorBooks = books.filter((b) => String(b.author_id) === String(author.id));
            const profileImage = author.image || '/user_logo.png';

            return (
              <div
                key={author.id}
                className="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition bg-white border border-sky-100 shadow-sm group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    
                    <div className="flex items-center space-x-3.5 min-w-0">
                      {/* Author Profile Picture */}
                      <img
                        src={profileImage}
                        alt={author.name}
                        className="w-14 h-14 rounded-2xl object-cover shadow-md border border-sky-100 shrink-0 group-hover:scale-105 transition"
                        onError={(e) => { e.target.src = '/user_logo.png'; }}
                      />

                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-slate-900 truncate">{author.name}</h3>
                        <span className="text-[11px] text-sky-700 font-extrabold flex items-center space-x-1 mt-0.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{authorBooks.length} titles published</span>
                        </span>
                      </div>
                    </div>

                    {userRole === 'admin' && (
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(author)}
                          className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAuthor(author.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-800 bg-sky-50/70 p-3.5 rounded-2xl border border-sky-200 leading-relaxed line-clamp-3 font-semibold">
                    {author.bio || 'No biography details provided.'}
                  </p>
                </div>

                {/* Author's books badges */}
                {authorBooks.length > 0 && (
                  <div className="pt-3 border-t border-sky-100 text-[11px]">
                    <div className="text-slate-700 font-extrabold mb-1.5">Featured Titles:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {authorBooks.slice(0, 3).map((b) => (
                        <span key={b.id} className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900 font-extrabold truncate max-w-[150px] border border-sky-200">
                          {b.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Author Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-sky-100 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingAuthor ? 'Edit Author Profile' : 'Add New Author'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Author Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eiichiro Oda"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Image className="w-3.5 h-3.5 text-sky-600" />
                  <span>Profile Image URL</span>
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Biography / Summary</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Author overview, achievements..."
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
                  <span>Save Author Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
