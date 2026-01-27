import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Calendar, TrendingUp, Clock, Target } from "lucide-react";
import WorkoutCard from "@/components/WorkoutCard";
import VisionAIExecution from "@/components/VisionAIExecution";

const Antrenman = () => {
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);

  const assignedWorkouts = [
    {
      id: "1",
      title: "GÖĞÜS & SIRT",
      day: "GÜN 1 - PAZARTES",
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

  return (
    <>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl text-foreground">ANTRENMAN</h1>
          <p className="text-muted-foreground text-sm">Vision AI Eğitim Merkezi</p>
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
    </>
  );
};

export default Antrenman;
