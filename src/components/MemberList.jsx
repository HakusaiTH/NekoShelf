import React, { useState } from 'react';
import { UserCheck, UserPlus, Edit2, Trash2, Mail, Phone, BookmarkCheck, X, Save } from 'lucide-react';

export default function MemberList({
  members = [],
  loans = [],
  userRole = 'admin',
  onAddMember,
  onEditMember,
  onDeleteMember
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  const generateNextMemberCode = () => {
    const numbers = members
      .map((m) => parseInt(m.member_code?.replace('MEM', '') || 0))
      .filter((n) => !isNaN(n));
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `MEM${String(max + 1).padStart(3, '0')}`;
  };

  const [formData, setFormData] = useState({
    member_code: '',
    name: '',
    email: '',
    phone: ''
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      member_code: generateNextMemberCode(),
      name: '',
      email: '',
      phone: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      member_code: member.member_code || '',
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingMember) {
      onEditMember(editingMember.id, formData);
    } else {
      onAddMember(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-3xl bg-white shadow-sm border border-sky-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            <span>Members Directory ({members.length})</span>
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            Manage library patrons, contact information, and borrowing privileges
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center space-x-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Member</span>
          </button>
        )}
      </div>

      {/* Member Table */}
      {members.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-700 bg-white border border-sky-100 font-bold">
          <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-900">No members registered yet</h3>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-sky-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-sky-50/70 text-slate-700 border-b border-sky-100 font-extrabold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Member ID</th>
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Current Borrowings</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {members.map((member) => {
                  const activeMemberLoans = loans.filter(
                    (l) => String(l.member_id) === String(member.id) && !l.return_date
                  );
                  return (
                    <tr key={member.id} className="hover:bg-sky-50/40 transition">
                      <td className="py-3.5 px-4 font-mono font-extrabold text-sky-700">
                        {member.member_code}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                        {member.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold">
                        <span className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-600" />
                          <span>{member.email || '-'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-bold">
                        <span className="flex items-center space-x-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-600" />
                          <span>{member.phone || '-'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {activeMemberLoans.length > 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1 w-max">
                            <BookmarkCheck className="w-3 h-3 text-amber-600" />
                            <span>{activeMemberLoans.length} active books</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-600 font-bold">No active loans</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {userRole === 'admin' && (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenEdit(member)}
                              className="p-1.5 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteMember(member.id)}
                              className="p-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-sky-100 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingMember ? 'Edit Member Details' : 'Register New Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Member Code</label>
                <input
                  type="text"
                  required
                  value={formData.member_code}
                  onChange={(e) => setFormData({ ...formData, member_code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-sky-700 font-mono font-extrabold focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Somchai Jaidee"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="somchai@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081-234-5678"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-mono font-medium"
                />
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
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
