import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Dumbbell, Leaf, Globe, Plus, X, Droplets, Scale, MessageSquare, BookOpen, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import useScrollDirection from "@/hooks/useScrollDirection";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface EliteDockProps {
  forceHide?: boolean;
  onOpenChat?: () => void;
}

const navItems: NavItem[] = [
  { id: "kokpit", label: "Kokpit", icon: <LayoutGrid className="w-6 h-6" />, path: "/kokpit" },
  { id: "antrenman", label: "Antrenman", icon: <Dumbbell className="w-6 h-6" />, path: "/antrenman" },
  { id: "beslenme", label: "Beslenme", icon: <Leaf className="w-6 h-6" />, path: "/beslenme" },
  { id: "kesfet", label: "Keşfet", icon: <Globe className="w-6 h-6" />, path: "/kesfet" },
];

// Mock Data
const academyVideos = [
  { id: 1, title: "Squat Tekniği", duration: "12:45", thumbnail: "🏋️" },
  { id: 2, title: "Beslenme 101", duration: "18:30", thumbnail: "🥗" },
  { id: 3, title: "Uyku Bilimi", duration: "15:20", thumbnail: "😴" },
];

const recipes = [
  { id: 1, title: "Yulaf Lapası", calories: "450 kcal", emoji: "🥣" },
  { id: 2, title: "Somon Izgara", calories: "380 kcal", emoji: "🐟" },
  { id: 3, title: "Protein Pankek", calories: "320 kcal", emoji: "🥞" },
];

