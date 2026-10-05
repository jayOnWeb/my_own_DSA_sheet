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

const safeGetItem = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const useDSAState = () => {
  const [solvedState, setSolvedState] = useState(() => safeGetItem(SOLVED_STORAGE_KEY, {}));

  const [streakState, setStreakState] = useState(() =>
    safeGetItem(STREAK_STORAGE_KEY, {
      currentStreak: 0,
      maxStreak: 0,
      lastActiveDate: null,
      activityHistory: {}
    })
  );

  // Sync state across browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === SOLVED_STORAGE_KEY && e.newValue) {
        try {
          setSolvedState(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === STREAK_STORAGE_KEY && e.newValue) {
        try {
          setStreakState(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  const toggleProblemSolved = useCallback((problemId) => {
    const key = String(problemId);
    const today = getTodayDateStr();
    const yesterday = getYesterdayDateStr();

    let wasCompleted = false;

    setSolvedState((prev) => {
      const current = prev[key] || prev[problemId] || {};
      const isCurrentlyCompleted = !!current.completed;
      const willBeCompleted = !isCurrentlyCompleted;
      wasCompleted = willBeCompleted;

      const nextSolved = {
        ...prev,
        [key]: {
          ...current,
          completed: willBeCompleted,
          solvedAt: willBeCompleted ? today : (current.solvedAt || null)
        }
      };

      // Direct synchronous write to localStorage for instant persistence
      safeSetItem(SOLVED_STORAGE_KEY, nextSolved);
      return nextSolved;
    });

    if (wasCompleted) {
      triggerConfetti();

      setStreakState((prevStreak) => {
        let newStreak = prevStreak.currentStreak || 0;
        const lastActive = prevStreak.lastActiveDate;

        if (lastActive === today) {
          // Already active today
        } else if (lastActive === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }

        const newMax = Math.max(prevStreak.maxStreak || 0, newStreak);
        const history = { ...(prevStreak.activityHistory || {}) };
        history[today] = (history[today] || 0) + 1;

        const nextStreak = {
          currentStreak: newStreak,
          maxStreak: newMax,
          lastActiveDate: today,
          activityHistory: history
        };

        safeSetItem(STREAK_STORAGE_KEY, nextStreak);
        return nextStreak;
      });
    }
  }, []);

  const toggleStarProblem = useCallback((problemId) => {
    const key = String(problemId);
    setSolvedState((prev) => {
      const current = prev[key] || prev[problemId] || {};
      const nextSolved = {
        ...prev,
        [key]: {
          ...current,
          starred: !current.starred
        }
      };
      safeSetItem(SOLVED_STORAGE_KEY, nextSolved);
      return nextSolved;
    });
  }, []);

  const saveProblemNote = useCallback((problemId, noteText) => {
    const key = String(problemId);
    setSolvedState((prev) => {
      const current = prev[key] || prev[problemId] || {};
      const nextSolved = {
        ...prev,
        [key]: {
          ...current,
          note: noteText
        }
      };
      safeSetItem(SOLVED_STORAGE_KEY, nextSolved);
      return nextSolved;
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all your progress and streak?')) {
      const emptySolved = {};
      const emptyStreak = { currentStreak: 0, maxStreak: 0, lastActiveDate: null, activityHistory: {} };

      setSolvedState(emptySolved);
      setStreakState(emptyStreak);

      safeSetItem(SOLVED_STORAGE_KEY, emptySolved);
      safeSetItem(STREAK_STORAGE_KEY, emptyStreak);
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
        safeSetItem(SOLVED_STORAGE_KEY, parsed.solvedState);
      }
      if (parsed.streakState) {
        setStreakState(parsed.streakState);
        safeSetItem(STREAK_STORAGE_KEY, parsed.streakState);
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
