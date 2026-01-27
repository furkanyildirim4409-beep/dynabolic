import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, TrendingUp, Target, Flame } from "lucide-react";

interface DayLog {
  id: string;
  date: string;
  dateShort: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: number;
  targetMet: boolean;
}

interface NutritionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const nutritionHistory: DayLog[] = [
  { id: "1", date: "Dün - 26 Ocak", dateShort: "26 Oca", calories: 2400, protein: 165, carbs: 280, fat: 75, meals: 5, targetMet: true },
  { id: "2", date: "25 Ocak", dateShort: "25 Oca", calories: 2250, protein: 152, carbs: 260, fat: 72, meals: 4, targetMet: false },
  { id: "3", date: "24 Ocak", dateShort: "24 Oca", calories: 2520, protein: 178, carbs: 295, fat: 78, meals: 5, targetMet: true },
  { id: "4", date: "23 Ocak", dateShort: "23 Oca", calories: 2180, protein: 148, carbs: 245, fat: 68, meals: 4, targetMet: false },
  { id: "5", date: "22 Ocak", dateShort: "22 Oca", calories: 2380, protein: 162, carbs: 275, fat: 74, meals: 5, targetMet: true },
  { id: "6", date: "21 Ocak", dateShort: "21 Oca", calories: 2450, protein: 170, carbs: 285, fat: 76, meals: 5, targetMet: true },
  { id: "7", date: "20 Ocak", dateShort: "20 Oca", calories: 2100, protein: 140, carbs: 240, fat: 65, meals: 4, targetMet: false },
];

const NutritionHistory = ({ isOpen, onClose }: NutritionHistoryProps) => {
  const avgCalories = Math.round(nutritionHistory.reduce((acc, d) => acc + d.calories, 0) / nutritionHistory.length);
  const avgProtein = Math.round(nutritionHistory.reduce((acc, d) => acc + d.protein, 0) / nutritionHistory.length);
  const successDays = nutritionHistory.filter(d => d.targetMet).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <div className="safe-area-inset p-4 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl text-foreground">BESLENME GEÇMİŞİ</h1>
                <p className="text-muted-foreground text-sm">Son 7 Günlük Kayıtlar</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 glass-card"
              >
                <X className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>

            {/* Stats Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 mb-6"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-primary/20 mx-auto mb-2 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-display text-lg text-foreground">{avgCalories}</p>
                  <p className="text-muted-foreground text-[10px]">Ort. Kalori</p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-lg bg-stat-recovery/20 mx-auto mb-2 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-stat-recovery" />
                  </div>
                  <p className="font-display text-lg text-foreground">{avgProtein}g</p>
                  <p className="text-muted-foreground text-[10px]">Ort. Protein</p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-lg bg-stat-hrv/20 mx-auto mb-2 flex items-center justify-center">
                    <Target className="w-5 h-5 text-stat-hrv" />
                  </div>
                  <p className="font-display text-lg text-foreground">{successDays}/7</p>
                  <p className="text-muted-foreground text-[10px]">Hedef Günü</p>
                </div>
              </div>
            </motion.div>

            {/* Days List */}
            <div className="space-y-3 pb-8">
              {nutritionHistory.map((day, index) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-4 flex items-center gap-4 ${
                    day.targetMet ? "border-l-2 border-l-stat-hrv" : ""
                  }`}
                >
                  {/* Date */}
                  <div className="w-14 text-center flex-shrink-0">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-[10px] mt-1">
                      {day.dateShort}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-12 bg-white/10" />

                  {/* Nutrition Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-medium text-sm">{day.date}</p>
                      {day.targetMet && (
                        <span className="px-1.5 py-0.5 bg-stat-hrv/20 text-stat-hrv text-[9px] rounded-full font-medium flex-shrink-0">
                          HEDEF OK
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">{day.meals} öğün</p>
                  </div>

                  {/* Macros */}
                  <div className="text-right flex-shrink-0 space-y-1">
                    <p className="text-foreground font-display text-sm">{day.calories} kcal</p>
                    <div className="flex gap-2 justify-end text-[10px]">
                      <span className="text-stat-recovery">{day.protein}g P</span>
                      <span className="text-stat-hrv">{day.carbs}g K</span>
                      <span className="text-stat-strain">{day.fat}g Y</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NutritionHistory;
