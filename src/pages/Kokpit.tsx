import { motion } from "framer-motion";
import EnergyBank from "@/components/EnergyBank";
import CoachUplink from "@/components/CoachUplink";
import BentoStats from "@/components/BentoStats";
import QuickActionFAB from "@/components/QuickActionFAB";

const Kokpit = () => {
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
        <div className="text-right">
          <p className="text-primary font-display text-lg">27 OCAK</p>
          <p className="text-muted-foreground text-xs">Pazartesi</p>
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
