import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Play, Pause, RotateCcw, Check, Activity, Target, Clock, Eye, EyeOff, Trophy, Info, History, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import RestTimerOverlay from "./RestTimerOverlay";
import ExerciseRestTimerOverlay from "./ExerciseRestTimerOverlay";
import ExerciseHistoryModal from "./ExerciseHistoryModal";
import { toast } from "sonner";
import { detailedExercises, assignedWorkouts } from "@/lib/mockData";
import { hapticLight, hapticMedium } from "@/lib/haptics";
import { useAchievements } from "@/hooks/useAchievements";

interface VisionAIExecutionProps {
  workoutTitle: string;
  onClose: () => void;
}

interface Exercise {
  id: string;
  name: string;
  targetReps: number;
  tempo: string;
  sets: number;
  reps: number;
  restDuration: number;
  rpe: number;
  notes?: string;
  category?: string;
  videoUrl?: string;
}

// RPE color coding helper
const getRPEColor = (rpe: number): { bg: string; text: string; border: string } => {
  if (rpe <= 5) return { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/50" };
  if (rpe <= 7) return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/50" };
  if (rpe <= 9) return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/50" };
  return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/50" };
};

// Filter exercises based on workout title
const getFilteredExercises = (workoutTitle: string): Exercise[] => {
  const workoutDef = assignedWorkouts.find(w => w.title === workoutTitle);
  
  if (workoutDef && workoutDef.categoryFilter && workoutDef.categoryFilter !== "rest") {
    const filtered = detailedExercises.filter(ex => ex.category === workoutDef.categoryFilter);
    return filtered.length > 0 ? filtered : detailedExercises;
  }
  
  return detailedExercises;
};

const VisionAIExecution = ({ workoutTitle, onClose }: VisionAIExecutionProps) => {
  const { triggerAchievement } = useAchievements();
  
  // Get filtered exercises based on workout title
  const exercises = getFilteredExercises(workoutTitle);
  
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [visionAIActive, setVisionAIActive] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showExerciseRestTimer, setShowExerciseRestTimer] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showWorkoutSummary, setShowWorkoutSummary] = useState(false);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [showExerciseHistory, setShowExerciseHistory] = useState(false);
  const [simulatedHeartRate, setSimulatedHeartRate] = useState(72);
  const [showVisionInfo, setShowVisionInfo] = useState(false);
  const [showRpeInfo, setShowRpeInfo] = useState(false);
  const [showHeartRateInfo, setShowHeartRateInfo] = useState(false);
  
  const exercise = exercises[currentExerciseIndex];
  const rpeColors = getRPEColor(exercise?.rpe || 5);

  // Simulated heart rate effect - varies based on workout intensity
  useEffect(() => {
    if (!isRunning) return;
    
    const baseHR = 72;
    const intensityBoost = exercise.rpe * 8; // Higher RPE = higher HR
    const setBoost = currentSet * 3; // HR increases with sets
    
    const interval = setInterval(() => {
      // Add some randomness to simulate real HR variation
      const variation = Math.random() * 10 - 5;
      const targetHR = baseHR + intensityBoost + setBoost + variation;
      setSimulatedHeartRate(Math.round(Math.min(Math.max(targetHR, 65), 185)));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isRunning, exercise.rpe, currentSet]);

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
          // Show exercise rest timer between exercises
          setShowExerciseRestTimer(true);
        } else {
          // All exercises complete - show summary and trigger achievements
          setShowWorkoutSummary(true);
          
          // Trigger workout completion achievements
          triggerAchievement("workout_complete");
          
          // Check if it's an early morning workout (before 6 AM)
          const hour = new Date().getHours();
          if (hour < 6) {
            triggerAchievement("early_workout");
          }
          
          // Check if using Vision AI
          if (visionAIActive) {
            triggerAchievement("vision_ai_workout");
          }
          
          // Check if heavy lift (100kg+)
          if (weight >= 100) {
            triggerAchievement("heavy_lift_100kg");
          }
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

  // Exercise rest timer handlers
  const handleExerciseRestComplete = () => {
    setShowExerciseRestTimer(false);
    setCurrentExerciseIndex((prev) => prev + 1);
    setCurrentSet(1);
    setTimer(0);
    setReps(0);
    setWeight(60);
    setIsRunning(true);
  };

  const handleExerciseRestSkip = () => {
    setShowExerciseRestTimer(false);
    setCurrentExerciseIndex((prev) => prev + 1);
    setCurrentSet(1);
    setTimer(0);
    setReps(0);
    setWeight(60);
    setIsRunning(true);
  };

  // Swipe navigation handlers
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipeEnd = (_: any, info: PanInfo) => {
    const threshold = 80;
    const velocity = 300;

    if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      // Swipe left -> next exercise
      if (currentExerciseIndex < exercises.length - 1) {
        hapticMedium();
        setSwipeDirection('left');
        goToExercise(currentExerciseIndex + 1);
      }
    } else if (info.offset.x > threshold || info.velocity.x > velocity) {
      // Swipe right -> previous exercise
      if (currentExerciseIndex > 0) {
        hapticMedium();
        setSwipeDirection('right');
        goToExercise(currentExerciseIndex - 1);
      }
    }
  };

  const goToExercise = (index: number) => {
    setCurrentExerciseIndex(index);
    setCurrentSet(1);
    setTimer(0);
    setReps(0);
    setWeight(60);
    setIsRunning(true);
    setTimeout(() => setSwipeDirection(null), 300);
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      hapticLight();
      setSwipeDirection('right');
      goToExercise(currentExerciseIndex - 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      hapticLight();
      setSwipeDirection('left');
      goToExercise(currentExerciseIndex + 1);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden touch-none"
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

        {/* Header - Mission Control with Heart Rate */}
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

          {/* Live Heart Rate Widget with Info Button */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowHeartRateInfo(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              </motion.div>
              <span className="font-display text-sm text-red-400 tabular-nums min-w-[32px]">
                {simulatedHeartRate}
              </span>
              <span className="text-[10px] text-red-400/70">bpm</span>
              <Info className="w-3 h-3 text-red-400/50 ml-0.5" />
            </motion.button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        {/* Exercise Progress Dots */}
        <div className="flex-shrink-0 flex items-center justify-center gap-1.5 py-2 bg-card/50">
          {exercises.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                hapticLight();
                setSwipeDirection(index > currentExerciseIndex ? 'left' : 'right');
                goToExercise(index);
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentExerciseIndex
                  ? 'w-6 bg-primary'
                  : index < currentExerciseIndex
                    ? 'w-1.5 bg-primary/50'
                    : 'w-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Vision Area - 55% height, clean canvas with swipe */}
        <motion.div 
          className="h-[55%] relative bg-black overflow-hidden touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleSwipeEnd}
        >
          {/* Swipe Hint Arrows */}
          <AnimatePresence>
            {currentExerciseIndex > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.6, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handlePrevExercise}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {currentExerciseIndex < exercises.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.6, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={handleNextExercise}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
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
                      className="w-24 h-24 mx-auto mb-3 rounded-full bg-secondary/50 border border-white/10 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="w-10 h-10 text-primary ml-1" />
                    </motion.div>
                    <p className="text-muted-foreground text-xs">Egzersiz Formu</p>
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

          {/* TOP LEFT: Vision AI Stats (only when active) */}
          <AnimatePresence>
            {visionAIActive && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="absolute top-3 left-3 flex gap-2"
              >
                <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="text-[9px] text-muted-foreground uppercase">ROM</span>
                  </div>
                  <p className="font-display text-base text-primary leading-none">98%</p>
                </div>

                <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Target className="w-3 h-3 text-stat-strain" />
                    <span className="text-[9px] text-muted-foreground uppercase">Hız</span>
                  </div>
                  <p className="font-display text-base text-stat-strain leading-none">0.45</p>
                </div>

                {/* Info Button for Vision AI Stats */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowVisionInfo(true)}
                  className="w-7 h-7 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center"
                >
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vision AI Info Modal */}
          <AnimatePresence>
            {showVisionInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setShowVisionInfo(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card border border-white/10 rounded-2xl p-4 max-w-xs w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg text-foreground">VİZYON AI METRİKLERİ</h3>
                    <button
                      onClick={() => setShowVisionInfo(false)}
                      className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* ROM Info */}
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="font-display text-sm text-primary">ROM (Hareket Açısı)</span>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed mb-2">
                        Eklem hareket açınızın yüzdelik ölçümü. Tam hareket açısı kas gelişimi için kritiktir.
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">İdeal:</span>
                        <span className="font-display text-primary">%95-100</span>
                      </div>
                    </div>

                    {/* Speed Info */}
                    <div className="bg-stat-strain/10 border border-stat-strain/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-stat-strain" />
                        <span className="font-display text-sm text-stat-strain">Hız (m/s)</span>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed mb-2">
                        Konsantrik faz hızı. Kontrollü ve sabit hız kas gerilimini maksimize eder.
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">İdeal:</span>
                        <span className="font-display text-stat-strain">0.5-0.65 m/s</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TOP RIGHT: Vision AI Toggle + Set Counter */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            {/* Vision AI Toggle Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setVisionAIActive(!visionAIActive)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                visionAIActive 
                  ? "bg-primary/20 border-primary/50 text-primary" 
                  : "bg-black/60 border-white/10 text-muted-foreground hover:border-primary/30"
              }`}
            >
              {visionAIActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="text-[9px] font-display tracking-wider">
                {visionAIActive ? "AI ON" : "AI"}
              </span>
            </motion.button>

            {/* Set Counter */}
            <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5 text-center">
              <span className="text-[9px] text-muted-foreground uppercase block">Set</span>
              <p className="font-display text-base text-foreground leading-none">
                {currentSet}/{exercise.sets}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info Panel - 45% height, no scroll */}
        <div className="h-[45%] bg-card border-t border-white/10 flex flex-col overflow-hidden">
          {/* Info Section - Fixed, no scroll */}
          <div className="flex-1 p-3 space-y-2 overflow-hidden">
            {/* Exercise Name + History */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg text-foreground tracking-wider leading-tight">
                  {exercise.name}
                </h2>
                <p className="text-muted-foreground text-[10px]">{workoutTitle}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExerciseHistory(true)}
                className="p-2 rounded-lg bg-secondary/50 border border-primary/30 hover:bg-primary/10 transition-colors"
                aria-label="Egzersiz Geçmişi"
              >
                <History className="w-4 h-4 text-primary" />
              </motion.button>
            </div>

            {/* RPE + Coach Target Row */}
            <div className="flex gap-2">
              {/* RPE Badge with Info Button */}
              <div className={`flex-1 ${rpeColors.bg} ${rpeColors.border} border rounded-xl px-3 py-2 relative`}>
                <div className="flex items-center gap-2">
                  <Target className={`w-4 h-4 ${rpeColors.text}`} />
                  <div className="flex-1">
                    <span className="text-[9px] text-muted-foreground block">HEDEF RPE</span>
                    <span className={`font-display text-lg ${rpeColors.text} leading-none`}>
                      {exercise.rpe}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowRpeInfo(true)}
                    className="w-6 h-6 rounded-md bg-black/30 flex items-center justify-center"
                  >
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </motion.button>
                </div>
              </div>

              {/* Coach Target */}
              <div className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[9px] text-primary tracking-wider">KOÇ HEDEFİ</span>
                </div>
                <p className="text-primary font-display text-sm leading-tight">
                  {exercise.targetReps}x @ {exercise.tempo}
                </p>
              </div>
            </div>

            {/* RPE Info Modal */}
            <AnimatePresence>
              {showRpeInfo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setShowRpeInfo(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-card border border-white/10 rounded-2xl p-4 max-w-xs w-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg text-foreground">RPE NEDİR?</h3>
                      <button
                        onClick={() => setShowRpeInfo(false)}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      RPE (Rate of Perceived Exertion), algılanan efor seviyesidir. 1-10 skalasında ölçülür.
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                        <span className="font-display text-lg text-green-400 w-8">1-5</span>
                        <div>
                          <p className="text-green-400 text-xs font-medium">Kolay - Orta</p>
                          <p className="text-muted-foreground text-[10px]">Isınma ve düşük yoğunluk</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <span className="font-display text-lg text-yellow-400 w-8">6-7</span>
                        <div>
                          <p className="text-yellow-400 text-xs font-medium">Zorlu</p>
                          <p className="text-muted-foreground text-[10px]">2-3 tekrar daha yapabilirsin</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                        <span className="font-display text-lg text-orange-400 w-8">8-9</span>
                        <div>
                          <p className="text-orange-400 text-xs font-medium">Çok Zorlu</p>
                          <p className="text-muted-foreground text-[10px]">1 tekrar daha yapabilirsin</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                        <span className="font-display text-lg text-red-400 w-8">10</span>
                        <div>
                          <p className="text-red-400 text-xs font-medium">Maksimum</p>
                          <p className="text-muted-foreground text-[10px]">Başarısızlığa kadar</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Heart Rate Info Modal */}
            <AnimatePresence>
              {showHeartRateInfo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setShowHeartRateInfo(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-card border border-white/10 rounded-2xl p-4 max-w-xs w-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                        <h3 className="font-display text-lg text-foreground">NABIZ REHBERİ</h3>
                      </div>
                      <button
                        onClick={() => setShowHeartRateInfo(false)}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="bg-secondary/50 rounded-xl p-3 mb-4">
                      <p className="text-muted-foreground text-xs mb-1">Yaşa Göre Max Nabız (220 - Yaş)</p>
                      <p className="text-foreground font-display text-xl">192 bpm</p>
                      <p className="text-muted-foreground text-[10px]">28 yaş için hesaplanmış</p>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      İdeal nabız aralığı antrenman tipine göre değişir:
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <div className="text-center w-20">
                          <span className="font-display text-sm text-blue-400">96-115</span>
                          <p className="text-[9px] text-blue-400/70">bpm</p>
                        </div>
                        <div>
                          <p className="text-blue-400 text-xs font-medium">Isınma (%50-60)</p>
                          <p className="text-muted-foreground text-[10px]">Düşük yoğunluk</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                        <div className="text-center w-20">
                          <span className="font-display text-sm text-green-400">115-134</span>
                          <p className="text-[9px] text-green-400/70">bpm</p>
                        </div>
                        <div>
                          <p className="text-green-400 text-xs font-medium">Yağ Yakımı (%60-70)</p>
                          <p className="text-muted-foreground text-[10px]">Orta yoğunluk</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <div className="text-center w-20">
                          <span className="font-display text-sm text-yellow-400">134-154</span>
                          <p className="text-[9px] text-yellow-400/70">bpm</p>
                        </div>
                        <div>
                          <p className="text-yellow-400 text-xs font-medium">Kardio (%70-80)</p>
                          <p className="text-muted-foreground text-[10px]">Yüksek yoğunluk</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                        <div className="text-center w-20">
                          <span className="font-display text-sm text-orange-400">154-173</span>
                          <p className="text-[9px] text-orange-400/70">bpm</p>
                        </div>
                        <div>
                          <p className="text-orange-400 text-xs font-medium">Anaerobik (%80-90)</p>
                          <p className="text-muted-foreground text-[10px]">Çok yüksek yoğunluk</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                        <div className="text-center w-20">
                          <span className="font-display text-sm text-red-400">173-192</span>
                          <p className="text-[9px] text-red-400/70">bpm</p>
                        </div>
                        <div>
                          <p className="text-red-400 text-xs font-medium">Maksimum (%90-100)</p>
                          <p className="text-muted-foreground text-[10px]">Tüm güç</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-2 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-primary text-[10px] text-center">
                        💡 Kuvvet antrenmanında nabız 120-160 bpm aralığında optimal performans sağlar
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Coach Notes - Compact Display */}
            {exercise.notes && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-2 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-100 text-[11px] leading-snug line-clamp-2">
                  {exercise.notes}
                </p>
              </div>
            )}
          </div>

          {/* Fixed Controls Section */}
          <div className="flex-shrink-0 p-3 pt-2 border-t border-white/5 space-y-3">
            {/* Mobile-Responsive Inputs - Grid Layout */}
            <div className="grid grid-cols-3 gap-2">
              {/* Weight Input */}
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground text-[9px] mb-1">KG</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setWeight((w) => Math.max(0, w - 2.5))}
                    className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground font-display text-base"
                  >
                    -
                  </button>
                  <div className="w-12 text-center">
                    <p className="font-display text-xl text-foreground leading-none">{weight}</p>
                  </div>
                  <button
                    onClick={() => setWeight((w) => w + 2.5)}
                    className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground font-display text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Timer - Center Column */}
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground text-[9px] mb-1">SÜRE</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center"
                  >
                    {isRunning ? <Pause className="w-3 h-3 text-foreground" /> : <Play className="w-3 h-3 text-foreground" />}
                  </button>
                  <div className="flex items-center">
                    <p className="font-display text-base text-foreground tracking-wider">{formatTime(timer)}</p>
                  </div>
                  <button
                    onClick={() => setTimer(0)}
                    className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center"
                  >
                    <RotateCcw className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Reps Input */}
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground text-[9px] mb-1">TEKRAR</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setReps((r) => Math.max(0, r - 1))}
                    className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground font-display text-base"
                  >
                    -
                  </button>
                  <div className="w-12 text-center">
                    <p className="font-display text-xl text-foreground leading-none">{reps}</p>
                  </div>
                  <button
                    onClick={() => setReps((r) => r + 1)}
                    className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground font-display text-base"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Set Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmSet}
              disabled={reps === 0}
              className="w-full py-3.5 bg-primary text-primary-foreground font-display text-base tracking-wider rounded-xl neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SETİ ONAYLA
            </motion.button>
          </div>
        </div>

      </motion.div>

      {/* Rest Timer Overlay (between sets) */}
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

      {/* Exercise Rest Timer Overlay (between exercises) */}
      <AnimatePresence>
        {showExerciseRestTimer && currentExerciseIndex < exercises.length - 1 && (
          <ExerciseRestTimerOverlay
            duration={90}
            onComplete={handleExerciseRestComplete}
            onSkip={handleExerciseRestSkip}
            completedExerciseName={exercise.name}
            nextExerciseName={exercises[currentExerciseIndex + 1].name}
            nextExerciseSets={exercises[currentExerciseIndex + 1].sets}
            nextExerciseReps={exercises[currentExerciseIndex + 1].reps}
            currentExerciseNumber={currentExerciseIndex + 1}
            totalExercises={exercises.length}
          />
        )}
      </AnimatePresence>

      {/* Exercise History Modal */}
      <ExerciseHistoryModal
        exerciseName={exercise.name}
        isOpen={showExerciseHistory}
        onClose={() => setShowExerciseHistory(false)}
      />
    </>
  );
};

export default VisionAIExecution;
