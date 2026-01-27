import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface CoachUplinkProps {
  coachName: string;
  status: "online" | "offline" | "busy";
  message: string;
  avatarUrl?: string;
}

const CoachUplink = ({ coachName, status, message }: CoachUplinkProps) => {
  const statusConfig = {
    online: { text: "ÇEVRİMİÇİ", color: "bg-primary", pulse: true },
    offline: { text: "ÇEVRİMDIŞI", color: "bg-muted-foreground", pulse: false },
    busy: { text: "MEŞGUL", color: "bg-alert-red", pulse: true },
  };

  const currentStatus = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-4"
    >
      {/* Header with pulse indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <div className={`w-2 h-2 rounded-full ${currentStatus.color}`} />
          {currentStatus.pulse && (
            <motion.div
              className={`absolute inset-0 rounded-full ${currentStatus.color}`}
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
        <span className="text-xs text-muted-foreground font-medium tracking-wider">
          KOÇ BAĞLANTISI
        </span>
      </div>

      <div className="flex items-start gap-4">
        {/* Hexagon Avatar */}
        <div className="relative flex-shrink-0">
          <svg width="56" height="64" viewBox="0 0 56 64" className="drop-shadow-lg">
            <defs>
              <clipPath id="hexagon-clip">
                <path d="M28 0L56 16V48L28 64L0 48V16L28 0Z" />
              </clipPath>
              <linearGradient id="hex-border" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Border */}
            <path
              d="M28 0L56 16V48L28 64L0 48V16L28 0Z"
              fill="none"
              stroke="url(#hex-border)"
              strokeWidth="2"
            />
            {/* Avatar Background */}
            <path
              d="M28 2L54 17V47L28 62L2 47V17L28 2Z"
              fill="hsl(var(--secondary))"
            />
            {/* Coach Initial */}
            <text
              x="28"
              y="38"
              textAnchor="middle"
              fill="hsl(var(--primary))"
              fontSize="20"
              fontFamily="Oswald"
              fontWeight="bold"
            >
              S
            </text>
          </svg>
          
          {/* Status indicator on avatar */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${currentStatus.color} border-2 border-background`}>
            {currentStatus.pulse && (
              <motion.div
                className={`absolute inset-0 rounded-full ${currentStatus.color}`}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
        </div>

        {/* Coach Info & Message */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-foreground tracking-wide">{coachName}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              status === "online" ? "bg-primary/20 text-primary" : 
              status === "busy" ? "bg-destructive/20 text-destructive" :
              "bg-muted text-muted-foreground"
            }`}>
              {currentStatus.text}
            </span>
          </div>
          
          {/* Message */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            "{message}"
          </p>
        </div>

        {/* Chat Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-primary" />
        </motion.button>
      </div>

      {/* Signal bars decoration */}
      <div className="absolute top-4 right-4 flex items-end gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <motion.div
            key={bar}
            className={`w-1 rounded-full ${bar <= 3 ? "bg-primary" : "bg-muted"}`}
            style={{ height: `${bar * 3 + 4}px` }}
            animate={bar <= 3 ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: bar * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CoachUplink;
