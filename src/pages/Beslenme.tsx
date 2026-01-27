import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Apple, Droplets, Plus } from "lucide-react";
import MacroDashboard from "@/components/MacroDashboard";
import NutriScanner from "@/components/NutriScanner";

interface MealEntry {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  icon: React.ElementType;
  verified: boolean;
}

const Beslenme = () => {
  const meals: MealEntry[] = [
    {
      id: "1",
      name: "Kahvaltı",
      time: "07:30",
      calories: 480,
      protein: 28,
      icon: Coffee,
      verified: true,
    },
    {
      id: "2",
      name: "Öğle Yemeği",
      time: "12:45",
      calories: 720,
      protein: 52,
      icon: Sun,
      verified: true,
    },
    {
      id: "3",
      name: "Ara Öğün",
      time: "16:00",
      calories: 250,
      protein: 18,
      icon: Apple,
      verified: false,
    },
    {
      id: "4",
      name: "Akşam Yemeği",
      time: "19:30",
      calories: 400,
      protein: 42,
      icon: Moon,
      verified: true,
    },
  ];

  const waterIntake = {
    current: 2.4,
    target: 3.5,
    glasses: 8,
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-foreground">BESLENME</h1>
        <p className="text-muted-foreground text-sm">Nutri-Scan AI Takip Sistemi</p>
      </div>

      {/* Macro Dashboard */}
      <MacroDashboard />

      {/* Nutri Scanner Button */}
      <NutriScanner />

      {/* Water Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-stat-strain" />
            <h3 className="font-display text-sm text-foreground tracking-wide">
              SU TAKİBİ
            </h3>
          </div>
          <span className="text-foreground font-display">
            {waterIntake.current}L 
            <span className="text-muted-foreground text-sm">
              /{waterIntake.target}L
            </span>
          </span>
        </div>

        {/* Water Progress */}
        <div className="h-3 rounded-full bg-stat-strain/20 overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(waterIntake.current / waterIntake.target) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-stat-strain"
          />
        </div>

        {/* Glass Icons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`w-6 h-8 rounded-b-lg border-2 ${
                  i < waterIntake.glasses
                    ? "border-stat-strain bg-stat-strain/30"
                    : "border-muted bg-transparent"
                }`}
              />
            ))}
          </div>
          <button className="w-8 h-8 rounded-lg bg-stat-strain/20 flex items-center justify-center">
            <Plus className="w-4 h-4 text-stat-strain" />
          </button>
        </div>
      </motion.div>

      {/* Meal Log */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-foreground tracking-wide">
            BUGÜNKÜ ÖĞÜNLER
          </h2>
          <span className="text-xs text-primary">{meals.length} Kayıt</span>
        </div>

        <div className="space-y-3">
          {meals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <meal.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{meal.name}</p>
                    {meal.verified && (
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-[8px]">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">{meal.time}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-display text-foreground">{meal.calories}</p>
                <p className="text-muted-foreground text-[10px]">{meal.protein}g protein</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Coach Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-4 border-l-4 border-l-yellow-500"
      >
        <p className="text-yellow-500 text-xs font-medium mb-1">KOÇ ÖNERİSİ</p>
        <p className="text-foreground/80 text-sm">
          Antrenman sonrası 30 dakika içinde protein alımını unutma. 
          Bugün için 40g daha protein hedefine ulaşman gerekiyor.
        </p>
      </motion.div>
    </div>
  );
};

export default Beslenme;
