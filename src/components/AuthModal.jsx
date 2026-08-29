import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User, Shield, Info, Check } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const userProfile = {
      name: name || (email.split('@')[0] || (role === 'admin' ? 'Librarian Admin' : 'Reader Member')),
      email: email || (role === 'admin' ? 'admin@libraryhub.com' : 'user@libraryhub.com'),
      role: role
    };
    onAuthSuccess(userProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-sky-100 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-sky-50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900">
            {mode === 'signin' ? 'Sign In to Library Hub' : 'Create Reader Account'}
          </h2>
          <p className="text-xs text-slate-600 font-semibold">
            {mode === 'signin' ? 'Select your role and enter credentials' : 'Register to borrow books and manga'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-sky-50 p-1 rounded-xl border border-sky-200">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition cursor-pointer ${
              mode === 'signin' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition cursor-pointer ${
              mode === 'signup' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Role Selector */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Account Type Role</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                role === 'user'
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                  : 'bg-white text-slate-700 border-sky-200 hover:bg-sky-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Reader (User)</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-sky-200 hover:bg-sky-50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Librarian (Admin)</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'admin@libraryhub.com' : 'user@libraryhub.com'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-sky-500/25 cursor-pointer mt-2"
          >
            {mode === 'signin' ? 'Sign In Now' : 'Create Account'}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200 text-xs text-slate-800 space-y-1 font-semibold">
          <div className="font-extrabold text-sky-900 flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-sky-600" />
            <span>Demo Test Credentials:</span>
          </div>
          <div>Admin: <code className="bg-white px-1.5 py-0.5 rounded text-sky-800 font-mono font-bold border">admin@libraryhub.com</code> / pass: <code className="bg-white px-1.5 py-0.5 rounded text-sky-800 font-mono font-bold border">123456</code></div>
          <div>Member: <code className="bg-white px-1.5 py-0.5 rounded text-sky-800 font-mono font-bold border">user@libraryhub.com</code> / pass: <code className="bg-white px-1.5 py-0.5 rounded text-sky-800 font-mono font-bold border">123456</code></div>
        </div>
      </div>
    </div>
  );
}
