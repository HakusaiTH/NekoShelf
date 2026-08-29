import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FolderTree,
  UserCheck,
  BookmarkCheck,
  PlusCircle,
  Database,
  Sparkles,
  Search
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts, onQuickAction, userRole = 'admin' }) {

  // Admin Navigation Menu
  const adminNavItems = [
    { id: 'dashboard', label: 'Admin Overview', icon: LayoutDashboard, badge: null },
    { id: 'books', label: 'Books Management', icon: BookOpen, badge: counts.books },
    { id: 'loans', label: 'Loans & Borrowing', icon: BookmarkCheck, badge: counts.activeLoans > 0 ? `${counts.activeLoans} Active` : null, badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold' },
    { id: 'members', label: 'Members Directory', icon: UserCheck, badge: counts.members },
    { id: 'authors', label: 'Authors Manager', icon: Users, badge: counts.authors },
    { id: 'categories', label: 'Categories Manager', icon: FolderTree, badge: counts.categories }
  ];

  // User / Reader Navigation Menu
  const userNavItems = [
    { id: 'dashboard', label: 'Reader Portal', icon: Sparkles, badge: null },
    { id: 'books', label: 'Explore Books Catalog', icon: BookOpen, badge: counts.books },
    { id: 'loans', label: 'My Borrowed Books', icon: BookmarkCheck, badge: counts.activeLoans > 0 ? `${counts.activeLoans} Active` : null, badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold' },
    { id: 'categories', label: 'Browse Genres', icon: FolderTree, badge: counts.categories },
    { id: 'authors', label: 'Authors Directory', icon: Users, badge: counts.authors }
  ];

  const navItems = userRole === 'admin' ? adminNavItems : userNavItems;

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white border-b md:border-b-0 md:border-r border-sky-100 p-4 flex flex-col justify-between rounded-2xl shadow-sm">
      <div className="space-y-6">

        {/* Navigation Group Header */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">
              {userRole === 'admin' ? 'Librarian Menu' : 'Reader Menu'}
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${userRole === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-sky-100 text-sky-800'
              }`}>
              {userRole === 'admin' ? 'ADMIN' : 'MEMBER'}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20 font-extrabold'
                      : 'text-slate-800 hover:text-slate-900 hover:bg-sky-50 font-bold'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 font-extrabold')
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions Panel */}
        <div className="pt-4 border-t border-sky-100">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700 px-3 mb-2">
            {userRole === 'admin' ? 'Admin Shortcuts' : 'Reader Shortcuts'}
          </div>
          <div className="space-y-2">
            {userRole === 'admin' ? (
              <>
                <button
                  onClick={() => onQuickAction('newLoan')}
                  className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold transition cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-amber-600" />
                  <span>Issue New Loan</span>
                </button>
                <button
                  onClick={() => onQuickAction('addBook')}
                  className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-extrabold transition cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-sky-600" />
                  <span>Add New Book</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('books')}
                className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-extrabold transition cursor-pointer shadow-sm"
              >
                <Search className="w-4 h-4 text-sky-600" />
                <span>Find Manga & Books</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
}
