import { motion } from "framer-motion";
import { Moon, Flame, Droplets } from "lucide-react";

interface StatItem {
  icon: typeof Moon;
  label: string;
  value: string;
  unit?: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: Moon,
    label: "Uyku",
    value: "7.5",
    unit: "saat",
    color: "text-violet-400",
  },
  {
    icon: Flame,
    label: "Kalori",
    value: "1,250",
    unit: "kcal",
    color: "text-orange-400",
  },
  {
    icon: Droplets,
    label: "Su",
    value: "1.5",
    unit: "L",
    color: "text-cyan-400",
  },
];

const QuickStatsRow = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center"
        >
          <stat.icon className={`w-4 h-4 mx-auto mb-2 ${stat.color}`} />
          <p className="text-foreground font-bold text-lg leading-none">
            {stat.value}
            {stat.unit && (
              <span className="text-muted-foreground text-[10px] font-normal ml-0.5">
                {stat.unit}
              </span>
            )}
          </p>
          <p className="text-muted-foreground text-[10px] uppercase tracking-wider mt-1">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStatsRow;
