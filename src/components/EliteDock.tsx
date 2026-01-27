import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Dumbbell,
  Leaf,
  Globe,
  User,
  Plus,
  X,
  Droplets,
  Scale,
  MessageSquare,
  BookOpen,
  ChefHat,
} from "lucide-react";
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

  // FAB Actions (Functions kept same)
  const handleAddWater = () => {
    toast({ title: "250ml Su Eklendi 💧" });
    setIsFabOpen(false);
  };
  const handleLogWeight = () => {
    setShowWeightModal(true);
    setIsFabOpen(false);
  };
  const handleSaveWeight = () => {
    toast({ title: "Ağırlık Kaydedildi ⚖️", description: `Güncel ağırlığın: ${weight} kg` });
    setShowWeightModal(false);
  };
  const handleReportToCoach = () => {
    onOpenChat ? onOpenChat() : toast({ title: "Koç Bağlantısı" });
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
      <motion.div
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{
          y: forceHide ? 100 : 0,
          opacity: forceHide ? 0 : 1,
          x: "-50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-8 left-1/2 z-[9999] flex items-center gap-4 w-max pointer-events-none"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Navigation Pill */}
        <nav className="pointer-events-auto bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-full px-4 h-[68px] flex items-center gap-1 shadow-2xl shadow-black/40">
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
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navBubble"
                        className="absolute inset-1 rounded-full bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] z-0"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className={cn("relative z-10", isActive && "drop-shadow-[0_0_10px_hsl(68,100%,50%)]")}>
                      {item.icon}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </LayoutGroup>
        </nav>

        {/* Action FAB Container */}
        <div className="relative pointer-events-auto">
          {/* Actions Menu */}
          <AnimatePresence>
            {isFabOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[-1]"
                  onClick={() => setIsFabOpen(false)}
                />

                <motion.div className="absolute bottom-24 right-0 flex flex-col gap-3 min-w-[180px] z-10">
                  {fabActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      transition={{
                        delay: (fabActions.length - 1 - index) * 0.04,
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      onClick={() => {
                        playClickSound();
                        action.onClick();
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3",
                        "bg-[#121212]/95 backdrop-blur-xl rounded-full",
                        "border border-white/10",
                        "shadow-xl shadow-black/30",
                        "hover:bg-[#1a1a1a] hover:border-primary/30 transition-all",
                        "justify-end group",
                      )}
                    >
                      <span className="text-foreground text-sm font-medium whitespace-nowrap group-hover:text-primary transition-colors">
                        {action.label}
                      </span>
                      <span className="text-primary bg-white/5 p-1 rounded-full">{action.icon}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main FAB Button & BREATHING ANIMATION FIX */}
          <div className="relative flex items-center justify-center">
            {/* The "Breathing" Glow Effect (Arkadaki Nefes Alan Işık) */}
            {/* Kesilme olmaması için scale: [0.9, 1.1, 0.9] döngüsü kullanıldı */}
            {!isFabOpen && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/40 blur-md z-0"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut", // Bu ayar geçişi yumuşatır, sert kesilmeyi önler
                }}
              />
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound();
                setIsFabOpen(!isFabOpen);
              }}
              className={cn(
                "h-[68px] w-[68px] rounded-full flex items-center justify-center transition-all duration-200 z-20 relative",
                isFabOpen ? "bg-[#121212] border border-white/10" : "bg-primary shadow-[0_0_20px_rgba(204,255,0,0.5)]",
              )}
            >
              <motion.div
                animate={{ rotate: isFabOpen ? 135 : 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                <Plus className={cn("w-8 h-8 transition-colors", isFabOpen ? "text-white" : "text-black")} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Weight Modal */}
      <Dialog open={showWeightModal} onOpenChange={setShowWeightModal}>
        <DialogContent className="bg-zinc-900 border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">AĞIRLIK GİRİŞİ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Scale className="w-12 h-12 mx-auto text-primary mb-4" />
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-center text-2xl bg-zinc-800 border-white/10 h-16 text-white"
              />
              <span className="text-foreground text-xl">kg</span>
            </div>
            <Button onClick={handleSaveWeight} className="w-full bg-primary text-primary-foreground">
              KAYDET
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EliteDock;
