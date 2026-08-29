import React, { useState } from 'react';
import {
  BookOpen,
  BookmarkCheck,
  UserCheck,
  FolderTree,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BookPlus,
  UserPlus,
  TrendingUp,
  BarChart3,
  PieChart,
  ShieldAlert,
  BellRing,
  Activity,
  Sparkles,
  Filter,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function Dashboard({
  books = [],
  loans = [],
  members = [],
  authors = [],
  categories = [],
  setActiveTab,
  onOpenLoanModal,
  onOpenBookModal,
  onOpenMemberModal,
  onReturnBook
}) {
  // Filter States
  const [timeframe, setTimeframe] = useState('all'); // 'all', 'this_month', 'this_week'
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loanFilter, setLoanFilter] = useState('active');

  // Key Metric Calculations
  const totalBooksCount = books.length;
  const totalCopies = books.reduce((acc, b) => acc + (parseInt(b.total_copies) || 1), 0);
  const availableCopies = books.reduce((acc, b) => acc + (parseInt(b.available_copies) || 0), 0);
  const borrowedCopies = totalCopies - availableCopies;
  const utilizationPercentage = totalCopies > 0 ? Math.round((borrowedCopies / totalCopies) * 100) : 0;

  const activeLoans = loans.filter((l) => !l.return_date);
  const returnedLoans = loans.filter((l) => l.return_date);

  const today = new Date().toISOString().split('T')[0];
  const overdueLoans = activeLoans.filter((l) => l.due_date && l.due_date < today);

  // Category distribution analysis
  const categoryStats = categories.map((cat) => {
    const count = books.filter((b) => String(b.category_id) === String(cat.id)).length;
    const percentage = totalBooksCount > 0 ? Math.round((count / totalBooksCount) * 100) : 0;
    return { ...cat, count, percentage };
  });

  // Monthly / Weekly Borrowing Bar Chart Mock Data
  const monthlyBorrowData = [
    { label: 'Jan', count: 12, height: '40%' },
    { label: 'Feb', count: 18, height: '55%' },
    { label: 'Mar', count: 24, height: '75%' },
    { label: 'Apr', count: 15, height: '48%' },
    { label: 'May', count: 28, height: '85%' },
    { label: 'Jun', count: 35, height: '100%' },
    { label: 'Jul', count: 22, height: '65%' },
    { label: 'Aug', count: activeLoans.length + 10, height: '80%' }
  ];

  // Filtered Books according to Genre Filter
  const filteredBooks = selectedGenre === 'all'
    ? books
    : books.filter((b) => String(b.category_id) === String(selectedGenre));

  // Recent system activity stream
  const recentActivities = [
    ...loans.slice(0, 5).map((l) => ({
      id: `loan-${l.id}`,
      type: l.return_date ? 'return' : (l.due_date < today ? 'overdue' : 'borrow'),
      title: l.return_date
        ? `Book Returned: ${l.books?.title || 'Book'}`
        : (l.due_date < today ? `Overdue Warning: ${l.books?.title || 'Book'}` : `New Loan Issued: ${l.books?.title || 'Book'}`),
      user: l.members?.name || 'Member',
      date: l.return_date || l.borrow_date || 'Today'
    }))
  ];

  return (
    <div className="space-y-6">

      {/* Top Banner & Control Center Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 text-white shadow-xl shadow-sky-500/15">
        <div className="ambient-glow bg-white -top-10 -left-10 w-48 h-48 opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-white/20 text-white backdrop-blur-md inline-flex items-center space-x-1.5 border border-white/20">
              <Activity className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Admin Operations Center</span>
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Library Control Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl font-semibold leading-relaxed">
              Real-time analytics, inventory charts, borrowing trends, and librarian control panel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenLoanModal}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-400/20 flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Loan</span>
            </button>
            <button
              onClick={onOpenBookModal}
              className="px-4 py-2.5 bg-white hover:bg-sky-50 text-sky-700 font-extrabold text-xs rounded-xl transition shadow-lg shadow-white/20 flex items-center space-x-2 cursor-pointer"
            >
              <BookPlus className="w-4 h-4 text-sky-600" />
              <span>Add Book</span>
            </button>
            <button
              onClick={onOpenMemberModal}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl transition border border-white/20 flex items-center space-x-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Register Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Interactive Filter Bar */}
      <div className="glass-panel p-4 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-extrabold text-slate-900">Dashboard Analytics Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* Timeframe Filter */}
          <div className="flex items-center space-x-1.5 bg-sky-50 p-1 rounded-xl border border-sky-200 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-sky-600 ml-2" />
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer font-extrabold ${timeframe === 'all' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
                }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeframe('this_month')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer font-extrabold ${timeframe === 'this_month' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
                }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe('this_week')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer font-extrabold ${timeframe === 'this_week' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
                }`}
            >
              This Week
            </button>
          </div>

          {/* Genre Category Filter */}
          <div className="flex items-center space-x-2 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 text-xs font-extrabold text-slate-800">
            <FolderTree className="w-3.5 h-3.5 text-sky-600" />
            <span>Genre:</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-transparent text-slate-900 font-extrabold focus:outline-none cursor-pointer"
            >
              <option value="all">All Genres ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Critical Overdue Warning Alert Banner */}
      {overdueLoans.length > 0 && (
        <div className="rounded-3xl bg-rose-50 border border-rose-200 p-5 text-rose-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-extrabold text-rose-900">
                Action Required: {overdueLoans.length} Overdue Book Loans Detected!
              </h3>
              <p className="text-xs text-rose-800 font-semibold mt-0.5">
                Some members have exceeded their 14-day borrowing period. Please inspect the overdue table below or send reminders.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('loans')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl transition shadow-md shrink-0 cursor-pointer flex items-center space-x-1.5"
          >
            <BellRing className="w-4 h-4" />
            <span>Manage Overdue Loans</span>
          </button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div
          onClick={() => setActiveTab('books')}
          className="glass-card rounded-3xl p-5 bg-white border border-sky-100 shadow-sm transition hover:-translate-y-0.5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              Total Books & Copies
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900">{totalBooksCount}</div>
            <span className="text-xs text-sky-700 font-extrabold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
              {totalCopies} physical copies
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-sky-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-bold">In Library: <strong className="text-emerald-700">{availableCopies}</strong></span>
            <span className="text-slate-600 font-bold">Checked out: <strong className="text-amber-700">{borrowedCopies}</strong></span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('loans')}
          className="glass-card rounded-3xl p-5 bg-white border border-sky-100 shadow-sm transition hover:-translate-y-0.5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              Active Loans
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <BookmarkCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900">{activeLoans.length}</div>
            {overdueLoans.length > 0 ? (
              <span className="text-xs text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                {overdueLoans.length} Overdue
              </span>
            ) : (
              <span className="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                All Healthy
              </span>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-sky-100 flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Total Returned: <strong className="text-emerald-700">{returnedLoans.length}</strong></span>
            <span>Total All-Time: <strong className="text-slate-900">{loans.length}</strong></span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('members')}
          className="glass-card rounded-3xl p-5 bg-white border border-sky-100 shadow-sm transition hover:-translate-y-0.5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              Registered Members
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900">{members.length}</div>
            <span className="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              Patrons
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-sky-100 flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Active Borrowers: <strong className="text-slate-900">{new Set(activeLoans.map(l => l.member_id)).size}</strong></span>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-600 transition" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('categories')}
          className="glass-card rounded-3xl p-5 bg-white border border-sky-100 shadow-sm transition hover:-translate-y-0.5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              Authors & Categories
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900">{categories.length}</div>
            <span className="text-xs text-indigo-700 font-extrabold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
              {authors.length} Authors
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-sky-100 flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Genre Categories</span>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-600 transition" />
          </div>
        </div>

      </div>

      {/* Visual Bar Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Monthly Borrowing Trend Bar Chart */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 bg-white border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-sky-500" />
                <span>Monthly Borrowing Activity Graph</span>
              </h3>
              <p className="text-xs text-slate-600 font-semibold">Total book checkouts per month</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200">
              2026 Trend Chart
            </span>
          </div>

          {/* Interactive Bar Graph */}
          <div className="pt-6 pb-2 px-2">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 border-b border-sky-100 pb-2">
              {monthlyBorrowData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap">
                    {item.count} loans
                  </div>

                  {/* Bar Visual Element */}
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[36px] bg-gradient-to-t from-sky-500 via-blue-500 to-sky-400 rounded-t-xl group-hover:from-amber-400 group-hover:to-orange-500 transition duration-300 shadow-sm"
                  ></div>
                </div>
              ))}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between gap-2 sm:gap-4 pt-2 text-center text-xs font-bold text-slate-600">
              {monthlyBorrowData.map((item, index) => (
                <div key={index} className="flex-1">{item.label}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Capacity Gauge & Utilization Bar */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 bg-white border border-sky-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Stock Utilization Rate</span>
              </h3>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {utilizationPercentage}% Capacity
              </span>
            </div>

            <p className="text-xs text-slate-600 font-semibold">
              Percentage of total inventory currently checked out by members
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span>On Loan ({borrowedCopies} copies)</span>
                <span>In Stock ({availableCopies} copies)</span>
              </div>
              {/* Dual-color Progress Bar */}
              <div className="h-4 bg-sky-100 rounded-full overflow-hidden flex p-0.5 border border-sky-200">
                <div
                  style={{ width: `${utilizationPercentage}%` }}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
                ></div>
                <div
                  style={{ width: `${100 - utilizationPercentage}%` }}
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center pt-4 text-xs font-bold">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                <div className="text-2xl font-extrabold">{borrowedCopies}</div>
                <div className="text-[11px] text-amber-800 font-bold">Currently Borrowed</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="text-2xl font-extrabold">{availableCopies}</div>
                <div className="text-[11px] text-emerald-800 font-bold">Ready to Issue</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-sky-100">
            <button
              onClick={onOpenLoanModal}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer text-center"
            >
              Issue Quick Loan Transaction
            </button>
          </div>
        </div>

      </div>

      {/* Genre Distribution Analytics */}
      <div className="glass-panel rounded-3xl p-6 bg-white border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-indigo-500" />
              <span>Genre & Category Analytics</span>
            </h3>
            <p className="text-xs text-slate-600 font-semibold">Title count distribution per book category</p>
          </div>
          <button
            onClick={() => setActiveTab('categories')}
            className="text-xs text-sky-600 hover:text-sky-700 font-extrabold"
          >
            Manage Genres ({categories.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryStats.map((cat) => (
            <div key={cat.id} className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <span>{cat.name}</span>
                <span className="text-sky-700">{cat.count} titles ({cat.percentage}%)</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden border border-sky-200">
                <div
                  style={{ width: `${cat.percentage || 10}%` }}
                  className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
                ></div>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold line-clamp-1">{cat.description || 'No overview'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Loan Management Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active & Overdue Loans Manager */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 bg-white border border-sky-100 shadow-sm space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <BookmarkCheck className="w-5 h-5 text-amber-500" />
                <span>Active Loan Operations</span>
              </h3>
              <p className="text-xs text-slate-600 font-semibold">Inspect and process book returns</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1.5 bg-sky-50 p-1 rounded-xl border border-sky-200">
              <button
                onClick={() => setLoanFilter('active')}
                className={`px-3 py-1 text-xs font-extrabold rounded-lg transition cursor-pointer ${loanFilter === 'active' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
                  }`}
              >
                Active ({activeLoans.length})
              </button>
              <button
                onClick={() => setLoanFilter('overdue')}
                className={`px-3 py-1 text-xs font-extrabold rounded-lg transition cursor-pointer ${loanFilter === 'overdue' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
                  }`}
              >
                Overdue ({overdueLoans.length})
              </button>
              <button
                onClick={() => setLoanFilter('returned')}
                className={`px-3 py-1 text-xs font-extrabold rounded-lg transition cursor-pointer ${loanFilter === 'returned' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
                  }`}
              >
                Returned ({returnedLoans.length})
              </button>
            </div>
          </div>

          {/* Loans Table */}
          {loans.length === 0 ? (
            <div className="py-12 text-center text-slate-700 text-xs font-bold">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              No loan records found in system.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-sky-50/70 text-slate-700 border-b border-sky-100 font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-3">Book Title</th>
                    <th className="py-3 px-3">Borrower Member</th>
                    <th className="py-3 px-3">Borrow Date</th>
                    <th className="py-3 px-3">Due Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {(loanFilter === 'overdue'
                    ? overdueLoans
                    : (loanFilter === 'returned' ? returnedLoans : activeLoans)
                  ).slice(0, 6).map((loan) => {
                    const isReturned = Boolean(loan.return_date);
                    const isOverdue = !isReturned && loan.due_date && loan.due_date < today;
                    return (
                      <tr key={loan.id} className="hover:bg-sky-50/50 transition">
                        <td className="py-3.5 px-3 font-extrabold text-slate-900 max-w-[180px] truncate">
                          {loan.books?.title || `Book #${loan.book_id}`}
                        </td>
                        <td className="py-3.5 px-3 text-slate-800 font-bold">
                          {loan.members?.name || `Member #${loan.member_id}`}
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 font-mono font-semibold">{loan.borrow_date || '-'}</td>
                        <td className="py-3.5 px-3 text-slate-900 font-mono font-extrabold">{loan.due_date}</td>
                        <td className="py-3.5 px-3">
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
                        <td className="py-3.5 px-3 text-right">
                          {!isReturned && (
                            <button
                              onClick={() => onReturnBook(loan.id)}
                              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-extrabold transition text-[11px] cursor-pointer shadow-sm"
                            >
                              Return
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Real-time System Activity Stream */}
        <div className="glass-panel rounded-3xl p-6 bg-white border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-sky-500" />
              <span>System Activity Audit</span>
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start space-x-3 text-xs"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${act.type === 'return'
                    ? 'bg-emerald-100 text-emerald-700'
                    : (act.type === 'overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700')
                  }`}>
                  {act.type === 'return' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (act.type === 'overdue' ? <AlertCircle className="w-4 h-4" /> : <BookmarkCheck className="w-4 h-4" />)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-slate-900 truncate">{act.title}</div>
                  <div className="text-[11px] text-slate-600 font-semibold">User: {act.user}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{act.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-sky-100">
            <button
              onClick={() => setActiveTab('loans')}
              className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-extrabold transition cursor-pointer text-center"
            >
              View Full Transaction Audit Log
            </button>
          </div>
        </div>

      </div>

      {/* Filtered Catalog Books Grid */}
      <div className="glass-panel rounded-3xl p-6 bg-white border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Catalog Inventory Overview ({filteredBooks.length})</span>
            </h3>
            <p className="text-xs text-slate-600 font-semibold">Filtered overview of available books</p>
          </div>
          <button
            onClick={() => setActiveTab('books')}
            className="text-xs text-sky-600 hover:text-sky-700 font-extrabold"
          >
            Manage Catalog ({books.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredBooks.slice(0, 6).map((book) => (
            <div
              key={book.id}
              className="p-3 rounded-2xl border border-sky-100 bg-white hover:border-sky-300 transition flex flex-col justify-between space-y-2 shadow-sm group"
            >
              <img
                src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                alt={book.title}
                className="w-full h-28 object-cover rounded-xl bg-slate-100 group-hover:scale-105 transition"
              />
              <div>
                <div className="text-xs font-extrabold text-slate-900 truncate">{book.title}</div>
                <div className="text-[11px] text-slate-600 font-semibold truncate">{book.authors?.name}</div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-extrabold">
                    {book.categories?.name || 'Manga'}
                  </span>
                  <span className={book.available_copies > 0 ? 'text-emerald-700 font-extrabold' : 'text-rose-600 font-extrabold'}>
                    {book.available_copies}/{book.total_copies}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
