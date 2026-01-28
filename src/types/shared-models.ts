// Shared data models synced with Coach Admin Panel

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  tier: "Pro" | "Elite" | "Standard";
  compliance: number;
  readiness: number;
  injuryRisk: "Low" | "Medium" | "High";
  checkInStatus: "completed" | "missed" | "pending";
  bloodworkStatus: "up-to-date" | "pending" | "overdue";
  subscriptionExpiry: string;
  currentCalories: number;
  currentProtein: number;
  currentProgram: string;
  currentDiet: string;
}

export interface DailyCheckIn {
  date: string;
  mood: number;
  sleep: number;
  soreness: number;
  stress: number;
  notes: string;
}

export interface Invoice {
  id: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate?: string;
  serviceType?: string;
}

export interface ProgramExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rpe: number;
  notes?: string;
}

export interface AssignedProgram {
  id: string;
  title: string;
  day: string;
  exercises: ProgramExercise[];
  coachNote?: string;
}

export type StoryCategory = "Değişimler" | "Soru-Cevap" | "Başarılar" | "Antrenman" | "Motivasyon";

export interface CoachStory {
  id: string;
  title: string;
  thumbnail: string;
  category: StoryCategory;
  content: { 
    image: string; 
    text: string; 
  };
  viewed?: boolean;
}

export interface CoachAdjustment {
  id: string;
  type: "intensity" | "calories" | "volume";
  value: number;
  message: string;
  appliedAt: string;
}
