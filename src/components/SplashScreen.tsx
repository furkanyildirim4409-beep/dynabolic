import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"drawing" | "activating" | "fading">("drawing");

  useEffect(() => {
    // Phase 1: Drawing (0-1s)
    const activationTimer = setTimeout(() => {
      setPhase("activating");
    }, 1000);

    // Phase 2: Activation complete, start fade (1.8s)
    const fadeTimer = setTimeout(() => {
      setPhase("fading");
    }, 1800);

    // Phase 3: Complete (2.3s) - shorter total time for mobile
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2300);

    return () => {
      clearTimeout(activationTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "fading" ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ willChange: "opacity" }}
    >
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        initial={{ scale: 1, opacity: 1 }}
        animate={{
          scale: phase === "fading" ? 1.5 : 1, // Reduced from 12x to 1.5x for mobile
          opacity: phase === "fading" ? 0 : 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        style={{ willChange: "transform, opacity" }}
      >
        {/* SIMPLIFIED LOGO - No heavy filters for mobile */}
        <div className="relative">
          <svg 
            viewBox="0 0 200 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-40 h-40 md:w-56 md:h-56"
            style={{ willChange: "transform" }}
          >
            {/* Outer D Shape */}
            <motion.path
              d="M 50 20 L 50 180 L 100 180 C 150 180 180 150 180 100 C 180 50 150 20 100 20 Z"
              stroke="#CCFF00"
              strokeWidth="5"
              fill="transparent"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                fill: phase !== "drawing" ? "rgba(204, 255, 0, 0.08)" : "transparent"
              }}
              transition={{
                pathLength: { duration: 1, ease: "easeInOut" },
                fill: { duration: 0.3 },
              }}
            />

            {/* Inner Tech Segments - simplified */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: phase !== "drawing" ? 0.7 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M 65 40 L 95 40" stroke="#CCFF00" strokeWidth="2" />
              <path d="M 65 60 L 105 60" stroke="#CCFF00" strokeWidth="2" />
              <path d="M 65 80 L 85 80" stroke="#CCFF00" strokeWidth="2" />
              <path d="M 65 120 L 85 120" stroke="#CCFF00" strokeWidth="2" />
              <path d="M 65 140 L 105 140" stroke="#CCFF00" strokeWidth="2" />
              <path d="M 65 160 L 95 160" stroke="#CCFF00" strokeWidth="2" />
            </motion.g>

            {/* Lightning Bolt - simplified spring */}
            <motion.path
              d="M 110 50 L 90 95 L 115 95 L 95 150 L 135 105 L 110 105 Z"
              fill="#CCFF00"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: phase !== "drawing" ? 1 : 0, 
                scale: phase !== "drawing" ? 1 : 0.8 
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
              style={{ transformOrigin: "center" }}
            />
          </svg>

          {/* Simple glow effect - no blur filter */}
          {phase === "activating" && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.4 }}
              style={{ 
                background: "radial-gradient(circle, rgba(204,255,0,0.3) 0%, transparent 70%)",
              }}
            />
          )}
        </div>

        {/* Text */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: phase !== "drawing" ? 1 : 0,
            y: phase !== "drawing" ? 0 : 15,
          }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-[0.25em] uppercase">
            DYNABOLIC
          </h1>
          <motion.div
            className="h-0.5 bg-[#CCFF00] mt-2 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: phase !== "drawing" ? "100%" : 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
          <p className="text-[#CCFF00]/80 text-xs font-mono mt-2 tracking-widest">
            SYSTEM READY
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
