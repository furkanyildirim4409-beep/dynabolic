import { useState, useEffect, useCallback } from "react";
import { useAchievements } from "./useAchievements";
import { toast } from "@/hooks/use-toast";

export interface ChallengeStreakData {
  currentWinStreak: number;
  longestWinStreak: number;
  totalWins: number;
  totalLosses: number;
  totalChallenges: number;
  lastWinDate: string | null;
  bonusCoinsEarned: number;
}

interface StreakMilestone {
  streak: number;
  name: string;
  bonusMultiplier: number;
  emoji: string;
}

const STREAK_MILESTONES: StreakMilestone[] = [
  { streak: 3, name: "Üçleme", bonusMultiplier: 1.25, emoji: "🔥" },
  { streak: 5, name: "Beşli Seri", bonusMultiplier: 1.5, emoji: "⚔️" },
  { streak: 7, name: "Haftalık Şampiyon", bonusMultiplier: 1.75, emoji: "🏆" },
  { streak: 10, name: "Efsane Savaşçı", bonusMultiplier: 2.0, emoji: "👑" },
  { streak: 15, name: "Yenilmez", bonusMultiplier: 2.5, emoji: "💎" },
];

const STORAGE_KEY = "dynabolic_challenge_streak";

const DEFAULT_DATA: ChallengeStreakData = {
  currentWinStreak: 0,
  longestWinStreak: 0,
  totalWins: 0,
  totalLosses: 0,
  totalChallenges: 0,
  lastWinDate: null,
  bonusCoinsEarned: 0,
};

export const useChallengeStreaks = () => {
  const [streakData, setStreakData] = useState<ChallengeStreakData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_DATA, ...JSON.parse(stored) } : DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  const { triggerAchievement } = useAchievements();

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(streakData));
  }, [streakData]);

  // Get current milestone based on streak
  const getCurrentMilestone = useCallback((streak: number): StreakMilestone | null => {
    const milestones = STREAK_MILESTONES.filter(m => streak >= m.streak);
    return milestones.length > 0 ? milestones[milestones.length - 1] : null;
  }, []);

  // Get next milestone
  const getNextMilestone = useCallback((streak: number): StreakMilestone | null => {
    return STREAK_MILESTONES.find(m => m.streak > streak) || null;
  }, []);

  // Calculate bonus for current streak
  const calculateBonus = useCallback((baseReward: number, streak: number): { total: number; bonus: number; multiplier: number } => {
    const milestone = getCurrentMilestone(streak);
    const multiplier = milestone?.bonusMultiplier || 1;
    const total = Math.floor(baseReward * multiplier);
    const bonus = total - baseReward;
    return { total, bonus, multiplier };
  }, [getCurrentMilestone]);

  // Record a challenge win
  const recordWin = useCallback((baseCoinsReward: number) => {
    setStreakData(prev => {
      const newStreak = prev.currentWinStreak + 1;
      const newLongest = Math.max(prev.longestWinStreak, newStreak);
      const milestone = getCurrentMilestone(newStreak);
      const bonus = milestone ? Math.floor(baseCoinsReward * (milestone.bonusMultiplier - 1)) : 0;

      // Check for milestone achievements
      const prevMilestone = getCurrentMilestone(prev.currentWinStreak);
      if (milestone && milestone !== prevMilestone) {
        toast({
          title: `${milestone.emoji} ${milestone.name}!`,
          description: `${newStreak} meydan okuma serisi! Bonus çarpan: ${milestone.bonusMultiplier}x`,
        });

        // Trigger achievements for specific milestones
        if (newStreak === 5) {
          triggerAchievement("challenge_streak_5");
        } else if (newStreak === 10) {
          triggerAchievement("challenge_streak_10");
        }
      }

      return {
        ...prev,
        currentWinStreak: newStreak,
        longestWinStreak: newLongest,
        totalWins: prev.totalWins + 1,
        totalChallenges: prev.totalChallenges + 1,
        lastWinDate: new Date().toISOString(),
        bonusCoinsEarned: prev.bonusCoinsEarned + bonus,
      };
    });
  }, [getCurrentMilestone, triggerAchievement]);

  // Record a challenge loss
  const recordLoss = useCallback(() => {
    setStreakData(prev => {
      if (prev.currentWinStreak > 0) {
        toast({
          title: "Seri Kırıldı! 💔",
          description: `${prev.currentWinStreak} maçlık serin sona erdi. Yeniden başla!`,
          variant: "destructive",
        });
      }

      return {
        ...prev,
        currentWinStreak: 0,
        totalLosses: prev.totalLosses + 1,
        totalChallenges: prev.totalChallenges + 1,
      };
    });
  }, []);

  // Get win rate
  const getWinRate = useCallback((): number => {
    if (streakData.totalChallenges === 0) return 0;
    return Math.round((streakData.totalWins / streakData.totalChallenges) * 100);
  }, [streakData]);

  // Reset streak data (for testing)
  const resetStreak = useCallback(() => {
    setStreakData(DEFAULT_DATA);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Simulate wins for testing
  const simulateWins = useCallback((count: number, baseReward: number = 500) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => recordWin(baseReward), i * 100);
    }
  }, [recordWin]);

  return {
    streakData,
    currentMilestone: getCurrentMilestone(streakData.currentWinStreak),
    nextMilestone: getNextMilestone(streakData.currentWinStreak),
    calculateBonus,
    recordWin,
    recordLoss,
    getWinRate,
    resetStreak,
    simulateWins,
    STREAK_MILESTONES,
  };
};
