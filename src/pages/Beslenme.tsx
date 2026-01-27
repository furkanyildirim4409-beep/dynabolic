import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  ScanBarcode,
  Plus,
  Droplets,
  Pencil,
  Zap,
  Utensils,
  Check,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// --- TİP TANIMLAMALARI ---
interface FoodItem {
  name: string;
  amount: string;
  cal: number;
  macros: { p: number; c: number; f: number };
  isEaten: boolean;
}

interface Meal {
  id: string;
  title: string;
  time: string;
  totalCal: number;
  totalMacros: { p: number; c: number; f: number };
  isCompleted: boolean;
  icon: string;
  color: string;
  foods: FoodItem[];
}

// --- ÖRNEK YİYECEK VERİTABANI (MOCK DATABASE) ---
const foodDatabase = [
  { name: "Muz (Orta Boy)", amount: "1 Adet", cal: 105, macros: { p: 1, c: 27, f: 0 } },
  { name: "Haşlanmış Pirinç", amount: "100g", cal: 130, macros: { p: 2, c: 28, f: 0 } },
  { name: "Izgara Tavuk", amount: "100g", cal: 165, macros: { p: 31, c: 0, f: 3 } },
  { name: "Tam Buğday Ekmeği", amount: "1 Dilim", cal: 69, macros: { p: 3, c: 12, f: 1 } },
  { name: "Fıstık Ezmesi", amount: "1 Tatlı Kaşığı", cal: 94, macros: { p: 4, c: 3, f: 8 } },
  { name: "Yoğurt (Yarım Yağlı)", amount: "1 Kase", cal: 100, macros: { p: 6, c: 8, f: 4 } },
  { name: "Ton Balığı", amount: "80g (Süzülmüş)", cal: 90, macros: { p: 20, c: 0, f: 1 } },
];

const initialMealData: Meal[] = [
  {
    id: "kahvalti",
    title: "Kahvaltı",
    time: "07:30",
    totalCal: 480,
    totalMacros: { p: 28, c: 45, f: 12 },
    isCompleted: true,
    icon: "☕",
    color: "text-yellow-500",
    foods: [
      { name: "Yulaf Ezmesi", amount: "60g", cal: 220, macros: { p: 8, c: 35, f: 4 }, isEaten: true },
      { name: "Yumurta (Haşlanmış)", amount: "3 Adet", cal: 210, macros: { p: 18, c: 1, f: 15 }, isEaten: true },
    ],
  },
  {
    id: "ogle",
    title: "Öğle Yemeği",
    time: "12:45",
    totalCal: 720,
    totalMacros: { p: 52, c: 60, f: 18 },
    isCompleted: false,
    icon: "☀️",
    color: "text-orange-500",
    foods: [
      { name: "Izgara Tavuk Göğsü", amount: "200g", cal: 330, macros: { p: 46, c: 0, f: 6 }, isEaten: false },
      { name: "Basmati Pirinç", amount: "250g", cal: 320, macros: { p: 6, c: 70, f: 1 }, isEaten: false },
    ],
  },
  {
    id: "aksam",
    title: "Akşam Yemeği",
    time: "19:30",
    totalCal: 400,
    totalMacros: { p: 42, c: 10, f: 20 },
    isCompleted: false,
    icon: "🌙",
    color: "text-indigo-400",
    foods: [{ name: "Somon Fileto", amount: "150g", cal: 310, macros: { p: 34, c: 0, f: 18 }, isEaten: false }],
  },
];

// --- ALT BİLEŞENLER ---

const FoodItemRow = ({ food, onToggle }: { food: FoodItem; onToggle: () => void }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border border-white/5 transition-all",
        food.isEaten ? "bg-[#ccff00]/5 border-[#ccff00]/20" : "bg-white/5",
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center border transition-all flex-shrink-0",
            food.isEaten
              ? "bg-[#ccff00] border-[#ccff00] text-black"
              : "border-zinc-600 text-transparent hover:border-zinc-400",
          )}
        >
          <Check size={14} strokeWidth={3} />
        </button>
        <div>
          <p
            className={cn(
              "text-sm font-medium transition-colors",
              food.isEaten ? "text-zinc-400 line-through" : "text-white",
            )}
          >
            {food.name}
          </p>
          <p className="text-xs text-zinc-500">{food.amount}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-white">{food.cal} kcal</p>
        <div className="flex gap-2 text-[10px] text-zinc-400 justify-end">
          <span className="text-yellow-500/80">P:{food.macros.p}</span>
          <span className="text-blue-500/80">K:{food.macros.c}</span>
        </div>
      </div>
    </div>
  );
};

