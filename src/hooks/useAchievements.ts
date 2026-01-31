import React, { useState, useCallback, createContext, useContext, ReactNode } from "react";
import { Achievement, achievements as allAchievements } from "@/lib/gamificationData";

export type AchievementTrigger = 
  | "workout_complete"
  | "early_workout"
  | "streak_7"
  | "streak_30"
  | "heavy_lift_100kg"
  | "personal_record"
  | "daily_checkin"
  | "vision_ai_workout"
  | "first_workout"
  | "workout_count_100";

const triggerToAchievementMap: Record<AchievementTrigger, string[]> = {
  workout_complete: ["first-workout"],
  early_workout: ["early-bird"],
  streak_7: ["streak-7"],
  streak_30: ["streak-30"],
  heavy_lift_100kg: ["heavy-lifter"],
  personal_record: ["pr-crusher"],
  daily_checkin: ["consistency-king"],
  vision_ai_workout: ["vision-ai-pioneer"],
  first_workout: ["first-workout"],
  workout_count_100: ["century"],
};

const userProgress: Record<string, number> = {
  "early-bird": 10,
  "streak-7": 7,
  "streak-30": 12,
  "consistency-king": 75,
  "heavy-lifter": 100,
  "pr-crusher": 3,
  "tonnage-master": 85,
  "first-workout": 1,
  "century": 45,
  "year-warrior": 45,
  "vision-ai-pioneer": 3,
};

const checkAchievementUnlock = (achievementId: string): boolean => {
  const achievement = allAchievements.find(a => a.id === achievementId);
  if (!achievement || achievement.unlocked) return false;

  const progress = userProgress[achievementId] || 0;
  
  switch (achievementId) {
    case "early-bird":
      return progress >= 10;
    case "streak-7":
      return progress >= 7;
    case "streak-30":
      return progress >= 30;
    case "heavy-lifter":
      return progress >= 100;
    case "pr-crusher":
      return progress >= 5;
    case "consistency-king":
      return progress >= 90;
    case "first-workout":
      return true;
    case "century":
      return progress >= 100;
    case "vision-ai-pioneer":
      return progress >= 10;
    default:
      return false;
  }
};

interface AchievementContextType {
  pendingAchievement: Achievement | null;
  triggerAchievement: (trigger: AchievementTrigger) => void;
  showDemoAchievement: () => void;
  dismissAchievement: () => void;
  unlockedAchievements: string[];
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export const AchievementProvider = ({ children }: { children: ReactNode }) => {
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    const stored = localStorage.getItem("unlockedAchievements");
    return stored ? JSON.parse(stored) : allAchievements.filter(a => a.unlocked).map(a => a.id);
  });
  const [queue, setQueue] = useState<Achievement[]>([]);

  const dismissAchievement = useCallback(() => {
    setPendingAchievement(null);
    
    setQueue(prev => {
      if (prev.length > 0) {
        const [next, ...rest] = prev;
        setTimeout(() => setPendingAchievement(next), 500);
        return rest;
      }
      return prev;
    });
  }, []);

  const triggerAchievement = useCallback((trigger: AchievementTrigger) => {
    const achievementIds = triggerToAchievementMap[trigger] || [];
    
    const newlyUnlocked: Achievement[] = [];
    
    achievementIds.forEach(id => {
      if (unlockedAchievements.includes(id)) return;
      
      if (checkAchievementUnlock(id)) {
        const achievement = allAchievements.find(a => a.id === id);
        if (achievement) {
          newlyUnlocked.push({
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          });
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      const newUnlockedIds = newlyUnlocked.map(a => a.id);
      setUnlockedAchievements(prev => {
        const updated = [...prev, ...newUnlockedIds];
        localStorage.setItem("unlockedAchievements", JSON.stringify(updated));
        return updated;
      });

      if (!pendingAchievement) {
        setPendingAchievement(newlyUnlocked[0]);
        if (newlyUnlocked.length > 1) {
          setQueue(prev => [...prev, ...newlyUnlocked.slice(1)]);
        }
      } else {
        setQueue(prev => [...prev, ...newlyUnlocked]);
      }
    }
  }, [unlockedAchievements, pendingAchievement]);

  const showDemoAchievement = useCallback(() => {
    const demoAchievement: Achievement = {
      id: "demo-streak-7",
      name: "Haftalik Savasci",
      description: "Bir hafta boyunca hic ara verme",
      requirement: "7 gun ust uste antrenman yap",
      icon: allAchievements.find(a => a.id === "streak-7")?.icon || allAchievements[0].icon,
      category: "consistency",
      tier: "silver",
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      xpReward: 100,
    };
    setPendingAchievement(demoAchievement);
  }, []);

  const contextValue: AchievementContextType = {
    pendingAchievement,
    triggerAchievement,
    showDemoAchievement,
    dismissAchievement,
    unlockedAchievements,
  };

  return React.createElement(
    AchievementContext.Provider,
    { value: contextValue },
    children
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
};
