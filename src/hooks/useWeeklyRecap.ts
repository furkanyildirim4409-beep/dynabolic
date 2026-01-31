import { useState, useEffect, useCallback } from "react";

export interface WeeklyRecapData {
  weekStartDate: string;
  weekEndDate: string;
  workoutsCompleted: number;
  streakDays: number;
  challengesWon: number;
  challengesLost: number;
  bioCoinsEarned: number;
  bonusCoinsEarned: number;
  totalTonnage: number;
  personalRecords: number;
  topExercise: string;
  comparedToLastWeek: {
    workouts: number; // percentage change
    tonnage: number;
    streak: number;
  };
}

interface WeeklyRecapState {
  lastShownWeek: string | null;
  recapData: WeeklyRecapData | null;
}

const STORAGE_KEY = "dynabolic_weekly_recap";

// Get the start of the current week (Monday)
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Generate mock weekly data (in production, this would come from actual tracking)
const generateMockRecapData = (): WeeklyRecapData => {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return {
    weekStartDate: formatDate(weekStart),
    weekEndDate: formatDate(weekEnd),
    workoutsCompleted: Math.floor(Math.random() * 4) + 3, // 3-6 workouts
    streakDays: Math.floor(Math.random() * 5) + 3, // 3-7 days
    challengesWon: Math.floor(Math.random() * 3), // 0-2 wins
    challengesLost: Math.floor(Math.random() * 2), // 0-1 losses
    bioCoinsEarned: Math.floor(Math.random() * 800) + 200, // 200-1000 coins
    bonusCoinsEarned: Math.floor(Math.random() * 200), // 0-200 bonus
    totalTonnage: Math.floor(Math.random() * 15000) + 5000, // 5000-20000 kg
    personalRecords: Math.floor(Math.random() * 3), // 0-2 PRs
    topExercise: ["Squat", "Bench Press", "Deadlift", "Overhead Press"][Math.floor(Math.random() * 4)],
    comparedToLastWeek: {
      workouts: Math.floor(Math.random() * 40) - 10, // -10% to +30%
      tonnage: Math.floor(Math.random() * 30) - 5, // -5% to +25%
      streak: Math.floor(Math.random() * 3) - 1, // -1 to +2 days
    },
  };
};

export const useWeeklyRecap = () => {
  const [showRecap, setShowRecap] = useState(false);
  const [recapData, setRecapData] = useState<WeeklyRecapData | null>(null);

  // Check if we should show the recap
  const checkAndShowRecap = useCallback(() => {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const currentWeekKey = formatDate(getWeekStart(now));

    // Get stored state
    const stored = localStorage.getItem(STORAGE_KEY);
    const state: WeeklyRecapState = stored 
      ? JSON.parse(stored) 
      : { lastShownWeek: null, recapData: null };

    // Show recap if it's Sunday and we haven't shown it this week
    if (isSunday && state.lastShownWeek !== currentWeekKey) {
      const data = generateMockRecapData();
      setRecapData(data);
      setShowRecap(true);

      // Mark as shown
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastShownWeek: currentWeekKey,
        recapData: data,
      }));
    }
  }, []);

  // Check on mount and set up periodic check
  useEffect(() => {
    checkAndShowRecap();

    // Check every hour (in case user keeps app open)
    const interval = setInterval(checkAndShowRecap, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAndShowRecap]);

  // Manually trigger recap for testing
  const triggerRecap = useCallback(() => {
    const data = generateMockRecapData();
    setRecapData(data);
    setShowRecap(true);
  }, []);

  // Dismiss recap
  const dismissRecap = useCallback(() => {
    setShowRecap(false);
  }, []);

  // Get last week's recap data
  const getLastRecapData = useCallback((): WeeklyRecapData | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state: WeeklyRecapState = JSON.parse(stored);
      return state.recapData;
    }
    return null;
  }, []);

  return {
    showRecap,
    recapData,
    triggerRecap,
    dismissRecap,
    getLastRecapData,
  };
};
