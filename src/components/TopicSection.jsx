import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProblemRow } from './ProblemRow';

export const TopicSection = ({
  topic,
  solvedState,
  onToggleSolved,
  onToggleStar,
  onSaveNote,
  searchQuery,
  selectedDifficultyFilter,
  selectedStatusFilter
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter problems within this topic
  const filteredProblems = topic.problems.filter((p) => {
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchId = String(p.id).includes(q);
      const matchConcept = (p.concept || '').toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchConcept) return false;
    }

    // Difficulty filter
    if (selectedDifficultyFilter !== 'ALL') {
      if (p.difficulty !== selectedDifficultyFilter) return false;
    }

    // Status filter
    if (selectedStatusFilter === 'COMPLETED') {
      if (!solvedState[p.id]?.completed) return false;
    } else if (selectedStatusFilter === 'PENDING') {
      if (solvedState[p.id]?.completed) return false;
    } else if (selectedStatusFilter === 'STARRED') {
      if (!solvedState[p.id]?.starred) return false;
    }

    return true;
  });

  const totalTopicProblems = topic.problems.length;
  const solvedTopicProblems = topic.problems.filter((p) => solvedState[p.id]?.completed).length;
  const percentCompleted = totalTopicProblems > 0 ? Math.round((solvedTopicProblems / totalTopicProblems) * 100) : 0;

  // Don't render section if searching/filtering hides all problems in this topic
  if (filteredProblems.length === 0 && (searchQuery || selectedDifficultyFilter !== 'ALL' || selectedStatusFilter !== 'ALL')) {
    return null;
  }

  return (
    <div className="glass-panel rounded-2xl border-slate-800/80 mb-6 overflow-hidden transition-all shadow-lg">
      
      {/* Topic Header Accordion */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 md:p-5 cursor-pointer bg-slate-900/60 hover:bg-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 transition-colors"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>{topic.title}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {solvedTopicProblems} / {totalTopicProblems} Solved
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl line-clamp-1">
              {topic.description}
            </p>
          </div>
        </div>

        {/* Progress bar & Expand Icon */}
        <div className="flex items-center space-x-4 shrink-0">
          <div className="w-32 hidden sm:block">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
              <span>Progress</span>
              <span>{percentCompleted}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>
          </div>

          <button className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div>
          {/* Note / Mental Model callout box */}
          {topic.note && (
            <div className="mx-4 mt-4 p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 text-xs flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-indigo-200">Key Mental Model: </strong>
                <span>{topic.note}</span>
              </div>
            </div>
          )}

          {/* Progression Sequence banner */}
          {topic.progressionLabel && (
            <div className="mx-4 mt-3 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-300 text-xs flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{topic.progressionLabel}</span>
            </div>
          )}

          {/* Patterns Grid */}
          {topic.patterns && topic.patterns.length > 0 && (
            <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Must-Recognize Patterns in {topic.title}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {topic.patterns.map((pt, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="font-semibold text-emerald-400">{pt.pattern}: </span>
                    <span className="text-slate-300">{pt.mustRecognize || pt.example || pt.mustKnow}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problem List */}
          <div className="mt-4 border-t border-slate-800/80">
            {filteredProblems.map((problem) => (
              <ProblemRow
                key={problem.id}
                problem={problem}
                solvedData={solvedState[problem.id]}
                onToggleSolved={onToggleSolved}
                onToggleStar={onToggleStar}
                onSaveNote={onSaveNote}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
