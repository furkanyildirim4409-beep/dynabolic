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

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weight, setWeight] = useState("78.5");

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleAddWater = () => {
    toast({ title: "250ml Su Eklendi 💧", description: "Günlük hedefe yaklaşıyorsun!" });
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
    if (onOpenChat) {
      onOpenChat();
    } else {
      toast({ title: "Koç Bağlantısı", description: "Koç sohbetine yönlendiriliyorsunuz..." });
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
      {/* MASTER CONTAINER */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: forceHide ? 100 : 0,
          opacity: forceHide ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* 1. NAVIGATION PILL */}
        <nav className="bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-full px-4 h-[68px] flex items-center gap-1 shadow-2xl shadow-black/40">
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
                      "relative z-10 flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {/* Liquid Bubble - BEHIND content with z-[-1] */}
                    {isActive && (
                      <motion.div
                        layoutId="navBubble"
                        className="absolute inset-1 rounded-full bg-white/15 z-[-1]"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <motion.span
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={cn(isActive && "drop-shadow-[0_0_8px_hsl(68,100%,50%)]")}
                    >
                      {item.icon}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </LayoutGroup>
        </nav>

        {/* 2. FAB CONTAINER */}
        <div className="relative">
          <AnimatePresence>
            {isFabOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/60 backdrop-blur-sm z-10"
                  onClick={() => setIsFabOpen(false)}
                />

                {/* Menu Items - Clean Vertical Pop */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute bottom-20 right-0 flex flex-col gap-3 items-end min-w-[180px] z-20"
                >
                  {fabActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            delay: (fabActions.length - 1 - index) * 0.05,
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          },
                        },
                      }}
                      onClick={action.onClick}
                      className="group flex items-center gap-3 px-4 py-3 bg-[#121212] border border-white/10 rounded-full shadow-xl hover:bg-zinc-900 transition-colors"
                    >
                      <span className="text-foreground text-sm font-medium whitespace-nowrap group-hover:text-primary transition-colors">
                        {action.label}
                      </span>
                      <span className="text-primary bg-white/5 p-1 rounded-full">
                        {action.icon}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main + Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFabOpen(!isFabOpen)}
            className={cn(
              "relative z-30 h-[68px] w-[68px] rounded-full flex items-center justify-center shadow-lg transition-colors",
              isFabOpen
                ? "bg-zinc-800 text-white border border-white/10"
                : "bg-primary text-primary-foreground shadow-[0_0_25px_hsl(68_100%_50%/0.4)]"
            )}
          >
            <motion.div
              animate={{ rotate: isFabOpen ? 135 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Plus className="w-8 h-8" />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Weight Modal */}
      <Dialog open={showWeightModal} onOpenChange={setShowWeightModal}>
        <DialogContent className="bg-zinc-900 border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-foreground">AĞIRLIK GİRİŞİ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Scale className="w-12 h-12 mx-auto text-primary mb-4" />
              <p className="text-muted-foreground text-sm">Güncel ağırlığını gir</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-center text-3xl h-16 bg-zinc-800 border-white/10 text-white font-bold w-32"
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
