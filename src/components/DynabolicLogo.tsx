import React from "react";
import { motion } from "framer-motion";

// Dışarıdan className alabilmesi için interface
interface DynabolicLogoProps {
  className?: string;
}

const DynabolicLogo = ({ className }: DynabolicLogoProps) => {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#neon-glow)">
        {/* D HARFİ - DIŞ ÇİZGİ */}
        <motion.path
          d="M 50 20 L 50 180 L 100 180 C 150 180 180 150 180 100 C 180 50 150 20 100 20 Z"
          stroke="#CCFF00"
          strokeWidth="6"
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, fill: "rgba(204, 255, 0, 0)" }}
          animate={{
            pathLength: 1,
            fill: ["rgba(204, 255, 0, 0)", "rgba(204, 255, 0, 0)", "rgba(204, 255, 0, 0.1)"],
          }}
          transition={{
            pathLength: { duration: 1.2, ease: "easeInOut" },
            fill: { delay: 1.2, duration: 0.5 },
          }}
        />

        {/* İÇ SEGMENTLER */}
        <motion.path
          d="M 65 40 L 95 40 M 65 60 L 105 60 M 65 80 L 85 80 M 65 120 L 85 120 M 65 140 L 105 140 M 65 160 L 95 160"
          stroke="#CCFF00"
          strokeWidth="3"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        />

        {/* ŞİMŞEK ÇEKİRDEĞİ */}
        <motion.path
          d="M 110 50 L 90 95 L 115 95 L 95 150 L 135 105 L 110 105 Z"
          fill="#CCFF00"
          stroke="#CCFF00"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5, transformOrigin: "center" }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
        />
      </g>
    </svg>
  );
};

export default DynabolicLogo;
