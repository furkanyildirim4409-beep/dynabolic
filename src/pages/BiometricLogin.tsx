import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import IcosahedronBackground from "@/components/IcosahedronBackground";

type ScanState = "idle" | "scanning" | "identified" | "granted";

const BiometricLogin = () => {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const navigate = useNavigate();

  const playSound = useCallback((type: "scan" | "beep" | "success") => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "scan") {
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(2000, audioContext.currentTime + 2);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    } else if (type === "beep") {
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === "success") {
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.15);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  }, []);

  const handleScan = useCallback(() => {
    if (scanState !== "idle") return;

    setScanState("scanning");
    playSound("scan");

    setTimeout(() => {
      setScanState("identified");
      playSound("beep");
    }, 2000);

    setTimeout(() => {
      setScanState("granted");
      playSound("success");
    }, 3000);

    setTimeout(() => {
      navigate("/kokpit");
    }, 4000);
  }, [scanState, navigate, playSound]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern" />
      
      {/* 3D Icosahedron Background */}
      <IcosahedronBackground />

      {/* Scan Line Animation */}
      <AnimatePresence>
        {scanState === "scanning" && (
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "linear" }}
            className="absolute left-0 right-0 h-32 scan-line z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-6xl md:text-7xl tracking-[0.3em] text-foreground mb-2"
        >
          GOKALAF
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-muted-foreground text-sm tracking-[0.5em] uppercase mb-16"
        >
          Elit Sporcu Sistemi
        </motion.p>

        {/* Scan Button / Status */}
        <AnimatePresence mode="wait">
          {scanState === "idle" && (
            <motion.button
              key="scan-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScan}
              className="relative px-12 py-4 bg-primary/10 border border-primary/50 rounded-lg font-display text-lg tracking-widest text-primary neon-glow-sm hover:bg-primary/20 transition-all"
            >
              <span className="relative z-10">BİYO-KİMLİK TARA</span>
              
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-primary"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          )}

          {scanState === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="font-display text-xl tracking-[0.3em] text-primary text-neon-glow"
              >
                SPORCU TANIMLANIYOR...
              </motion.div>
              
              {/* Loading bar */}
              <div className="mt-6 w-64 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="h-full bg-primary neon-glow-sm"
                />
              </div>
            </motion.div>
          )}

          {(scanState === "identified" || scanState === "granted") && (
            <motion.div
              key="granted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl tracking-[0.3em] text-primary text-neon-glow"
              >
                ERİŞİM ONAYLANDI
              </motion.div>
              
              {/* Success indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
                className="mt-6 w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center neon-glow"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-primary/30" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-primary/30" />
    </div>
  );
};

export default BiometricLogin;
