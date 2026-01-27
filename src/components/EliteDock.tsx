import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Dumbbell, Leaf, Globe, User, Plus, X, Droplets, Scale, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import useScrollDirection from "@/hooks/useScrollDirection";
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
  { id: "kokpit", label: "Kokpit", icon: <LayoutGrid className="w-5 h-5" />, path: "/kokpit" },
  { id: "antrenman", label: "Antrenman", icon: <Dumbbell className="w-5 h-5" />, path: "/antrenman" },
  { id: "beslenme", label: "Beslenme", icon: <Leaf className="w-5 h-5" />, path: "/beslenme" },
  { id: "kesfet", label: "Keşfet", icon: <Globe className="w-5 h-5" />, path: "/kesfet" },
  { id: "profil", label: "Profil", icon: <User className="w-5 h-5" />, path: "/profil" },
];

const EliteDock = ({ forceHide = false, onOpenChat }: EliteDockProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollDirection, isAtTop } = useScrollDirection({ threshold: 10 });
  
  // FAB State
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weight, setWeight] = useState("78.5");
  const [waterCount, setWaterCount] = useState(0);

  // Collapse when scrolling down (not at top)
  const isCollapsed = scrollDirection === "down" && !isAtTop;
  const shouldHide = forceHide;

  const activeIndex = navItems.findIndex(item => item.path === location.pathname);

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

  const fabActions = [
    { id: "water", label: "Su Ekle", icon: <Droplets className="w-5 h-5" />, onClick: handleAddWater },
    { id: "weight", label: "Ağırlık Gir", icon: <Scale className="w-5 h-5" />, onClick: handleLogWeight },
    { id: "coach", label: "Koça Raporla", icon: <MessageSquare className="w-5 h-5" />, onClick: handleReportToCoach },
  ];

  return (
    <>
      {/* Main Dock Container */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: shouldHide ? 100 : 0, 
          opacity: shouldHide ? 0 : 1 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-[9999]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Navigation Pill */}
        <motion.nav
          layout
          animate={{
            width: isCollapsed ? 60 : "auto",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className={cn(
            "relative flex items-center justify-center overflow-hidden",
            "bg-[#121212]/80 backdrop-blur-2xl",
            "border border-white/10 rounded-full",
            "shadow-2xl shadow-black/40"
          )}
        >
          <div className="flex items-center px-2 py-2">
            <AnimatePresence mode="popLayout">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const showInCollapsed = isActive || index === activeIndex;
                
                // In collapsed mode, only show active icon
                if (isCollapsed && !showInCollapsed) {
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
                      "relative flex items-center justify-center p-3 rounded-full transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {/* Liquid Lens Background - Active State */}
                    {isActive && (
                      <motion.div
                        layoutId="liquid-lens"
                        className={cn(
                          "absolute inset-0 rounded-full",
                          "bg-white/10",
                          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                        )}
                        initial={false}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 30,
                          mass: 0.8
                        }}
                      />
                    )}
                    
                    {/* Icon */}
                    <motion.div
                      className="relative z-10"
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <span className={cn(
                        isActive && "text-primary drop-shadow-[0_0_8px_hsl(68,100%,50%)]"
                      )}>
                        {item.icon}
                      </span>
                    </motion.div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.nav>

        {/* Floating Action Button */}
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
                
                {/* Action Items */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-16 right-0 flex flex-col-reverse gap-3"
                >
                  {fabActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, x: 20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        playClickSound();
                        action.onClick();
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3",
                        "bg-[#121212]/90 backdrop-blur-xl rounded-full",
                        "border border-white/10",
                        "shadow-xl shadow-black/30",
                        "hover:bg-[#1a1a1a] transition-colors"
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playClickSound();
              setIsFabOpen(!isFabOpen);
            }}
            className={cn(
              "relative w-14 h-14 rounded-full flex items-center justify-center",
              "shadow-lg shadow-black/30",
              "transition-all duration-200",
              isFabOpen 
                ? "bg-[#121212]/80 backdrop-blur-2xl border border-white/10" 
                : "bg-primary"
            )}
          >
            <motion.div
              animate={{ rotate: isFabOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isFabOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Plus className="w-6 h-6 text-primary-foreground" />
              )}
            </motion.div>
            
            {/* Pulse ring when closed */}
            {!isFabOpen && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
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
