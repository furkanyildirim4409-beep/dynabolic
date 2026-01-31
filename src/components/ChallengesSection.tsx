import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Plus, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ChallengeCard from "./ChallengeCard";
import CreateChallengeModal from "./CreateChallengeModal";
import ChallengeDetailModal from "./ChallengeDetailModal";
import ChallengeStreakBanner from "./ChallengeStreakBanner";
import { mockChallenges, Challenge } from "@/lib/challengeData";
import { hapticLight, hapticMedium, hapticSuccess } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";
import { useChallengeStreaks } from "@/hooks/useChallengeStreaks";

interface ChallengesSectionProps {
  athletes: Array<{
    id: string;
    name: string;
    avatar: string;
    bioCoins: number;
    volume: number;
    streak: number;
  }>;
}

type FilterType = "all" | "pending" | "active" | "completed";

const ChallengesSection = ({ athletes }: ChallengesSectionProps) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [challenges, setChallenges] = useState(mockChallenges);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  const { recordWin, recordLoss, calculateBonus, currentMilestone } = useChallengeStreaks();

  // Filter challenges
  const filteredChallenges = challenges.filter(ch => {
    if (filter === "all") return true;
    if (filter === "pending") return ch.status === "pending";
    if (filter === "active") return ch.status === "active";
    if (filter === "completed") return ch.status === "completed" || ch.status === "expired";
    return true;
  });

  // Count pending incoming challenges
  const pendingCount = challenges.filter(
    ch => ch.status === "pending" && ch.challengedId === "current"
  ).length;

  const handleAcceptChallenge = (id: string) => {
    setChallenges(prev => prev.map(ch => 
      ch.id === id ? { ...ch, status: "active" as const } : ch
    ));
    hapticSuccess();
    toast({
      title: "Meydan okuma kabul edildi! ⚔️",
      description: "Şimdi rakibini geçme zamanı!",
    });
  };

  const handleDeclineChallenge = (id: string) => {
    setChallenges(prev => prev.map(ch => 
      ch.id === id ? { ...ch, status: "declined" as const } : ch
    ));
    hapticMedium();
    toast({
      title: "Meydan okuma reddedildi",
      description: "Belki başka zaman...",
    });
  };

  // Simulate winning a challenge (for demo purposes)
  const handleSimulateWin = (challenge: Challenge) => {
    const bonus = calculateBonus(challenge.bioCoinsReward, 1);
    
    setChallenges(prev => prev.map(ch => 
      ch.id === challenge.id 
        ? { ...ch, status: "completed" as const, winnerId: "current", completedAt: new Date().toISOString() } 
        : ch
    ));
    
    recordWin(challenge.bioCoinsReward);
    hapticSuccess();
    
    toast({
      title: "Meydan Okuma Kazanıldı! 🏆",
      description: currentMilestone 
        ? `+${bonus.total} coin (${bonus.bonus} bonus dahil!)`
        : `+${challenge.bioCoinsReward} coin kazandın!`,
    });
  };

  const handleViewDetails = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg text-foreground tracking-wide">
              MEYDAN OKUMALAR
            </h2>
            {pendingCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-yellow-500 text-background text-xs font-bold flex items-center justify-center"
              >
                {pendingCount}
              </motion.span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => { hapticMedium(); setShowCreateModal(true); }}
            className="h-9 px-4 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Meydan Oku
          </Button>
        </div>

        {/* Challenge Streak Banner */}
        <ChallengeStreakBanner showDevTools={true} />

        {/* Filters */}
        <Tabs value={filter} onValueChange={(v) => { hapticLight(); setFilter(v as FilterType); }}>
          <TabsList className="w-full grid grid-cols-4 bg-secondary/50 border border-white/5">
            <TabsTrigger 
              value="all" 
              className="font-display text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Tümü
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="font-display text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
            >
              <Clock className="w-3 h-3" />
              Bekleyen
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-yellow-500 text-background text-[8px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="active"
              className="font-display text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
            >
              <Swords className="w-3 h-3" />
              Aktif
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="font-display text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
            >
              <CheckCircle className="w-3 h-3" />
              Biten
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Challenge List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredChallenges.length > 0 ? (
              filteredChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <ChallengeCard
                    challenge={challenge}
                    onAccept={handleAcceptChallenge}
                    onDecline={handleDeclineChallenge}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Swords className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm">
                  {filter === "pending" && "Bekleyen meydan okuman yok"}
                  {filter === "active" && "Aktif meydan okuman yok"}
                  {filter === "completed" && "Tamamlanan meydan okuman yok"}
                  {filter === "all" && "Henüz meydan okuman yok"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  İlk meydan okumayı başlat
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Summary */}
        {challenges.length > 0 && (
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="glass-card p-3 text-center">
              <p className="text-primary font-display text-xl">
                {challenges.filter(c => c.status === "active").length}
              </p>
              <p className="text-muted-foreground text-[10px]">AKTİF</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-emerald-400 font-display text-xl">
                {challenges.filter(c => c.status === "completed" && c.winnerId === "current").length}
              </p>
              <p className="text-muted-foreground text-[10px]">KAZANILAN</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-yellow-400 font-display text-xl">
                {challenges.reduce((sum, c) => 
                  c.status === "completed" && c.winnerId === "current" ? sum + c.bioCoinsReward : sum
                , 0)}
              </p>
              <p className="text-muted-foreground text-[10px]">KAZANILAN COİN</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Challenge Modal */}
      <CreateChallengeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        athletes={athletes}
      />

      {/* Challenge Detail Modal */}
      <ChallengeDetailModal
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        challenge={selectedChallenge}
        onAccept={handleAcceptChallenge}
        onDecline={handleDeclineChallenge}
      />
    </>
  );
};

export default ChallengesSection;
