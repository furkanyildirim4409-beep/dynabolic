import { motion } from "framer-motion";
import { ArrowLeft, ChefHat, Flame, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { hapticLight } from "@/lib/haptics";

interface Recipe {
  id: number;
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  servings: number;
  ingredients: string[];
  thumbnail: string;
  difficulty: "Kolay" | "Orta" | "Zor";
}

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Yüksek Proteinli Yulaf",
    description: "Günün enerjik başlangıcı için ideal kahvaltı tarifi.",
    calories: 450,
    protein: 35,
    carbs: 55,
    fat: 12,
    prepTime: "10 dk",
    servings: 1,
    ingredients: ["Yulaf ezmesi", "Whey protein", "Muz", "Ceviz", "Tarçın", "Bal"],
    thumbnail: "🥣",
    difficulty: "Kolay"
  },
  {
    id: 2,
    title: "Somon & Kuşkonmaz",
    description: "Omega-3 zengini akşam yemeği. Kas yapımı için ideal.",
    calories: 600,
    protein: 45,
    carbs: 20,
    fat: 38,
    prepTime: "25 dk",
    servings: 2,
    ingredients: ["Somon fileto", "Kuşkonmaz", "Zeytinyağı", "Limon", "Sarımsak", "Dereotu"],
    thumbnail: "🐟",
    difficulty: "Orta"
  },
  {
    id: 3,
    title: "Protein Pankek",
    description: "Antrenman sonrası toparlanma için mükemmel atıştırmalık.",
    calories: 380,
    protein: 32,
    carbs: 40,
    fat: 8,
    prepTime: "15 dk",
    servings: 2,
    ingredients: ["Yulaf unu", "Whey protein", "Yumurta akı", "Muz", "Yaban mersini"],
    thumbnail: "🥞",
    difficulty: "Kolay"
  },
  {
    id: 4,
    title: "Tavuk Avokado Bowl",
    description: "Dengeli makrolar ve sağlıklı yağlar içeren öğle yemeği.",
    calories: 550,
    protein: 40,
    carbs: 35,
    fat: 28,
    prepTime: "20 dk",
    servings: 1,
    ingredients: ["Tavuk göğsü", "Avokado", "Kinoa", "Kiraz domates", "Ispanak", "Limon"],
    thumbnail: "🥗",
    difficulty: "Kolay"
  },
  {
    id: 5,
    title: "Post-Workout Shake",
    description: "Hızlı emilim için optimize edilmiş toparlanma içeceği.",
    calories: 420,
    protein: 45,
    carbs: 50,
    fat: 5,
    prepTime: "5 dk",
    servings: 1,
    ingredients: ["Whey izolat", "Muz", "Yulaf", "Badem sütü", "Bal", "Buz"],
    thumbnail: "🥤",
    difficulty: "Kolay"
  },
  {
    id: 6,
    title: "Biftek & Tatlı Patates",
    description: "Yoğun antrenman günleri için yüksek kalorili ana yemek.",
    calories: 750,
    protein: 55,
    carbs: 60,
    fat: 30,
    prepTime: "30 dk",
    servings: 2,
    ingredients: ["Dana biftek", "Tatlı patates", "Tereyağı", "Brokoli", "Sarımsak"],
    thumbnail: "🥩",
    difficulty: "Zor"
  }
];

const difficultyColors = {
  "Kolay": "bg-green-500/20 text-green-400 border-green-500/30",
  "Orta": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Zor": "bg-red-500/20 text-red-400 border-red-500/30"
};

const Tarifler = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="flex items-center gap-4 px-4 py-4 relative z-50">
          <button
            onClick={() => { hapticLight(); navigate(-1); }}
            className="relative z-50 flex items-center justify-center w-10 h-10 rounded-full bg-secondary/80 hover:bg-secondary active:scale-95 transition-all"
            aria-label="Geri Dön"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">TARİFLER</h1>
              <p className="text-xs text-muted-foreground">Performans mutfağı</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Featured Recipe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 overflow-hidden">
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                  <span className="text-7xl">🍳</span>
                </div>
              </AspectRatio>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    HAFTANIN TARİFİ
                  </span>
                  <Badge variant="outline" className={difficultyColors["Orta"]}>
                    Orta
                  </Badge>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mt-2">
                  Atlet Kahvaltı Tabağı
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Yumurta, avokado, somon ve tam buğday ekmek ile dolu dolu bir kahvaltı.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>650 kcal</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>20 dk</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>1 kişilik</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recipe Grid */}
        <div className="space-y-3">
          <h2 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Tüm Tarifler
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="bg-secondary/30 border-white/5 hover:border-primary/30 transition-all overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-28 h-28 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl">{recipe.thumbnail}</span>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={difficultyColors[recipe.difficulty]}>
                            {recipe.difficulty}
                          </Badge>
                        </div>
                        <h4 className="font-display font-bold text-foreground mt-1">
                          {recipe.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {recipe.description}
                        </p>
                        
                        {/* Macros */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-400" />
                            <span className="text-xs text-muted-foreground">{recipe.calories}</span>
                          </div>
                          <span className="text-xs text-primary font-medium">P:{recipe.protein}g</span>
                          <span className="text-xs text-blue-400 font-medium">C:{recipe.carbs}g</span>
                          <span className="text-xs text-yellow-400 font-medium">F:{recipe.fat}g</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ingredients Preview */}
                    <div className="px-4 pb-3 border-t border-white/5 mt-2 pt-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="text-foreground/60">Malzemeler:</span>{" "}
                        {recipe.ingredients.slice(0, 4).join(", ")}
                        {recipe.ingredients.length > 4 && "..."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tarifler;
