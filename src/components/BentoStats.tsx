import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  badge?: string;
  type: "strain" | "recovery" | "sleep" | "hrv";
  progress?: number;
}

const StatCard = ({ title, value, subtitle, badge, type, progress }: StatCardProps) => {
  const typeConfig = {
    strain: { 
      bgColor: "bg-stat-strain",
      textColor: "text-stat-strain",
      strokeColor: "hsl(var(--stat-strain))"
    },
    recovery: { 
      bgColor: "bg-primary",
      textColor: "text-primary",
      strokeColor: "hsl(var(--primary))"
    },
    sleep: { 
      bgColor: "bg-stat-sleep",
      textColor: "text-stat-sleep",
      strokeColor: "hsl(var(--stat-sleep))"
    },
    hrv: { 
      bgColor: "bg-stat-hrv",
      textColor: "text-stat-hrv",
      strokeColor: "hsl(var(--stat-hrv))"
    },
  };

  const config = typeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="glass-card-premium p-4 relative overflow-hidden group transition-all duration-300 hover:border-primary/20"
    >
      {/* Background Glow */}
      <div className={`absolute -bottom-8 -right-8 w-24 h-24 ${config.bgColor} opacity-10 blur-2xl rounded-full`} />
      
      {/* Title */}
      <p className="text-muted-foreground text-xs font-medium tracking-wider mb-3">
        {title}
      </p>

      {/* Visual based on type */}
      {type === "strain" && progress !== undefined && (
        <div className="relative w-16 h-16 mb-3">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke={config.strokeColor}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28 * (progress / 21)} ${2 * Math.PI * 28}`}
              className="drop-shadow-[0_0_6px_hsl(var(--stat-strain))]"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-display text-lg ${config.textColor}`}>{value}</span>
          </div>
        </div>
      )}

      {type === "recovery" && (
        <div className="mb-3">
          <div className="flex items-end gap-1 h-12">
            {[40, 55, 48, 62, 75, 82, 92].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className={`flex-1 rounded-t-sm ${
                  i === 6 ? "bg-primary" : "bg-primary/40"
                }`}
              />
            ))}
          </div>
          <p className={`font-display text-2xl ${config.textColor} mt-2`}>{value}</p>
        </div>
      )}

      {type === "sleep" && (
        <div className="mb-2">
          <p className={`font-display text-2xl ${config.textColor}`}>{value}</p>
          {badge && (
            <span className={`inline-block mt-2 text-[10px] px-2 py-1 rounded-full bg-stat-sleep/20 ${config.textColor}`}>
              {badge}
            </span>
          )}
        </div>
      )}

      {type === "hrv" && (
        <div className="mb-2">
          <p className={`font-display text-2xl ${config.textColor}`}>{value}</p>
          {/* Mini ECG Line */}
          <svg className="w-full h-8 mt-2" viewBox="0 0 100 20">
            <motion.path
              d="M0,10 L20,10 L25,2 L30,18 L35,10 L50,10 L55,5 L60,15 L65,10 L100,10"
              fill="none"
              stroke={config.strokeColor}
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};

const BentoStats = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title="GÜNLÜK YÜK"
        value="14.2"
        type="strain"
        progress={14.2}
        subtitle="Hedef: 16.0"
      />
      <StatCard
        title="TOPARLANMA"
        value="92%"
        type="recovery"
        subtitle="Çok İyi"
      />
      <StatCard
        title="UYKU PUANI"
        value="7sa 42dk"
        type="sleep"
        badge="Derin Uyku: 2sa"
      />
      <StatCard
        title="HRV (STRES)"
        value="112ms"
        type="hrv"
        subtitle="Sinir Sistemi Dengede"
      />
    </div>
  );
};

export default BentoStats;
