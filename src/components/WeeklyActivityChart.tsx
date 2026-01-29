import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface DayActivity {
  day: string;
  completed: boolean;
  workoutType?: string;
}

const weekData: DayActivity[] = [
  { day: "Pzt", completed: true, workoutType: "Üst Vücut" },
  { day: "Sal", completed: true, workoutType: "Bacak" },
  { day: "Çar", completed: false },
  { day: "Per", completed: true, workoutType: "Push" },
  { day: "Cum", completed: true, workoutType: "Pull" },
  { day: "Cmt", completed: true, workoutType: "Bacak" },
  { day: "Paz", completed: false }, // Today - not yet
];

const WeeklyActivityChart = () => {
  const completedCount = weekData.filter(d => d.completed).length;
  const todayIndex = 6; // Sunday is today

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <h3 className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
            Haftalık Aktivite
          </h3>
        </div>
        <span className="text-primary text-xs font-medium">
          {completedCount}/7 gün
        </span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekData.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.05 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Day Label */}
            <span className={`text-[10px] uppercase tracking-wider ${
              index === todayIndex ? "text-primary font-medium" : "text-muted-foreground"
            }`}>
              {day.day}
            </span>

            {/* Status Circle */}
            <div className={`
              w-9 h-9 rounded-full flex items-center justify-center transition-all
              ${day.completed 
                ? "bg-primary/20 border border-primary/40" 
                : index === todayIndex
                  ? "bg-white/[0.05] border border-white/10 border-dashed"
                  : "bg-white/[0.02] border border-white/[0.05]"
              }
            `}>
              {day.completed ? (
                <Check className="w-4 h-4 text-primary" />
              ) : index === todayIndex ? (
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
              ) : (
                <X className="w-3 h-3 text-muted-foreground/30" />
              )}
            </div>

            {/* Workout Type (if completed) */}
            {day.workoutType && (
              <span className="text-[8px] text-muted-foreground text-center leading-tight truncate w-full">
                {day.workoutType}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Streak indicator */}
      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-center gap-2">
        <span className="text-muted-foreground text-xs">🔥</span>
        <span className="text-foreground text-xs font-medium">14 günlük seri</span>
      </div>
    </motion.div>
  );
};

export default WeeklyActivityChart;
