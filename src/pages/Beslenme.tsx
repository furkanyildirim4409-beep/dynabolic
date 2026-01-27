import { motion } from "framer-motion";
import { Leaf, Camera, Droplets, Flame } from "lucide-react";

const Beslenme = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-foreground">BESLENME</h1>
        <p className="text-muted-foreground text-sm">Nutri-Tarama Sistemi</p>
      </div>

      {/* Quick Scan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg text-foreground">NUTRİ-TARAMA</h2>
            <p className="text-muted-foreground text-xs">Yemeğini tara, makrolarını öğren</p>
          </div>
        </div>
        
        <button className="w-full py-4 bg-primary/10 border border-primary/50 rounded-xl font-display text-primary tracking-wider hover:bg-primary/20 transition-all neon-glow-sm">
          YEMEĞİ TARA
        </button>
      </motion.div>

      {/* Daily Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <h2 className="font-display text-lg text-foreground mb-4">GÜNLÜK ÖZET</h2>
        
        {/* Calories Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground text-sm">Kalori</span>
            <span className="text-foreground text-sm font-medium">1,850 / 2,800 kcal</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[66%] rounded-full neon-glow-sm" />
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-secondary/50 rounded-xl">
            <Flame className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-display text-xl text-foreground">145g</p>
            <p className="text-muted-foreground text-xs">Protein</p>
            <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary w-[80%] rounded-full" />
            </div>
          </div>
          
          <div className="text-center p-3 bg-secondary/50 rounded-xl">
            <Leaf className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-display text-xl text-foreground">210g</p>
            <p className="text-muted-foreground text-xs">Karbonhidrat</p>
            <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary w-[60%] rounded-full" />
            </div>
          </div>
          
          <div className="text-center p-3 bg-secondary/50 rounded-xl">
            <Droplets className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-display text-xl text-foreground">65g</p>
            <p className="text-muted-foreground text-xs">Yağ</p>
            <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary w-[70%] rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <h2 className="font-display text-lg text-foreground mb-4">SON ÖĞÜNLER</h2>
        
        <div className="space-y-3">
          {[
            { name: "Kahvaltı", time: "08:30", calories: 520, description: "Yumurta, avokado, tam tahıl" },
            { name: "Ara Öğün", time: "11:00", calories: 180, description: "Protein shake" },
            { name: "Öğle", time: "13:00", calories: 680, description: "Tavuk göğsü, pilav, salata" },
            { name: "Ara Öğün", time: "16:00", calories: 220, description: "Muz, badem" },
          ].map((meal, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground text-sm">{meal.name}</p>
                  <span className="text-muted-foreground text-xs">{meal.time}</span>
                </div>
                <p className="text-muted-foreground text-xs mt-1">{meal.description}</p>
              </div>
              <span className="text-primary font-display">{meal.calories}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Beslenme;