const EliteDock = ({ forceHide = false, onOpenChat }: EliteDockProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollDirection, isAtTop } = useScrollDirection({ threshold: 10 });
  
  // FAB State
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showAcademyModal, setShowAcademyModal] = useState(false);
  const [showRecipesModal, setShowRecipesModal] = useState(false);
  const [weight, setWeight] = useState("78.5");
  const [waterCount, setWaterCount] = useState(0);

  // Collapse when scrolling down (not at top)
  const isCollapsed = scrollDirection === "down" && !isAtTop;
  const shouldHide = forceHide;

  const handleNavClick = (path: string) => {
    playClickSound();
    navigate(path);
  };

  const playClickSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.05);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  // FAB Actions
  const handleAddWater = () => {
    const newCount = waterCount + 1;
    setWaterCount(newCount);
    toast({
      title: "250ml Su Eklendi 💧",
      description: `Bugün ${newCount * 250}ml su içtin!`,
    });
    setIsFabOpen(false);
  };

  const handleLogWeight = () => {
    setShowWeightModal(true);
    setIsFabOpen(false);
  };

  const handleSaveWeight = () => {
    toast({
      title: "Ağırlık Kaydedildi ⚖️",
      description: `Güncel ağırlığın: ${weight} kg`,
    });
    setShowWeightModal(false);
  };

  const handleReportToCoach = () => {
    if (onOpenChat) {
      onOpenChat();
    } else {
      toast({
        title: "Koç Bağlantısı",
        description: "Koç sohbetine yönlendiriliyorsunuz...",
      });
    }
    setIsFabOpen(false);
  };

  const handleOpenAcademy = () => {
    setShowAcademyModal(true);
    setIsFabOpen(false);
  };

  const handleOpenRecipes = () => {
    setShowRecipesModal(true);
    setIsFabOpen(false);
  };

  const fabActions = [
    { id: "water", label: "Su Ekle", icon: <Droplets className="w-5 h-5" />, onClick: handleAddWater },
    { id: "weight", label: "Ağırlık Gir", icon: <Scale className="w-5 h-5" />, onClick: handleLogWeight },
    { id: "coach", label: "Koça Raporla", icon: <MessageSquare className="w-5 h-5" />, onClick: handleReportToCoach },
    { id: "academy", label: "Akademi", icon: <BookOpen className="w-5 h-5" />, onClick: handleOpenAcademy },
    { id: "recipes", label: "Tarifler", icon: <ChefHat className="w-5 h-5" />, onClick: handleOpenRecipes },
  ];

  return (
    <>
      {/* Main Dock Assembly - Centered Container */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: shouldHide ? 100 : 0, 
          opacity: shouldHide ? 0 : 1 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-[9999]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Element A: Navigation Pill */}
        <motion.nav
          layout
          animate={{
            width: isCollapsed ? 64 : "auto",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className={cn(
            "relative h-16 flex items-center overflow-hidden",
            "bg-[#121212]/90 backdrop-blur-xl",
            "border border-white/10 rounded-full",
            "shadow-2xl shadow-black/40"
          )}
        >
          <LayoutGroup>
            <div className="relative flex items-center px-2">
              <AnimatePresence mode="popLayout">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  
                  // In collapsed mode, only show active icon
                  if (isCollapsed && !isActive) {
                    return null;
                  }
                  
                  return (
                    <motion.button
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      onClick={() => handleNavClick(item.path)}
                      className={cn(
                        "relative flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {/* Liquid Lens Background - Active State */}
                      {isActive && (
                        <motion.div
                          layoutId="navBubble"
                          className="absolute inset-1 rounded-full bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] z-0"
                          initial={false}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 30,
                            mass: 0.8
                          }}
                        />
                      )}
                      
                      {/* Icon */}
                      <motion.div
                        className="relative z-10"
                        animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <span className={cn(
                          isActive && "drop-shadow-[0_0_10px_hsl(68,100%,50%)]"
                        )}>
                          {item.icon}
                        </span>
                      </motion.div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        </motion.nav>

        {/* Element B: Floating Action Button */}
        <motion.div className="relative">
          {/* FAB Actions Menu */}
          <AnimatePresence>
            {isFabOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[-1]"
                  onClick={() => setIsFabOpen(false)}
                />
                
                {/* Action Items - Positioned Above FAB */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute bottom-20 right-0 flex flex-col gap-3"
                >
                  {fabActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, x: 20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.8 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => {
                        playClickSound();
                        action.onClick();
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3",
                        "bg-[#121212]/95 backdrop-blur-xl rounded-full",
                        "border border-white/10",
                        "shadow-xl shadow-black/30",
                        "hover:bg-[#1a1a1a] hover:border-primary/30 transition-all"
                      )}
                    >
                      <span className="text-primary">{action.icon}</span>
                      <span className="text-foreground text-sm font-medium whitespace-nowrap">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main FAB Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playClickSound();
              setIsFabOpen(!isFabOpen);
            }}
            className={cn(
              "relative h-16 w-16 rounded-full flex items-center justify-center",
              "transition-all duration-200",
              isFabOpen 
                ? "bg-[#121212]/90 backdrop-blur-xl border border-white/10" 
                : "bg-primary shadow-[0_0_25px_rgba(204,255,0,0.4)]"
            )}
          >
            <motion.div
              animate={{ rotate: isFabOpen ? 45 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {isFabOpen ? (
                <X className="w-7 h-7 text-foreground" />
              ) : (
                <Plus className="w-7 h-7 text-primary-foreground" />
              )}
            </motion.div>
            
            {/* Pulse ring when closed */}
            {!isFabOpen && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Weight Input Modal */}
      <Dialog open={showWeightModal} onOpenChange={setShowWeightModal}>
        <DialogContent className="bg-background border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-foreground">AĞIRLIK GİRİŞİ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Scale className="w-12 h-12 mx-auto text-primary mb-4" />
              <p className="text-muted-foreground text-sm">Güncel ağırlığını gir</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-center text-2xl font-display bg-secondary/50 border-white/10 h-16"
              />
              <span className="text-foreground font-display text-xl">kg</span>
            </div>
            <Button
              onClick={handleSaveWeight}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display"
            >
              KAYDET
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Academy Modal */}
      <Dialog open={showAcademyModal} onOpenChange={setShowAcademyModal}>
        <DialogContent className="bg-background border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              AKADEMİ
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-3">
              {academyVideos.map((video) => (
                <motion.button
                  key={video.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    toast({
                      title: `${video.title} Açılıyor`,
                      description: `Süre: ${video.duration}`,
                    });
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-secondary/50 rounded-xl border border-white/5 hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">
                    {video.thumbnail}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-foreground font-medium">{video.title}</h4>
                    <p className="text-muted-foreground text-sm">{video.duration}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">▶</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Recipes Modal */}
      <Dialog open={showRecipesModal} onOpenChange={setShowRecipesModal}>
        <DialogContent className="bg-background border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-foreground flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              TARİFLER
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-3">
              {recipes.map((recipe) => (
                <motion.button
                  key={recipe.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    toast({
                      title: `${recipe.title}`,
                      description: `Kalori: ${recipe.calories}`,
                    });
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-secondary/50 rounded-xl border border-white/5 hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">
                    {recipe.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-foreground font-medium">{recipe.title}</h4>
                    <p className="text-muted-foreground text-sm">{recipe.calories}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EliteDock;
