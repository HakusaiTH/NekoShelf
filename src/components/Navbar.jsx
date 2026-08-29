import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogIn, UserPlus, LogOut, ShieldCheck, UserCheck } from 'lucide-react';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  user,
  onOpenAuth
}) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-sky-100 px-4 sm:px-6 lg:px-8 py-3 shadow-sm w-full">
      <div className="flex items-center justify-between gap-4 w-full">
        
        {/* Header Logo Image */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center cursor-pointer hover:opacity-90 transition shrink-0"
        >
          <img
            src="/logo.png"
            alt="Library Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-600 font-bold" />
            <input
              type="text"
              placeholder="Search books, authors, categories, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sky-50/70 border border-sky-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 font-medium placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-600 hover:text-slate-900"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* User Auth Controls & Sign In / Sign Up Buttons */}
        <div className="flex items-center space-x-3">
          
          {user ? (
            /* Signed In Profile Badge with Circular user_logo.png avatar */
            <div className="flex items-center space-x-3 pl-2">
              <div className="flex items-center space-x-2.5 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl">
                <img
                  src={user.avatar || "/user_logo.png"}
                  alt={user.name || "User Profile"}
                  className="w-8 h-8 rounded-full object-cover border border-sky-200 shadow-sm shrink-0"
                  onError={(e) => { e.target.src = '/user_logo.png'; }}
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-extrabold text-slate-900 leading-none">{user.name}</div>
                  <div className="text-[10px] text-sky-700 font-bold mt-0.5 capitalize flex items-center space-x-1">
                    {user.role === 'admin' ? (
                      <span className="text-indigo-700 font-extrabold flex items-center">
                        <ShieldCheck className="w-3 h-3 inline mr-0.5" /> Librarian (Admin)
                      </span>
                    ) : (
                      <span className="text-sky-800 font-extrabold flex items-center">
                        <UserCheck className="w-3 h-3 inline mr-0.5" /> Member
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => onOpenAuth('signout')}
                className="p-2 rounded-xl text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Sign In and Sign Up Action Buttons */
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-3.5 py-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-extrabold transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-sky-500/25 flex items-center space-x-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
