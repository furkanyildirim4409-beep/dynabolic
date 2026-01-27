import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EnergyBank from "@/components/EnergyBank";
import CoachUplink from "@/components/CoachUplink";
import BentoStats from "@/components/BentoStats";
import QuickActionFAB from "@/components/QuickActionFAB";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock assigned coach data
const assignedCoach = {
  id: "1",
  name: "Koç Serdar",
  avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face",
};

const Kokpit = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl text-foreground">KOKPİT</h1>
          <p className="text-muted-foreground text-sm">Misyon Kontrol Merkezi</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-primary font-display text-lg">27 OCAK</p>
            <p className="text-muted-foreground text-xs">Pazartesi</p>
          </div>
          {/* Coach Avatar - Clicking navigates to Coach Profile */}
          <motion.button
            onClick={() => navigate(`/coach/${assignedCoach.id}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary via-primary/80 to-primary neon-glow-sm">
              <Avatar className="w-10 h-10">
                <AvatarImage src={assignedCoach.avatar} alt={assignedCoach.name} className="object-cover" />
                <AvatarFallback className="bg-secondary text-foreground text-sm font-display">
                  {assignedCoach.name.charAt(4)}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-stat-hrv border-2 border-background" />
          </motion.button>
        </div>
      </motion.div>

      {/* Energy Bank - Hero Widget */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card py-8 px-6 flex justify-center"
      >
        <EnergyBank
          level={84}
          label="GÜNLÜK ENERJİ"
          subtext="Yüksek Yoğunluk İçin Uygun"
        />
      </motion.div>

      {/* Coach Uplink */}
      <CoachUplink
        coachName="KOÇ SERDAR"
        status="online"
        message="Bugün bacak antrenmanında tempoyu düşürme. Vision AI sonuçlarını bekliyorum."
      />

      {/* Bento Grid Stats */}
      <div>
        <h2 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          SAĞLIK VERİLERİ
        </h2>
        <BentoStats />
      </div>

      {/* Quick Action FAB */}
      <QuickActionFAB />
    </div>
  );
};

export default Kokpit;
