import { motion } from "framer-motion";
import { Dumbbell, Eye, Timer, Zap } from "lucide-react";

const Antrenman = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-foreground">ANTRENMAN</h1>
        <p className="text-muted-foreground text-sm">Vision AI Eğitim Sistemi</p>
      </div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg text-foreground">VİZYON AI</h2>
            <p className="text-muted-foreground text-xs">Hareket analizi başlat</p>
          </div>
        </div>
        
        <button className="w-full py-4 bg-primary/10 border border-primary/50 rounded-xl font-display text-primary tracking-wider hover:bg-primary/20 transition-all neon-glow-sm">
          ANTRENMAN BAŞLAT
        </button>
      </motion.div>

      {/* Today's Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <h2 className="font-display text-lg text-foreground mb-4">BUGÜNKÜ PLAN</h2>
        
        <div className="space-y-3">
          {[
            { name: "Üst Vücut Güç", duration: "45 dk", intensity: "Yüksek", icon: Dumbbell },
            { name: "Kor Stabilite", duration: "20 dk", intensity: "Orta", icon: Zap },
            { name: "Esneme & Toparlanma", duration: "15 dk", intensity: "Düşük", icon: Timer },
          ].map((workout, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <workout.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{workout.name}</p>
                  <p className="text-muted-foreground text-xs">{workout.duration}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                workout.intensity === "Yüksek" ? "bg-destructive/20 text-destructive" :
                workout.intensity === "Orta" ? "bg-primary/20 text-primary" :
                "bg-muted text-muted-foreground"
              }`}>
                {workout.intensity}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <h2 className="font-display text-lg text-foreground mb-4">HAFTALIK İSTATİSTİK</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="font-display text-2xl text-primary">5</p>
            <p className="text-muted-foreground text-xs">Antrenman</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl text-foreground">4.2<span className="text-sm">sa</span></p>
            <p className="text-muted-foreground text-xs">Toplam Süre</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl text-foreground">12,450</p>
            <p className="text-muted-foreground text-xs">kcal</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Antrenman;
