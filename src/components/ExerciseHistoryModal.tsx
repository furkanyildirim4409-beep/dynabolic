import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, TrendingUp, Calendar, Target, Edit2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import { exerciseHistory, ExerciseHistoryRecord } from "@/lib/mockData";
import { format, parseISO, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";
import ExerciseGoalModal, { ExerciseGoal } from "./ExerciseGoalModal";
import { hapticCelebration } from "@/lib/haptics";

interface ExerciseHistoryModalProps {
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Calculate estimated 1RM using Epley formula
const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  if (weight === 0) return 0;
  return Math.round(weight * (1 + reps / 30));
};

// LocalStorage key for goals
const GOALS_STORAGE_KEY = 'dynabolic_exercise_goals';

// Load goals from localStorage
const loadGoals = (): ExerciseGoal[] => {
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save goals to localStorage
const saveGoals = (goals: ExerciseGoal[]) => {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
};

const ExerciseHistoryModal = ({ exerciseName, isOpen, onClose }: ExerciseHistoryModalProps) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goals, setGoals] = useState<ExerciseGoal[]>([]);

  // Load goals on mount
  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  // Get goal for this exercise
  const currentGoal = goals.find(
    (g) => g.exerciseName.toLowerCase() === exerciseName.toLowerCase()
  );

  // Get history for this specific exercise
  const history = exerciseHistory.filter(
    (record) => record.exerciseName.toLowerCase() === exerciseName.toLowerCase()
  );

  // Calculate trend data
  const trendData = history
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => {
      const max1RM = Math.max(
        ...record.sets.map((s) => calculate1RM(s.weight, s.reps))
      );
      const maxWeight = Math.max(...record.sets.map((s) => s.weight));
      const formattedDate = format(new Date(record.date), 'd MMM', { locale: tr });
      
      return {
        date: formattedDate,
        fullDate: record.date,
        estimated1RM: max1RM,
        maxWeight: maxWeight,
        totalVolume: record.sets.reduce((acc, s) => acc + s.weight * s.reps, 0)
      };
    });

  // Find personal best
  const personalBest = history.reduce<{ weight: number; reps: number; date: string; estimated1RM: number } | null>(
    (best, record) => {
      record.sets.forEach((set) => {
        const est1RM = calculate1RM(set.weight, set.reps);
        if (!best || est1RM > best.estimated1RM) {
          best = {
            weight: set.weight,
            reps: set.reps,
            date: record.date,
            estimated1RM: est1RM
          };
        }
      });
      return best;
    },
    null
  );

  // Recent logs (last 5)
  const recentLogs = [...history]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate goal progress
  const goalProgress = currentGoal && personalBest
    ? Math.min(100, Math.round((personalBest.weight / currentGoal.targetWeight) * 100))
    : 0;

  const goalAchieved = goalProgress >= 100;

  // Trigger celebration haptic when goal is achieved
  useEffect(() => {
    if (isOpen && goalAchieved) {
      hapticCelebration();
    }
  }, [isOpen, goalAchieved]);

  const daysRemaining = currentGoal
    ? differenceInDays(new Date(currentGoal.targetDate), new Date())
    : 0;

  const handleSaveGoal = (goal: ExerciseGoal) => {
    const newGoals = goals.filter(
      (g) => g.exerciseName.toLowerCase() !== exerciseName.toLowerCase()
    );
    newGoals.push(goal);
    setGoals(newGoals);
    saveGoals(newGoals);
  };

  const handleDeleteGoal = () => {
    const newGoals = goals.filter(
      (g) => g.exerciseName.toLowerCase() !== exerciseName.toLowerCase()
    );
    setGoals(newGoals);
    saveGoals(newGoals);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-end justify-center"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  onClose();
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-background rounded-t-3xl max-h-[90vh] flex flex-col touch-none"
            >
              {/* Drag Handle */}
              <div className="flex-shrink-0 pt-3 pb-1 flex justify-center">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              {/* FIXED HEADER */}
              <div className="flex-shrink-0 px-4 pb-3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg text-foreground tracking-wider">
                    {exerciseName.toUpperCase()}
                  </h2>
                  <p className="text-muted-foreground text-xs">Performans Geçmişi</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SCROLLABLE BODY */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Goal Progress Card - TOP PRIORITY */}
                {currentGoal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-primary text-[10px] font-medium tracking-wider">
                          AKTİF HEDEF
                        </span>
                      </div>
                      <button
                        onClick={() => setShowGoalModal(true)}
                        className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-primary" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Compact Progress Ring */}
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="hsl(var(--secondary))"
                            strokeWidth="3"
                            fill="none"
                          />
                          <motion.circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 126" }}
                            animate={{ 
                              strokeDasharray: `${(goalProgress / 100) * 126} 126` 
                            }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-sm text-foreground">
                            {goalProgress}%
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-display text-lg text-foreground">
                          {currentGoal.targetWeight}kg x {currentGoal.targetReps}
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          {daysRemaining > 0 
                            ? `${daysRemaining} gün kaldı`
                            : daysRemaining === 0 
                              ? "Bugün son gün!"
                              : "Süre doldu"
                          }
                          {personalBest && currentGoal.targetWeight - personalBest.weight > 0 && (
                            <span className="text-primary ml-2">
                              (+{currentGoal.targetWeight - personalBest.weight}kg kaldı)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Personal Best Card - Compact */}
                {personalBest && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-yellow-400 text-[10px] font-medium tracking-wider">
                          KİŞİSEL REKOR
                        </p>
                        <p className="font-display text-lg text-foreground">
                          {personalBest.weight}kg x {personalBest.reps}
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          Est. 1RM: {personalBest.estimated1RM}kg • {format(new Date(personalBest.date), 'd MMM yyyy', { locale: tr })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Trend Chart - Reduced Height */}
                {trendData.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <h3 className="font-display text-xs text-foreground tracking-wider">
                        12 HAFTALIK TREND
                      </h3>
                    </div>
                    
                    <div className="glass-card p-3 h-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={9}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={9}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}kg`}
                            width={40}
                            domain={currentGoal ? ['dataMin - 10', Math.max(currentGoal.targetWeight + 10, Math.max(...trendData.map(d => d.estimated1RM)) + 10)] : ['dataMin - 10', 'dataMax + 10']}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '11px'
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                            formatter={(value: number) => [`${value}kg`, 'Est. 1RM']}
                          />
                          {currentGoal && (
                            <ReferenceLine 
                              y={currentGoal.targetWeight} 
                              stroke="hsl(var(--primary))" 
                              strokeDasharray="5 5"
                              strokeOpacity={0.7}
                            />
                          )}
                          <Area
                            type="monotone"
                            dataKey="estimated1RM"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#colorGradient)"
                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    {currentGoal && (
                      <p className="text-center text-muted-foreground text-[9px] mt-1">
                        Kesikli çizgi: Hedef ({currentGoal.targetWeight}kg)
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Recent Logs - Compact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-xs text-foreground tracking-wider">
                      SON KAYITLAR
                    </h3>
                  </div>
                  
                  <div className="space-y-1.5">
                    {recentLogs.length > 0 ? (
                      recentLogs.map((log, index) => (
                        <motion.div
                          key={log.date}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.03 }}
                          className="glass-card p-2.5"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(log.date), 'd MMM yyyy', { locale: tr })}
                            </span>
                            <span className="text-[10px] text-primary">
                              {log.sets.length} set
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {log.sets.map((set, setIndex) => (
                              <span
                                key={setIndex}
                                className={`px-1.5 py-0.5 rounded text-[10px] ${
                                  set.isFailure
                                    ? 'bg-destructive/20 text-destructive'
                                    : 'bg-secondary text-foreground'
                                }`}
                              >
                                {set.weight > 0 ? `${set.weight}kg` : 'BW'} x{set.reps}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="glass-card p-4 text-center">
                        <p className="text-muted-foreground text-xs">
                          Bu egzersiz için kayıt bulunamadı.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Stats Summary - Compact */}
                {history.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-3"
                  >
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="font-display text-base text-primary">{history.length}</p>
                        <p className="text-muted-foreground text-[9px]">ANTRENMAN</p>
                      </div>
                      <div>
                        <p className="font-display text-base text-foreground">
                          {history.reduce((acc, h) => acc + h.sets.length, 0)}
                        </p>
                        <p className="text-muted-foreground text-[9px]">TOPLAM SET</p>
                      </div>
                      <div>
                        <p className="font-display text-base text-foreground">
                          {Math.round(
                            history.reduce(
                              (acc, h) => acc + h.sets.reduce((a, s) => a + s.weight * s.reps, 0),
                              0
                            ) / 1000
                          )}t
                        </p>
                        <p className="text-muted-foreground text-[9px]">TOPLAM TONAJ</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* FIXED FOOTER */}
              <div className="flex-shrink-0 p-4 border-t border-white/10 bg-background/95 backdrop-blur flex gap-2">
                {!currentGoal && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowGoalModal(true)}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-display text-sm rounded-xl flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    HEDEF BELİRLE
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className={`${currentGoal ? 'flex-1' : 'w-24'} py-3 bg-secondary text-foreground font-display text-sm rounded-xl`}
                >
                  KAPAT
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Setting Modal */}
      <ExerciseGoalModal
        exerciseName={exerciseName}
        currentBest={personalBest ? { weight: personalBest.weight, reps: personalBest.reps } : null}
        existingGoal={currentGoal || null}
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSave={handleSaveGoal}
        onDelete={currentGoal ? handleDeleteGoal : undefined}
      />
    </>
  );
};

export default ExerciseHistoryModal;
