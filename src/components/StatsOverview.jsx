import React from 'react';
import { CheckCircle2, Flame, Award, Star, Clock, Filter, Zap, Target } from 'lucide-react';

export const StatsOverview = ({
  allProblems,
  solvedState,
  streakState,
  selectedDifficultyFilter,
  setSelectedDifficultyFilter,
  selectedStatusFilter,
  setSelectedStatusFilter
}) => {
  const total = allProblems.length;
  
  let easyCount = 0;
  let easySolved = 0;
  let mediumCount = 0;
  let mediumSolved = 0;
  let hardCount = 0;
  let hardSolved = 0;
  let core75Solved = 0;
  let totalSolved = 0;
  let starredCount = 0;

  allProblems.forEach((p) => {
    const isSolved = solvedState[p.id]?.completed;
    const isStarred = solvedState[p.id]?.starred;

    if (isSolved) {
      totalSolved++;
      if (p.isCore75) core75Solved++;
    }
    if (isStarred) starredCount++;

    if (p.difficulty === 'Easy') {
      easyCount++;
      if (isSolved) easySolved++;
    } else if (p.difficulty === 'Medium') {
      mediumCount++;
      if (isSolved) mediumSolved++;
    } else if (p.difficulty === 'Hard') {
      hardCount++;
      if (isSolved) hardSolved++;
    }
  });

  const overallPercent = total > 0 ? Math.round((totalSolved / total) * 100) : 0;
  const core75Percent = Math.round((core75Solved / 75) * 100);

  return (
    <div className="space-y-6 mb-8">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Progress Card */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border-slate-800/80 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Solved</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">{totalSolved}</span>
              <span className="text-xs text-slate-400">/ {total} ({overallPercent}%)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Core 75 Progress Card */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border-slate-800/80 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Core 75 Progress</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">{core75Solved}</span>
              <span className="text-xs text-slate-400">/ 75 ({core75Percent}%)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
                style={{ width: `${core75Percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak & Activity Card */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border-slate-800/80 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Streak</span>
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-amber-400 text-glow-flame">
                {streakState.currentStreak}
              </span>
              <span className="text-xs text-slate-400">days active</span>
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
              <span>Max Streak: <strong className="text-slate-200">{streakState.maxStreak}d</strong></span>
              <span>Starred: <strong className="text-amber-300">{starredCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown Card */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Difficulty Stats</span>
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-medium">Easy 🟢</span>
              <span className="text-slate-300 font-semibold">{easySolved} / {easyCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-medium">Medium 🟡</span>
              <span className="text-slate-300 font-semibold">{mediumSolved} / {mediumCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rose-400 font-medium">Hard 🔴</span>
              <span className="text-slate-300 font-semibold">{hardSolved} / {hardCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass-panel rounded-xl border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Filters:</span>
        </div>

        {/* Difficulty filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficultyFilter(diff)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                selectedDifficultyFilter === diff
                  ? diff === 'Easy'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : diff === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : diff === 'Hard'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Status filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Status' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'STARRED', label: 'Starred ★' }
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setSelectedStatusFilter(status.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                selectedStatusFilter === status.id
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
