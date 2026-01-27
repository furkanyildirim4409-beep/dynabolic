import { motion } from "framer-motion";
import { Flame, Droplet, Wheat } from "lucide-react";

interface MacroData {
  current: number;
  target: number;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}

const MacroDashboard = () => {
  const macros: MacroData[] = [
    {
      current: 140,
      target: 180,
      label: "PROTEİN",
      color: "bg-destructive",
      bgColor: "bg-destructive/20",
      icon: Flame,
    },
    {
      current: 200,
      target: 250,
      label: "KARBONHİDRAT",
      color: "bg-stat-strain",
      bgColor: "bg-stat-strain/20",
      icon: Wheat,
    },
    {
      current: 45,
      target: 70,
      label: "YAĞ",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-500/20",
      icon: Droplet,
    },
  ];

  const totalCalories = { current: 1850, target: 2400 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground tracking-wide">
          GÜNLÜK YAKIT
        </h2>
        <div className="text-right">
          <p className="font-display text-xl text-primary">
            {totalCalories.current}
            <span className="text-muted-foreground text-sm">
              /{totalCalories.target}
            </span>
          </p>
          <p className="text-muted-foreground text-[10px]">KALORİ</p>
        </div>
      </div>

      {/* Macro Progress Bars */}
      <div className="space-y-3">
        {macros.map((macro, index) => {
          const percentage = Math.round((macro.current / macro.target) * 100);
          const IconComponent = macro.icon;

          return (
            <motion.div
              key={macro.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md ${macro.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`w-3 h-3 ${macro.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {macro.label}
                  </span>
                </div>
                <span className="text-xs text-foreground font-medium">
                  {macro.current}g / {macro.target}g
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className={`h-2 rounded-full ${macro.bgColor} overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className={`h-full rounded-full ${macro.color}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
        <div className="text-center">
          <p className="font-display text-lg text-foreground">3</p>
          <p className="text-muted-foreground text-[10px]">ÖĞÜN</p>
        </div>
        <div className="text-center">
          <p className="font-display text-lg text-foreground">2.4L</p>
          <p className="text-muted-foreground text-[10px]">SU</p>
        </div>
        <div className="text-center">
          <p className="font-display text-lg text-stat-hrv">550</p>
          <p className="text-muted-foreground text-[10px]">KALAN</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MacroDashboard;
