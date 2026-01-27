import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Droplets, Scale, MessageSquare } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuickActionFAB = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions: QuickAction[] = [
    {
      id: "water",
      label: "Su Ekle",
      icon: <Droplets className="w-5 h-5" />,
      onClick: () => console.log("Su eklendi"),
    },
    {
      id: "weight",
      label: "Ağırlık Gir",
      icon: <Scale className="w-5 h-5" />,
      onClick: () => console.log("Ağırlık girişi"),
    },
    {
      id: "coach",
      label: "Koça Raporla",
      icon: <MessageSquare className="w-5 h-5" />,
      onClick: () => console.log("Koça rapor"),
    },
  ];

  const playClickSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.08);
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleToggle = () => {
    playClickSound();
    setIsOpen(!isOpen);
  };

  const handleAction = (action: QuickAction) => {
    playClickSound();
    action.onClick();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 right-0 flex flex-col-reverse gap-3"
            >
              {actions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleAction(action)}
                  className="flex items-center gap-3 px-4 py-3 bg-secondary/90 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-secondary transition-colors"
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
        onClick={handleToggle}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          isOpen 
            ? "bg-muted border border-border" 
            : "bg-primary neon-glow"
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Plus className="w-6 h-6 text-primary-foreground" />
          )}
        </motion.div>
        
        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Label */}
      {!isOpen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -left-24 top-1/2 -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap"
        >
          HIZLI BAŞLAT
        </motion.p>
      )}
    </div>
  );
};

export default QuickActionFAB;
