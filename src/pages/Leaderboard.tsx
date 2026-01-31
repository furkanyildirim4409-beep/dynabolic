import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, Flame, Dumbbell, Coins, ChevronLeft, Crown, Medal, Award, TrendingUp, Swords } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hapticLight, hapticMedium } from "@/lib/haptics";
import ChallengesSection from "@/components/ChallengesSection";

// Mock Turkish athlete data
const mockAthletes = [
  { id: "1", name: "Ahmet Yılmaz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", bioCoins: 8450, volume: 125000, streak: 45 },
  { id: "2", name: "Mehmet Demir", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", bioCoins: 7890, volume: 118500, streak: 38 },
  { id: "3", name: "Zeynep Kaya", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", bioCoins: 7200, volume: 95000, streak: 42 },
  { id: "4", name: "Burak Şahin", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", bioCoins: 6950, volume: 112000, streak: 35 },
  { id: "5", name: "Elif Çelik", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", bioCoins: 6700, volume: 88000, streak: 30 },
  { id: "6", name: "Oğuz Acar", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", bioCoins: 6200, volume: 105000, streak: 28 },
  { id: "7", name: "Selin Yıldız", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", bioCoins: 5980, volume: 92000, streak: 33 },
  { id: "8", name: "Emre Koç", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop", bioCoins: 5600, volume: 99000, streak: 25 },
  { id: "9", name: "Deniz Arslan", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", bioCoins: 5400, volume: 85000, streak: 27 },
  { id: "10", name: "Can Özdemir", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop", bioCoins: 5100, volume: 78000, streak: 22 },
  { id: "11", name: "Ayşe Polat", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", bioCoins: 4800, volume: 72000, streak: 20 },
  { id: "12", name: "Murat Kılıç", avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop", bioCoins: 4500, volume: 68000, streak: 19 },
  { id: "13", name: "Gizem Erdoğan", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop", bioCoins: 4200, volume: 65000, streak: 18 },
  { id: "current", name: "Ahmet Kaya", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop", bioCoins: 3950, volume: 62000, streak: 17, isCurrentUser: true },
  { id: "15", name: "Serkan Yalçın", avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=100&h=100&fit=crop", bioCoins: 3700, volume: 58000, streak: 15 },
  { id: "16", name: "Burcu Aksoy", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", bioCoins: 3500, volume: 55000, streak: 14 },
  { id: "17", name: "Tolga Güneş", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop", bioCoins: 3200, volume: 52000, streak: 12 },
  { id: "18", name: "Merve Aslan", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop", bioCoins: 2900, volume: 48000, streak: 10 },
  { id: "19", name: "Enes Korkmaz", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop", bioCoins: 2600, volume: 45000, streak: 8 },
  { id: "20", name: "İrem Bakır", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop", bioCoins: 2300, volume: 42000, streak: 6 },
];

type MetricType = "bioCoins" | "volume" | "streak";

const getMetricValue = (athlete: typeof mockAthletes[0], metric: MetricType) => {
  switch (metric) {
    case "bioCoins": return athlete.bioCoins;
    case "volume": return athlete.volume;
    case "streak": return athlete.streak;
  }
};

const formatMetricValue = (value: number, metric: MetricType) => {
  switch (metric) {
    case "bioCoins": return value.toLocaleString("tr-TR");
    case "volume": return `${(value / 1000).toFixed(0)}k kg`;
    case "streak": return `${value} gün`;
  }
};

const getMetricIcon = (metric: MetricType) => {
  switch (metric) {
    case "bioCoins": return Coins;
    case "volume": return Dumbbell;
    case "streak": return Flame;
  }
};

const getPodiumStyle = (rank: number) => {
  switch (rank) {
    case 1: return {
      size: "w-20 h-20",
      ring: "ring-4 ring-yellow-400",
      glow: "shadow-[0_0_30px_rgba(250,204,21,0.6)]",
      badge: "🥇",
      gradient: "from-yellow-400 via-yellow-500 to-amber-600",
      order: 2,
      height: "h-28",
    };
    case 2: return {
      size: "w-16 h-16",
      ring: "ring-3 ring-gray-300",
      glow: "shadow-[0_0_20px_rgba(156,163,175,0.5)]",
      badge: "🥈",
      gradient: "from-gray-300 via-gray-400 to-gray-500",
      order: 1,
      height: "h-20",
    };
    case 3: return {
      size: "w-16 h-16",
      ring: "ring-3 ring-amber-600",
      glow: "shadow-[0_0_20px_rgba(217,119,6,0.5)]",
      badge: "🥉",
      gradient: "from-amber-500 via-amber-600 to-amber-700",
      order: 3,
      height: "h-16",
    };
    default: return null;
  }
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [metric, setMetric] = useState<MetricType>("bioCoins");
  const [activeTab, setActiveTab] = useState<"leaderboard" | "challenges">("leaderboard");

  // Sort athletes by current metric
  const sortedAthletes = [...mockAthletes].sort((a, b) => 
    getMetricValue(b, metric) - getMetricValue(a, metric)
  );

  const top3 = sortedAthletes.slice(0, 3);
  const rest = sortedAthletes.slice(3);
  const currentUser = sortedAthletes.find(a => a.id === "current");
  const currentUserRank = sortedAthletes.findIndex(a => a.id === "current") + 1;

  const MetricIcon = getMetricIcon(metric);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4 relative z-50">
          <button 
            onClick={() => { hapticLight(); navigate(-1); }}
            className="relative z-50 flex items-center justify-center w-10 h-10 rounded-full bg-secondary/80 hover:bg-secondary active:scale-95 transition-all"
            aria-label="Geri Dön"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="font-display text-lg text-foreground tracking-wider">ATLET LİGİ</h1>
          <div className="w-10" />
        </div>

        {/* Main Tabs: Leaderboard vs Challenges */}
        <div className="px-4 pb-3">
          <Tabs value={activeTab} onValueChange={(v) => { hapticLight(); setActiveTab(v as "leaderboard" | "challenges"); }}>
            <TabsList className="w-full grid grid-cols-2 bg-secondary/50 border border-white/5">
              <TabsTrigger 
                value="leaderboard" 
                className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
              >
                <Trophy className="w-3 h-3" />
                SIRALAMA
              </TabsTrigger>
              <TabsTrigger 
                value="challenges"
                className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
              >
                <Swords className="w-3 h-3" />
                MEYDAN OKUMA
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="p-4 pb-32 space-y-6">
        {/* Challenges Tab */}
        {activeTab === "challenges" && (
          <ChallengesSection athletes={mockAthletes} />
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <>
            {/* Metric Tabs */}
            <Tabs value={metric} onValueChange={(v) => { hapticLight(); setMetric(v as MetricType); }}>
              <TabsList className="w-full grid grid-cols-3 bg-secondary/50 border border-white/5">
                <TabsTrigger 
                  value="bioCoins" 
                  className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
                >
                  <Coins className="w-3 h-3" />
                  BİO-COİN
                </TabsTrigger>
                <TabsTrigger 
                  value="volume"
                  className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
                >
                  <Dumbbell className="w-3 h-3" />
                  TONAJ
                </TabsTrigger>
                <TabsTrigger 
                  value="streak"
                  className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
                >
                  <Flame className="w-3 h-3" />
                  SERİ
                </TabsTrigger>
              </TabsList>
            </Tabs>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-display text-sm text-foreground tracking-wide">PODYUM</span>
          </div>

          <div className="flex items-end justify-center gap-4">
            {[2, 1, 3].map((position) => {
              const athlete = top3[position - 1];
              const style = getPodiumStyle(position);
              if (!athlete || !style) return null;

              return (
                <motion.div
                  key={athlete.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: position * 0.1 }}
                  className="flex flex-col items-center"
                  style={{ order: style.order }}
                >
                  {/* Avatar */}
                  <div className={`relative ${style.glow}`}>
                    <Avatar className={`${style.size} ${style.ring}`}>
                      <AvatarImage src={athlete.avatar} alt={athlete.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/20 text-primary font-display">
                        {athlete.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl">
                      {style.badge}
                    </div>
                  </div>

                  {/* Name */}
                  <p className="mt-4 text-foreground text-xs font-medium text-center max-w-16 truncate">
                    {athlete.name.split(" ")[0]}
                  </p>

                  {/* Score */}
                  <div className="flex items-center gap-1 mt-1">
                    <MetricIcon className="w-3 h-3 text-primary" />
                    <span className="font-display text-primary text-sm tabular-nums">
                      {formatMetricValue(getMetricValue(athlete, metric), metric)}
                    </span>
                  </div>

                  {/* Podium Base */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className={`mt-3 w-16 ${style.height} rounded-t-lg bg-gradient-to-b ${style.gradient} flex items-center justify-center`}
                  >
                    <span className="font-display text-2xl text-white/80">{position}</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Leaderboard List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 px-1">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Sıralama</span>
          </div>

          {rest.map((athlete, index) => {
            const rank = index + 4;
            const isCurrentUser = athlete.id === "current";

            return (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.03 }}
                className={`glass-card p-3 flex items-center gap-3 ${
                  isCurrentUser ? "ring-2 ring-primary/50 bg-primary/5" : ""
                }`}
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCurrentUser ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}>
                  <span className="font-display text-xs">#{rank}</span>
                </div>

                {/* Avatar */}
                <Avatar className="w-10 h-10">
                  <AvatarImage src={athlete.avatar} alt={athlete.name} className="object-cover" />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {athlete.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {athlete.name}
                    {isCurrentUser && <span className="text-primary ml-1">(Sen)</span>}
                  </p>
                  <div className="flex items-center gap-3 text-muted-foreground text-[10px]">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {athlete.bioCoins.toLocaleString("tr-TR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {athlete.streak} gün
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <MetricIcon className="w-3 h-3 text-primary" />
                    <span className="font-display text-sm text-primary tabular-nums">
                      {formatMetricValue(getMetricValue(athlete, metric), metric)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
            })}
          </motion.div>
          </>
        )}
      </div>

      {/* Fixed Bottom Bar - My Rank */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-white/10"
      >
        <div className="max-w-[430px] mx-auto p-4">
          <div className="flex items-center gap-4">
            {/* Rank Badge */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-display text-lg text-primary-foreground">#{currentUserRank}</span>
            </div>

            {/* Avatar */}
            <Avatar className="w-12 h-12 ring-2 ring-primary">
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} className="object-cover" />
              <AvatarFallback className="bg-primary/20 text-primary">AK</AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <p className="text-foreground font-display text-sm">SENİN SIRAN</p>
              <p className="text-muted-foreground text-xs">
                {metric === "bioCoins" && `${(getMetricValue(sortedAthletes[currentUserRank - 2], metric) - getMetricValue(currentUser!, metric)).toLocaleString("tr-TR")} coin ile #${currentUserRank - 1}'e yüksel`}
                {metric === "volume" && `${((getMetricValue(sortedAthletes[currentUserRank - 2], metric) - getMetricValue(currentUser!, metric)) / 1000).toFixed(0)}k kg ile #${currentUserRank - 1}'e yüksel`}
                {metric === "streak" && `${getMetricValue(sortedAthletes[currentUserRank - 2], metric) - getMetricValue(currentUser!, metric)} gün ile #${currentUserRank - 1}'e yüksel`}
              </p>
            </div>

            {/* Current Score */}
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <MetricIcon className="w-4 h-4 text-primary" />
                <span className="font-display text-lg text-primary tabular-nums">
                  {formatMetricValue(getMetricValue(currentUser!, metric), metric)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
