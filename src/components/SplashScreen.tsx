import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DynabolicLogo from "./DynabolicLogo"; // Logo bileşeninin doğru import edildiğinden emin ol

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"drawing" | "activating" | "zooming">("drawing");

  useEffect(() => {
    // 1. Faz: Çizim (0s - 1.2s arası)
    // Logo "DynabolicLogo" içindeki animasyonla çiziliyor.

    // 2. Faz: Aktivasyon (1.2s)
    // İç parçalar doluyor ve neon parlıyor
    const activationTimer = setTimeout(() => {
      setPhase("activating");
    }, 1200);

    // 3. Faz: Zoom (2.2s)
    // Kameraya doğru yaklaşma
    const zoomTimer = setTimeout(() => {
      setPhase("zooming");
    }, 2200);

    // 4. Bitiş (2.8s)
    // Ana ekrana geçiş.
    // NOT: Zoom animasyonu bitmeden hemen önce tetikleyerek "boşluk" hissini önlüyoruz.
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2700);

    return () => {
      clearTimeout(activationTimer);
      clearTimeout(zoomTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      // Exit animasyonu: Ana ekrana geçerken siyah ekran yavaşça kaybolur
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        // ÖNEMLİ DÜZELTME: scale: 50 yerine scale: 12 kullanıyoruz.
        // 12 kat büyüme ekranı kaplamak için yeterlidir ve kasmayı engeller.
        animate={phase === "zooming" ? { scale: 12, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.64, 0, 0.78, 0], // "Ease-in-expo" benzeri hızlı çıkış
        }}
        // GPU Hızlandırması için:
        style={{ willChange: "transform, opacity" }}
      >
        {/* LOGO BİLEŞENİ */}
        {/* progress prop'unu kaldırdık, Framer Motion kendi içinde hallediyor */}
        <div className="relative">
          <DynabolicLogo
            // Logo bileşenine prop göndererek içindeki animasyonu kontrol ediyoruz
            // Eğer senin DynabolicLogo bileşenin prop almıyorsa burayı düzenlememiz gerekebilir
            // Ancak standart SVG animasyonlarında class kontrolü yeterlidir.
            className={`w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all duration-700 ${
              phase !== "drawing" ? "drop-shadow-[0_0_50px_rgba(204,255,0,0.8)]" : ""
            }`}
          />

          {/* Şimşek Efekti (Logo ortasında ekstra parlama) */}
          <AnimatePresence>
            {phase === "activating" && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: 1.5 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white blur-xl rounded-full opacity-0"
                style={{ mixBlendMode: "overlay" }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* METİN ALANI */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: phase !== "drawing" ? 1 : 0,
            y: phase !== "drawing" ? 0 : 20,
          }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-[0.3em] uppercase">
            DYNABOLIC
          </h1>
          <motion.div
            className="h-0.5 bg-[#CCFF00] mt-2 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: phase !== "drawing" ? "100%" : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <p className="text-[#CCFF00] text-xs md:text-sm font-mono mt-2 tracking-widest opacity-80">
            SYSTEM INITIALIZED
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
