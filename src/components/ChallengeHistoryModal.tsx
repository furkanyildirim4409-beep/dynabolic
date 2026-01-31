import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Swords, Flame, Calendar, TrendingUp, X } from "lucide-react";
import { motion } from "framer-motion";

interface ChallengeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: {
    id: string;
    name: string;
    avatar: string;
    challengeWins: number;
    winStreak: number;
  } | null;
}

const ChallengeHistoryModal = ({ isOpen, onClose, athlete }: ChallengeHistoryModalProps) => {
  if (!athlete) return null;

  // Mock geçmiş verisi - Gerçek veriye bağlanabilir
  const history = [
    { id: 1, opponent: "Can Özdemir", result: "win", score: "125 vs 110", date: "28 Oca", type: "Push-up" },
    { id: 2, opponent: "Merve Aslan", result: "win", score: "140 vs 135", date: "25 Oca", type: "Squat" },
    { id: 3, opponent: "Burak Şahin", result: "loss", score: "90 vs 95", date: "20 Oca", type: "Plank" },
    { id: 4, opponent: "Elif Çelik", result: "win", score: "200 vs 180", date: "15 Oca", type: "Pull-up" },
    { id: 5, opponent: "Ahmet Yılmaz", result: "loss", score: "110 vs 120", date: "10 Oca", type: "Burpee" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-md max-h-[85vh] p-0 bg-[#0a0a0a] border-white/10 gap-0 overflow-hidden rounded-2xl">
        {/* Header - Sabit Kısım */}
        <DialogHeader className="p-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent relative">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-primary/20 shadow-xl">
                <AvatarImage src={athlete.avatar} alt={athlete.name} className="object-cover" />
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-display">
                  {athlete.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {athlete.winStreak > 2 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-2 -right-2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1"
                >
                  <Flame className="w-3 h-3 fill-black" />
                  {athlete.winStreak}
                </motion.div>
              )}
            </div>

            <div className="text-center space-y-1">
              <DialogTitle className="font-display text-xl tracking-wide text-foreground">{athlete.name}</DialogTitle>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">DÜELLO GEÇMİŞİ</p>
            </div>

            <div className="flex items-center gap-3 w-full justify-center">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 py-1 px-3">
                <Trophy className="w-3.5 h-3.5" />
                {athlete.challengeWins} Zafer
              </Badge>
              <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10 gap-1.5 py-1 px-3">
                <Swords className="w-3.5 h-3.5" />
                {history.length} Maç
              </Badge>
            </div>
          </div>

          {/* Kapat Butonu - Sağ Üst */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-black/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Kapat</span>
          </button>
        </DialogHeader>

        {/* Scrollable Content - Kaydırılabilir Kısım */}
        <div className="overflow-y-auto overscroll-contain p-4 space-y-4 max-h-[50vh]">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Son Karşılaşmalar
            </span>
          </div>

          <div className="space-y-2">
            {history.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      match.result === "win" ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {match.result === "win" ? <TrendingUp className="w-5 h-5" /> : <Swords className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">vs {match.opponent}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {match.type} • {match.date}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-display text-sm ${match.result === "win" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {match.result === "win" ? "KAZANDI" : "KAYBETTİ"}
                  </span>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{match.score}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 mt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Flame className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Kazanma Serisi</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Son 5 maçta %{(history.filter((h) => h.result === "win").length / history.length) * 100} galibiyet
                  oranı yakaladı.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Opsiyonel) */}
        <div className="p-4 border-t border-white/10 bg-background/95">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-display text-sm transition-colors"
          >
            KAPAT
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeHistoryModal;
