import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus, Heart, Footprints } from "lucide-react";

export type BiometricType = "rhr" | "steps";

interface HistoryPoint {
  day: string;
  value: number;
}

interface BiometricConfig {
  icon: typeof Heart;
  label: string;
  unit: string;
  color: string;
  bgColor: string;
  history: HistoryPoint[];
  average: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  goal?: number;
  optimalRange?: { min: number; max: number };
  insight: string;
}

const biometricConfigs: Record<BiometricType, BiometricConfig> = {
  rhr: {
    icon: Heart,
    label: "Dinlenme Nabzı",
    unit: "bpm",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    history: [
      { day: "Pzt", value: 58 },
      { day: "Sal", value: 56 },
      { day: "Çar", value: 60 },
      { day: "Per", value: 57 },
      { day: "Cum", value: 55 },
      { day: "Cmt", value: 62 },
      { day: "Paz", value: 56 },
    ],
    average: 58,
    trend: "down",
    trendPercent: 4,
    optimalRange: { min: 50, max: 65 },
    insight: "Düşük dinlenme nabzı iyi kardiyovasküler sağlığa işaret eder.",
  },
  steps: {
    icon: Footprints,
    label: "Günlük Adım",
    unit: "adım",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    history: [
      { day: "Pzt", value: 8542 },
      { day: "Sal", value: 6234 },
      { day: "Çar", value: 10125 },
      { day: "Per", value: 7845 },
      { day: "Cum", value: 5432 },
      { day: "Cmt", value: 12350 },
      { day: "Paz", value: 8234 },
    ],
    average: 8395,
    trend: "up",
    trendPercent: 12,
    goal: 10000,
    insight: "Günlük 10.000 adım genel sağlık için idealdir.",
  },
};

interface BiometricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  biometricType: BiometricType | null;
}

const BiometricDetailModal = ({ isOpen, onClose, biometricType }: BiometricDetailModalProps) => {
  if (!biometricType) return null;
  
  const config = biometricConfigs[biometricType];
  const maxValue = Math.max(...config.history.map(h => h.value));
  const Icon = config.icon;

  const TrendIcon = config.trend === "up" ? TrendingUp : config.trend === "down" ? TrendingDown : Minus;
  
  // For RHR, down is good. For steps, up is good.
  const isTrendGood = 
    (biometricType === "rhr" && config.trend === "down") ||
    (biometricType === "steps" && config.trend === "up");
  
  const trendColor = isTrendGood ? "text-green-400" : "text-red-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center"
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
            className="w-full max-w-[430px] bg-background border-t border-white/10 rounded-t-3xl overflow-hidden touch-none"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="px-5 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">{config.label}</h2>
                  <p className="text-muted-foreground text-xs">Son 7 gün</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Value */}
            <div className="px-5 py-4 border-y border-white/[0.05]">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Bugün</p>
                  <p className="text-foreground text-4xl font-bold">
                    {biometricType === "steps" 
                      ? config.history[6].value.toLocaleString() 
                      : config.history[6].value}
                    <span className="text-muted-foreground text-lg font-normal ml-1">{config.unit}</span>
                  </p>
                </div>
                <div className={`flex items-center gap-1 ${trendColor}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{config.trendPercent}%</span>
                </div>
              </div>
              
              {/* Optimal Range */}
              {config.optimalRange && (
                <div className="mt-3 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">İdeal Aralık</p>
                  <p className={`text-sm font-medium ${config.color}`}>
                    {config.optimalRange.min} - {config.optimalRange.max} {config.unit}
                  </p>
                </div>
              )}
              
              {/* Goal Progress */}
              {config.goal && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Hedefe</span>
                    <span className="text-foreground">
                      {config.history[6].value.toLocaleString()}/{config.goal.toLocaleString()} {config.unit}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((config.history[6].value / config.goal) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full bg-green-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="px-5 py-5">
              <div className="flex items-end justify-between gap-2 h-32">
                {config.history.map((point, index) => {
                  const heightPercent = (point.value / maxValue) * 100;
                  const isToday = index === 6;
                  
                  return (
                    <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
                      {/* Bar */}
                      <div className="w-full h-24 flex items-end justify-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className={`w-full max-w-[24px] rounded-t-md ${
                            isToday 
                              ? biometricType === "rhr" ? "bg-red-500" : "bg-green-500"
                              : "bg-white/[0.08]"
                          }`}
                        />
                      </div>
                      
                      {/* Value */}
                      <span className={`text-[10px] font-medium ${isToday ? config.color : "text-muted-foreground"}`}>
                        {biometricType === "steps" 
                          ? (point.value / 1000).toFixed(1) + "k"
                          : point.value}
                      </span>
                      
                      {/* Day */}
                      <span className={`text-[10px] uppercase ${isToday ? "text-foreground" : "text-muted-foreground/60"}`}>
                        {point.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insight */}
            <div className="px-5 pb-4">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  💡 {config.insight}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="px-5 pb-8 grid grid-cols-2 gap-3">
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Haftalık Ort.</p>
                <p className="text-foreground text-lg font-bold">
                  {biometricType === "steps" 
                    ? config.average.toLocaleString() 
                    : config.average}
                  <span className="text-muted-foreground text-xs font-normal ml-1">{config.unit}</span>
                </p>
              </div>
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
                  {config.goal ? "Hedef" : "En Düşük"}
                </p>
                <p className="text-foreground text-lg font-bold">
                  {config.goal 
                    ? config.goal.toLocaleString()
                    : Math.min(...config.history.map(h => h.value))}
                  <span className="text-muted-foreground text-xs font-normal ml-1">{config.unit}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BiometricDetailModal;