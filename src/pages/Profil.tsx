import { motion } from "framer-motion";
import { User, Settings, Bell, Shield, LogOut } from "lucide-react";

const Profil = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-foreground">PROFİL</h1>
        <p className="text-muted-foreground text-sm">3D Avatar & Ayarlar</p>
      </div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 flex flex-col items-center"
      >
        {/* 3D Avatar Placeholder */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/50 flex items-center justify-center mb-4 neon-glow">
          <User className="w-16 h-16 text-primary" />
        </div>
        
        <h2 className="font-display text-xl text-foreground">SPORCU #0427</h2>
        <p className="text-muted-foreground text-sm">Elit Seviye • 2 yıl</p>
        
        <div className="flex gap-6 mt-4 pt-4 border-t border-border w-full justify-center">
          <div className="text-center">
            <p className="font-display text-xl text-primary">847</p>
            <p className="text-muted-foreground text-xs">Antrenman</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl text-foreground">156</p>
            <p className="text-muted-foreground text-xs">Gün Serisi</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl text-foreground">12</p>
            <p className="text-muted-foreground text-xs">Rozet</p>
          </div>
        </div>
      </motion.div>

      {/* Body Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <h2 className="font-display text-lg text-foreground mb-4">VÜCUT VERİLERİ</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Boy", value: "182 cm" },
            { label: "Kilo", value: "78.5 kg" },
            { label: "Yağ Oranı", value: "12.4%" },
            { label: "Kas Kütlesi", value: "68.8 kg" },
            { label: "BMI", value: "23.7" },
            { label: "Bazal Metabolizma", value: "1,890 kcal" },
          ].map((stat, index) => (
            <div key={index} className="p-3 bg-secondary/50 rounded-xl">
              <p className="text-muted-foreground text-xs">{stat.label}</p>
              <p className="font-display text-lg text-foreground mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
