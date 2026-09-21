import React from 'react';
import { Flame, Award, Search, Sparkles, BookOpen, Layers, CheckCircle2, Download } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  streakState,
  solvedCount,
  totalCount,
  onOpenDataModal
}) => {
  const percentCompleted = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('topics')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                DSA Sheet
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO 2026
              </span>
            </div>
          </div>

          {/* Mobile Streak & Data trigger */}
          <div className="flex items-center space-x-2 md:hidden">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{streakState.currentStreak}d</span>
            </div>
            <button
              onClick={onOpenDataModal}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              title="Backup / Restore Data"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problem title, #ID, or pattern (e.g. 53, HashMap, Kadane)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Navigation & Action Badges */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto pb-1 md:pb-0">
          
          {/* Tab buttons */}
          <div className="flex items-center p-1 bg-slate-900/80 border border-slate-800 rounded-xl space-x-1">
            <button
              onClick={() => setActiveTab('topics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'topics'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>All Topics</span>
            </button>

            <button
              onClick={() => setActiveTab('core75')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'core75'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Core 75</span>
            </button>

            <button
              onClick={() => setActiveTab('patterns')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'patterns'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Patterns & Guides</span>
            </button>
          </div>

          {/* Desktop Streak & Backup Button */}
          <div className="hidden md:flex items-center space-x-2">
            <div
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
              title={`Active Streak: ${streakState.currentStreak} day(s) | Max Streak: ${streakState.maxStreak} day(s)`}
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{streakState.currentStreak} Days Streak</span>
            </div>

            <button
              onClick={onOpenDataModal}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="Backup / Restore / Reset Progress"
            >
              <DownloadUpload className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
