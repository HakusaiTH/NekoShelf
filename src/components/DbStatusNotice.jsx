import React, { useState } from 'react';
import { Database, AlertTriangle, Copy, Check, ExternalLink, RefreshCw, ShieldAlert } from 'lucide-react';

export default function DbStatusNotice({ dbStatus, onRetry, onSeedLocalData }) {
  const [copied, setCopied] = useState(false);

  const disableRlsAndSeedSql = `-- Run this in Supabase SQL Editor to Disable RLS & Allow Access:

ALTER TABLE public.authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans DISABLE ROW LEVEL SECURITY;`;

  const copySql = () => {
    navigator.clipboard.writeText(disableRlsAndSeedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (dbStatus.connected && dbStatus.hasTables && !dbStatus.isRlsBlocked) {
    return null;
  }

  return (
    <div className="mb-6 rounded-3xl bg-amber-50 border border-amber-200 p-5 text-amber-900 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          {dbStatus.isRlsBlocked ? (
            <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="text-base font-extrabold text-amber-900">
              {dbStatus.isRlsBlocked 
                ? 'Supabase RLS Policy Blocking Access (Row Level Security Enabled)' 
                : 'Displaying Interactive Manga Demo Data'}
            </h3>
            <p className="text-xs text-amber-800 mt-1 font-semibold">
              {dbStatus.isRlsBlocked 
                ? 'Supabase Cloud Database has RLS enabled which blocks API requests. Please run the SQL command below to disable RLS.' 
                : 'Your cloud Supabase tables are ready. Showing full Manga demo data (One Piece, Demon Slayer, Attack on Titan, etc.).'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={copySql}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-extrabold rounded-xl transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'SQL Copied!' : 'Copy Disable RLS SQL'}</span>
          </button>

          <button
            onClick={onRetry}
            className="p-2 bg-white hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 transition cursor-pointer"
            title="Refresh Database Sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-amber-200/60 text-[11px] text-amber-800 font-bold flex flex-wrap items-center justify-between gap-2">
        <span>To sync directly to Cloud DB: Paste command in <a href="https://supabase.com/dashboard/project/rwiuevnywuapaqjzeubz/sql" target="_blank" rel="noreferrer" className="underline font-extrabold hover:text-amber-950">Supabase SQL Editor <ExternalLink className="inline w-3 h-3 ml-0.5" /></a></span>
      </div>
    </div>
  );
}
