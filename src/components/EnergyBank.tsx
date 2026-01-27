import { motion } from "framer-motion";

interface EnergyBankProps {
  level: number;
  label: string;
  subtext: string;
}

const EnergyBank = ({ level, label, subtext }: EnergyBankProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center"
    >
      {/* Battery Container */}
      <div className="relative w-32 h-56">
        {/* Battery Cap */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-muted/50 rounded-t-lg border-2 border-b-0 border-primary/30" />
        
        {/* Main Battery Body */}
        <div className="relative w-full h-full rounded-3xl border-2 border-primary/40 bg-background/50 backdrop-blur-sm overflow-hidden">
          {/* Grid lines inside battery */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-primary/50"
                style={{ top: `${(i + 1) * 12}%` }}
              />
            ))}
          </div>
          
          {/* Liquid Fill */}
          <div 
            className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
            style={{ height: `${level}%` }}
          >
            {/* Wave Animation */}
            <svg
              className="absolute -top-4 left-0 w-full"
              viewBox="0 0 120 20"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,10 C20,20 40,0 60,10 C80,20 100,0 120,10 L120,20 L0,20 Z"
                fill="hsl(var(--primary))"
                animate={{
                  d: [
                    "M0,10 C20,20 40,0 60,10 C80,20 100,0 120,10 L120,20 L0,20 Z",
                    "M0,10 C20,0 40,20 60,10 C80,0 100,20 120,10 L120,20 L0,20 Z",
                    "M0,10 C20,20 40,0 60,10 C80,20 100,0 120,10 L120,20 L0,20 Z",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
            
            {/* Liquid Body with Gradient */}
            <div className="absolute inset-0 top-2 bg-gradient-to-t from-primary via-primary to-primary/80">
              {/* Bubbles */}
              <motion.div
                className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-primary-foreground/30"
                animate={{ y: [-10, -40], opacity: [1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="absolute bottom-8 right-6 w-3 h-3 rounded-full bg-primary-foreground/20"
                animate={{ y: [-10, -50], opacity: [1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-2 left-1/2 w-1.5 h-1.5 rounded-full bg-primary-foreground/25"
                animate={{ y: [-5, -30], opacity: [1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
              />
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/20 blur-xl" />
          </div>
          
          {/* Inner Glow */}
          <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_30px_rgba(204,255,0,0.15)]" />
        </div>
        
        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-3xl neon-glow-sm opacity-50" />
      </div>
      
      {/* Level Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="font-display text-5xl text-primary text-neon-glow">
          {level}%
        </p>
        <p className="font-display text-lg text-foreground mt-1 tracking-wider">
          {label}
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          {subtext}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EnergyBank;
