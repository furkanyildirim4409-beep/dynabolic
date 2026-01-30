import { motion, AnimatePresence } from "framer-motion";
import { Heart, Activity, Moon, Footprints, Clock } from "lucide-react";
import { wearableMetrics } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";

interface BioMetricsDashboardProps {
  isActive: boolean;
}

const BioMetricsDashboard = ({ isActive }: BioMetricsDashboardProps) => {
  const metrics = isActive ? wearableMetrics : null;

  const metricCards = [
    {
      id: "rhr",
      label: "Dinlenme Nabzı",
      icon: Heart,
      value: metrics?.rhr.value,
      unit: metrics?.rhr.unit,
      change: metrics?.rhr.change,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      id: "hrv",
      label: "HRV",
      icon: Activity,
      value: metrics?.hrv.value,
      unit: metrics?.hrv.unit,
      change: metrics?.hrv.change,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      id: "sleep",
      label: "Uyku Kalitesi",
      icon: Moon,
      value: metrics?.sleep.total,
      unit: metrics?.sleep.unit,
      subtext: metrics ? `Derin: %${metrics.sleep.deep}` : undefined,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      id: "steps",
      label: "Günlük Adım",
      icon: Footprints,
      value: metrics?.steps.value,
      unit: "",
      change: metrics?.steps.change,
      progress: metrics ? (metrics.steps.value / metrics.steps.goal) * 100 : undefined,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg text-foreground tracking-wide">
            BİYO-METRİK PANELİ
          </h2>
        </div>
        {metrics && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{metrics.lastSync}</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-2 gap-3"
          >
            {metricCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl ${card.bgColor} border ${card.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                  <span className="text-xs text-muted-foreground">{card.label}</span>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <motion.span
                    key={card.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-display text-2xl ${card.color}`}
                  >
                    {card.value?.toLocaleString()}
                  </motion.span>
                  {card.unit && (
                    <span className="text-xs text-muted-foreground">{card.unit}</span>
                  )}
                </div>

                {/* Change indicator or subtext */}
                {card.change !== undefined && (
                  <div className={`flex items-center gap-1 mt-1 text-xs ${
                    card.change > 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    <span>{card.change > 0 ? "↑" : "↓"}{Math.abs(card.change)}</span>
                    <span className="text-muted-foreground">dün</span>
                  </div>
                )}

                {card.subtext && (
                  <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
                )}

                {/* Progress bar for steps */}
                {card.progress !== undefined && (
                  <div className="mt-2">
                    <Progress value={card.progress} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">
                      {Math.round(card.progress)}% hedef
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="inactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">Veri bulunamadı</p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              Simülasyon modunu etkinleştirin veya cihaz bağlayın
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleep Breakdown (shown when active) */}
      {isActive && metrics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <p className="text-xs text-muted-foreground mb-2">Uyku Aşamaları</p>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-purple-600 rounded-l-full" 
              style={{ width: `${metrics.sleep.deep}%` }}
            />
            <div 
              className="bg-purple-400" 
              style={{ width: `${metrics.sleep.rem}%` }}
            />
            <div 
              className="bg-purple-200/30 rounded-r-full" 
              style={{ width: `${metrics.sleep.light}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>Derin %{metrics.sleep.deep}</span>
            <span>REM %{metrics.sleep.rem}</span>
            <span>Hafif %{metrics.sleep.light}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BioMetricsDashboard;
