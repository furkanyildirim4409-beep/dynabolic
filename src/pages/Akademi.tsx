import { motion } from "framer-motion";
import { ArrowLeft, Play, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoItem {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
}

const academyVideos: VideoItem[] = [
  {
    id: 1,
    title: "Squat Anatomisi",
    description: "Diz sağlığı için doğru açıları öğrenin. Kalça, diz ve ayak bileği mobilitesi.",
    duration: "12 dk",
    thumbnail: "🏋️",
    category: "Teknik"
  },
  {
    id: 2,
    title: "Hipertrofi Bilimi",
    description: "Kas büyümesi için mekanik gerilim, metabolik stres ve kas hasarı prensipleri.",
    duration: "15 dk",
    thumbnail: "💪",
    category: "Bilim"
  },
  {
    id: 3,
    title: "Uyku Hackleri",
    description: "Derin uykuyu %30 artırma yöntemleri. Sirkadiyen ritim ve melatonin optimizasyonu.",
    duration: "8 dk",
    thumbnail: "😴",
    category: "Toparlanma"
  },
  {
    id: 4,
    title: "Deadlift Masterclass",
    description: "Bel sağlığını koruyarak maksimum güç üretimi. Konvansiyonel vs Sumo karşılaştırması.",
    duration: "18 dk",
    thumbnail: "🔥",
    category: "Teknik"
  },
  {
    id: 5,
    title: "Protein Timing",
    description: "Anabolik pencere miti ve gerçek protein sentezi dinamikleri.",
    duration: "10 dk",
    thumbnail: "🥩",
    category: "Beslenme"
  },
  {
    id: 6,
    title: "Stres Yönetimi",
    description: "Kortizol seviyelerini dengeleyerek performans ve toparlanmayı optimize et.",
    duration: "12 dk",
    thumbnail: "🧘",
    category: "Zihin"
  }
];

const Akademi = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="flex items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">AKADEMİ</h1>
              <p className="text-xs text-muted-foreground">Bilgi ile güçlen</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Featured Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 overflow-hidden">
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center relative">
                  <span className="text-6xl">🎯</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.4)]">
                      <Play className="w-7 h-7 text-primary-foreground ml-1" />
                    </div>
                  </motion.button>
                </div>
              </AspectRatio>
              <div className="p-4">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  ÖNE ÇIKAN
                </span>
                <h3 className="font-display text-lg font-bold text-foreground mt-2">
                  Başlangıç Rehberi: Elite Atlet Yolculuğu
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Gokalaf sisteminin tüm özelliklerini keşfet ve performansını maksimize et.
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>25 dk</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Video Grid */}
        <div className="space-y-3">
          <h2 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Tüm Eğitimler
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {academyVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="bg-secondary/30 border-white/5 hover:border-primary/30 transition-all overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-28 h-28 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center flex-shrink-0 relative">
                        <span className="text-4xl">{video.thumbnail}</span>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 py-3 pr-4">
                        <span className="text-xs font-medium text-primary/80">
                          {video.category}
                        </span>
                        <h4 className="font-display font-bold text-foreground mt-1">
                          {video.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {video.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Akademi;
