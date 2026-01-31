import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, SkipForward, Volume2, Plus } from "lucide-react";
import { hapticLight } from "@/lib/haptics";

interface RestTimerOverlayProps {
  duration: number; // in seconds
  onComplete: () => void;
  onSkip: () => void;
  setNumber: number;
  totalSets: number;
}

const RestTimerOverlay = ({
  duration,
  onComplete,
  onSkip,
  setNumber,
  totalSets,
}: RestTimerOverlayProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [totalDuration, setTotalDuration] = useState(duration);
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      // Play completion sound
      playSound(880, 0.2);
      setTimeout(() => playSound(1100, 0.15), 100);
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // Warning beeps at 3, 2, 1
        if (prev <= 4 && prev > 1) {
          playSound(600, 0.1);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const playSound = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Audio not supported
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAdd30Seconds = () => {
    hapticLight();
    setTimeLeft((prev) => prev + 30);
    setTotalDuration((prev) => prev + 30);
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
    >
      {/* Background Pulse */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 left-0 right-0 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-primary mb-2">
          <Timer className="w-5 h-5" />
          <span className="font-display text-sm tracking-wider">DİNLENME SÜRESİ</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Set {setNumber} / {totalSets} tamamlandı
        </p>
      </motion.div>

      {/* Circular Timer */}
      <div className="relative">
        {/* Outer Glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 60px hsl(var(--primary) / 0.3), 0 0 120px hsl(var(--primary) / 0.1)`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* SVG Circle */}
        <svg width="280" height="280" className="transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "linear" }}
            style={{
              filter: "drop-shadow(0 0 10px hsl(var(--primary) / 0.5))",
            }}
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-display text-6xl ${
              timeLeft <= 3 ? "text-destructive" : "text-foreground"
            }`}
            style={{
              textShadow: timeLeft <= 3 
                ? "0 0 20px hsl(var(--destructive) / 0.5)" 
                : "0 0 20px hsl(var(--primary) / 0.3)",
            }}
          >
            {formatTime(timeLeft)}
          </motion.span>
          <span className="text-muted-foreground text-sm mt-2">kalan süre</span>
        </div>
      </div>

      {/* +30 Seconds Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAdd30Seconds}
        className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary"
      >
        <Plus className="w-4 h-4" />
        <span className="font-display text-sm">+30 SANİYE</span>
      </motion.button>

      {/* Sound Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 flex items-center gap-2 text-muted-foreground"
      >
        <Volume2 className="w-4 h-4" />
        <span className="text-xs">Sesli uyarı aktif</span>
      </motion.div>

      {/* Skip Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSkip}
        className="absolute bottom-12 flex items-center gap-3 bg-secondary/80 hover:bg-secondary px-8 py-4 rounded-2xl border border-white/10 transition-colors"
      >
        <SkipForward className="w-5 h-5 text-primary" />
        <span className="font-display text-foreground tracking-wide">DİNLENMEYİ ATLA</span>
      </motion.button>

      {/* Next Set Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-32 text-center"
      >
        <p className="text-muted-foreground text-xs">Sıradaki:</p>
        <p className="text-foreground font-display text-sm">SET {setNumber + 1}</p>
      </motion.div>
    </motion.div>
  );
};

export default RestTimerOverlay;
