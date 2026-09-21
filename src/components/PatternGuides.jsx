import React from 'react';
import { CROSS_TOPIC_PATTERNS } from '../data/dsaData';
import { Layers, ArrowRight, GitMerge, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const PatternGuides = () => {
  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="glass-panel p-6 rounded-2xl border-indigo-500/20 bg-gradient-to-r from-indigo-950/20 via-slate-900/80 to-slate-900/80">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Cross-Topic Patterns & Progression Roadmaps</h2>
            <p className="text-xs text-slate-400">
              This is where your actual DSA skill comes from. A problem might be listed under Array, but the real pattern could be HashMap + Prefix Sum.
            </p>
          </div>
        </div>
      </div>

      {/* Pattern Progressions Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stack Progression */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center space-x-2.5 mb-3">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Stack Pattern Progression</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            If you genuinely understand this progression, you'll recognize many monotonic-stack questions.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 20, label: '#20 Valid Parentheses' },
              { id: 496, label: '#496 Next Greater I' },
              { id: 739, label: '#739 Daily Temperatures' },
              { id: 503, label: '#503 Next Greater II' },
              { id: 84, label: '#84 Largest Histogram' },
              { id: 85, label: '#85 Maximal Rectangle' }
            ].map((step, i, arr) => (
              <React.Fragment key={step.id}>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {step.label}
                </span>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Linked List Progression */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center space-x-2.5 mb-3">
            <GitMerge className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Linked List Progression</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            This progression teaches most core pointer manipulation patterns.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[21, 206, 876, 141, 19, 92, 143, 25].map((id, i, arr) => (
              <React.Fragment key={id}>
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  #{id}
                </span>
                {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Backtracking Mental Model & Progression */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 md:col-span-2">
          <div className="flex items-center space-x-2.5 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Backtracking Mental Model & Progression</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-4 flex items-center justify-center space-x-4">
            <span className="px-3 py-1 rounded bg-indigo-900/60 border border-indigo-400/30">choose</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
            <span className="px-3 py-1 rounded bg-indigo-900/60 border border-indigo-400/30">explore</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
            <span className="px-3 py-1 rounded bg-indigo-900/60 border border-indigo-400/30">undo</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              'Subsets',
              'Combinations',
              'Combination Sum',
              'Permutations',
              'Generate Parentheses',
              'Word Search',
              'Palindrome Partitioning',
              'N-Queens',
              'Sudoku Solver'
            ].map((step, i, arr) => (
              <React.Fragment key={step}>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                  {step}
                </span>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* DP Progression */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 md:col-span-2">
          <div className="flex items-center space-x-2.5 mb-2">
            <Layers className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Dynamic Programming Progression</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            State → Choice → Transition → Base Case → Answer. If you can derive these independently, your DP pattern recognition becomes rock solid.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[70, 746, 198, 213, 322, 518, 300, 1143, 416, 62, 64, 91, 139, 152, 72, 312, 10].map((id, i, arr) => (
              <React.Fragment key={id}>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  #{id}
                </span>
                {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>

      {/* Cross-Topic Patterns Table */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            All Cross-Topic Patterns & Problem Links
          </h3>
          <span className="text-xs text-slate-400">{CROSS_TOPIC_PATTERNS.length} Essential Patterns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {CROSS_TOPIC_PATTERNS.map((pt, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="text-xs font-bold text-emerald-400 mb-2">{pt.pattern}</div>
              <div className="flex flex-wrap gap-1.5">
                {pt.problems.map((probId) => (
                  <span
                    key={probId}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700/80"
                  >
                    #{probId}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
