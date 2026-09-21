import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const SOLVED_STORAGE_KEY = 'dsa_sheet_solved_v1';
const STREAK_STORAGE_KEY = 'dsa_sheet_streak_v1';

const getTodayDateStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getYesterdayDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const useDSAState = () => {
  // Solved state: map of problemId => { completed: bool, solvedAt: string, note: string, starred: bool }
  const [solvedState, setSolvedState] = useState(() => {
    try {
      const saved = localStorage.getItem(SOLVED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error loading solved state from localStorage', e);
      return {};
    }
  });

  // Streak state
  const [streakState, setStreakState] = useState(() => {
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            currentStreak: 0,
            maxStreak: 0,
            lastActiveDate: null,
            activityHistory: {}
          };
    } catch (e) {
      console.error('Error loading streak state', e);
      return { currentStreak: 0, maxStreak: 0, lastActiveDate: null, activityHistory: {} };
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(solvedState));
    } catch (e) {
      console.error('Failed to save solvedState', e);
    }
  }, [solvedState]);

  useEffect(() => {
    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakState));
    } catch (e) {
      console.error('Failed to save streakState', e);
    }
  }, [streakState]);

  // Recalculate active streak on load (e.g. check if streak reset due to missed day)
  useEffect(() => {
    const today = getTodayDateStr();
    const yesterday = getYesterdayDateStr();
    
    if (streakState.lastActiveDate) {
      if (streakState.lastActiveDate !== today && streakState.lastActiveDate !== yesterday) {
        // Streak broken
        setStreakState(prev => ({
          ...prev,
          currentStreak: 0
        }));
      }
    }
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }
  };

  const toggleProblemSolved = useCallback((problemId) => {
    const today = getTodayDateStr();
    const yesterday = getYesterdayDateStr();

    setSolvedState(prev => {
      const current = prev[problemId];
      const isCurrentlyCompleted = current && current.completed;
      const willBeCompleted = !isCurrentlyCompleted;

      const nextState = {
        ...prev,
        [problemId]: {
          ...(current || {}),
          completed: willBeCompleted,
          solvedAt: willBeCompleted ? today : (current?.solvedAt || null)
        }
      };

      if (willBeCompleted) {
        triggerConfetti();

        // Update streak
        setStreakState(prevStreak => {
          let newStreak = prevStreak.currentStreak;
          const lastActive = prevStreak.lastActiveDate;

          if (lastActive === today) {
            // Already active today, streak count remains same
          } else if (lastActive === yesterday) {
            // Continued streak from yesterday!
            newStreak += 1;
          } else {
            // Fresh streak start
            newStreak = 1;
          }

          const newMax = Math.max(prevStreak.maxStreak, newStreak);
          const history = { ...prevStreak.activityHistory };
          history[today] = (history[today] || 0) + 1;

          return {
            currentStreak: newStreak,
            maxStreak: newMax,
            lastActiveDate: today,
            activityHistory: history
          };
        });
      }

      return nextState;
    });
  }, []);

  const toggleStarProblem = useCallback((problemId) => {
    setSolvedState(prev => {
      const current = prev[problemId] || {};
      return {
        ...prev,
        [problemId]: {
          ...current,
          starred: !current.starred
        }
      };
    });
  }, []);

  const saveProblemNote = useCallback((problemId, noteText) => {
    setSolvedState(prev => {
      const current = prev[problemId] || {};
      return {
        ...prev,
        [problemId]: {
          ...current,
          note: noteText
        }
      };
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all your progress and streak?')) {
      setSolvedState({});
      setStreakState({ currentStreak: 0, maxStreak: 0, lastActiveDate: null, activityHistory: {} });
      localStorage.removeItem(SOLVED_STORAGE_KEY);
      localStorage.removeItem(STREAK_STORAGE_KEY);
    }
  }, []);

  const exportData = useCallback(() => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      solvedState,
      streakState
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_progress_backup_${getTodayDateStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [solvedState, streakState]);

  const importData = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.solvedState) {
        setSolvedState(parsed.solvedState);
      }
      if (parsed.streakState) {
        setStreakState(parsed.streakState);
      }
      alert('Progress imported successfully!');
    } catch (e) {
      alert('Invalid JSON file format.');
    }
  }, []);

  return {
    solvedState,
    streakState,
    toggleProblemSolved,
    toggleStarProblem,
    saveProblemNote,
    resetAllProgress,
    exportData,
    importData
  };
};
