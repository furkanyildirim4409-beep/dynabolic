import { motion } from "framer-motion";
import { Activity, Heart, Flame, TrendingUp } from "lucide-react";

const Kokpit = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">KOKPİT</h1>
          <p className="text-muted-foreground text-sm">Bugünkü Durumun</p>
        </div>
        <div className="text-right">
          <p className="text-primary font-display text-lg">27 OCAK</p>
          <p className="text-muted-foreground text-xs">Pazartesi</p>
        </div>
      </div>

      {/* Recovery Score - Main Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-foreground">TOPARLANMA SKORU</h2>
          <Activity className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            {/* Circular Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70 * 0.78} ${2 * Math.PI * 70}`}
                className="drop-shadow-[0_0_8px_hsl(68,100%,50%)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl text-primary text-neon-glow">78%</span>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">HRV: 62ms</span>
            </div>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground text-sm mt-4">
          Toparlanman iyi durumda. Yoğun antrenman yapabilirsin.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Daily Strain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-primary" />
            <span className="font-display text-sm text-foreground">GÜNLÜK YÜK</span>
          </div>
          <p className="font-display text-3xl text-primary">12.4</p>
          <p className="text-muted-foreground text-xs mt-1">Hedef: 14.0</p>
        </motion.div>

        {/* Heart Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-destructive" />
            <span className="font-display text-sm text-foreground">KAH</span>
          </div>
          <p className="font-display text-3xl text-foreground">72</p>
          <p className="text-muted-foreground text-xs mt-1">bpm (dinlenme)</p>
        </motion.div>

        {/* Sleep */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary">🌙</span>
            <span className="font-display text-sm text-foreground">UYKU</span>
          </div>
          <p className="font-display text-3xl text-foreground">7.2<span className="text-lg">sa</span></p>
          <p className="text-muted-foreground text-xs mt-1">%85 kalite</p>
        </motion.div>

        {/* Calories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-display text-sm text-foreground">KALORİ</span>
          </div>
          <p className="font-display text-3xl text-primary">2,340</p>
          <p className="text-muted-foreground text-xs mt-1">kcal yakıldı</p>
        </motion.div>
      </div>

      {/* Body Composition Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-foreground">VÜCUT KOMPOZİSYONU</h2>
          <span className="text-primary text-xs font-medium">DETAY →</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="font-display text-2xl text-foreground">78.5</p>
            <p className="text-muted-foreground text-xs">kg</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="font-display text-2xl text-primary">12.4%</p>
            <p className="text-muted-foreground text-xs">Yağ Oranı</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="font-display text-2xl text-foreground">68.8</p>
            <p className="text-muted-foreground text-xs">kg Kas</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Kokpit;
