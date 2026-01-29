import { motion } from "framer-motion";
import { Dumbbell, Play, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface DailyFocusCardProps {
  title?: string;
  coach?: string;
  duration?: string;
  progress?: number;
  type?: "workout" | "habit";
}

const DailyFocusCard = ({
  title = "BACAK GÜNÜ",
  coach = "Koç Serdar",
  duration = "45 dk",
  progress = 75,
  type = "workout",
}: DailyFocusCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-card-premium p-5 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-xs font-semibold text-primary tracking-wider">
          BUGÜNKÜ ODAK
        </span>
      </div>

      {/* Main Content */}
      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0 neon-glow-sm">
          <Dumbbell className="w-7 h-7 text-primary" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-xl text-foreground tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {coach} atadı
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">İlerleme</span>
              <span className="text-primary font-medium">{progress}% Tamamlandı</span>
            </div>
            <Progress value={progress} className="h-2 bg-secondary" />
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/antrenman")}
        className="w-full mt-5 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 neon-glow-sm"
      >
        <Play className="w-5 h-5" fill="currentColor" />
        ANTRENMANA BAŞLA
      </motion.button>
    </motion.div>
  );
};

export default DailyFocusCard;
