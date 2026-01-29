import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { StoryCategory, CoachStory } from "@/types/shared-models";

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  category: StoryCategory;
  stories: CoachStory[];
  categoryIcon: React.ReactNode;
  categoryGradient: string;
}

const STORY_DURATION = 5000; // 5 seconds per story
const PROGRESS_INTERVAL = 50; // Update progress every 50ms

const StoryViewer = ({
  isOpen,
  onClose,
  category,
  stories,
  categoryIcon,
  categoryGradient,
}: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStory = stories[currentIndex];

  // Clear timer helper
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Go to next story
  const goNext = useCallback(() => {
    clearTimer();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      progressRef.current = 0;
    } else {
      // Last story finished, close viewer
      onClose();
    }
  }, [currentIndex, stories.length, onClose, clearTimer]);

  // Go to previous story
  const goPrev = useCallback(() => {
    clearTimer();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    // Always reset progress when going back
    setProgress(0);
    progressRef.current = 0;
  }, [currentIndex, clearTimer]);

  // Start/resume timer
  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      progressRef.current += (PROGRESS_INTERVAL / STORY_DURATION) * 100;
      
      if (progressRef.current >= 100) {
        goNext();
      } else {
        setProgress(progressRef.current);
      }
    }, PROGRESS_INTERVAL);
  }, [clearTimer, goNext]);

  // Handle timer based on pause state
  useEffect(() => {
    if (!isOpen) return;
    
    if (isPaused) {
      clearTimer();
    } else {
      startTimer();
    }

    return () => clearTimer();
  }, [isOpen, isPaused, currentIndex, startTimer, clearTimer]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setProgress(0);
      progressRef.current = 0;
      setIsPaused(false);
    }
  }, [isOpen]);

  // Handle tap zones
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const tapPosition = (clientX - rect.left) / rect.width;

    if (tapPosition < 0.5) {
      goPrev();
    } else {
      goNext();
    }
  };

  // Long press handlers
  const handlePressStart = () => {
    setIsPaused(true);
  };

  const handlePressEnd = () => {
    setIsPaused(false);
  };

  if (!isOpen || !currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black touch-none select-none"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onClick={handleTap}
      >
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
          {stories.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width:
                    idx < currentIndex
                      ? "100%"
                      : idx === currentIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-10 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${categoryGradient} flex items-center justify-center text-white shadow-lg`}
            >
              {categoryIcon}
            </div>
            <div>
              <p className="text-white font-display text-sm tracking-wide">
                {category.toUpperCase()}
              </p>
              <p className="text-white/60 text-xs">{currentStory.title}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 text-white/80 hover:text-white transition-colors z-30"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Story Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.img
            key={currentStory.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            src={currentStory.content.image}
            alt={currentStory.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Text Overlay */}
        <div className="absolute bottom-20 left-4 right-4 z-20">
          <motion.div
            key={currentStory.id + "-text"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4"
          >
            <p className="text-white text-sm leading-relaxed">
              {currentStory.content.text}
            </p>
          </motion.div>
        </div>

        {/* Pause indicator */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <div className="flex gap-1.5">
                  <div className="w-2 h-6 bg-white rounded-sm" />
                  <div className="w-2 h-6 bg-white rounded-sm" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer;
