import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Circle, ScanBarcode, Plus, Droplets, Pencil, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// 1. RICH MOCK DATA (Örnek Beslenme Planı)
const mealData = [
  {
    id: "kahvalti",
    title: "Kahvaltı",
    time: "07:30",
    calories: 480,
    protein: "28g",
    isCompleted: true,
    icon: "☕",
    color: "text-yellow-500",
    foods: [
      { name: "Yulaf Ezmesi", amount: "60g", cal: 220 },
      { name: "Yumurta (Haşlanmış)", amount: "3 Adet", cal: 210 },
      { name: "Ceviz İçi", amount: "2 Adet", cal: 50 },
    ],
  },
  {
    id: "ogle",
    title: "Öğle Yemeği",
    time: "12:45",
    calories: 720,
    protein: "52g",
    isCompleted: true,
    icon: "☀️",
    color: "text-orange-500",
    foods: [
      { name: "Izgara Tavuk Göğsü", amount: "200g", cal: 330 },
      { name: "Basmati Pirinç (Pişmiş)", amount: "250g", cal: 320 },
      { name: "Zeytinyağlı Brokoli", amount: "100g", cal: 70 },
    ],
  },
  {
    id: "ara",
    title: "Ara Öğün",
    time: "16:00",
    calories: 250,
    protein: "18g",
    isCompleted: false,
    icon: "🍏",
    color: "text-green-500",
    foods: [
      { name: "Whey Protein (Su ile)", amount: "1 Ölçek", cal: 120 },
      { name: "Yeşil Elma", amount: "1 Orta Boy", cal: 90 },
      { name: "Badem (Çiğ)", amount: "10 Adet", cal: 40 },
    ],
  },
  {
    id: "aksam",
    title: "Akşam Yemeği",
    time: "19:30",
    calories: 400,
    protein: "42g",
    isCompleted: true,
    icon: "🌙",
    color: "text-indigo-400",
    foods: [
      { name: "Somon Fileto", amount: "150g", cal: 310 },
      { name: "Kuşkonmaz & Mantar", amount: "150g", cal: 60 },
      { name: "Avokado Dilimleri", amount: "Çeyrek", cal: 30 },
    ],
  },
];

// 2. THE EXPANDABLE CARD COMPONENT
const ExpandableMealCard = ({ meal }: { meal: (typeof mealData)[0] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div layout className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden mb-3">
      {/* Header (Always Visible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl", meal.color)}>
            {meal.icon}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-sm">{meal.title}</h3>
              {meal.isCompleted && <CheckCircle2 className="w-3 h-3 text-[#ccff00]" />}
            </div>
            <p className="text-zinc-500 text-xs">{meal.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-white font-display font-bold">{meal.calories}</div>
            <div className="text-xs text-zinc-500">{meal.protein} protein</div>
          </div>
          <ChevronDown
            className={cn("text-zinc-500 w-5 h-5 transition-transform duration-300", isOpen && "rotate-180")}
          />
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-4 space-y-3">
              <p className="text-xs text-[#ccff00] font-bold uppercase tracking-wider mb-2">MENÜ DETAYI</p>
              {meal.foods.map((food, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Circle className="w-1.5 h-1.5 fill-zinc-500 text-zinc-500" />
                    <span>{food.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-xs">{food.amount}</span>
                    <span className="text-white font-medium text-xs bg-white/10 px-1.5 py-0.5 rounded">
                      {food.cal} kcal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 3. MAIN PAGE COMPONENT (Restored Features)
const Beslenme = () => {
  const [waterIntake, setWaterIntake] = useState(2.0);
  const waterGoal = 3.5;
  const progress = (waterIntake / waterGoal) * 100;

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-32">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white uppercase font-display">Beslenme Planı</h1>
            <p className="text-zinc-500 text-sm">Günlük hedeflere 84% ulaşıldı</p>
          </div>
          {/* Top Actions */}
          <div className="flex gap-2">
            <Button size="icon" className="bg-[#ccff00] text-black hover:bg-[#b3e600] rounded-xl h-10 w-10">
              <ScanBarcode size={20} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 rounded-xl h-10 w-10"
            >
              <Pencil size={18} />
            </Button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-white/5 p-3 rounded-xl text-sm font-medium text-zinc-300 hover:border-[#ccff00]/50 transition-colors">
            <Zap className="w-4 h-4 text-[#ccff00]" />
            Yapay Zeka Analizi
          </button>
          <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-white/5 p-3 rounded-xl text-sm font-medium text-zinc-300 hover:border-[#ccff00]/50 transition-colors">
            <Plus className="w-4 h-4 text-white" />
            Manuel Ekle
          </button>
        </div>
      </div>

      {/* WATER TRACKER (Restored) */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 mb-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-white font-bold text-sm">SU TAKİBİ</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-display font-bold text-white">{waterIntake}L</span>
            <span className="text-zinc-500 text-sm">/{waterGoal}L</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-white/5 rounded-full mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>

        {/* Cups Grid */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-6 rounded-sm border border-white/10 transition-colors",
                  i < waterIntake * 2.5 ? "bg-blue-500 border-blue-500" : "bg-transparent",
                )}
              />
            ))}
          </div>
          <Button
            size="sm"
            onClick={() => setWaterIntake((prev) => Math.min(prev + 0.25, 5))}
            className="bg-blue-600 hover:bg-blue-500 text-white h-8 w-8 rounded-lg p-0"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* MEALS HEADER */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">BUGÜNKÜ ÖĞÜNLER</h2>
        <span className="text-[#ccff00] text-xs font-bold">4 Kayıt</span>
      </div>

      {/* EXPANDABLE MEAL LIST (The New Feature) */}
      <div className="space-y-3 mb-6">
        {mealData.map((meal) => (
          <ExpandableMealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {/* COACH SUGGESTION BOX (Restored) */}
      <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-600/30 rounded-2xl p-4">
        <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-2">KOÇ ÖNERİSİ</p>
        <p className="text-zinc-300 text-xs leading-relaxed">
          Antrenman sonrası 30 dakika içinde protein alımını unutma. Bugün için{" "}
          <span className="text-white font-bold">40g daha protein</span> hedefine ulaşman gerekiyor.
        </p>
      </div>
    </div>
  );
};

export default Beslenme;
