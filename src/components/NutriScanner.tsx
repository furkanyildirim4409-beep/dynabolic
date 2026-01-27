import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check, Clock, Utensils } from "lucide-react";

interface DetectedFood {
  name: string;
  confidence: number;
}

interface ScanResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: DetectedFood[];
}

const NutriScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState<"camera" | "scanning" | "result">("camera");
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);

  const mockResult: ScanResult = {
    calories: 650,
    protein: 45,
    carbs: 62,
    fat: 18,
    foods: [
      { name: "Izgara Tavuk", confidence: 98 },
      { name: "Basmati Pilav", confidence: 94 },
      { name: "Buharda Brokoli", confidence: 91 },
    ],
  };

  const startScan = () => {
    setIsScanning(true);
    setScanPhase("camera");
    setDetectedFoods([]);

    // Start scanning after brief delay
    setTimeout(() => {
      setScanPhase("scanning");
      
      // Simulate food detection
      mockResult.foods.forEach((food, index) => {
        setTimeout(() => {
          setDetectedFoods((prev) => [...prev, food]);
        }, 800 + index * 600);
      });

      // Show result
      setTimeout(() => {
        setScanPhase("result");
      }, 3000);
    }, 500);
  };

  const closeScan = () => {
    setIsScanning(false);
    setScanPhase("camera");
    setDetectedFoods([]);
  };

  const addToLog = () => {
    // Mock add to log
    closeScan();
  };

  return (
    <>
      {/* Scan Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={startScan}
        className="w-full py-4 glass-card flex items-center justify-center gap-3 neon-glow-sm"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Camera className="w-6 h-6 text-primary" />
        </div>
        <div className="text-left">
          <p className="font-display text-lg text-primary tracking-wide">ÖĞÜN TARA</p>
          <p className="text-muted-foreground text-xs">Yapay Zeka Besin Analizi</p>
        </div>
      </motion.button>

      {/* Scanner Modal */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="font-display text-sm text-foreground tracking-wider">
                  NUTRİ-SCAN AI
                </span>
              </div>
              <button
                onClick={closeScan}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Camera View */}
            {scanPhase !== "result" && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Mock Food Image Background */}
                <div className="relative w-full h-full bg-gradient-to-b from-secondary to-background">
                  {/* Food Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-48 rounded-2xl bg-secondary/50 border border-white/10 flex items-center justify-center">
                      <Utensils className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  </div>

                  {/* Grid Overlay */}
                  <div className="absolute inset-0 grid-pattern opacity-20" />

                  {/* Scanning Laser Line */}
                  {scanPhase === "scanning" && (
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_hsl(var(--primary)),0_0_40px_hsl(var(--primary))]"
                      initial={{ top: "20%" }}
                      animate={{ top: ["20%", "80%", "20%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  {/* Corner Brackets */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <g stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity={0.6}>
                      {/* Top Left */}
                      <path d="M 60 100 L 60 60 L 100 60" />
                      {/* Top Right */}
                      <path d="M calc(100% - 60) 100 L calc(100% - 60) 60 L calc(100% - 100) 60" />
                      {/* Bottom Left */}
                      <path d="M 60 calc(100% - 100) L 60 calc(100% - 60) L 100 calc(100% - 60)" />
                      {/* Bottom Right */}
                      <path d="M calc(100% - 60) calc(100% - 100) L calc(100% - 60) calc(100% - 60) L calc(100% - 100) calc(100% - 60)" />
                    </g>
                  </svg>

                  {/* Detected Foods Bubbles */}
                  <div className="absolute bottom-32 left-4 right-4 space-y-2">
                    <AnimatePresence>
                      {detectedFoods.map((food, index) => (
                        <motion.div
                          key={food.name}
                          initial={{ opacity: 0, x: -20, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="glass-card px-4 py-2 inline-flex items-center gap-2 mr-2"
                        >
                          <Check className="w-4 h-4 text-primary" />
                          <span className="text-foreground text-sm font-medium">
                            Tespit Edildi: {food.name}
                          </span>
                          <span className="text-primary text-xs">%{food.confidence}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Scanning Status */}
                  {scanPhase === "scanning" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-20 left-0 right-0 text-center"
                    >
                      <p className="font-display text-sm text-primary tracking-widest animate-pulse">
                        ANALİZ EDİLİYOR...
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Result Modal */}
            {scanPhase === "result" && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 flex items-center justify-center p-6"
              >
                <div className="w-full max-w-sm glass-card p-6 space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center"
                    >
                      <Check className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h2 className="font-display text-xl text-foreground tracking-wide">
                      YAPAY ZEKA ANALİZİ TAMAMLANDI
                    </h2>
                  </div>

                  {/* Detected Foods */}
                  <div className="space-y-2">
                    {mockResult.foods.map((food) => (
                      <div
                        key={food.name}
                        className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2"
                      >
                        <span className="text-foreground text-sm">{food.name}</span>
                        <span className="text-primary text-xs">%{food.confidence}</span>
                      </div>
                    ))}
                  </div>

                  {/* Nutrition Summary */}
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="font-display text-2xl text-primary">
                          {mockResult.calories}
                        </p>
                        <p className="text-muted-foreground text-xs">KALORİ</p>
                      </div>
                      <div>
                        <p className="font-display text-2xl text-foreground">
                          {mockResult.protein}g
                        </p>
                        <p className="text-muted-foreground text-xs">PROTEİN</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center mt-3 pt-3 border-t border-white/10">
                      <div>
                        <p className="font-display text-lg text-stat-strain">
                          {mockResult.carbs}g
                        </p>
                        <p className="text-muted-foreground text-[10px]">KARB</p>
                      </div>
                      <div>
                        <p className="font-display text-lg text-yellow-500">
                          {mockResult.fat}g
                        </p>
                        <p className="text-muted-foreground text-[10px]">YAĞ</p>
                      </div>
                    </div>
                  </div>

                  {/* Coach Verification Badge */}
                  <div className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-500 text-sm font-medium">
                      Koç Onayı Bekleniyor
                    </span>
                  </div>

                  {/* Add Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addToLog}
                    className="w-full py-4 bg-primary text-primary-foreground font-display text-lg tracking-wider rounded-xl neon-glow"
                  >
                    GÜNLÜĞE EKLE
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NutriScanner;
