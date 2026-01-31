import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus, Activity, Battery, Moon, Heart } from "lucide-react";
import type { BentoStatType } from "./BentoStats";

interface HistoryPoint {
  day: string;
  value: number;
}

interface StatConfig {
  icon: typeof Activity;
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
}

const statConfigs: Record<BentoStatType, StatConfig> = {
  strain: {
    icon: Activity,
    label: "Günlük Yük",
    unit: "puan",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    history: [
      { day: "Pzt", value: 12.5 },
      { day: "Sal", value: 8.2 },
      { day: "Çar", value: 15.8 },
      { day: "Per", value: 10.3 },
      { day: "Cum", value: 6.5 },
      { day: "Cmt", value: 18.2 },
      { day: "Paz", value: 14.7 },
    ],
    average: 12.3,
    trend: "up",
    trendPercent: 12,
    optimalRange: { min: 10, max: 18 },
  },
  recovery: {
    icon: Battery,
    label: "Toparlanma",
    unit: "%",
    color: "text-primary",
    bgColor: "bg-primary/20",
    history: [
      { day: "Pzt", value: 72 },
      { day: "Sal", value: 85 },
      { day: "Çar", value: 68 },
      { day: "Per", value: 78 },
      { day: "Cum", value: 92 },
      { day: "Cmt", value: 65 },
      { day: "Paz", value: 88 },
    ],
    average: 78,
    trend: "up",
    trendPercent: 8,
    optimalRange: { min: 66, max: 100 },
  },
  sleep: {
    icon: Moon,
    label: "Uyku Süresi",
    unit: "saat",
    color: "text-violet-400",
    bgColor: "bg-violet-500/20",
    history: [
      { day: "Pzt", value: 7.2 },
      { day: "Sal", value: 6.5 },
      { day: "Çar", value: 8.1 },
      { day: "Per", value: 7.0 },
      { day: "Cum", value: 6.8 },
      { day: "Cmt", value: 8.5 },
      { day: "Paz", value: 7.5 },
    ],
    average: 7.4,
    trend: "stable",
    trendPercent: 3,
    goal: 8,
  },
  hrv: {
    icon: Heart,
    label: "HRV",
    unit: "ms",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    history: [
      { day: "Pzt", value: 38 },
      { day: "Sal", value: 45 },
      { day: "Çar", value: 32 },
      { day: "Per", value: 42 },
      { day: "Cum", value: 48 },
      { day: "Cmt", value: 35 },
      { day: "Paz", value: 44 },
    ],
    average: 41,
    trend: "up",
    trendPercent: 6,
    optimalRange: { min: 40, max: 60 },
  },
};

interface BentoStatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  statType: BentoStatType | null;
}

const BentoStatDetailModal = ({ isOpen, onClose, statType }: BentoStatDetailModalProps) => {
  if (!statType) return null;
  
  const config = statConfigs[statType];
  const maxValue = Math.max(...config.history.map(h => h.value));
  const Icon = config.icon;

  const TrendIcon = config.trend === "up" ? TrendingUp : config.trend === "down" ? TrendingDown : Minus;
  const trendColor = config.trend === "up" ? "text-green-400" : config.trend === "down" ? "text-red-400" : "text-muted-foreground";

  // Determine if trend up is good or bad based on stat type
  const isTrendGood = 
    (statType === "recovery" && config.trend === "up") ||
    (statType === "hrv" && config.trend === "up") ||
    (statType === "sleep" && config.trend === "up") ||
    (statType === "strain" && config.trend === "stable");

  const actualTrendColor = isTrendGood ? "text-green-400" : config.trend === "down" ? "text-red-400" : "text-muted-foreground";

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
                    {config.history[6].value}
                    <span className="text-muted-foreground text-lg font-normal ml-1">{config.unit}</span>
                  </p>
                </div>
                <div className={`flex items-center gap-1 ${actualTrendColor}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{config.trendPercent}%</span>
                </div>
              </div>
              
              {/* Optimal Range or Goal */}
              {config.optimalRange && (
                <div className="mt-3 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">İdeal Aralık</p>
                  <p className={`text-sm font-medium ${config.color}`}>
                    {config.optimalRange.min} - {config.optimalRange.max} {config.unit}
                  </p>
                </div>
              )}
              
              {config.goal && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Hedefe</span>
                    <span className="text-foreground">{config.history[6].value}/{config.goal} {config.unit}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((config.history[6].value / config.goal) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${config.bgColor.replace('/20', '')}`}
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
                              ? config.bgColor.replace('/20', '') 
                              : "bg-white/[0.08]"
                          }`}
                        />
                      </div>
                      
                      {/* Value */}
                      <span className={`text-[10px] font-medium ${isToday ? config.color : "text-muted-foreground"}`}>
                        {point.value}
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

            {/* Stats Row */}
            <div className="px-5 pb-8 grid grid-cols-2 gap-3">
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Haftalık Ort.</p>
                <p className="text-foreground text-lg font-bold">
                  {config.average}
                  <span className="text-muted-foreground text-xs font-normal ml-1">{config.unit}</span>
                </p>
              </div>
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
                  {config.goal ? "Hedef" : "En Yüksek"}
                </p>
                <p className="text-foreground text-lg font-bold">
                  {config.goal || Math.max(...config.history.map(h => h.value))}
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

export default BentoStatDetailModal;