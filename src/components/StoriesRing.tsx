import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, RefreshCw, HelpCircle, Trophy, Dumbbell, Zap } from "lucide-react";
import { coachStories } from "@/lib/mockData";
import type { StoryCategory, CoachStory } from "@/types/shared-models";

interface StoriesRingProps {
  className?: string;
}

const categoryConfig: Record<StoryCategory, { icon: React.ReactNode; gradient: string }> = {
  "Değişimler": {
    icon: <RefreshCw className="w-5 h-5" />,
    gradient: "from-pink-500 to-rose-500",
  },
  "Soru-Cevap": {
    icon: <HelpCircle className="w-5 h-5" />,
    gradient: "from-blue-500 to-cyan-500",
  },
  "Başarılar": {
    icon: <Trophy className="w-5 h-5" />,
    gradient: "from-yellow-500 to-amber-500",
  },
  "Antrenman": {
    icon: <Dumbbell className="w-5 h-5" />,
    gradient: "from-green-500 to-emerald-500",
  },
  "Motivasyon": {
    icon: <Zap className="w-5 h-5" />,
    gradient: "from-purple-500 to-violet-500",
  },
};

// Group stories by category
const groupedStories = coachStories.reduce((acc, story) => {
  if (!acc[story.category]) {
    acc[story.category] = [];
  }
  acc[story.category].push(story);
  return acc;
}, {} as Record<StoryCategory, CoachStory[]>);

const categories = Object.keys(groupedStories) as StoryCategory[];

const StoriesRing = ({ className = "" }: StoriesRingProps) => {
  const [viewedCategories, setViewedCategories] = useState<Set<StoryCategory>>(new Set());
  const [activeCategory, setActiveCategory] = useState<StoryCategory | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleCategoryClick = (category: StoryCategory) => {
    setActiveCategory(category);
    setActiveStoryIndex(0);
    setProgress(0);
    setViewedCategories((prev) => new Set([...prev, category]));
  };

  const handleClose = () => {
    setActiveCategory(null);
    setActiveStoryIndex(0);
    setProgress(0);
  };

  const handleNext = () => {
    if (!activeCategory) return;
    const stories = groupedStories[activeCategory];
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const currentStory = activeCategory ? groupedStories[activeCategory][activeStoryIndex] : null;

  return (
    <>
      {/* Stories Ring */}
      <div className={`overflow-x-auto scrollbar-hide ${className}`}>
        <div className="flex gap-3 px-1 py-2">
          {categories.map((category, index) => {
            const config = categoryConfig[category];
            const isViewed = viewedCategories.has(category);

            return (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCategoryClick(category)}
                className="flex flex-col items-center gap-1.5 min-w-[72px]"
              >
                {/* Ring */}
                <div
                  className={`p-0.5 rounded-full ${
                    isViewed
                      ? "bg-muted/50"
                      : "bg-gradient-to-tr from-primary via-primary/80 to-primary neon-glow-sm"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white`}
                  >
                    {config.icon}
                  </div>
                </div>
                {/* Label */}
                <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[72px]">
                  {category}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {activeCategory && currentStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black"
          >
            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
              {groupedStories[activeCategory].map((_, idx) => (
                <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: idx < activeStoryIndex ? "100%" : "0%" }}
                    animate={{
                      width:
                        idx < activeStoryIndex
                          ? "100%"
                          : idx === activeStoryIndex
                          ? "100%"
                          : "0%",
                    }}
                    transition={
                      idx === activeStoryIndex
                        ? { duration: 5, ease: "linear" }
                        : { duration: 0 }
                    }
                    onAnimationComplete={() => {
                      if (idx === activeStoryIndex) {
                        handleNext();
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-10 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${categoryConfig[activeCategory].gradient} flex items-center justify-center text-white`}
                >
                  {categoryConfig[activeCategory].icon}
                </div>
                <div>
                  <p className="text-white font-display text-sm">{activeCategory.toUpperCase()}</p>
                  <p className="text-white/60 text-xs">{currentStory.title}</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Story Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.img
                key={currentStory.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                src={currentStory.content.image}
                alt={currentStory.title}
                className="w-full h-full object-cover"
              />
              {/* Text Overlay */}
              <div className="absolute bottom-24 left-4 right-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-4 bg-black/60"
                >
                  <p className="text-white text-sm leading-relaxed">{currentStory.content.text}</p>
                </motion.div>
              </div>
            </div>

            {/* Navigation Zones */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-20 bottom-20 w-1/3 z-10"
              aria-label="Previous"
            />
            <button
              onClick={handleNext}
              className="absolute right-0 top-20 bottom-20 w-1/3 z-10"
              aria-label="Next"
            />

            {/* Navigation Arrows (visual hint) */}
            {activeStoryIndex > 0 && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <ChevronLeft className="w-8 h-8 text-white/40" />
              </div>
            )}
            {activeStoryIndex < groupedStories[activeCategory].length - 1 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <ChevronRight className="w-8 h-8 text-white/40" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoriesRing;
