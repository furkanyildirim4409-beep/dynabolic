import { motion } from "framer-motion";
import { Play, Clock, Trophy, BookOpen } from "lucide-react";

const Akademi = () => {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-foreground">AKADEMİ</h1>
        <p className="text-muted-foreground text-sm">Medya Merkezi & Eğitim</p>
      </div>

      {/* Featured Video */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card overflow-hidden"
      >
        <div className="relative aspect-video bg-secondary flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary flex items-center justify-center neon-glow">
            <Play className="w-8 h-8 text-primary ml-1" />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-display text-lg text-foreground">YARALANMA ÖNLEME</p>
            <p className="text-muted-foreground text-xs">Isınma rutinleri ve mobilite</p>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        {[
          { name: "Teknik", count: 24, icon: Trophy },
          { name: "Beslenme", count: 18, icon: BookOpen },
          { name: "Toparlanma", count: 12, icon: Clock },
          { name: "Motivasyon", count: 8, icon: Play },
        ].map((category, index) => (
          <div
            key={index}
            className="glass-card p-4 flex flex-col items-center justify-center text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <category.icon className="w-6 h-6 text-primary" />
            </div>
            <p className="font-display text-foreground">{category.name}</p>
            <p className="text-muted-foreground text-xs">{category.count} video</p>
          </div>
        ))}
      </motion.div>

      {/* Recent Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="font-display text-lg text-foreground">SON EKLENENLER</h2>
        
        {[
          { title: "Squat Tekniği", duration: "12:45", category: "Teknik" },
          { title: "Pre-Workout Beslenme", duration: "8:30", category: "Beslenme" },
          { title: "Uyku Optimizasyonu", duration: "15:20", category: "Toparlanma" },
        ].map((video, index) => (
          <div
            key={index}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="w-20 h-14 bg-secondary rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{video.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground text-xs">{video.duration}</span>
                <span className="text-primary text-xs">• {video.category}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Akademi;
