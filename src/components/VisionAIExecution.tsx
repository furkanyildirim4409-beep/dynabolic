import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, Check, Activity, Target, Clock, Eye, EyeOff, Trophy } from "lucide-react";
import RestTimerOverlay from "./RestTimerOverlay";
import { toast } from "sonner";

interface VisionAIExecutionProps {
  workoutTitle: string;
  onClose: () => void;
}

interface Exercise {
  name: string;
  targetReps: number;
  tempo: string;
  sets: number;
  restDuration: number;
}

const exercises: Exercise[] = [
  { name: "BARBELL SQUAT", targetReps: 12, tempo: "3010", sets: 4, restDuration: 90 },
  { name: "LEG PRESS", targetReps: 15, tempo: "2010", sets: 4, restDuration: 75 },
  { name: "LEG CURL", targetReps: 12, tempo: "3011", sets: 4, restDuration: 60 },
  { name: "CALF RAISE", targetReps: 20, tempo: "2010", sets: 4, restDuration: 45 },
];

const VisionAIExecution = ({ workoutTitle, onClose }: VisionAIExecutionProps) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [visionAIActive, setVisionAIActive] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showWorkoutSummary, setShowWorkoutSummary] = useState(false);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  
  const exercise = exercises[currentExerciseIndex];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !showRestTimer) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, showRestTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const playSound = (type: 'confirm' | 'complete') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'confirm') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } else {
        // Victory sound for exercise complete
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
    } catch (e) {}
  };

  const handleConfirmSet = () => {
    setShowComplete(true);
    setIsRunning(false);
    playSound('confirm');

    // Check if this was the last set
    if (currentSet >= exercise.sets) {
      // Exercise complete!
      setExerciseComplete(true);
      playSound('complete');
      
      setTimeout(() => {
        setShowComplete(false);
        setExerciseComplete(false);
        
        // Check if there are more exercises
        if (currentExerciseIndex < exercises.length - 1) {
          toast.success("MÜKEMMEL! HAREKET TAMAMLANDI.", {
            description: "SIRADAKİNE GEÇİLİYOR...",
            duration: 2000,
          });
          
          // Move to next exercise
          setTimeout(() => {
            setCurrentExerciseIndex((prev) => prev + 1);
            setCurrentSet(1);
            setTimer(0);
            setReps(0);
            setWeight(60);
            setIsRunning(true);
          }, 1500);
        } else {
          // All exercises complete - show summary
          setShowWorkoutSummary(true);
        }
      }, 1500);
    } else {
      // More sets remaining, show rest timer
      setTimeout(() => {
        setShowComplete(false);
        setShowRestTimer(true);
      }, 1000);
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
    setTimer(0);
    setReps(0);
    setCurrentSet((prev) => prev + 1);
    setIsRunning(true);
  };

  const handleSkipRest = () => {
    setShowRestTimer(false);
    setTimer(0);
    setReps(0);
    setCurrentSet((prev) => prev + 1);
    setIsRunning(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background flex flex-col"
      >
        {/* Complete Flash Effect - Enhanced for exercise complete */}
        <AnimatePresence>
          {showComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 z-50 flex items-center justify-center ${
                exerciseComplete ? 'bg-primary/50' : 'bg-primary/30'
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: exerciseComplete ? [0, 1.2, 1] : 1 }}
                transition={{ duration: exerciseComplete ? 0.5 : 0.3 }}
                className={`rounded-full flex items-center justify-center ${
                  exerciseComplete ? 'w-32 h-32 bg-primary neon-glow' : 'w-24 h-24 bg-primary'
                }`}
              >
                {exerciseComplete ? (
                  <Trophy className="w-16 h-16 text-primary-foreground" />
                ) : (
                  <Check className="w-12 h-12 text-primary-foreground" />
                )}
              </motion.div>
              {exerciseComplete && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-1/3 font-display text-xl text-foreground tracking-wider"
                >
                  HAREKET TAMAMLANDI!
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workout Summary Overlay */}
        <AnimatePresence>
          {showWorkoutSummary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-24 h-24 rounded-full bg-primary neon-glow flex items-center justify-center mb-6"
              >
                <Trophy className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-3xl text-foreground mb-2"
              >
                ANTRENMAN TAMAMLANDI!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground text-center mb-8"
              >
                Harika iş çıkardın! Tüm hareketleri başarıyla tamamladın.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 w-full max-w-sm space-y-4 mb-8"
              >
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Toplam Hareket</span>
                  <span className="font-display text-lg text-foreground">{exercises.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Toplam Set</span>
                  <span className="font-display text-lg text-foreground">{exercises.reduce((acc, ex) => acc + ex.sets, 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Kazanılan Bio-Coin</span>
                  <span className="font-display text-lg text-primary">+150</span>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full max-w-sm py-4 bg-primary text-primary-foreground font-display text-lg tracking-wider rounded-xl neon-glow"
              >
                ANTRENMANI BİTİR
              </motion.button>
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
          {/* Video/GIF Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!visionAIActive ? (
              // Default: Exercise Video/GIF View
              <div className="relative w-full h-full">
                {/* Simulated Exercise Video Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background/80" />
                
                {/* Looping Animation Placeholder */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-32 h-32 mx-auto mb-4 rounded-full bg-secondary/50 border border-white/10 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="w-12 h-12 text-primary ml-1" />
                    </motion.div>
                    <p className="text-muted-foreground text-sm">Egzersiz Formu Görüntüsü</p>
                    <p className="text-muted-foreground/60 text-xs mt-1">Döngülü Video/GIF</p>
                  </div>
                </motion.div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 grid-pattern opacity-10" />
              </div>
            ) : (
              // Vision AI: Skeleton Tracking View
              <>
                <div className="absolute inset-0 grid-pattern opacity-20" />
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 200 300"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-[0_0_10px_hsl(var(--primary))]"
                  >
                    <circle cx="100" cy="40" r="15" />
                    <line x1="100" y1="55" x2="100" y2="130" />
                    <line x1="60" y1="70" x2="140" y2="70" />
                    <line x1="60" y1="70" x2="45" y2="110" />
                    <line x1="45" y1="110" x2="35" y2="150" />
                    <line x1="140" y1="70" x2="155" y2="110" />
                    <line x1="155" y1="110" x2="165" y2="150" />
                    <line x1="75" y1="130" x2="125" y2="130" />
                    <line x1="75" y1="130" x2="65" y2="190" />
                    <line x1="65" y1="190" x2="60" y2="260" />
                    <line x1="125" y1="130" x2="135" y2="190" />
                    <line x1="135" y1="190" x2="140" y2="260" />
                    {[
                      [60, 70], [140, 70], [45, 110], [155, 110],
                      [75, 130], [125, 130], [65, 190], [135, 190]
                    ].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="4" fill="hsl(var(--primary))" />
                    ))}
                  </g>
                </svg>
              </>
            )}
          </div>

          {/* Vision AI Toggle Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setVisionAIActive(!visionAIActive)}
            className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
              visionAIActive 
                ? "bg-primary/20 border-primary/50 text-primary" 
                : "bg-black/50 border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary"
            }`}
          >
            {visionAIActive ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
            <span className="text-[10px] font-display tracking-wider">
              VISION AI {visionAIActive ? "AÇIK" : "AÇ"} (BETA)
            </span>
          </motion.button>

          {/* HUD Data - Only visible when Vision AI is active */}
          <AnimatePresence>
            {visionAIActive && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="absolute top-4 left-4 space-y-2"
              >
                <div className="glass-card px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">HAREKET ARALIĞI</span>
                  </div>
                  <p className="font-display text-lg text-primary">%98</p>
                </div>

                <div className="glass-card px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3 text-stat-strain" />
                    <span className="text-xs text-muted-foreground">HIZ</span>
                  </div>
                  <p className="font-display text-lg text-stat-strain">0.45 m/sn</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Set Counter */}
          <div className="absolute top-16 right-4 glass-card px-3 py-2">
            <span className="text-xs text-muted-foreground">SET</span>
            <p className="font-display text-lg text-foreground">
              {currentSet}/{exercise.sets}
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

          {/* Confirm Set Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirmSet}
            disabled={reps === 0}
            className="w-full py-4 bg-primary text-primary-foreground font-display text-lg tracking-wider rounded-xl neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SETİ ONAYLA
          </motion.button>
        </div>
      </motion.div>

      {/* Rest Timer Overlay */}
      <AnimatePresence>
        {showRestTimer && (
          <RestTimerOverlay
            duration={exercise.restDuration}
            onComplete={handleRestComplete}
            onSkip={handleSkipRest}
            setNumber={currentSet}
            totalSets={exercise.sets}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default VisionAIExecution;
