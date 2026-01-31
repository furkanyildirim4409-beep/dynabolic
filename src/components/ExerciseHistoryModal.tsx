import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, TrendingUp, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { exerciseHistory, ExerciseHistoryRecord } from "@/lib/mockData";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

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

const ExerciseHistoryModal = ({ exerciseName, isOpen, onClose }: ExerciseHistoryModalProps) => {
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

  return (
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
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-t-3xl max-h-[85vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
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

            <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
              {/* Personal Best Card */}
              {personalBest && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="m-4 p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/30"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center"
                    >
                      <Trophy className="w-6 h-6 text-primary-foreground" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-yellow-400 text-[10px] font-medium tracking-wider">
                        KİŞİSEL REKOR
                      </p>
                      <p className="font-display text-xl text-foreground">
                        {personalBest.weight}kg x {personalBest.reps} tekrar
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Est. 1RM: {personalBest.estimated1RM}kg • {format(new Date(personalBest.date), 'd MMMM yyyy', { locale: tr })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Trend Chart */}
              {trendData.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mx-4 mb-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-sm text-foreground tracking-wider">
                      12 HAFTALIK TREND
                    </h3>
                  </div>
                  
                  <div className="glass-card p-4 h-48">
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
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}kg`}
                          width={45}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                          formatter={(value: number) => [`${value}kg`, 'Est. 1RM']}
                        />
                        <Area
                          type="monotone"
                          dataKey="estimated1RM"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill="url(#colorGradient)"
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                          activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Recent Logs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mx-4 mb-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-sm text-foreground tracking-wider">
                    SON KAYITLAR
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {recentLogs.length > 0 ? (
                    recentLogs.map((log, index) => (
                      <motion.div
                        key={log.date}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="glass-card p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.date), 'd MMM yyyy', { locale: tr })}
                          </span>
                          <span className="text-xs text-primary">
                            {log.sets.length} set
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {log.sets.map((set, setIndex) => (
                            <span
                              key={setIndex}
                              className={`px-2 py-1 rounded-lg text-xs ${
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
                    <div className="glass-card p-6 text-center">
                      <p className="text-muted-foreground text-sm">
                        Bu egzersiz için kayıt bulunamadı.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Stats Summary */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mx-4 mb-4 glass-card p-4"
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="font-display text-lg text-primary">{history.length}</p>
                      <p className="text-muted-foreground text-[10px]">ANTRENMAN</p>
                    </div>
                    <div>
                      <p className="font-display text-lg text-foreground">
                        {history.reduce((acc, h) => acc + h.sets.length, 0)}
                      </p>
                      <p className="text-muted-foreground text-[10px]">TOPLAM SET</p>
                    </div>
                    <div>
                      <p className="font-display text-lg text-foreground">
                        {Math.round(
                          history.reduce(
                            (acc, h) => acc + h.sets.reduce((a, s) => a + s.weight * s.reps, 0),
                            0
                          ) / 1000
                        )}t
                      </p>
                      <p className="text-muted-foreground text-[10px]">TOPLAM TONAJ</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Close Button */}
            <div className="p-4 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 bg-secondary text-foreground font-display text-sm rounded-xl"
              >
                KAPAT
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExerciseHistoryModal;
