import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DynabolicLogo from "./DynabolicLogo";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"drawing" | "activating" | "zooming">("drawing");

  useEffect(() => {
    // Mobil işlemciler için optimize edilmiş zamanlama
    const activationTimer = setTimeout(() => setPhase("activating"), 1000);
    const zoomTimer = setTimeout(() => setPhase("zooming"), 2200);
    const completeTimer = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(activationTimer);
      clearTimeout(zoomTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden touch-none"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        animate={
          phase === "zooming"
            ? { scale: 15, opacity: 0 } // Mobilde performans için scale 15 yeterli
            : { scale: 1, opacity: 1 }
        }
        transition={{
          duration: 0.8,
          ease: [0.64, 0, 0.78, 0],
        }}
        style={{ willChange: "transform, opacity" }}
      >
        {/* LOGO - Mobil/Masaüstü Boyut Ayarı */}
        <div className="relative p-4">
          <DynabolicLogo
            // className prop'u ile boyutları kontrol ediyoruz
            className={`w-32 h-32 md:w-64 md:h-64 drop-shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all duration-700 ${
              phase !== "drawing" ? "drop-shadow-[0_0_40px_rgba(204,255,0,0.6)]" : ""
            }`}
          />
        </div>

        {/* MARKA YAZISI */}
        <motion.div
          className="mt-8 md:mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: phase !== "drawing" ? 1 : 0,
            y: phase !== "drawing" ? 0 : 20,
          }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white tracking-[0.2em] md:tracking-[0.3em] uppercase">
            DYNABOLIC
          </h1>
          <motion.div
            className="h-0.5 bg-[#CCFF00] mt-2 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: phase !== "drawing" ? "100%" : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
