import { useEffect, useCallback, useState } from "react";
import { useAchievements } from "./useAchievements";
import { toast } from "@/hooks/use-toast";
import { hapticSuccess } from "@/lib/haptics";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  totalWorkouts: number;
}

const STREAK_STORAGE_KEY = "dynabolic-streak-data";

const getDefaultStreakData = (): StreakData => ({
  currentStreak: 12, // Start with mock data
  longestStreak: 21,
  lastWorkoutDate: new Date().toISOString().split("T")[0],
  totalWorkouts: 45,
});

export const useStreakTracking = () => {
  const { triggerAchievement } = useAchievements();
  const [streakData, setStreakData] = useState<StreakData>(() => {
    const stored = localStorage.getItem(STREAK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultStreakData();
  });

  // Save streak data to localStorage
  useEffect(() => {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
  }, [streakData]);

  // Check if streak is still active (workout done today or yesterday)
  const isStreakActive = useCallback(() => {
    if (!streakData.lastWorkoutDate) return false;
    
    const lastDate = new Date(streakData.lastWorkoutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  }, [streakData.lastWorkoutDate]);

  // Record a workout completion and check for streak milestones
  const recordWorkout = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    
    setStreakData(prev => {
      // Check if already recorded today
      if (prev.lastWorkoutDate === today) {
        return prev;
      }

      const lastDate = prev.lastWorkoutDate ? new Date(prev.lastWorkoutDate) : null;
      const todayDate = new Date(today);
      
      let newStreak = prev.currentStreak;
      
      if (lastDate) {
        lastDate.setHours(0, 0, 0, 0);
        todayDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day - increment streak
          newStreak = prev.currentStreak + 1;
        } else if (diffDays > 1) {
          // Streak broken - start fresh
          newStreak = 1;
          toast({
            title: "Seri Kırıldı 💔",
            description: "Yeni bir seri başlatıyorsun. Hedef: 7 gün!",
          });
        }
        // diffDays === 0 means same day, keep streak
      } else {
        // First workout ever
        newStreak = 1;
      }

      const newLongestStreak = Math.max(prev.longestStreak, newStreak);
      const newTotalWorkouts = prev.totalWorkouts + 1;

      // Check streak milestones and trigger achievements
      setTimeout(() => {
        checkStreakMilestones(newStreak, prev.currentStreak);
      }, 500);

      return {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastWorkoutDate: today,
        totalWorkouts: newTotalWorkouts,
      };
    });
  }, []);

  // Check for streak milestones and trigger appropriate achievements
  const checkStreakMilestones = useCallback((newStreak: number, previousStreak: number) => {
    // 7-day streak milestone
    if (newStreak >= 7 && previousStreak < 7) {
      hapticSuccess();
      triggerAchievement("streak_7");
      toast({
        title: "🔥 7 Gün Serisi!",
        description: "Bir hafta boyunca hiç ara vermedin. Müthiş!",
      });
    }
    
    // 30-day streak milestone
    if (newStreak >= 30 && previousStreak < 30) {
      hapticSuccess();
      triggerAchievement("streak_30");
      toast({
        title: "🏆 30 Gün Serisi!",
        description: "Bir ay boyunca disiplini korudun. Efsanesin!",
      });
    }

    // Additional milestone notifications (without achievements)
    if (newStreak === 14 && previousStreak < 14) {
      toast({
        title: "⚡ 2 Haftalık Seri!",
        description: "14 gün üst üste antrenman. Durdurulamıyorsun!",
      });
    }

    if (newStreak === 21 && previousStreak < 21) {
      toast({
        title: "💪 3 Haftalık Seri!",
        description: "21 gün! Artık bu bir alışkanlık.",
      });
    }

    if (newStreak === 60 && previousStreak < 60) {
      toast({
        title: "👑 60 Gün Serisi!",
        description: "2 ay boyunca her gün antrenman. İnanılmaz!",
      });
    }

    if (newStreak === 100 && previousStreak < 100) {
      toast({
        title: "🌟 100 GÜN SERİSİ!",
        description: "Üç haneli rakamlar kulübüne hoş geldin. Sen bir efsanesin!",
      });
    }
  }, [triggerAchievement]);

  // Simulate a streak for demo purposes
  const simulateStreak = useCallback((days: number) => {
    const previousStreak = streakData.currentStreak;
    
    setStreakData(prev => ({
      ...prev,
      currentStreak: days,
      longestStreak: Math.max(prev.longestStreak, days),
      lastWorkoutDate: new Date().toISOString().split("T")[0],
    }));

    // Trigger milestone check after state update
    setTimeout(() => {
      checkStreakMilestones(days, previousStreak);
    }, 100);
  }, [streakData.currentStreak, checkStreakMilestones]);

  // Reset streak (for testing)
  const resetStreak = useCallback(() => {
    setStreakData({
      currentStreak: 0,
      longestStreak: streakData.longestStreak,
      lastWorkoutDate: null,
      totalWorkouts: streakData.totalWorkouts,
    });
    toast({
      title: "Seri Sıfırlandı",
      description: "Test için seri sıfırlandı.",
    });
  }, [streakData.longestStreak, streakData.totalWorkouts]);

  return {
    ...streakData,
    isStreakActive: isStreakActive(),
    recordWorkout,
    simulateStreak,
    resetStreak,
  };
};
