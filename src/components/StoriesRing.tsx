import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, HelpCircle, Trophy, Dumbbell, Zap } from "lucide-react";
import { coachStories } from "@/lib/mockData";
import type { StoryCategory, CoachStory } from "@/types/shared-models";
import StoryViewer from "./StoryViewer";

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

  const handleCategoryClick = (category: StoryCategory) => {
    setActiveCategory(category);
    setViewedCategories((prev) => new Set([...prev, category]));
  };

  const handleClose = () => {
    setActiveCategory(null);
  };

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

      {/* Story Viewer */}
      {activeCategory && (
        <StoryViewer
          isOpen={!!activeCategory}
          onClose={handleClose}
          category={activeCategory}
          stories={groupedStories[activeCategory]}
          categoryIcon={categoryConfig[activeCategory].icon}
          categoryGradient={categoryConfig[activeCategory].gradient}
        />
      )}
    </>
  );
};

export default StoriesRing;
