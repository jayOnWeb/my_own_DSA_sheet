import React from 'react';
import { CORE_75_LIST } from '../data/dsaData';
import { ProblemRow } from './ProblemRow';
import { Award, Sparkles, Filter } from 'lucide-react';

export const Core75View = ({
  allProblemsMap,
  solvedState,
  onToggleSolved,
  onToggleStar,
  onSaveNote,
  searchQuery,
  selectedDifficultyFilter,
  selectedStatusFilter
}) => {
  // Map Core 75 list to actual full problem objects
  const core75Problems = CORE_75_LIST.map((c) => {
    const found = allProblemsMap[c.id];
    return {
      num: c.num,
      id: c.id,
      title: found?.title || c.title,
      difficulty: found?.difficulty || 'Medium',
      concept: c.pattern || found?.concept,
      isCore75: true
    };
  });

  const filteredCore75 = core75Problems.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchId = String(p.id).includes(q);
      const matchPattern = (p.concept || '').toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchPattern) return false;
    }

    if (selectedDifficultyFilter !== 'ALL') {
      if (p.difficulty !== selectedDifficultyFilter) return false;
    }

    if (selectedStatusFilter === 'COMPLETED') {
      if (!solvedState[p.id]?.completed) return false;
    } else if (selectedStatusFilter === 'PENDING') {
      if (solvedState[p.id]?.completed) return false;
    } else if (selectedStatusFilter === 'STARRED') {
      if (!solvedState[p.id]?.starred) return false;
    }

    return true;
  });

  const solvedCoreCount = core75Problems.filter((p) => solvedState[p.id]?.completed).length;
  const percentSolved = Math.round((solvedCoreCount / 75) * 100);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Core 75 Essential List</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                Must Solve First
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              "Bro, which questions should I absolutely solve myself before I start expecting to solve new DSA questions?"
              Solve these 75 core pattern questions to build high-level problem recognition.
            </p>
          </div>
        </div>

        {/* Progress Gauge */}
        <div className="w-full md:w-auto flex items-center space-x-4 shrink-0 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div>
            <div className="text-xs font-semibold text-slate-400">Core 75 Solved</div>
            <div className="text-2xl font-extrabold text-amber-400">
              {solvedCoreCount} <span className="text-sm font-normal text-slate-400">/ 75</span>
            </div>
          </div>
          <div className="w-20">
            <div className="text-[10px] text-right font-semibold text-amber-300 mb-1">{percentSolved}%</div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentSolved}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Core 75 Table Container */}
      <div className="glass-panel rounded-2xl border-slate-800/80 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Core 75 Problems ({filteredCore75.length} shown)
          </span>
          <span className="text-xs text-slate-400">
            Includes direct LeetCode links & pattern tags
          </span>
        </div>

        <div>
          {filteredCore75.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No problems match your current search or filter.
            </div>
          ) : (
            filteredCore75.map((problem) => (
              <ProblemRow
                key={problem.id}
                problem={problem}
                solvedData={solvedState[problem.id]}
                onToggleSolved={onToggleSolved}
                onToggleStar={onToggleStar}
                onSaveNote={onSaveNote}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
