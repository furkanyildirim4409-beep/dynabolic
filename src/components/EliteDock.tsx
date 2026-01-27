import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Dumbbell, Leaf, Globe, User, Plus, X, Droplets, Scale, MessageSquare, BookOpen, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  { id: "profil", label: "Profil", icon: <User className="w-6 h-6" />, path: "/profil" },
];

const EliteDock = ({ forceHide = false, onOpenChat }: EliteDockProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // FAB State
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weight, setWeight] = useState("78.5");

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
    toast({
      title: "250ml Su Eklendi 💧",
      description: "Günlük hedefe yaklaşıyorsun!",
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
    navigate("/akademi");
    setIsFabOpen(false);
  };

  const handleOpenRecipes = () => {
    navigate("/tarifler");
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
      {/* Main Dock Assembly - Perfectly Centered, Always Visible */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: forceHide ? 100 : 0, 
          opacity: forceHide ? 0 : 1 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-[9999]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Element A: Navigation Pill - Always Full Width */}
        <motion.nav
          className={cn(
            "relative h-16 flex items-center px-3",
            "bg-[#121212]/95 backdrop-blur-xl",
            "border border-white/10 rounded-full",
            "shadow-2xl shadow-black/40"
          )}
        >
          <LayoutGroup>
            <div className="relative flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.button
                    key={item.id}
                    layout
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
    </>
  );
};

export default EliteDock;
