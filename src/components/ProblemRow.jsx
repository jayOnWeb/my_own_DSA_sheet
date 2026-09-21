import React, { useState } from 'react';
import { ExternalLink, Check, Star, Award, StickyNote, ChevronDown, ChevronUp } from 'lucide-react';
import { getLeetCodeUrl } from '../data/dsaData';

export const ProblemRow = ({
  problem,
  solvedData,
  onToggleSolved,
  onToggleStar,
  onSaveNote
}) => {
  const isCompleted = solvedData?.completed || false;
  const isStarred = solvedData?.starred || false;
  const note = solvedData?.note || '';

  const [showNoteDrawer, setShowNoteDrawer] = useState(false);
  const [noteText, setNoteText] = useState(note);

  const handleSaveNote = () => {
    onSaveNote(problem.id, noteText);
    setShowNoteDrawer(false);
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">🟢 Easy</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">🟡 Medium</span>;
      case 'Hard':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">🔴 Hard</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">{diff}</span>;
    }
  };

  const leetcodeLink = getLeetCodeUrl(problem.title);

  return (
    <div className={`border-b border-slate-800/60 transition-colors ${isCompleted ? 'bg-emerald-950/10' : 'hover:bg-slate-900/40'}`}>
      <div className="flex items-center justify-between p-3.5 gap-3">
        
        {/* Left: Checkbox & Problem Title */}
        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
          {/* Custom Checkbox */}
          <button
            onClick={() => onToggleSolved(problem.id)}
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'border-2 border-slate-600 hover:border-emerald-400 bg-slate-900/80'
            }`}
            title={isCompleted ? 'Mark as unsolved' : 'Mark as completed'}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Problem ID */}
          <span className="text-xs font-mono font-bold text-slate-500 w-12 shrink-0">
            #{problem.id}
          </span>

          {/* Problem Title & Direct Link */}
          <div className="min-w-0 flex-1 flex items-center space-x-2">
            <a
              href={leetcodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium hover:underline flex items-center space-x-1.5 truncate ${
                isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-100 hover:text-emerald-300'
              }`}
            >
              <span className="truncate">{problem.title}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400 hover:text-emerald-400" />
            </a>

            {/* Core 75 Badge */}
            {problem.isCore75 && (
              <span className="hidden sm:inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                <Award className="w-3 h-3" />
                <span>Core 75</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Difficulty & Pattern Tag & Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Pattern Tag */}
          <span className="hidden md:inline-block text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 max-w-[200px] truncate">
            {problem.concept || problem.pattern}
          </span>

          {/* Difficulty Badge */}
          {getDifficultyBadge(problem.difficulty)}

          {/* Star Bookmark */}
          <button
            onClick={() => onToggleStar(problem.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isStarred ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={isStarred ? 'Unstar problem' : 'Star for revision'}
          >
            <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Note Drawer Toggle */}
          <button
            onClick={() => setShowNoteDrawer(!showNoteDrawer)}
            className={`p-1.5 rounded-lg transition-colors relative ${
              note ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title="Add notes / code approach"
          >
            <StickyNote className="w-4 h-4" />
            {note && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400" />}
          </button>
        </div>
      </div>

      {/* Note Drawer */}
      {showNoteDrawer && (
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Notes / Key Learnings for #{problem.id} {problem.title}:</span>
            <span className="text-[10px] text-slate-400">Stored locally in your browser</span>
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write approach hints, complexity analysis, or code notes here..."
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[70px]"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowNoteDrawer(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              className="px-3 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
