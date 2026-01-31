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
  const filteredChallenges = challenges.filter((ch) => {
    if (filter === "all") return true;
    if (filter === "pending") return ch.status === "pending";
    if (filter === "active") return ch.status === "active";
    if (filter === "completed") return ch.status === "completed" || ch.status === "expired";
    return true;
  });

  // Count pending incoming challenges
  const pendingCount = challenges.filter((ch) => ch.status === "pending" && ch.challengedId === "current").length;

  const handleAcceptChallenge = (id: string) => {
    setChallenges((prev) => prev.map((ch) => (ch.id === id ? { ...ch, status: "active" as const } : ch)));
    hapticSuccess();
    toast({
      title: "Meydan okuma kabul edildi! ⚔️",
      description: "Şimdi rakibini geçme zamanı!",
    });
  };

  const handleDeclineChallenge = (id: string) => {
    setChallenges((prev) => prev.map((ch) => (ch.id === id ? { ...ch, status: "declined" as const } : ch)));
    hapticMedium();
    toast({
      title: "Meydan okuma reddedildi",
      description: "Belki başka zaman...",
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
        className="flex flex-col space-y-4 pb-8" // Padding-bottom eklendi, iç scroll kaldırıldı
      >
        {/* Compact Header & Actions */}
        <div className="flex items-center justify-between shrink-0 px-1">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg text-foreground tracking-wide">MEYDAN OKUMALAR</h2>
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
            onClick={() => {
              hapticMedium();
              setShowCreateModal(true);
            }}
            className="h-9 px-4 bg-primary hover:bg-primary/90 font-display text-xs tracking-wider rounded-lg"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            MEYDAN OKU
          </Button>
        </div>

        {/* Challenge Streak Banner */}
        <div className="shrink-0">
          <ChallengeStreakBanner showDevTools={true} />
        </div>

        {/* Filters */}
        <div className="shrink-0 sticky top-0 z-10 -mx-4 px-4 py-2 bg-background/95 backdrop-blur-md border-b border-white/5">
          <Tabs
            value={filter}
            onValueChange={(v) => {
              hapticLight();
              setFilter(v as FilterType);
            }}
          >
            <TabsList className="w-full grid grid-cols-4 bg-secondary/50 border border-white/5 h-9 p-1">
              <TabsTrigger
                value="all"
                className="font-display text-[10px] h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Tümü
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="font-display text-[10px] h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
              >
                <Clock className="w-3 h-3" />
                Bekleyen
                {pendingCount > 0 && (
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 text-background text-[8px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="font-display text-[10px] h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
              >
                <Swords className="w-3 h-3" />
                Aktif
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="font-display text-[10px] h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Biten
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Challenge List - No internal scroll, flows naturally */}
        <div className="space-y-3 min-h-[300px]">
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
                className="text-center py-16 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5 mx-1"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Swords className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-foreground font-display text-lg mb-1">Hareket Yok</h3>
                <p className="text-muted-foreground text-sm max-w-[200px] mb-6">
                  {filter === "pending" && "Bekleyen meydan okuman yok"}
                  {filter === "active" && "Aktif meydan okuman yok"}
                  {filter === "completed" && "Tamamlanan meydan okuman yok"}
                  {filter === "all" && "Henüz hiç meydan okuma yapılmamış."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Meydan Oku
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Summary - Now flows at bottom */}
        {challenges.length > 0 && (
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="glass-card p-3 text-center border-white/5 bg-white/5">
              <p className="text-primary font-display text-xl">
                {challenges.filter((c) => c.status === "active").length}
              </p>
              <p className="text-muted-foreground text-[10px] font-medium tracking-wider">AKTİF</p>
            </div>
            <div className="glass-card p-3 text-center border-white/5 bg-white/5">
              <p className="text-emerald-400 font-display text-xl">
                {challenges.filter((c) => c.status === "completed" && c.winnerId === "current").length}
              </p>
              <p className="text-muted-foreground text-[10px] font-medium tracking-wider">KAZANILAN</p>
            </div>
            <div className="glass-card p-3 text-center border-white/5 bg-white/5">
              <p className="text-yellow-400 font-display text-xl">
                {challenges.reduce(
                  (sum, c) => (c.status === "completed" && c.winnerId === "current" ? sum + c.bioCoinsReward : sum),
                  0,
                )}
              </p>
              <p className="text-muted-foreground text-[10px] font-medium tracking-wider">COİN</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Challenge Modal */}
      <CreateChallengeModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} athletes={athletes} />

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
