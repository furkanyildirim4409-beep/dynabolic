import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Bell, Shield, LogOut, AlertTriangle, TrendingUp, Target, Coins, ChevronRight, Moon, Smartphone, Lock, HelpCircle, X, Camera } from "lucide-react";
import RealisticBodyAvatar from "@/components/RealisticBodyAvatar";
import BioCoinWallet from "@/components/BioCoinWallet";
import BodyScanUpload from "@/components/BodyScanUpload";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Profil = () => {
  const [timelineValue, setTimelineValue] = useState([50]);
  const [bioCoins] = useState(2450);
  const [showSettings, setShowSettings] = useState(false);
  const [showBodyScan, setShowBodyScan] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
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

  const handleSettingsAction = (action: string) => {
    if (action === "logout") {
      toast({
        title: "Çıkış Yapılıyor (Demo)",
        description: "Hesabınızdan çıkış yapılıyor...",
      });
    } else {
      toast({
        title: `${action} (Demo)`,
        description: "Bu özellik yakında aktif olacak!",
      });
    }
  };

  const menuItems = [
    { icon: Settings, label: "Ayarlar", description: "Uygulama tercihlerini düzenle", action: "settings" },
    { icon: Bell, label: "Bildirimler", description: "Hatırlatıcıları yönet", action: "notifications" },
    { icon: Shield, label: "Gizlilik", description: "Veri paylaşım ayarları", action: "privacy" },
    { icon: LogOut, label: "Çıkış Yap", description: "Hesabından çık", danger: true, action: "logout" },
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

      {/* User ID Card Header - MOVED TO TOP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-4 flex items-center gap-4 border border-primary/30"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center neon-glow-sm relative">
          <User className="w-10 h-10 text-primary" />
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[8px] px-1.5 py-0.5 rounded-full font-bold">
            ELİT
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl text-foreground">SPORCU #0427</h3>
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <p className="text-primary text-sm font-medium">Elit Seviye • 2 yıl</p>
          <div className="flex gap-6 mt-3">
            <div className="text-center">
              <p className="font-display text-lg text-primary">847</p>
              <p className="text-muted-foreground text-[10px]">Antrenman</p>
            </div>
            <div className="text-center">
              <p className="font-display text-lg text-foreground">156</p>
              <p className="text-muted-foreground text-[10px]">Gün Serisi</p>
            </div>
            <div className="text-center">
              <p className="font-display text-lg text-foreground">12</p>
              <p className="text-muted-foreground text-[10px]">Rozet</p>
            </div>
          </div>
        </div>
      </motion.div>

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
            <p className="font-display text-2xl text-primary">{bioCoins.toLocaleString()}</p>
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

      {/* Body Scan Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg text-foreground tracking-wide">
            VÜCUT TARAMA
          </h2>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          İlerlemenizi takip etmek için koçunuza güncel vücut fotoğraflarınızı gönderin.
        </p>
        
        <Button 
          onClick={() => setShowBodyScan(true)}
          className="w-full h-12 font-display neon-glow-sm"
        >
          <Camera className="w-5 h-5 mr-2" />
          FOTOĞRAF YÜKLE
        </Button>
      </motion.div>

      {/* Settings Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-4 space-y-2"
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => item.action === "settings" ? setShowSettings(true) : handleSettingsAction(item.action)}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              item.danger ? "bg-destructive/20" : "bg-primary/10"
            }`}>
              <item.icon className={`w-5 h-5 ${item.danger ? "text-destructive" : "text-primary"}`} />
            </div>
            <div className="flex-1">
              <p className={`font-medium text-sm ${item.danger ? "text-destructive" : "text-foreground"}`}>
                {item.label}
              </p>
              <p className="text-muted-foreground text-xs">{item.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-white/10"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-lg text-foreground">AYARLAR</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Settings Options */}
              <div className="p-4 space-y-4">
                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 glass-card">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-foreground text-sm font-medium">Karanlık Mod</p>
                      <p className="text-muted-foreground text-xs">Koyu tema kullan</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-4 glass-card">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-foreground text-sm font-medium">Bildirimler</p>
                      <p className="text-muted-foreground text-xs">Push bildirimleri al</p>
                    </div>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                {/* Other Options */}
                {[
                  { icon: Smartphone, label: "Cihaz Bağlantısı", desc: "Akıllı saat ve bantlar" },
                  { icon: Lock, label: "Gizlilik", desc: "Veri paylaşım ayarları" },
                  { icon: HelpCircle, label: "Yardım & Destek", desc: "SSS ve iletişim" },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => toast({ title: `${item.label} (Demo)` })}
                    className="w-full flex items-center justify-between p-4 glass-card hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-primary" />
                      <div className="text-left">
                        <p className="text-foreground text-sm font-medium">{item.label}</p>
                        <p className="text-muted-foreground text-xs">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}

                {/* App Version */}
                <div className="text-center pt-4 border-t border-white/10">
                  <p className="text-muted-foreground text-xs">DYNABOLIC v1.0.0</p>
                  <p className="text-muted-foreground/50 text-[10px] mt-1">© 2026 Dynabolic Labs</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body Scan Upload Modal */}
      <BodyScanUpload 
        isOpen={showBodyScan} 
        onClose={() => setShowBodyScan(false)} 
      />
    </div>
  );
};

export default Profil;
