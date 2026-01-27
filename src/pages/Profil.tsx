import { useState } from "react";
import { motion } from "framer-motion";
import { User, Settings, Bell, Shield, LogOut, AlertTriangle, TrendingUp, Target, Coins } from "lucide-react";
import RealisticBodyAvatar from "@/components/RealisticBodyAvatar";
import BioCoinWallet from "@/components/BioCoinWallet";
import { Slider } from "@/components/ui/slider";

const Profil = () => {
  const [timelineValue, setTimelineValue] = useState([50]);
  const [bioCoins] = useState(1250);
  
  // Calculate waist scale based on timeline (1.2 at start, 0.85 at goal)
  const waistScale = 1.2 - (timelineValue[0] / 100) * 0.35;

  const bodyStats = [
    { label: "Boy", value: "182 cm" },
    { label: "Kilo", value: "78.5 kg" },
    { label: "Yağ Oranı", value: "12.4%", highlight: true },
    { label: "Kas Kütlesi", value: "74 kg", highlight: true },
    { label: "BMI", value: "23.7" },
    { label: "Bazal Metabolizma", value: "1,890 kcal" },
  ];

  const recoveryZones = [
    { zone: "Göğüs", status: "Toparlanma Gerekiyor", severity: "high" },
    { zone: "Omuz", status: "Toparlanma Gerekiyor", severity: "high" },
    { zone: "Bacak", status: "Hazır", severity: "ok" },
    { zone: "Sırt", status: "Yarın Hazır", severity: "medium" },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header with Bio-Coins */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">PROFİL</h1>
          <p className="text-muted-foreground text-sm">Dijital İkiz & Vücut Analizi</p>
        </div>
        <BioCoinWallet balance={bioCoins} showLabel />
      </div>

      {/* 3D Avatar Section - Now Realistic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-lg text-foreground tracking-wide">
            DİJİTAL İKİZ
          </h2>
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] text-muted-foreground">CANLI</span>
          </div>
        </div>

        {/* Realistic 3D Avatar */}
        <RealisticBodyAvatar waistScale={waistScale} />

        {/* Recovery Alert */}
        <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div>
            <p className="text-destructive text-xs font-medium">
              KAS TOPARLANMASI GEREKİYOR
            </p>
            <p className="text-muted-foreground text-[10px]">
              Göğüs ve Omuz bölgeleri dinlenme gerektirir
            </p>
          </div>
        </div>
      </motion.div>

      {/* Timeline AI - Body Transformation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg text-foreground tracking-wide">
            ZAMAN YOLCULUĞU
          </h2>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">BUGÜN</span>
            <span className="text-primary font-medium">HEDEF (TEMMUZ 2026)</span>
          </div>
          
          <Slider
            value={timelineValue}
            onValueChange={setTimelineValue}
            max={100}
            step={1}
            className="w-full"
          />

          {/* Tooltip */}
          <div className="text-center">
            <span className="inline-block bg-primary/20 text-primary text-xs px-3 py-1 rounded-full">
              TAHMİNİ FİZİK: {Math.round(timelineValue[0])}% İlerleme
            </span>
          </div>

          {/* Projected Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
            <div className="text-center p-2 bg-secondary/50 rounded-lg">
              <p className="text-muted-foreground text-[10px]">TAHMİNİ YAĞ</p>
              <p className="font-display text-lg text-stat-hrv">
                %{(12.4 - (timelineValue[0] / 100) * 3.4).toFixed(1)}
              </p>
            </div>
            <div className="text-center p-2 bg-secondary/50 rounded-lg">
              <p className="text-muted-foreground text-[10px]">TAHMİNİ KAS</p>
              <p className="font-display text-lg text-primary">
                {(74 + (timelineValue[0] / 100) * 4).toFixed(1)}kg
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bio-Coins Earned Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.17 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Coins className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg text-foreground tracking-wide">
            BIO-COIN CÜZDANI
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-primary/10 border border-primary/30 rounded-xl">
            <p className="font-display text-2xl text-primary">{bioCoins}</p>
            <p className="text-muted-foreground text-[10px]">TOPLAM</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-xl">
            <p className="font-display text-2xl text-foreground">+125</p>
            <p className="text-muted-foreground text-[10px]">BU HAFTA</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-xl">
            <p className="font-display text-2xl text-foreground">3</p>
            <p className="text-muted-foreground text-[10px]">SATIN ALIM</p>
          </div>
        </div>

        <p className="text-muted-foreground text-xs mt-3 text-center">
          Her tamamlanan antrenman = Bio-Coin kazanırsın! 💪
        </p>
      </motion.div>

      {/* Recovery Zones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg text-foreground tracking-wide">
            TOPARLANMA BÖLGELERİ
          </h2>
        </div>

        <div className="space-y-2">
          {recoveryZones.map((zone, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl"
            >
              <span className="text-foreground text-sm">{zone.zone}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                zone.severity === "high" 
                  ? "bg-destructive/20 text-destructive" 
                  : zone.severity === "medium"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-stat-hrv/20 text-stat-hrv"
              }`}>
                {zone.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Body Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-4"
      >
        <h2 className="font-display text-lg text-foreground mb-4 tracking-wide">
          VÜCUT VERİLERİ
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {bodyStats.map((stat, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-xl ${
                stat.highlight 
                  ? "bg-primary/10 border border-primary/30" 
                  : "bg-secondary/50"
              }`}
            >
              <p className="text-muted-foreground text-xs">{stat.label}</p>
              <p className={`font-display text-lg mt-1 ${
                stat.highlight ? "text-primary" : "text-foreground"
              }`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Athlete Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 flex items-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center neon-glow-sm">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg text-foreground">SPORCU #0427</h3>
          <p className="text-muted-foreground text-sm">Elit Seviye • 2 yıl</p>
          <div className="flex gap-4 mt-2">
            <div className="text-center">
              <p className="font-display text-sm text-primary">847</p>
              <p className="text-muted-foreground text-[10px]">Antrenman</p>
            </div>
            <div className="text-center">
              <p className="font-display text-sm text-foreground">156</p>
              <p className="text-muted-foreground text-[10px]">Gün Serisi</p>
            </div>
            <div className="text-center">
              <p className="font-display text-sm text-foreground">12</p>
              <p className="text-muted-foreground text-[10px]">Rozet</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-4 space-y-2"
      >
        {[
          { icon: Settings, label: "Ayarlar", description: "Uygulama tercihlerini düzenle" },
          { icon: Bell, label: "Bildirimler", description: "Hatırlatıcıları yönet" },
          { icon: Shield, label: "Gizlilik", description: "Veri paylaşım ayarları" },
          { icon: LogOut, label: "Çıkış Yap", description: "Hesabından çık", danger: true },
        ].map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              item.danger ? "bg-destructive/20" : "bg-primary/10"
            }`}>
              <item.icon className={`w-5 h-5 ${item.danger ? "text-destructive" : "text-primary"}`} />
            </div>
            <div>
              <p className={`font-medium text-sm ${item.danger ? "text-destructive" : "text-foreground"}`}>
                {item.label}
              </p>
              <p className="text-muted-foreground text-xs">{item.description}</p>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default Profil;
