import React, { useState, useMemo } from 'react';
import { TOPICS_DATA, CORE_75_IDS } from './data/dsaData';
import { useDSAState } from './hooks/useDSAState';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { TopicSection } from './components/TopicSection';
import { Core75View } from './components/Core75View';
import { PatternGuides } from './components/PatternGuides';
import { DataExportModal } from './components/DataExportModal';
import { Code2, Heart, Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' | 'core75' | 'patterns'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const {
    solvedState,
    streakState,
    toggleProblemSolved,
    toggleStarProblem,
    saveProblemNote,
    resetAllProgress,
    exportData,
    importData
  } = useDSAState();

  // Process and flatten all problems across topics
  const { allProblemsList, allProblemsMap, processedTopics } = useMemo(() => {
    const list = [];
    const map = {};

    const topicsWithCore75 = TOPICS_DATA.map((topic) => {
      const updatedProblems = topic.problems.map((p) => {
        const isCore75 = CORE_75_IDS.has(p.id);
        const problemObj = {
          ...p,
          topicId: topic.id,
          topicTitle: topic.title,
          isCore75
        };

        map[p.id] = problemObj;
        list.push(problemObj);
        return problemObj;
      });

      return {
        ...topic,
        problems: updatedProblems
      };
    });

    return {
      allProblemsList: list,
      allProblemsMap: map,
      processedTopics: topicsWithCore75
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 font-sans pb-16">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        streakState={streakState}
        solvedCount={Object.values(solvedState).filter(s => s?.completed).length}
        totalCount={allProblemsList.length}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        
        {/* Statistics & Filter Overview Bar */}
        <StatsOverview
          allProblems={allProblemsList}
          solvedState={solvedState}
          streakState={streakState}
          selectedDifficultyFilter={selectedDifficultyFilter}
          setSelectedDifficultyFilter={setSelectedDifficultyFilter}
          selectedStatusFilter={selectedStatusFilter}
          setSelectedStatusFilter={setSelectedStatusFilter}
        />

        {/* Tab Content */}
        {activeTab === 'topics' && (
          <div className="space-y-4">
            {processedTopics.map((topic) => (
              <TopicSection
                key={topic.id}
                topic={topic}
                solvedState={solvedState}
                onToggleSolved={toggleProblemSolved}
                onToggleStar={toggleStarProblem}
                onSaveNote={saveProblemNote}
                searchQuery={searchQuery}
                selectedDifficultyFilter={selectedDifficultyFilter}
                selectedStatusFilter={selectedStatusFilter}
              />
            ))}
          </div>
        )}

        {activeTab === 'core75' && (
          <Core75View
            allProblemsMap={allProblemsMap}
            solvedState={solvedState}
            onToggleSolved={toggleProblemSolved}
            onToggleStar={toggleStarProblem}
            onSaveNote={saveProblemNote}
            searchQuery={searchQuery}
            selectedDifficultyFilter={selectedDifficultyFilter}
            selectedStatusFilter={selectedStatusFilter}
          />
        )}

        {activeTab === 'patterns' && (
          <PatternGuides />
        )}

      </main>

      {/* Backup & Export Modal */}
      <DataExportModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onExport={exportData}
        onImport={importData}
        onReset={resetAllProgress}
      />

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-500 border-t border-slate-900 pt-8 pb-4">
        <div className="flex items-center justify-center space-x-2">
          <span>Crafted with precision for DSA Mastery</span>
          <span>•</span>
          <a
            href="https://github.com/jayOnWeb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>jayOnWeb</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
