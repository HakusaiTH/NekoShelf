import React, { useState } from 'react';
import {
  BookmarkCheck,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Filter,
  Download,
  DollarSign
} from 'lucide-react';
import { exportToCSV, calculateOverdueFine } from '../utils/csvExport';

export default function LoanList({
  loans = [],
  books = [],
  members = [],
  userRole = 'admin',
  onAddLoan,
  onReturnBook,
  onDeleteLoan,
  isOpenLoanModal,
  onCloseLoanModal,
  preselectedBook = null
}) {
  const [filterStatus, setFilterStatus] = useState('all');

  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    book_id: preselectedBook ? String(preselectedBook.id) : '',
    member_id: '',
    due_date: defaultDueDate()
  });

  React.useEffect(() => {
    if (isOpenLoanModal) {
      setFormData((prev) => ({
        ...prev,
        book_id: preselectedBook ? String(preselectedBook.id) : prev.book_id || '',
        due_date: prev.due_date || defaultDueDate()
      }));
    }
  }, [isOpenLoanModal, preselectedBook]);

  const today = new Date().toISOString().split('T')[0];

  const filteredLoans = loans.filter((loan) => {
    const isReturned = Boolean(loan.return_date);
    const isOverdue = !isReturned && loan.due_date && loan.due_date < today;

    if (filterStatus === 'active') return !isReturned;
    if (filterStatus === 'returned') return isReturned;
    if (filterStatus === 'overdue') return isOverdue;
    return true;
  });

  const handleSubmitNewLoan = (e) => {
    e.preventDefault();
    if (!formData.book_id || !formData.member_id || !formData.due_date) return;

    onAddLoan({
      book_id: parseInt(formData.book_id),
      member_id: parseInt(formData.member_id),
      borrow_date: today,
      due_date: formData.due_date
    });
    onCloseLoanModal();
  };

  const handleExportCSV = () => {
    const exportData = filteredLoans.map((l) => {
      const fineInfo = calculateOverdueFine(l.due_date, l.return_date);
      return {
        'Loan ID': l.id,
        'Book Title': l.books?.title || `Book #${l.book_id}`,
        'Borrower Name': l.members?.name || `Member #${l.member_id}`,
        'Member Code': l.members?.member_code || '',
        'Borrow Date': l.borrow_date || '',
        'Due Date': l.due_date || '',
        'Return Date': l.return_date || 'Active',
        'Days Late': fineInfo.daysLate,
        'Overdue Fine (THB)': `฿${fineInfo.fineAmount}`
      };
    });
    exportToCSV(exportData, `Library_Loans_Report_${today}.csv`);
  };

  // Calculate total pending fines
  const totalPendingFines = activeLoansFineSum(loans, today);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl bg-white shadow-sm border border-sky-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <BookmarkCheck className="w-6 h-6 text-amber-500" />
            <span>Loan & Overdue Fine Management ({loans.length})</span>
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            Track book borrowing transactions, automated ฿10/day overdue fines, and CSV exports
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Issue New Loan */}
          <button
            onClick={() => {
              setFormData({
                book_id: preselectedBook ? String(preselectedBook.id) : (books.find((b) => b.available_copies > 0)?.id || ''),
                member_id: members[0]?.id || '',
                due_date: defaultDueDate()
              });
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shadow-amber-400/20 transition flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Loan</span>
          </button>
        </div>
      </div>

      {/* Overdue Fine Summary Banner */}
      {totalPendingFines > 0 && (
        <div className="rounded-3xl bg-rose-50 border border-rose-200 p-4 text-rose-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <span className="text-xs font-extrabold text-rose-900 uppercase tracking-wider block">
                Total Overdue Fines Outstanding:
              </span>
              <span className="text-lg font-extrabold text-rose-700">
                ฿{totalPendingFines} THB <span className="text-xs text-rose-600 font-bold">(10 THB per late day)</span>
              </span>
            </div>
          </div>
          <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-extrabold border border-rose-300">
            Database Auto-Calculated
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-700 font-extrabold shrink-0 flex items-center space-x-1 pr-2">
          <Filter className="w-3.5 h-3.5 text-sky-600" />
          <span>Status:</span>
        </span>
        {[
          { id: 'all', label: `All (${loans.length})` },
          { id: 'active', label: `Active (${loans.filter((l) => !l.return_date).length})` },
          { id: 'overdue', label: `Overdue (${loans.filter((l) => !l.return_date && l.due_date < today).length})` },
          { id: 'returned', label: `Returned (${loans.filter((l) => l.return_date).length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-slate-900 border border-sky-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loan Table */}
      {filteredLoans.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-700 bg-white border border-sky-100 font-bold">
          <BookmarkCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-900">No loan records matching this status filter</h3>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-sky-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-sky-50/70 text-slate-700 border-b border-sky-100 font-extrabold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Borrowed Book</th>
                  <th className="py-3.5 px-4">Borrower (Member)</th>
                  <th className="py-3.5 px-4">Borrow Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Calculated Fine</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {filteredLoans.map((loan) => {
                  const isReturned = Boolean(loan.return_date);
                  const isOverdue = !isReturned && loan.due_date && loan.due_date < today;
                  const fineInfo = calculateOverdueFine(loan.due_date, loan.return_date);

                  return (
                    <tr key={loan.id} className="hover:bg-sky-50/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 text-sm">
                          {loan.books?.title || `Book ID #${loan.book_id}`}
                        </div>
                        <div className="text-[11px] text-slate-600 font-semibold">
                          {loan.books?.authors?.name || ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">
                          {loan.members?.name || `Member ID #${loan.member_id}`}
                        </div>
                        <div className="text-[10px] text-sky-700 font-mono font-extrabold">
                          {loan.members?.member_code || ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-mono font-semibold">
                        {loan.borrow_date || '-'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                        {loan.due_date || '-'}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {fineInfo.fineAmount > 0 ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 inline-block">
                            ฿{fineInfo.fineAmount} ({fineInfo.daysLate}d late)
                          </span>
                        ) : (
                          <span className="text-slate-600 font-bold">฿0 (No Fine)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isReturned ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Returned</span>
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                            <AlertCircle className="w-3 h-3" />
                            <span>Overdue</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {!isReturned && (
                            <button
                              onClick={() => onReturnBook(loan.id)}
                              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-extrabold transition cursor-pointer shadow-sm"
                            >
                              Return Book
                            </button>
                          )}
                          {userRole === 'admin' && (
                            <button
                              onClick={() => onDeleteLoan(loan.id)}
                              className="p-1.5 text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Record"
                            >
                              ✕
                            </button>
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

      {/* New Loan Modal */}
      {isOpenLoanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-sky-100 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <BookmarkCheck className="w-5 h-5 text-amber-500" />
                <span>Issue New Book Loan</span>
              </h3>
              <button onClick={onCloseLoanModal} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewLoan} className="mt-4 space-y-4">
              
              {/* Select Member */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Borrower Member <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.member_id}
                  onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                >
                  <option value="">-- Choose Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.member_code} - {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Book */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Book to Borrow <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.book_id}
                  onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                >
                  <option value="">-- Choose Book --</option>
                  {books.map((b) => (
                    <option
                      key={b.id}
                      value={b.id}
                      disabled={b.available_copies <= 0}
                    >
                      {b.title} ({b.available_copies > 0 ? `${b.available_copies} available` : 'Out of stock'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Return Due Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-sky-100">
                <button
                  type="button"
                  onClick={onCloseLoanModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-amber-400/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Issue Loan</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function activeLoansFineSum(loans, today) {
  return loans
    .filter((l) => !l.return_date && l.due_date < today)
    .reduce((acc, l) => acc + calculateOverdueFine(l.due_date, l.return_date).fineAmount, 0);
}
