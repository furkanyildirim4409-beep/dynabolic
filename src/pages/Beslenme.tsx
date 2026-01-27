import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

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

// 2. THE COMPONENT (Interactive Card)
const ExpandableMealCard = ({ meal }: { meal: (typeof mealData)[0] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div layout className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden mb-3">
      {/* Header (Always Visible) - Click to Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Icon Box */}
          <div className={cn("w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl", meal.color)}>
            {meal.icon}
          </div>

          {/* Titles */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-sm">{meal.title}</h3>
              {meal.isCompleted && <CheckCircle2 className="w-3 h-3 text-[#ccff00]" />}
            </div>
            <p className="text-zinc-500 text-xs">{meal.time}</p>
          </div>
        </div>

        {/* Right Side Stats */}
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

      {/* Expanded Content (The Meal Plan) */}
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

// 3. RENDER (Use this inside your Main View)
// <div className="space-y-1">
//   {mealData.map((meal) => (
//     <ExpandableMealCard key={meal.id} meal={meal} />
//   ))}
// </div>
