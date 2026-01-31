import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Calendar, Trophy, TrendingUp, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { format, addWeeks } from "date-fns";
import { tr } from "date-fns/locale";

interface ExerciseGoalModalProps {
  exerciseName: string;
  currentBest: { weight: number; reps: number } | null;
  existingGoal: ExerciseGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: ExerciseGoal) => void;
  onDelete?: () => void;
}

export interface ExerciseGoal {
  id: string;
  exerciseName: string;
  targetWeight: number;
  targetReps: number;
  targetDate: string;
  createdAt: string;
}

const ExerciseGoalModal = ({
  exerciseName,
  currentBest,
  existingGoal,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: ExerciseGoalModalProps) => {
  const defaultWeight = existingGoal?.targetWeight || (currentBest ? Math.round(currentBest.weight * 1.1 / 2.5) * 2.5 : 60);
  const defaultReps = existingGoal?.targetReps || (currentBest?.reps || 8);
  const defaultWeeks = 8;

  const [targetWeight, setTargetWeight] = useState(defaultWeight);
  const [targetReps, setTargetReps] = useState(defaultReps);
  const [targetWeeks, setTargetWeeks] = useState(defaultWeeks);

  const targetDate = format(addWeeks(new Date(), targetWeeks), 'yyyy-MM-dd');

  const handleSave = () => {
    const goal: ExerciseGoal = {
      id: existingGoal?.id || `goal-${Date.now()}`,
      exerciseName,
      targetWeight,
      targetReps,
      targetDate,
      createdAt: existingGoal?.createdAt || new Date().toISOString(),
    };
    onSave(goal);
    toast.success("Hedef kaydedildi!", {
      description: `${targetWeight}kg x ${targetReps} tekrar`,
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      toast.success("Hedef silindi");
      onClose();
    }
  };

  // Calculate improvement percentage
  const improvementPercent = currentBest
    ? Math.round(((targetWeight - currentBest.weight) / currentBest.weight) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-t-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-lg text-foreground tracking-wider">
                    HEDEF BELİRLE
                  </h2>
                  <p className="text-muted-foreground text-xs">{exerciseName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Current Best */}
              {currentBest && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">MEVCUT EN İYİ</span>
                  </div>
                  <p className="font-display text-lg text-foreground">
                    {currentBest.weight}kg x {currentBest.reps} tekrar
                  </p>
                </motion.div>
              )}

              {/* Target Weight */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  HEDEF AĞIRLIK
                </label>
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTargetWeight((w) => Math.max(0, w - 2.5))}
                    className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                  <div className="w-32 text-center">
                    <p className="font-display text-4xl text-primary">{targetWeight}</p>
                    <p className="text-muted-foreground text-xs">KG</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTargetWeight((w) => w + 2.5)}
                    className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                {improvementPercent > 0 && (
                  <p className="text-center text-primary text-xs mt-2">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +{improvementPercent}% artış hedefi
                  </p>
                )}
              </div>

              {/* Target Reps */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  HEDEF TEKRAR
                </label>
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTargetReps((r) => Math.max(1, r - 1))}
                    className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                  <div className="w-32 text-center">
                    <p className="font-display text-4xl text-foreground">{targetReps}</p>
                    <p className="text-muted-foreground text-xs">TEKRAR</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTargetReps((r) => r + 1)}
                    className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Target Timeline */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  SÜRE (HAFTA)
                </label>
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTargetWeeks((w) => Math.max(1, w - 1))}
                    className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                  <div className="w-32 text-center">
                    <p className="font-display text-4xl text-foreground">{targetWeeks}</p>
                    <p className="text-muted-foreground text-xs">HAFTA</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTargetWeeks((w) => w + 1)}
                    className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>Hedef Tarih: {format(addWeeks(new Date(), targetWeeks), 'd MMMM yyyy', { locale: tr })}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full py-4 bg-primary text-primary-foreground font-display text-lg tracking-wider rounded-xl neon-glow"
              >
                {existingGoal ? "HEDEFİ GÜNCELLE" : "HEDEFİ KAYDET"}
              </motion.button>
              
              {existingGoal && onDelete && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className="w-full py-3 bg-destructive/20 text-destructive font-display text-sm tracking-wider rounded-xl border border-destructive/30"
                >
                  HEDEFİ SİL
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExerciseGoalModal;
