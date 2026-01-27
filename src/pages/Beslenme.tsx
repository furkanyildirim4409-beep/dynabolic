import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Sun, Moon, Apple, Droplets, Plus, List, Search, X, Check, Calendar } from "lucide-react";
import MacroDashboard from "@/components/MacroDashboard";
import NutriScanner from "@/components/NutriScanner";
import NutritionHistory from "@/components/NutritionHistory";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { foodDatabase, FoodItem } from "@/lib/mockData";

interface AddedFood extends FoodItem {
  quantity: number;
  meal: string;
}

const mealOptions = [
  { id: "breakfast", label: "Kahvaltı", icon: Coffee },
  { id: "lunch", label: "Öğle", icon: Sun },
  { id: "dinner", label: "Akşam", icon: Moon },
  { id: "snack", label: "Ara Öğün", icon: Apple },
];

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
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedFoods, setAddedFoods] = useState<AddedFood[]>([]);
  const [waterGlasses, setWaterGlasses] = useState(8);

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFood = () => {
    if (selectedFood) {
      const newFood: AddedFood = {
        ...selectedFood,
        quantity,
        meal: selectedMeal,
      };
      setAddedFoods(prev => [...prev, newFood]);
      setSelectedFood(null);
      setQuantity(1);
      setSearchQuery("");
    }
  };

  const handleAddWater = () => {
    setWaterGlasses(prev => Math.min(prev + 1, 12));
    toast({
      title: "Su Eklendi 💧",
      description: `Bugün ${(waterGlasses + 1) * 250}ml su içtin!`,
    });
  };

  // Calculate total added macros
  const totalAddedMacros = addedFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories * food.quantity,
      protein: acc.protein + food.protein * food.quantity,
      carbs: acc.carbs + food.carbs * food.quantity,
      fat: acc.fat + food.fat * food.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

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
    current: (waterGlasses * 0.25).toFixed(1),
    target: 3.5,
    glasses: waterGlasses,
  };

  return (
    <>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground">BESLENME</h1>
            <p className="text-muted-foreground text-sm">Nutri-Scan AI Takip Sistemi</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistory(true)}
            className="p-3 glass-card border border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <Calendar className="w-5 h-5 text-primary" />
          </motion.button>
        </div>

        {/* Macro Dashboard */}
        <MacroDashboard />

        {/* Scanner Buttons */}
        <div className="flex gap-3">
          <div className="flex-1">
            <NutriScanner />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsManualModalOpen(true)}
            className="glass-card p-4 flex items-center justify-center gap-2 border border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <List className="w-5 h-5 text-primary" />
            <span className="text-foreground text-sm font-medium">MANUEL EKLE</span>
          </motion.button>
        </div>

        {/* Added Foods Today */}
        {addedFoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm text-foreground tracking-wide">
                GÜNLÜK LİSTE
              </h3>
              <div className="flex items-center gap-2 text-primary text-xs">
                <span>{totalAddedMacros.calories} kcal</span>
                <span>|</span>
                <span>{totalAddedMacros.protein.toFixed(1)}g P</span>
              </div>
            </div>
            <div className="space-y-2">
              {addedFoods.map((food, index) => (
                <motion.div
                  key={`${food.id}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground text-xs font-medium">{food.name}</p>
                      <p className="text-muted-foreground text-[10px]">
                        {food.quantity}x {food.portion} • {mealOptions.find(m => m.id === food.meal)?.label}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground text-xs">{food.calories * food.quantity} kcal</p>
                    <p className="text-muted-foreground text-[10px]">{(food.protein * food.quantity).toFixed(1)}g prot</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Manual Food Entry Modal */}
        <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
          <DialogContent className="bg-background border-white/10 max-w-md max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="font-display text-lg text-foreground">MANUEL BESİN EKLE</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              {/* Meal Selector */}
              <div className="flex gap-2">
                {mealOptions.map((meal) => (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal.id)}
                    className={`flex-1 p-2 rounded-lg border transition-colors ${
                      selectedMeal === meal.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary/50 text-muted-foreground border-white/10 hover:bg-secondary"
                    }`}
                  >
                    <meal.icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[10px] block">{meal.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Besin ara... (örn: Tavuk Göğsü)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-white/10"
                />
              </div>

              {/* Food List or Selected Food */}
              {selectedFood ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-medium">{selectedFood.name}</h4>
                      <p className="text-muted-foreground text-xs">{selectedFood.portion}</p>
                    </div>
                    <button
                      onClick={() => setSelectedFood(null)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Macro Preview */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-secondary/50 p-2 rounded-lg">
                      <p className="text-foreground font-display text-sm">{selectedFood.calories * quantity}</p>
                      <p className="text-muted-foreground text-[10px]">kcal</p>
                    </div>
                    <div className="bg-secondary/50 p-2 rounded-lg">
                      <p className="text-stat-recovery font-display text-sm">{(selectedFood.protein * quantity).toFixed(1)}</p>
                      <p className="text-muted-foreground text-[10px]">Protein</p>
                    </div>
                    <div className="bg-secondary/50 p-2 rounded-lg">
                      <p className="text-stat-hrv font-display text-sm">{(selectedFood.carbs * quantity).toFixed(1)}</p>
                      <p className="text-muted-foreground text-[10px]">Karb</p>
                    </div>
                    <div className="bg-secondary/50 p-2 rounded-lg">
                      <p className="text-stat-strain font-display text-sm">{(selectedFood.fat * quantity).toFixed(1)}</p>
                      <p className="text-muted-foreground text-[10px]">Yağ</p>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm">Miktar:</span>
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="text-center w-16 bg-secondary/50 border-white/10"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10"
                      >
                        +
                      </Button>
                    </div>
                    <span className="text-muted-foreground text-sm">{selectedFood.portion}</span>
                  </div>

                  <Button
                    onClick={handleAddFood}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    LİSTEYE EKLE
                  </Button>
                </motion.div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {filteredFoods.map((food) => (
                    <motion.button
                      key={food.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedFood(food)}
                      className="w-full glass-card p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-foreground text-sm font-medium">{food.name}</p>
                        <p className="text-muted-foreground text-xs">{food.portion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-sm">{food.calories} kcal</p>
                        <p className="text-primary text-xs">{food.protein}g prot</p>
                      </div>
                    </motion.button>
                  ))}
                  {filteredFoods.length === 0 && searchQuery && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">"{searchQuery}" bulunamadı</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
              animate={{ width: `${(parseFloat(waterIntake.current) / waterIntake.target) * 100}%` }}
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
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddWater}
              className="w-8 h-8 rounded-lg bg-stat-strain/20 flex items-center justify-center hover:bg-stat-strain/30 transition-colors"
            >
              <Plus className="w-4 h-4 text-stat-strain" />
            </motion.button>
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

      {/* Nutrition History */}
      <NutritionHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
};

export default Beslenme;