const ExpandableMealCard = ({
  meal,
  onUpdateFood,
}: {
  meal: Meal;
  onUpdateFood: (mealId: string, foodIndex: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const allEaten = meal.foods.length > 0 && meal.foods.every((f) => f.isEaten);

  return (
    <motion.div
      layout
      className={cn(
        "border rounded-2xl overflow-hidden mb-3 transition-colors",
        allEaten ? "bg-[#1a1a1a] border-[#ccff00]/20" : "bg-[#1a1a1a] border-white/5",
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl relative flex-shrink-0",
              meal.color,
            )}
          >
            {meal.icon}
            {allEaten && (
              <div className="absolute -top-1 -right-1 bg-[#ccff00] rounded-full p-0.5 border-2 border-[#1a1a1a]">
                <Check size={10} className="text-black" />
              </div>
            )}
          </div>
          <div className="text-left">
            <h3 className={cn("font-bold text-sm", allEaten ? "text-[#ccff00]" : "text-white")}>{meal.title}</h3>
            <p className="text-zinc-500 text-xs">{meal.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-white font-display font-bold text-lg">{meal.totalCal}</div>
            <div className="text-xs text-zinc-500">kcal</div>
          </div>
          <ChevronDown
            className={cn("text-zinc-500 w-5 h-5 transition-transform duration-300", isOpen && "rotate-180")}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-3 space-y-2">
              {meal.foods.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-2">Bu öğünde henüz yiyecek yok.</p>
              ) : (
                meal.foods.map((food, idx) => (
                  <FoodItemRow key={idx} food={food} onToggle={() => onUpdateFood(meal.id, idx)} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- ANA SAYFA ---
const Beslenme = () => {
  const [waterIntake, setWaterIntake] = useState(2.0);
  const [meals, setMeals] = useState<Meal[]>(initialMealData);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const waterGoal = 3.5;
  const progress = (waterIntake / waterGoal) * 100;

  // Yiyecek Durumu Değiştirme (Yendi/Yenmedi)
  const handleToggleFood = (mealId: string, foodIndex: number) => {
    setMeals((currentMeals) =>
      currentMeals.map((meal) => {
        if (meal.id !== mealId) return meal;

        const newFoods = [...meal.foods];
        const food = newFoods[foodIndex];
        food.isEaten = !food.isEaten;

        if (food.isEaten) {
          toast({ title: "Afiyet olsun! 💪", description: `${food.name} sisteme işlendi.` });
        }

        return { ...meal, foods: newFoods };
      }),
    );
  };

  // Yeni Yiyecek Ekleme Fonksiyonu
  const handleAddFoodToMeal = (food: (typeof foodDatabase)[0]) => {
    // Varsayılan olarak "Öğle Yemeği"ne ekleyelim (Veya o anki saate göre seçilebilir)
    const targetMealId = "ogle";

    setMeals((currentMeals) =>
      currentMeals.map((meal) => {
        if (meal.id !== targetMealId) return meal;

        const newFood: FoodItem = {
          name: food.name,
          amount: food.amount,
          cal: food.cal,
          macros: food.macros,
          isEaten: false,
        };

        // Toplam kaloriyi güncelle
        const newTotalCal = meal.totalCal + food.cal;
        const newTotalMacros = {
          p: meal.totalMacros.p + food.macros.p,
          c: meal.totalMacros.c + food.macros.c,
          f: meal.totalMacros.f + food.macros.f,
        };

        return {
          ...meal,
          totalCal: newTotalCal,
          totalMacros: newTotalMacros,
          foods: [...meal.foods, newFood],
        };
      }),
    );

    toast({ title: "Eklendi ✅", description: `${food.name} öğle yemeğine eklendi.` });
    setShowManualAdd(false);
  };

  const filteredFoods = foodDatabase.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-black px-4 pt-6 pb-32">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white uppercase font-display">Beslenme Planı</h1>
            <p className="text-zinc-500 text-sm">Hedefine 420 kcal kaldı</p>
          </div>
          <div className="flex gap-2">
            <Button size="icon" className="bg-[#ccff00] text-black hover:bg-[#b3e600] rounded-xl h-10 w-10">
              <ScanBarcode size={20} />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-white/5 p-3 rounded-xl text-sm font-medium text-zinc-300 hover:border-[#ccff00]/50 active:scale-95 transition-all">
            <Zap className="w-4 h-4 text-[#ccff00]" />
            Yapay Zeka Analizi
          </button>
          <button
            onClick={() => setShowManualAdd(true)}
            className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-white/5 p-3 rounded-xl text-sm font-medium text-zinc-300 hover:bg-white/5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            Manuel Ekle
          </button>
        </div>
      </div>

      {/* WATER TRACKER */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 mb-6 relative overflow-hidden">
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
        <div className="h-2 w-full bg-white/5 rounded-full mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>
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

      {/* MEAL LIST */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">BUGÜNKÜ ÖĞÜNLER</h2>
      </div>
      <div className="space-y-3 mb-6">
        {meals.map((meal) => (
          <ExpandableMealCard key={meal.id} meal={meal} onUpdateFood={handleToggleFood} />
        ))}
      </div>

      {/* MANUAL ADD MODAL */}
      <Dialog open={showManualAdd} onOpenChange={setShowManualAdd}>
        <DialogContent className="bg-[#121212] border-white/10 text-white max-w-sm max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Yiyecek Ekle</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Yiyecek ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-900 border-white/10 pl-10 text-white"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredFoods.map((food, idx) => (
              <button
                key={idx}
                onClick={() => handleAddFoodToMeal(food)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 transition-colors text-left group"
              >
                <div>
                  <p className="font-medium text-sm text-white">{food.name}</p>
                  <p className="text-xs text-zinc-500">
                    {food.amount} • {food.cal} kcal
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#ccff00]/10 flex items-center justify-center group-hover:bg-[#ccff00] transition-colors">
                  <Plus className="w-4 h-4 text-[#ccff00] group-hover:text-black" />
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Beslenme;
