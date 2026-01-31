import { motion } from "framer-motion";
import { Swords, Clock, Trophy, Check, X, ChevronRight, Flame, Dumbbell } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Challenge, 
  getChallengeTypeIcon, 
  getChallengeTypeLabel,
  getStatusLabel,
  getStatusColor 
} from "@/lib/challengeData";
import { hapticLight, hapticMedium, hapticSuccess } from "@/lib/haptics";

interface ChallengeCardProps {
  challenge: Challenge;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onViewDetails?: (challenge: Challenge) => void;
}

const ChallengeCard = ({ challenge, onAccept, onDecline, onViewDetails }: ChallengeCardProps) => {
  const TypeIcon = getChallengeTypeIcon(challenge.type);
  const isIncoming = challenge.challengedId === "current" && challenge.status === "pending";
  const isActive = challenge.status === "active";
  const isCompleted = challenge.status === "completed";
  const isWinner = isCompleted && challenge.winnerId === "current";
  
  // Determine opponent (the other person in the challenge)
  const isChallenger = challenge.challengerId === "current";
  const opponent = isChallenger 
    ? { name: challenge.challengedName, avatar: challenge.challengedAvatar, value: challenge.challengedValue }
    : { name: challenge.challengerName, avatar: challenge.challengerAvatar, value: challenge.challengerValue };

  // Calculate days remaining
  const daysRemaining = Math.max(0, Math.ceil(
    (new Date(challenge.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  // Calculate progress for active challenges
  const progress = isActive && challenge.challengedValue 
    ? Math.min(100, (challenge.challengedValue / challenge.targetValue) * 100)
    : 0;

  const handleAccept = () => {
    hapticSuccess();
    onAccept?.(challenge.id);
  };

  const handleDecline = () => {
    hapticMedium();
    onDecline?.(challenge.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => { hapticLight(); onViewDetails?.(challenge); }}
      className={`glass-card p-4 cursor-pointer ${
        isIncoming ? "ring-2 ring-yellow-500/50" : ""
      } ${isWinner ? "ring-2 ring-emerald-500/50 bg-emerald-500/5" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            challenge.type === "pr" ? "bg-orange-500/20" : "bg-red-500/20"
          }`}>
            <TypeIcon className={`w-4 h-4 ${
              challenge.type === "pr" ? "text-orange-400" : "text-red-400"
            }`} />
          </div>
          <div>
            <p className="text-foreground text-sm font-medium">
              {getChallengeTypeLabel(challenge.type)}
            </p>
            {challenge.exercise && (
              <p className="text-muted-foreground text-xs">{challenge.exercise}</p>
            )}
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(challenge.status)}`}>
          {getStatusLabel(challenge.status)}
        </div>
      </div>

      {/* VS Display */}
      <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-3 mb-3">
        {/* You */}
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10 ring-2 ring-primary">
            <AvatarImage 
              src={isChallenger ? challenge.challengerAvatar : challenge.challengedAvatar} 
              alt="Sen" 
              className="object-cover" 
            />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">SEN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-foreground text-xs font-medium">Sen</p>
            <p className="text-primary font-display text-sm">
              {isChallenger ? challenge.challengerValue : (challenge.challengedValue || "—")}
              {challenge.type === "pr" ? "kg" : " gün"}
            </p>
          </div>
        </div>

        {/* VS Badge */}
        <div className="flex flex-col items-center">
          <Swords className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground text-[10px] mt-0.5">VS</span>
        </div>

        {/* Opponent */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-foreground text-xs font-medium">{opponent.name.split(" ")[0]}</p>
            <p className="text-orange-400 font-display text-sm">
              {opponent.value || challenge.targetValue}
              {challenge.type === "pr" ? "kg" : " gün"}
            </p>
          </div>
          <Avatar className="w-10 h-10 ring-2 ring-orange-500/50">
            <AvatarImage src={opponent.avatar} alt={opponent.name} className="object-cover" />
            <AvatarFallback className="bg-orange-500/20 text-orange-400 text-xs">
              {opponent.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Progress Bar (for active challenges) */}
      {isActive && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">İlerleme</span>
            <span className="text-primary font-medium">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-muted-foreground text-xs">
          {!isCompleted && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {daysRemaining} gün kaldı
            </span>
          )}
          <span className="flex items-center gap-1 text-yellow-400">
            <Trophy className="w-3 h-3" />
            {challenge.bioCoinsReward} coin
          </span>
        </div>

        {/* Action Buttons */}
        {isIncoming ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => { e.stopPropagation(); handleDecline(); }}
              className="h-8 px-3 border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <X className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              onClick={(e) => { e.stopPropagation(); handleAccept(); }}
              className="h-8 px-3 bg-primary hover:bg-primary/90"
            >
              <Check className="w-3 h-3 mr-1" />
              Kabul
            </Button>
          </div>
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Winner Badge */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-[10px] font-bold ${
            isWinner 
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
              : "bg-red-500/80 text-white"
          }`}
        >
          {isWinner ? "KAZANDIN! 🏆" : "KAYBETTİN"}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChallengeCard;
