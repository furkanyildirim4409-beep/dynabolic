import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DynabolicLogo } from "./DynabolicLogo";

interface SplashScreenProps {
  onComplete: () => void;
}

type Phase = "drawing" | "activating" | "zooming";

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<Phase>("drawing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phase 1: Drawing (0-1s)
    const drawInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(drawInterval);
          return 1;
        }
        return prev + 0.02;
      });
    }, 20);

    // Transition to activation phase at 1s
    const activationTimer = setTimeout(() => {
      setPhase("activating");
    }, 1000);

    // Transition to zoom phase at 1.8s
    const zoomTimer = setTimeout(() => {
      setPhase("zooming");
    }, 1800);

    // Complete at 2.5s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(drawInterval);
      clearTimeout(activationTimer);
      clearTimeout(zoomTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const isFilled = phase === "activating" || phase === "zooming";
  const isZooming = phase === "zooming";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Scan Line Effect during drawing */}
      {phase === "drawing" && (
        <motion.div
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 1, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent pointer-events-none"
        />
      )}

      {/* Main Content Container with Zoom Effect */}
      <motion.div
        animate={{
          scale: isZooming ? 50 : 1,
          opacity: isZooming ? 0 : 1,
        }}
        transition={{
          duration: 0.7,
          ease: "easeIn",
        }}
        className="flex flex-col items-center justify-center"
      >
        {/* Glow Effect Container */}
        <motion.div
          animate={{
            boxShadow: isFilled
              ? [
                  "0 0 20px rgba(204, 255, 0, 0.2)",
                  "0 0 60px rgba(204, 255, 0, 0.4)",
                  "0 0 20px rgba(204, 255, 0, 0.2)",
                ]
              : "none",
          }}
          transition={{
            duration: 0.8,
            repeat: isFilled && !isZooming ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="rounded-full p-4"
        >
          <DynabolicLogo progress={progress} isFilled={isFilled} />
        </motion.div>

        {/* Brand Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isFilled ? 1 : 0,
            y: isFilled ? 0 : 20,
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-3xl md:text-4xl tracking-[0.3em] text-primary mt-6 text-neon-glow"
        >
          DYNABOLIC
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: isFilled ? 0.6 : 0,
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-xs tracking-[0.5em] uppercase mt-2"
        >
          POWER UNLEASHED
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
