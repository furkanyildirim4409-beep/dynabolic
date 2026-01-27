import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Verified, 
  Users, 
  GraduationCap, 
  Star,
  ShoppingBag,
  Briefcase,
  Grid3X3,
  X,
  Play,
  Coins
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CoachData {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialty: string;
  followers: string;
  students: number;
  rating: number;
  highlights: { id: string; title: string; thumbnail: string }[];
  posts: {
    id: string;
    type: "transformation" | "video" | "motivation";
    beforeImage?: string;
    afterImage?: string;
    videoThumbnail?: string;
    content?: string;
    likes: number;
    comments: number;
  }[];
  products: {
    id: string;
    title: string;
    price: number;
    bioCoins?: number;
    image: string;
    type: "ebook" | "pdf" | "apparel";
  }[];
  packages: {
    id: string;
    title: string;
    price: number;
    description: string;
    features: string[];
  }[];
}

const mockCoachData: CoachData = {
  id: "1",
  name: "Koç Serdar",
  avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop&crop=face",
  bio: "Elit Performans Koçu | Bio-Hacker 🧬 | 10+ Yıl Deneyim | 500+ Başarılı Dönüşüm",
  specialty: "Hipertrofi & Güç",
  followers: "12.4K",
  students: 140,
  rating: 4.9,
  highlights: [
    { id: "1", title: "Değişimler", thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100&h=100&fit=crop" },
    { id: "2", title: "Soru-Cevap", thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=100&h=100&fit=crop" },
    { id: "3", title: "Yemekler", thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&h=100&fit=crop" },
    { id: "4", title: "Motivasyon", thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop" },
  ],
  posts: [
    {
      id: "1",
      type: "transformation",
      beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop",
      content: "12 haftalık dönüşüm programı sonucu. Disiplin + Bilim = Sonuç 💪 #GokalafAilesi",
      likes: 2847,
      comments: 156,
    },
    {
      id: "2",
      type: "video",
      videoThumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
      content: "Squat formunda dikkat etmeniz gereken 3 kritik nokta! 🎯",
      likes: 1892,
      comments: 89,
    },
    {
      id: "3",
      type: "transformation",
      beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=500&fit=crop",
      content: "6 ayda 25kg kas kütlesi artışı. Doğru program + beslenme = imkansız yok.",
      likes: 3241,
      comments: 234,
    },
  ],
  products: [
    { 
      id: "1", 
      title: "Hipertrofi E-Kitabı", 
      price: 150, 
      bioCoins: 500,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop", 
      type: "ebook" 
    },
    { 
      id: "2", 
      title: "Diyet Listesi (PDF)", 
      price: 200, 
      bioCoins: 650,
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=300&fit=crop", 
      type: "pdf" 
    },
    { 
      id: "3", 
      title: "Gokalaf Pro Atlet (Siyah)", 
      price: 450, 
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", 
      type: "apparel" 
    },
    { 
      id: "4", 
      title: "Kuvvet Programı", 
      price: 180, 
      bioCoins: 600,
      image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300&h=300&fit=crop", 
      type: "ebook" 
    },
  ],
  packages: [
    {
      id: "1",
      title: "Online Koçluk (Aylık)",
      price: 1500,
      description: "Kişiselleştirilmiş antrenman ve beslenme programı",
      features: ["Haftalık program güncelleme", "7/24 mesaj desteği", "Video form analizi", "Haftalık check-in"]
    },
    {
      id: "2",
      title: "Yarışma Hazırlık",
      price: 3000,
      description: "Vücut geliştirme yarışmalarına tam hazırlık paketi",
      features: ["Günlük takip", "Posing eğitimi", "Peak week stratejisi", "Sahne hazırlığı", "Mental koçluk"]
    },
    {
      id: "3",
      title: "VIP Birebir Koçluk",
      price: 5000,
      description: "Premium birebir koçluk deneyimi",
      features: ["Sınırsız iletişim", "Günlük program ayarı", "Yüz yüze görüşme (aylık)", "Özel supleman planı", "Yaşam tarzı danışmanlığı"]
    }
  ]
};

const CoachProfile = () => {
  const navigate = useNavigate();
  const { coachId } = useParams();
  const [selectedStory, setSelectedStory] = useState<typeof mockCoachData.highlights[0] | null>(null);
  const [activeTab, setActiveTab] = useState("feed");

  const coach = mockCoachData; // In real app, fetch by coachId

  return (
    <>
      <div className="min-h-screen bg-background pb-8">
        {/* Header with Back Button */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 py-3 flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display text-lg text-foreground flex-1">{coach.name}</h1>
            <Verified className="w-5 h-5 text-primary fill-primary" />
          </div>
        </div>

        {/* Profile Header */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Avatar with Neon Ring */}
            <motion.button
              onClick={() => setSelectedStory(coach.highlights[0])}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="p-1 rounded-full bg-gradient-to-tr from-primary via-yellow-500 to-primary animate-pulse">
                <div className="p-0.5 rounded-full bg-background">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={coach.avatar} alt={coach.name} className="object-cover" />
                    <AvatarFallback className="bg-secondary text-foreground text-2xl font-display">
                      {coach.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Play className="w-3 h-3 text-primary-foreground fill-primary-foreground ml-0.5" />
              </div>
            </motion.button>

            {/* Stats */}
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="font-display text-xl text-foreground">{coach.followers}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" /> Takipçi
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl text-foreground">{coach.students}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Öğrenci
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl text-primary">{coach.rating}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 text-primary fill-primary" /> Puan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            <p className="text-foreground text-sm leading-relaxed">{coach.bio}</p>
            <p className="text-primary text-xs mt-1 font-medium">{coach.specialty}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-primary text-primary-foreground font-display text-sm rounded-xl neon-glow"
            >
              TAKİP ET
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-secondary text-foreground font-display text-sm rounded-xl border border-white/10"
            >
              MESAJ GÖNDER
            </motion.button>
          </div>
        </div>

        {/* Highlights */}
        <div className="px-4 py-4 border-y border-white/10">
          <h3 className="font-display text-xs text-muted-foreground mb-3 tracking-wider">ÖNE ÇIKANLAR</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {coach.highlights.map((highlight) => (
              <motion.button
                key={highlight.id}
                onClick={() => setSelectedStory(highlight)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary/50 to-primary/30">
                  <div className="p-0.5 rounded-full bg-background">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src={highlight.thumbnail} 
                        alt={highlight.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-foreground text-[10px] font-medium truncate w-16 text-center">
                  {highlight.title}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-transparent border-b border-white/10 rounded-none h-12 p-0">
            <TabsTrigger 
              value="feed" 
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary font-display text-xs tracking-wider"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              AKIŞ
            </TabsTrigger>
            <TabsTrigger 
              value="shop" 
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary font-display text-xs tracking-wider"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              MAĞAZA
            </TabsTrigger>
            <TabsTrigger 
              value="coaching" 
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary font-display text-xs tracking-wider"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              KOÇLUK
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="mt-0 p-4 space-y-4">
            {coach.posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden"
              >
                {/* Post Images */}
                {post.type === "transformation" && (
                  <div className="grid grid-cols-2 gap-1">
                    <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                      <img src={post.beforeImage} alt="Önce" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                        ÖNCE
                      </span>
                    </div>
                    <div className="relative aspect-[3/4] bg-muted overflow-hidden border-l-2 border-primary/50">
                      <img src={post.afterImage} alt="Sonra" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded">
                        SONRA
                      </span>
                    </div>
                  </div>
                )}

                {post.type === "video" && (
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img src={post.videoThumbnail} alt="Video" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <p className="text-foreground text-sm">{post.content}</p>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex items-center gap-6">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-xs">{post.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          {/* Shop Tab */}
          <TabsContent value="shop" className="mt-0 p-4">
            <div className="grid grid-cols-2 gap-3">
              {coach.products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card overflow-hidden"
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {product.type === "ebook" ? "E-KİTAP" : product.type === "pdf" ? "PDF" : "GİYİM"}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-foreground text-xs font-medium line-clamp-2 h-8">
                      {product.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary font-display text-sm">{product.price}₺</span>
                      {product.bioCoins && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Coins className="w-3 h-3" />
                          <span className="text-[10px]">{product.bioCoins}</span>
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-3 py-2 bg-primary text-primary-foreground font-display text-xs rounded-lg"
                    >
                      SATIN AL
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Coaching Tab */}
          <TabsContent value="coaching" className="mt-0 p-4 space-y-4">
            {coach.packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-4 ${index === 2 ? 'border-primary/50 neon-glow-sm' : ''}`}
              >
                {index === 2 && (
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-primary text-xs font-display tracking-wider">EN POPÜLER</span>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-foreground">{pkg.title}</h3>
                    <p className="text-muted-foreground text-xs mt-1">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl text-primary">{pkg.price.toLocaleString()}₺</p>
                    <p className="text-muted-foreground text-[10px]">/ aylık</p>
                  </div>
                </div>
                
                <ul className="mt-4 space-y-2">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full mt-4 py-3 font-display text-sm rounded-xl ${
                    index === 2 
                      ? 'bg-primary text-primary-foreground neon-glow' 
                      : 'bg-secondary text-foreground border border-white/10'
                  }`}
                >
                  BAŞVUR
                </motion.button>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Story Progress Bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              {coach.highlights.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: coach.highlights.findIndex(h => h.id === selectedStory.id) === i ? "100%" : "0%" 
                    }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-primary">
                  <AvatarImage src={coach.avatar} />
                  <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-medium">{coach.name}</p>
                  <p className="text-white/60 text-xs">{selectedStory.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Story Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={selectedStory.thumbnail} 
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>

            {/* Tap Areas */}
            <button
              onClick={() => {
                const currentIndex = coach.highlights.findIndex(h => h.id === selectedStory.id);
                if (currentIndex > 0) {
                  setSelectedStory(coach.highlights[currentIndex - 1]);
                } else {
                  setSelectedStory(null);
                }
              }}
              className="absolute left-0 top-0 bottom-0 w-1/3"
            />
            <button
              onClick={() => {
                const currentIndex = coach.highlights.findIndex(h => h.id === selectedStory.id);
                if (currentIndex < coach.highlights.length - 1) {
                  setSelectedStory(coach.highlights[currentIndex + 1]);
                } else {
                  setSelectedStory(null);
                }
              }}
              className="absolute right-0 top-0 bottom-0 w-1/3"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CoachProfile;
