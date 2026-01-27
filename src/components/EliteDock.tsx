import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Dumbbell, Leaf, Play, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { id: "kokpit", label: "Kokpit", icon: <LayoutGrid className="w-5 h-5" />, path: "/kokpit" },
  { id: "antrenman", label: "Antrenman", icon: <Dumbbell className="w-5 h-5" />, path: "/antrenman" },
  { id: "beslenme", label: "Beslenme", icon: <Leaf className="w-5 h-5" />, path: "/beslenme" },
  { id: "akademi", label: "Akademi", icon: <Play className="w-5 h-5" />, path: "/akademi" },
  { id: "profil", label: "Profil", icon: <User className="w-5 h-5" />, path: "/profil" },
];

const EliteDock = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    // Play sci-fi click sound
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
    
    navigate(path);
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-40px)] max-w-[400px]"
    >
      <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border-t border-white/10 px-2 py-3">
        {/* Subtle top glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active glow reflection */}
                {isActive && (
                  <motion.div
                    layoutId="dock-glow"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-4 dock-reflection rounded-full blur-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                
                {/* Icon with glow effect when active */}
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "relative z-10",
                    isActive && "drop-shadow-[0_0_8px_hsl(68,100%,50%)]"
                  )}
                >
                  {item.icon}
                </motion.div>
                
                {/* Label */}
                <span className={cn(
                  "text-[10px] font-medium uppercase tracking-wider",
                  isActive && "text-neon-glow"
                )}>
                  {item.label}
                </span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary neon-glow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default EliteDock;
