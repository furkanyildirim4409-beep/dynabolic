import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Calendar, TrendingUp, Clock, Target, History, X, CheckCircle2, Timer, Flame } from "lucide-react";
import WorkoutCard from "@/components/WorkoutCard";
import VisionAIExecution from "@/components/VisionAIExecution";

interface WorkoutHistoryEntry {
  id: string;
  date: string;
  dateShort: string;
  name: string;
  duration: string;
  tonnage: string;
  exercises: number;
  bioCoins: number;
  completed: boolean;
}

const workoutHistory: WorkoutHistoryEntry[] = [
  { id: "1", date: "27 Ocak 2026", dateShort: "27 Oca", name: "Göğüs & Arka Kol", duration: "55dk", tonnage: "4.2 Ton", exercises: 6, bioCoins: 75, completed: true },
  { id: "2", date: "25 Ocak 2026", dateShort: "25 Oca", name: "Bacak & Core", duration: "48dk", tonnage: "5.8 Ton", exercises: 5, bioCoins: 80, completed: true },
  { id: "3", date: "23 Ocak 2026", dateShort: "23 Oca", name: "Sırt & Biceps", duration: "52dk", tonnage: "3.9 Ton", exercises: 7, bioCoins: 70, completed: true },
  { id: "4", date: "21 Ocak 2026", dateShort: "21 Oca", name: "Omuz & Trapez", duration: "42dk", tonnage: "2.8 Ton", exercises: 5, bioCoins: 60, completed: true },
  { id: "5", date: "19 Ocak 2026", dateShort: "19 Oca", name: "Full Body", duration: "65dk", tonnage: "6.1 Ton", exercises: 8, bioCoins: 95, completed: true },
  { id: "6", date: "17 Ocak 2026", dateShort: "17 Oca", name: "Göğüs & Arka Kol", duration: "50dk", tonnage: "4.0 Ton", exercises: 6, bioCoins: 72, completed: true },
];

const Antrenman = () => {
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const assignedWorkouts = [
    {
      id: "1",
      title: "GÖĞÜS & SIRT",
      day: "GÜN 1 - PAZARTESİ",
      exercises: 8,
      duration: "55 dk",
      intensity: "Yüksek" as const,
      coachNote: "Tempoya dikkat et. Göğüs açıklığını koru.",
    },
    {
      id: "2",
      title: "BACAK & KOR",
      day: "GÜN 2 - ÇARŞAMBA",
      exercises: 6,
      duration: "45 dk",
      intensity: "Yüksek" as const,
      coachNote: "Squat derinliğini Vision AI ile kontrol et.",
    },
    {
      id: "3",
      title: "OMUZ & KOL",
      day: "GÜN 3 - CUMA",
      exercises: 7,
      duration: "50 dk",
      intensity: "Orta" as const,
    },
    {
      id: "4",
      title: "AKTİF DİNLENME",
      day: "GÜN 4 - PAZAR",
      exercises: 4,
      duration: "30 dk",
      intensity: "Düşük" as const,
      coachNote: "Esneme hareketlerine odaklan.",
    },
  ];

  const weeklyStats = [
    { label: "Tamamlanan", value: "5", icon: Target },
    { label: "Toplam Süre", value: "4.2sa", icon: Clock },
    { label: "Yakılan Kalori", value: "2,450", icon: TrendingUp },
  ];

  // Calculate history stats
  const totalBioCoins = workoutHistory.reduce((acc, w) => acc + w.bioCoins, 0);
  const totalWorkouts = workoutHistory.length;

  return (
    <>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground">ANTRENMAN</h1>
            <p className="text-muted-foreground text-sm">Vision AI Eğitim Merkezi</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistory(true)}
            className="p-3 glass-card border border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <History className="w-5 h-5 text-primary" />
          </motion.button>
        </div>

        {/* Vision AI Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
              <Dumbbell className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg text-foreground tracking-wide">
                VİZYON AI AKTİF
              </h2>
              <p className="text-muted-foreground text-xs">
                Hareket analizi ve gerçek zamanlı geri bildirim
              </p>
            </div>
            <motion.div
              className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="font-display text-sm text-foreground tracking-wide">
              BU HAFTA
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-10 h-10 rounded-lg bg-secondary mx-auto mb-2 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-display text-lg text-foreground">{stat.value}</p>
                <p className="text-muted-foreground text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Assigned Workouts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-foreground tracking-wide">
              ATANAN ANTRENMANLAR
            </h2>
            <span className="text-xs text-primary">4 Görev</span>
          </div>
          
          <div className="space-y-4">
            {assignedWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <WorkoutCard
                  title={workout.title}
                  day={workout.day}
                  exercises={workout.exercises}
                  duration={workout.duration}
                  intensity={workout.intensity}
                  coachNote={workout.coachNote}
                  onStart={() => setActiveWorkout(workout.title)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision AI Execution Overlay */}
      <AnimatePresence>
        {activeWorkout && (
          <VisionAIExecution
            workoutTitle={activeWorkout}
            onClose={() => setActiveWorkout(null)}
          />
        )}
      </AnimatePresence>

      {/* Workout History Overlay */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="safe-area-inset p-4 h-full overflow-y-auto">
              {/* History Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-display text-2xl text-foreground">GEÇMİŞ</h1>
                  <p className="text-muted-foreground text-sm">Antrenman Kayıtların</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHistory(false)}
                  className="p-2 glass-card"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>

              {/* History Stats Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 mb-6"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-primary/20 mx-auto mb-2 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-display text-lg text-foreground">{totalWorkouts}</p>
                    <p className="text-muted-foreground text-[10px]">Antrenman</p>
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-stat-strain/20 mx-auto mb-2 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-stat-strain" />
                    </div>
                    <p className="font-display text-lg text-foreground">{totalBioCoins}</p>
                    <p className="text-muted-foreground text-[10px]">Bio-Coin</p>
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-stat-recovery/20 mx-auto mb-2 flex items-center justify-center">
                      <Timer className="w-5 h-5 text-stat-recovery" />
                    </div>
                    <p className="font-display text-lg text-foreground">5.2sa</p>
                    <p className="text-muted-foreground text-[10px]">Toplam</p>
                  </div>
                </div>
              </motion.div>

              {/* History List */}
              <div className="space-y-3 pb-8">
                {workoutHistory.map((workout, index) => (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    {/* Date */}
                    <div className="w-14 text-center flex-shrink-0">
                      <p className="font-display text-lg text-foreground leading-tight">
                        {workout.dateShort.split(" ")[0]}
                      </p>
                      <p className="text-muted-foreground text-[10px] uppercase">
                        {workout.dateShort.split(" ")[1]}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-12 bg-white/10" />

                    {/* Workout Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium text-sm truncate">{workout.name}</p>
                        <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[9px] rounded-full font-medium flex-shrink-0">
                          TAMAMLANDI
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {workout.duration}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {workout.exercises} hareket
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-foreground font-display text-sm">{workout.tonnage}</p>
                      <div className="flex items-center gap-1 justify-end text-primary text-[10px]">
                        <Flame className="w-3 h-3" />
                        <span>+{workout.bioCoins}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Antrenman;
