import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, Check, Activity, Target, Clock } from "lucide-react";

interface VisionAIExecutionProps {
  workoutTitle: string;
  onClose: () => void;
}

interface Exercise {
  name: string;
  targetReps: number;
  tempo: string;
  sets: number;
  currentSet: number;
}

const VisionAIExecution = ({ workoutTitle, onClose }: VisionAIExecutionProps) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  
  const exercise: Exercise = {
    name: "BARBELL SQUAT",
    targetReps: 12,
    tempo: "3010",
    sets: 4,
    currentSet: 2,
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCompleteSet = () => {
    setShowComplete(true);
    setIsRunning(false);
    setTimeout(() => {
      setShowComplete(false);
      setTimer(0);
      setReps(0);
      setIsRunning(true);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Complete Flash Effect */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-primary/30 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 rounded-full bg-primary flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-primary-foreground" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Mission Control */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-display text-sm text-foreground tracking-wider">
            GÖREV KONTROL: CANLI
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Vision Area - Top Half */}
      <div className="flex-1 relative bg-black overflow-hidden">
        {/* Video Placeholder with Grid */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Skeleton Overlay */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 300"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Neon Green Skeleton */}
          <g
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            className="drop-shadow-[0_0_10px_hsl(var(--primary))]"
          >
            {/* Head */}
            <circle cx="100" cy="40" r="15" />
            {/* Spine */}
            <line x1="100" y1="55" x2="100" y2="130" />
            {/* Shoulders */}
            <line x1="60" y1="70" x2="140" y2="70" />
            {/* Left Arm */}
            <line x1="60" y1="70" x2="45" y2="110" />
            <line x1="45" y1="110" x2="35" y2="150" />
            {/* Right Arm */}
            <line x1="140" y1="70" x2="155" y2="110" />
            <line x1="155" y1="110" x2="165" y2="150" />
            {/* Hips */}
            <line x1="75" y1="130" x2="125" y2="130" />
            {/* Left Leg */}
            <line x1="75" y1="130" x2="65" y2="190" />
            <line x1="65" y1="190" x2="60" y2="260" />
            {/* Right Leg */}
            <line x1="125" y1="130" x2="135" y2="190" />
            <line x1="135" y1="190" x2="140" y2="260" />
            {/* Joints */}
            {[
              [60, 70], [140, 70], [45, 110], [155, 110],
              [75, 130], [125, 130], [65, 190], [135, 190]
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" fill="hsl(var(--primary))" />
            ))}
          </g>
        </svg>

        {/* HUD Data - Floating Text */}
        <div className="absolute top-4 left-4 space-y-2">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">HAREKET ARALIĞI</span>
            </div>
            <p className="font-display text-lg text-primary">%98</p>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-stat-strain" />
              <span className="text-xs text-muted-foreground">HIZ</span>
            </div>
            <p className="font-display text-lg text-stat-strain">0.45 m/sn</p>
          </motion.div>
        </div>

        {/* Set Counter */}
        <div className="absolute top-4 right-4 glass-card px-3 py-2">
          <span className="text-xs text-muted-foreground">SET</span>
          <p className="font-display text-lg text-foreground">
            {exercise.currentSet}/{exercise.sets}
          </p>
        </div>

        {/* Coach Overlay */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-[10px] text-yellow-500 font-medium tracking-wider">
              KOÇ HEDEFİ
            </span>
          </div>
          <p className="text-yellow-500 font-display text-sm tracking-wide">
            {exercise.targetReps} Tekrar @ {exercise.tempo} Tempo
          </p>
        </motion.div>
      </div>

      {/* Controls - Bottom Half */}
      <div className="bg-card border-t border-white/10 p-4 space-y-4">
        {/* Exercise Name */}
        <div className="text-center">
          <h2 className="font-display text-xl text-foreground tracking-wider">
            {exercise.name}
          </h2>
          <p className="text-muted-foreground text-xs">{workoutTitle}</p>
        </div>

        {/* Inputs Row */}
        <div className="flex items-center justify-center gap-6">
          {/* Weight Input */}
          <div className="text-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeight((w) => Math.max(0, w - 2.5))}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground font-display"
              >
                -
              </button>
              <div className="w-20">
                <p className="font-display text-3xl text-foreground">{weight}</p>
                <p className="text-muted-foreground text-xs">KG</p>
              </div>
              <button
                onClick={() => setWeight((w) => w + 2.5)}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground font-display"
              >
                +
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-white/10" />

          {/* Reps Input */}
          <div className="text-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReps((r) => Math.max(0, r - 1))}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground font-display"
              >
                -
              </button>
              <div className="w-20">
                <p className="font-display text-3xl text-foreground">{reps}</p>
                <p className="text-muted-foreground text-xs">TEKRAR</p>
              </div>
              <button
                onClick={() => setReps((r) => r + 1)}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground font-display"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"
          >
            {isRunning ? (
              <Pause className="w-4 h-4 text-foreground" />
            ) : (
              <Play className="w-4 h-4 text-foreground" />
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <p className="font-display text-2xl text-foreground tracking-widest">
              {formatTime(timer)}
            </p>
          </div>

          <button
            onClick={() => setTimer(0)}
            className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Complete Set Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCompleteSet}
          className="w-full py-4 bg-primary text-primary-foreground font-display text-lg tracking-wider rounded-xl neon-glow"
        >
          SETİ BİTİR
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VisionAIExecution;
