import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Check,
  Search,
  Plus,
  Droplets,
  Camera,
  X,
  Focus,
  ScanBarcode,
  Trash2, // Yeni eklenen ikon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// --- HEDEFLER (Goals) ---
const macroGoals = {
  protein: 180,
  carbs: 250,
  fat: 70,
  calories: 2200,
};

// --- ÖRNEK YİYECEK VERİTABANI ---
const foodDatabase = [
  { name: "Muz (Orta Boy)", amount: "1 Adet", cal: 105, macros: { p: 1, c: 27, f: 0 }, baseGrams: 120 },
  { name: "Haşlanmış Pirinç", amount: "100g", cal: 130, macros: { p: 2, c: 28, f: 0 }, baseGrams: 100 },
  { name: "Izgara Tavuk", amount: "100g", cal: 165, macros: { p: 31, c: 0, f: 3 }, baseGrams: 100 },
  { name: "Tam Buğday Ekmeği", amount: "1 Dilim", cal: 69, macros: { p: 3, c: 12, f: 1 }, baseGrams: 30 },
  { name: "Fıstık Ezmesi", amount: "1 Tatlı Kaşığı", cal: 94, macros: { p: 4, c: 3, f: 8 }, baseGrams: 16 },
  { name: "Yoğurt (Yarım Yağlı)", amount: "1 Kase", cal: 100, macros: { p: 6, c: 8, f: 4 }, baseGrams: 150 },
  { name: "Ton Balığı", amount: "80g (Süzülmüş)", cal: 90, macros: { p: 20, c: 0, f: 1 }, baseGrams: 80 },
  { name: "Yumurta", amount: "1 Adet", cal: 70, macros: { p: 6, c: 0, f: 5 }, baseGrams: 50 },
  { name: "Yulaf Ezmesi", amount: "40g", cal: 150, macros: { p: 5, c: 27, f: 3 }, baseGrams: 40 },
  { name: "Avokado", amount: "Yarım", cal: 120, macros: { p: 1, c: 6, f: 11 }, baseGrams: 75 },
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
    id: "ara",
    title: "Ara Öğün",
    time: "16:00",
    totalCal: 0,
    totalMacros: { p: 0, c: 0, f: 0 },
    isCompleted: false,
    icon: "🍏",
    color: "text-green-500",
    foods: [],
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

// --- MACRO DASHBOARD COMPONENT ---
const MacroDashboard = ({ meals }: { meals: Meal[] }) => {
  const totals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => ({
        protein: acc.protein + meal.totalMacros.p,
        carbs: acc.carbs + meal.totalMacros.c,
        fat: acc.fat + meal.totalMacros.f,
        calories: acc.calories + meal.totalCal,
      }),
      { protein: 0, carbs: 0, fat: 0, calories: 0 },
    );
  }, [meals]);

  const macros = [
    {
      label: "PROTEİN",
      current: totals.protein,
      goal: macroGoals.protein,
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
    },
    {
      label: "KARBONHİDRAT",
      current: totals.carbs,
      goal: macroGoals.carbs,
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
    {
      label: "YAĞ",
      current: totals.fat,
      goal: macroGoals.fat,
      color: "bg-orange-500",
      textColor: "text-orange-500",
    },
  ];

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">MAKRO ÖZETİ</h2>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-display font-bold text-primary">{totals.calories}</span>
          <span className="text-zinc-500 text-sm">/ {macroGoals.calories} kcal</span>
        </div>
      </div>

      {/* Macro Grid */}
      <div className="grid grid-cols-3 gap-3">
        {macros.map((macro) => {
          const percentage = Math.min((macro.current / macro.goal) * 100, 100);
          return (
            <div key={macro.label} className="bg-black/30 rounded-xl p-3">
              <p className="text-[10px] font-bold text-zinc-500 mb-2 tracking-wide">{macro.label}</p>
              <div className="h-1.5 w-full bg-white/5 rounded-full mb-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn("h-full rounded-full", macro.color)}
                />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className={cn("font-display font-bold text-lg", macro.textColor)}>{macro.current}g</span>
                <span className="text-zinc-600 text-xs">/ {macro.goal}g</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- CAMERA SCANNER COMPONENT ---
type ScannerMode = "meal" | "barcode";

const CameraScanner = ({
  isOpen,
  onClose,
  mode = "meal",
}: {
  isOpen: boolean;
  onClose: () => void;
  mode?: ScannerMode;
}) => {
  const [phase, setPhase] = useState<"camera" | "processing">("camera");

  const instructionText = mode === "barcode" ? "Barkodu çerçeve içine alın" : "Yiyeceği çerçeve içine alın";
  const processingText = mode === "barcode" ? "BARKOD TARANIYOR..." : "ÖĞÜN TARANIYOR...";

  const handleCapture = () => {
    setPhase("processing");
    setTimeout(() => {
      onClose();
      setPhase("camera");
      toast({
        title: "Analiz Tamamlandı ✅",
        description: mode === "barcode" ? "Barkod başarıyla tarandı." : "Öğün başarıyla tarandı ve sisteme eklendi.",
      });
    }, 2500);
  };

  const handleClose = () => {
    onClose();
    setPhase("camera");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="font-display text-sm text-white tracking-wider uppercase">
                {mode === "barcode" ? "BARKOD TARAYICI" : "NUTRİ-SCAN AI"}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {phase === "camera" && (
            <>
              {/* Mock Camera Feed */}
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black">
                {/* Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Focus Frame */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-72 h-72"
                  >
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary rounded-br-lg" />

                    {/* Center Focus Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {mode === "barcode" ? (
                        <ScanBarcode className="w-12 h-12 text-primary/30" />
                      ) : (
                        <Focus className="w-12 h-12 text-primary/30" />
                      )}
                    </div>

                    {/* Animated Corners Pulse */}
                    <motion.div
                      className="absolute inset-0 border-2 border-primary/20 rounded-xl"
                      animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-40 left-0 right-0 text-center">
                  <p className="text-zinc-400 text-sm">{instructionText}</p>
                </div>
              </div>

              {/* Shutter Button */}
              <div className="absolute bottom-12 left-0 right-0 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCapture}
                  className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/20"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-black/20 flex items-center justify-center">
                    {mode === "barcode" ? (
                      <ScanBarcode className="w-6 h-6 text-black" />
                    ) : (
                      <Camera className="w-6 h-6 text-black" />
                    )}
                  </div>
                </motion.button>
              </div>
            </>
          )}

          {phase === "processing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
              {/* Scanning Animation */}
              <div className="relative w-48 h-48 mb-8">
                {/* Outer Ring */}
                <motion.div
                  className="absolute inset-0 border-2 border-primary/30 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Inner Ring */}
                <motion.div
                  className="absolute inset-4 border-2 border-primary/50 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                {/* Center */}
                <div className="absolute inset-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    {mode === "barcode" ? (
                      <ScanBarcode className="w-12 h-12 text-primary" />
                    ) : (
                      <Camera className="w-12 h-12 text-primary" />
                    )}
                  </motion.div>
                </div>

                {/* Scanning Line */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <motion.p
                className="font-display text-lg text-primary tracking-widest"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {processingText}
              </motion.p>
              <p className="text-zinc-500 text-sm mt-2">
                {mode === "barcode" ? "Ürün bilgileri alınıyor" : "Yapay zeka besinleri analiz ediyor"}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- FOOD ITEM ROW COMPONENT ---
// YENİ ÖZELLİK: onRemove fonksiyonu eklendi
const FoodItemRow = ({ food, onToggle, onRemove }: { food: FoodItem; onToggle: () => void; onRemove: () => void }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border border-white/5 transition-all group",
        food.isEaten ? "bg-primary/5 border-primary/20" : "bg-white/5",
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center border transition-all flex-shrink-0",
            food.isEaten
              ? "bg-primary border-primary text-primary-foreground"
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
      <div className="flex items-center gap-3">
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-white">{food.cal} kcal</p>
          <div className="flex gap-2 text-[10px] text-zinc-400 justify-end">
            <span className="text-yellow-500/80">P:{food.macros.p}</span>
            <span className="text-blue-500/80">K:{food.macros.c}</span>
          </div>
        </div>
        {/* SİLME BUTONU */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// --- EXPANDABLE MEAL CARD COMPONENT ---
// YENİ ÖZELLİK: onRemoveFood prop'u eklendi
const ExpandableMealCard = ({
  meal,
  onUpdateFood,
  onRemoveFood,
}: {
  meal: Meal;
  onUpdateFood: (mealId: string, foodIndex: number) => void;
  onRemoveFood: (mealId: string, foodIndex: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const allEaten = meal.foods.length > 0 && meal.foods.every((f) => f.isEaten);

  return (
    <motion.div
      layout
      className={cn(
        "border rounded-2xl overflow-hidden mb-3 transition-colors",
        allEaten ? "bg-[#1a1a1a] border-primary/20" : "bg-[#1a1a1a] border-white/5",
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
              <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5 border-2 border-[#1a1a1a]">
                <Check size={10} className="text-black" />
              </div>
            )}
          </div>
          <div className="text-left">
            <h3 className={cn("font-bold text-sm", allEaten ? "text-primary" : "text-white")}>{meal.title}</h3>
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
                  <FoodItemRow
                    key={idx}
                    food={food}
                    onToggle={() => onUpdateFood(meal.id, idx)}
                    onRemove={() => onRemoveFood(meal.id, idx)}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- FOOD DETAIL WIZARD (for Manual Add) ---
interface SelectedFood {
  name: string;
  amount: string;
  cal: number;
  macros: { p: number; c: number; f: number };
  baseGrams: number;
}

const FoodDetailWizard = ({
  food,
  meals,
  onConfirm,
  onBack,
}: {
  food: SelectedFood;
  meals: Meal[];
  onConfirm: (mealId: string, grams: number) => void;
  onBack: () => void;
}) => {
  const [targetMeal, setTargetMeal] = useState("ogle");
  const [grams, setGrams] = useState(food.baseGrams.toString());

  const gramsNum = parseInt(grams) || 0;
  const ratio = gramsNum / food.baseGrams;

  const calculatedValues = {
    cal: Math.round(food.cal * ratio),
    protein: Math.round(food.macros.p * ratio),
    carbs: Math.round(food.macros.c * ratio),
    fat: Math.round(food.macros.f * ratio),
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-zinc-400 rotate-90" />
        </button>
        <div>
          <h3 className="font-bold text-white">{food.name}</h3>
          <p className="text-xs text-zinc-500">Detayları Düzenle</p>
        </div>
      </div>

      {/* Amount Input */}
      <div className="bg-black/30 rounded-xl p-4">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2 block">MİKTAR (GRAM)</label>
        <Input
          type="number"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          className="bg-zinc-900 border-white/10 text-white text-lg font-display h-12"
        />
      </div>

      {/* Target Meal Select */}
      <div className="bg-black/30 rounded-xl p-4">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2 block">HEDEF ÖĞÜN</label>
        <Select value={targetMeal} onValueChange={setTargetMeal}>
          <SelectTrigger className="bg-zinc-900 border-white/10 text-white h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10">
            {meals.map((meal) => (
              <SelectItem key={meal.id} value={meal.id} className="text-white hover:bg-white/10">
                {meal.icon} {meal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calculated Macros Preview */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">HESAPLANAN DEĞERLER</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-lg font-display font-bold text-primary">{calculatedValues.cal}</p>
            <p className="text-[10px] text-zinc-500">KCAL</p>
          </div>
          <div>
            <p className="text-lg font-display font-bold text-yellow-500">{calculatedValues.protein}g</p>
            <p className="text-[10px] text-zinc-500">PROTEİN</p>
          </div>
          <div>
            <p className="text-lg font-display font-bold text-blue-500">{calculatedValues.carbs}g</p>
            <p className="text-[10px] text-zinc-500">KARB</p>
          </div>
          <div>
            <p className="text-lg font-display font-bold text-orange-500">{calculatedValues.fat}g</p>
            <p className="text-[10px] text-zinc-500">YAĞ</p>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={() => onConfirm(targetMeal, gramsNum)}
        className="w-full h-12 bg-primary text-primary-foreground font-display text-lg tracking-wider hover:bg-primary/90"
      >
        ÖĞÜNE EKLE
      </Button>
    </div>
  );
};

// --- ANA SAYFA ---
const Beslenme = () => {
  const [waterIntake, setWaterIntake] = useState(2.0);
  const [meals, setMeals] = useState<Meal[]>(initialMealData);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scannerMode, setScannerMode] = useState<ScannerMode>("meal");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<SelectedFood | null>(null);

  const waterGoal = 3.5;
  const progress = (waterIntake / waterGoal) * 100;

  const openMealScanner = () => {
    setScannerMode("meal");
    setShowCamera(true);
  };

  const openBarcodeScanner = () => {
    setScannerMode("barcode");
    setShowCamera(true);
  };

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

  // YENİ ÖZELLİK: Yiyecek Silme ve Kalori Hesaplama
  const handleRemoveFood = (mealId: string, foodIndex: number) => {
    setMeals((currentMeals) =>
      currentMeals.map((meal) => {
        if (meal.id !== mealId) return meal;

        // Silinecek yiyeceği çıkar
        const newFoods = meal.foods.filter((_, idx) => idx !== foodIndex);

        // Kalan yiyeceklere göre toplamları yeniden hesapla
        const newTotalCal = newFoods.reduce((acc, f) => acc + f.cal, 0);
        const newTotalMacros = newFoods.reduce(
          (acc, f) => ({
            p: acc.p + f.macros.p,
            c: acc.c + f.macros.c,
            f: acc.f + f.macros.f,
          }),
          { p: 0, c: 0, f: 0 },
        );

        return {
          ...meal,
          foods: newFoods,
          totalCal: newTotalCal,
          totalMacros: newTotalMacros,
        };
      }),
    );
    toast({ title: "Silindi 🗑️", description: "Yiyecek listeden kaldırıldı ve değerler güncellendi." });
  };

  // Select food for editing
  const handleSelectFood = (food: (typeof foodDatabase)[0]) => {
    setSelectedFood(food);
  };

  // Confirm add food with custom values
  const handleConfirmAddFood = (targetMealId: string, grams: number) => {
    if (!selectedFood) return;

    const ratio = grams / selectedFood.baseGrams;
    const newFood: FoodItem = {
      name: selectedFood.name,
      amount: `${grams}g`,
      cal: Math.round(selectedFood.cal * ratio),
      macros: {
        p: Math.round(selectedFood.macros.p * ratio),
        c: Math.round(selectedFood.macros.c * ratio),
        f: Math.round(selectedFood.macros.f * ratio),
      },
      isEaten: false,
    };

    setMeals((currentMeals) =>
      currentMeals.map((meal) => {
        if (meal.id !== targetMealId) return meal;

        return {
          ...meal,
          totalCal: meal.totalCal + newFood.cal,
          totalMacros: {
            p: meal.totalMacros.p + newFood.macros.p,
            c: meal.totalMacros.c + newFood.macros.c,
            f: meal.totalMacros.f + newFood.macros.f,
          },
          foods: [...meal.foods, newFood],
        };
      }),
    );

    const targetMeal = meals.find((m) => m.id === targetMealId);
    toast({
      title: "Eklendi ✅",
      description: `${selectedFood.name} ${targetMeal?.title || "öğüne"} eklendi.`,
    });

    setSelectedFood(null);
    setShowManualAdd(false);
  };

  const filteredFoods = foodDatabase.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-32">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-foreground uppercase font-display">Beslenme Planı</h1>
            <p className="text-muted-foreground text-sm">
              Hedefine {Math.max(0, macroGoals.calories - meals.reduce((acc, m) => acc + m.totalCal, 0))} kcal kaldı
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              onClick={openBarcodeScanner}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-10 w-10"
            >
              <ScanBarcode size={20} />
            </Button>
          </div>
        </div>

        {/* MACRO DASHBOARD - Below header, before action buttons */}
        <MacroDashboard meals={meals} />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={openMealScanner}
            className="flex items-center justify-center gap-2 bg-secondary border border-white/5 p-3 rounded-xl text-sm font-medium text-muted-foreground hover:border-primary/50 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4 text-primary" />
            Öğün Tara
          </button>
          <button
            onClick={() => setShowManualAdd(true)}
            className="flex items-center justify-center gap-2 bg-secondary border border-white/5 p-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-foreground" />
            Manuel Ekle
          </button>
        </div>
      </div>

      {/* WATER TRACKER */}
      <div className="bg-secondary border border-white/5 rounded-2xl p-5 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-foreground font-bold text-sm">SU TAKİBİ</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-display font-bold text-foreground">{waterIntake}L</span>
            <span className="text-muted-foreground text-sm">/{waterGoal}L</span>
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
        <h2 className="text-muted-foreground text-xs font-bold uppercase tracking-wider">BUGÜNKÜ ÖĞÜNLER</h2>
      </div>
      <div className="space-y-3 mb-6">
        {meals.map((meal) => (
          <ExpandableMealCard
            key={meal.id}
            meal={meal}
            onUpdateFood={handleToggleFood}
            onRemoveFood={handleRemoveFood}
          />
        ))}
      </div>

      {/* CAMERA SCANNER */}
      <CameraScanner isOpen={showCamera} onClose={() => setShowCamera(false)} mode={scannerMode} />

      {/* MANUAL ADD MODAL */}
      <Dialog
        open={showManualAdd}
        onOpenChange={(open) => {
          setShowManualAdd(open);
          if (!open) setSelectedFood(null);
        }}
      >
        <DialogContent className="bg-[#121212] border-white/10 text-white max-w-sm max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedFood ? "Detayları Düzenle" : "Yiyecek Ekle"}</DialogTitle>
          </DialogHeader>

          {!selectedFood ? (
            <>
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
                    onClick={() => handleSelectFood(food)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 transition-colors text-left group"
                  >
                    <div>
                      <p className="font-medium text-sm text-white">{food.name}</p>
                      <p className="text-xs text-zinc-500">
                        {food.amount} • {food.cal} kcal
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Plus className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <FoodDetailWizard
              food={selectedFood}
              meals={meals}
              onConfirm={handleConfirmAddFood}
              onBack={() => setSelectedFood(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Beslenme;
