import { motion } from "framer-motion";

interface DynabolicLogoProps {
  progress: number;
  isFilled: boolean;
}

export const DynabolicLogo = ({ progress, isFilled }: DynabolicLogoProps) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 md:w-64 md:h-64">
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
      {/* OUTER D SHAPE - The Outline */}
      <motion.path
        d="M 50 20 L 50 180 L 100 180 C 150 180 180 150 180 100 C 180 50 150 20 100 20 Z"
        stroke="#CCFF00"
        strokeWidth="6"
        fill={isFilled ? "rgba(204, 255, 0, 0.1)" : "transparent"}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* INNER TECH SEGMENTS */}
      <motion.path
        d="M 65 40 L 95 40 M 65 60 L 105 60 M 65 80 L 85 80 M 65 120 L 85 120 M 65 140 L 105 140 M 65 160 L 95 160"
        stroke="#CCFF00"
        strokeWidth="3"
        opacity={isFilled ? 0.8 : 0}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isFilled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* THE LIGHTNING BOLT (Negative Space / Core) */}
      <motion.path
        d="M 110 50 L 90 95 L 115 95 L 95 150 L 135 105 L 110 105 Z"
        fill="#CCFF00"
        stroke="#CCFF00"
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isFilled ? 1 : 0, scale: isFilled ? 1 : 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </g>
  </svg>
);

export default DynabolicLogo;
