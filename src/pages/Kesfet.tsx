import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, ShoppingBag, X, Heart, MessageCircle, Share2, Verified, Coins, Trophy, Star, Users, Shield } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface Coach {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  hasNewStory: boolean;
  score?: number;
  students?: number;
  rating?: number;
  level?: number;
}

interface Product {
  id: string;
  title: string;
  coach: string;
  price: number;
  bioCoins?: number;
  image: string;
  type: "ebook" | "apparel" | "pdf";
}

interface FeedPost {
  id: string;
  coach: string;
  coachId: string;
  coachAvatar: string;
  type: "transformation" | "motivation";
  beforeImage?: string;
  afterImage?: string;
  content?: string;
  likes: number;
  comments: number;
}

const eliteCoaches: Coach[] = [
  { id: "1", name: "Koç Serdar", avatar: "/placeholder.svg", specialty: "Hipertrofi", hasNewStory: true, score: 9850, students: 150, rating: 4.9, level: 10 },
  { id: "2", name: "Koç Elif", avatar: "/placeholder.svg", specialty: "Beslenme", hasNewStory: true, score: 8720, students: 120, rating: 4.8, level: 9 },
  { id: "3", name: "Koç Mert", avatar: "/placeholder.svg", specialty: "Güç", hasNewStory: false, score: 7540, students: 95, rating: 4.7, level: 9 },
  { id: "4", name: "Koç Ayşe", avatar: "/placeholder.svg", specialty: "Mobilite", hasNewStory: true, score: 6890, students: 80, rating: 4.9, level: 8 },
  { id: "5", name: "Koç Burak", avatar: "/placeholder.svg", specialty: "Dayanıklılık", hasNewStory: false, score: 5420, students: 65, rating: 4.6, level: 7 },
  { id: "6", name: "Koç Deniz", avatar: "/placeholder.svg", specialty: "Fonksiyonel", hasNewStory: true, score: 4980, students: 55, rating: 4.5, level: 7 },
];

const shopProducts: Product[] = [
  { id: "1", title: "Hipertrofi E-Kitabı", coach: "Koç Serdar", price: 150, bioCoins: 500, image: "/placeholder.svg", type: "ebook" },
  { id: "2", title: "Gokalaf Pro Atlet (Siyah)", coach: "GOKALAF", price: 450, image: "/placeholder.svg", type: "apparel" },
  { id: "3", title: "Diyet Tarifleri (PDF)", coach: "Koç Elif", price: 90, bioCoins: 300, image: "/placeholder.svg", type: "pdf" },
  { id: "4", title: "Kuvvet Programı", coach: "Koç Mert", price: 200, bioCoins: 650, image: "/placeholder.svg", type: "ebook" },
];

const feedPosts: FeedPost[] = [
  {
    id: "1",
    coach: "Koç Serdar",
    coachId: "1",
    coachAvatar: "/placeholder.svg",
    type: "transformation",
    beforeImage: "/placeholder.svg",
    afterImage: "/placeholder.svg",
    content: "12 haftalık dönüşüm programı sonucu. Disiplin + Bilim = Sonuç 💪",
    likes: 2847,
    comments: 156,
  },
  {
    id: "2",
    coach: "Koç Elif",
    coachId: "2",
    coachAvatar: "/placeholder.svg",
    type: "motivation",
    content: "\"Başarı, her gün tekrarlanan küçük çabaların toplamıdır.\" Bugün de devam! 🔥",
    likes: 1523,
    comments: 89,
  },
  {
    id: "3",
    coach: "Koç Mert",
    coachId: "3",
    coachAvatar: "/placeholder.svg",
    type: "transformation",
    beforeImage: "/placeholder.svg",
    afterImage: "/placeholder.svg",
    content: "6 ayda 25kg kas kütlesi artışı. Doğru program + beslenme = imkansız yok.",
    likes: 3241,
    comments: 234,
  },
];

interface BioCoinWalletProps {
  balance: number;
}

const BioCoinWallet = ({ balance }: BioCoinWalletProps) => (
  <motion.div 
    className="flex items-center gap-2 bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Coins className="w-4 h-4 text-primary" />
    <span className="font-display text-sm text-primary">{balance.toLocaleString()}</span>
  </motion.div>
);

const getMedalBadge = (rank: number) => {
  if (rank === 1) return { emoji: "🥇", color: "from-yellow-400 to-yellow-600", glow: "shadow-[0_0_20px_rgba(250,204,21,0.5)]" };
  if (rank === 2) return { emoji: "🥈", color: "from-gray-300 to-gray-400", glow: "shadow-[0_0_15px_rgba(156,163,175,0.4)]" };
  if (rank === 3) return { emoji: "🥉", color: "from-amber-600 to-amber-700", glow: "shadow-[0_0_15px_rgba(217,119,6,0.4)]" };
  return null;
};

// Bio-Coin Discount Calculator
const COIN_TO_TL_RATE = 0.1; // 1000 Bio-Coin = 100 TL, so 1 Bio-Coin = 0.1 TL
const USER_BIO_COINS = 2450; // Mock user balance

const calculateMaxDiscount = (productPrice: number, userCoins: number): number => {
  const maxPossibleDiscount = userCoins * COIN_TO_TL_RATE;
  return Math.min(maxPossibleDiscount, productPrice - 10); // Keep minimum 10 TL price
};

const calculateCoinsNeeded = (discountAmount: number): number => {
  return Math.ceil(discountAmount / COIN_TO_TL_RATE);
};

const Kesfet = () => {
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<Coach | null>(null);
  const [bioCoins] = useState(USER_BIO_COINS);
  const [coinDiscounts, setCoinDiscounts] = useState<Record<string, boolean>>({});

  // Sort coaches by score for leaderboard
  const sortedCoaches = [...eliteCoaches].sort((a, b) => (b.score || 0) - (a.score || 0));

  const handleCoachClick = (coachId: string) => {
    navigate(`/coach/${coachId}`);
  };

  return (
    <>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground">KEŞFET</h1>
            <p className="text-muted-foreground text-sm">Pazar Yeri & Sosyal Ağ</p>
          </div>
          <BioCoinWallet balance={bioCoins} />
        </div>

        {/* Elite Coaches Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-display text-sm text-foreground tracking-wide">
              ELİT KOÇLAR
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {eliteCoaches.map((coach) => (
              <motion.button
                key={coach.id}
                onClick={() => handleCoachClick(coach.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className={`p-0.5 rounded-full ${
                  coach.hasNewStory 
                    ? "bg-gradient-to-tr from-primary via-yellow-500 to-primary" 
                    : "bg-muted"
                }`}>
                  <div className="p-0.5 rounded-full bg-background">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={coach.avatar} alt={coach.name} />
                      <AvatarFallback className="bg-secondary text-foreground">
                        {coach.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-foreground text-xs font-medium truncate w-16">
                    {coach.name}
                  </p>
                  <p className="text-muted-foreground text-[10px]">{coach.specialty}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <Tabs defaultValue="akis" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-secondary/50 border border-white/5">
            <TabsTrigger value="akis" className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              AKIŞ
            </TabsTrigger>
            <TabsTrigger value="koclar" className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              KOÇLAR
            </TabsTrigger>
            <TabsTrigger value="magaza" className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              MAĞAZA
            </TabsTrigger>
          </TabsList>

          {/* AKIŞ (Feed) Tab */}
          <TabsContent value="akis" className="mt-4">
            <div className="space-y-4">
              {feedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card overflow-hidden"
                >
                  {/* Post Header - Clickable */}
                  <button
                    onClick={() => handleCoachClick(post.coachId)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.coachAvatar} alt={post.coach} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {post.coach.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-foreground text-sm font-medium">{post.coach}</span>
                        <Verified className="w-4 h-4 text-primary fill-primary" />
                      </div>
                      <span className="text-muted-foreground text-xs">Elit Koç</span>
                    </div>
                  </button>

                  {/* Transformation Images */}
                  {post.type === "transformation" && (
                    <div className="grid grid-cols-2 gap-1 px-4">
                      <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                        <img src={post.beforeImage} alt="Önce" className="w-full h-full object-cover opacity-60" />
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                          ÖNCE
                        </span>
                      </div>
                      <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden border-2 border-primary/50">
                        <img src={post.afterImage} alt="Sonra" className="w-full h-full object-cover opacity-60" />
                        <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded">
                          SONRA
                        </span>
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
            </div>
          </TabsContent>

          {/* KOÇLAR (Leaderboard) Tab */}
          <TabsContent value="koclar" className="mt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="font-display text-sm text-foreground tracking-wide">
                  KOÇLAR LİGİ
                </h2>
              </div>

              {sortedCoaches.map((coach, index) => {
                const rank = index + 1;
                const medal = getMedalBadge(rank);
                
                return (
                  <motion.button
                    key={coach.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleCoachClick(coach.id)}
                    className={`w-full glass-card p-4 flex items-center gap-4 hover:bg-white/5 transition-all ${
                      medal ? medal.glow : ""
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      medal 
                        ? `bg-gradient-to-br ${medal.color}` 
                        : "bg-secondary"
                    }`}>
                      {medal ? (
                        <span className="text-xl">{medal.emoji}</span>
                      ) : (
                        <span className="font-display text-sm text-foreground">#{rank}</span>
                      )}
                    </div>

                    {/* Coach Avatar */}
                    <div className="relative">
                      <Avatar className={`w-14 h-14 ${
                        rank === 1 ? "ring-2 ring-offset-2 ring-offset-background ring-yellow-500" :
                        rank === 2 ? "ring-2 ring-offset-2 ring-offset-background ring-gray-400" :
                        rank === 3 ? "ring-2 ring-offset-2 ring-offset-background ring-amber-600" : ""
                      }`}>
                        <AvatarImage src={coach.avatar} alt={coach.name} />
                        <AvatarFallback className="bg-primary/20 text-primary font-display">
                          {coach.name.split(" ")[1]?.charAt(0) || coach.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {rank <= 3 && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                          TOP{rank}
                        </div>
                      )}
                    </div>

                    {/* Coach Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-display text-sm">{coach.name}</span>
                        <Verified className="w-4 h-4 text-primary fill-primary" />
                      </div>
                      <p className="text-primary text-xs">{coach.specialty} Uzmanı</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-muted-foreground text-[10px]">{coach.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground text-[10px]">{coach.students} Öğrenci</span>
                        </div>
                      </div>
                    </div>

                    {/* Score/Level Badge */}
                    <div className="text-right">
                      {rank <= 3 ? (
                        <div className="text-center">
                          <p className="font-display text-lg text-primary">{coach.score?.toLocaleString()}</p>
                          <p className="text-muted-foreground text-[10px]">PUAN</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-secondary/80 px-2 py-1 rounded-full">
                          <Shield className="w-3 h-3 text-primary" />
                          <span className="text-xs text-foreground">Lv. {coach.level}</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </TabsContent>

          {/* MAĞAZA (Shop) Tab */}
          <TabsContent value="magaza" className="mt-4">
            {/* Balance Display */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-3 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="text-foreground text-sm">Bakiyen:</span>
              </div>
              <span className="font-display text-lg text-primary">{bioCoins.toLocaleString()} BIO</span>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              {shopProducts.map((product, index) => {
                const maxDiscount = calculateMaxDiscount(product.price, bioCoins);
                const isDiscountActive = coinDiscounts[product.id] || false;
                const coinsNeeded = calculateCoinsNeeded(maxDiscount);
                const discountedPrice = product.price - maxDiscount;
                const remainingCoins = bioCoins - coinsNeeded;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card overflow-hidden"
                  >
                    <div className="aspect-square bg-muted relative">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                          {product.type === "ebook" ? "E-KİTAP" : product.type === "apparel" ? "GİYİM" : "PDF"}
                        </span>
                      </div>
                      {isDiscountActive && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                            -{Math.round(maxDiscount)}₺
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-foreground text-xs font-medium line-clamp-2 h-8">
                        {product.title}
                      </p>
                      <p className="text-muted-foreground text-[10px] mt-1">{product.coach}</p>
                      
                      {/* Price Display */}
                      <div className="flex items-center justify-between mt-2">
                        {isDiscountActive ? (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs line-through">{product.price}₺</span>
                            <span className="text-primary font-display text-sm">{Math.round(discountedPrice)}₺</span>
                          </div>
                        ) : (
                          <span className="text-primary font-display text-sm">{product.price}₺</span>
                        )}
                      </div>

                      {/* Bio-Coin Toggle */}
                      {maxDiscount > 0 && (
                        <div className="mt-2 p-2 bg-secondary/50 rounded-lg">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <Coins className="w-3 h-3 text-primary flex-shrink-0" />
                              <span className="text-[10px] text-muted-foreground truncate">
                                Bio-Coin Kullan
                              </span>
                            </div>
                            <Switch
                              checked={isDiscountActive}
                              onCheckedChange={(checked) => {
                                setCoinDiscounts(prev => ({ ...prev, [product.id]: checked }));
                              }}
                              className="scale-75"
                            />
                          </div>
                          {isDiscountActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-1.5 pt-1.5 border-t border-white/10"
                            >
                              <div className="flex justify-between text-[9px]">
                                <span className="text-muted-foreground">Kullanılacak:</span>
                                <span className="text-primary font-medium">{coinsNeeded.toLocaleString()} BIO</span>
                              </div>
                              <div className="flex justify-between text-[9px]">
                                <span className="text-muted-foreground">Kalan Bakiye:</span>
                                <span className="text-foreground">{remainingCoins.toLocaleString()} BIO</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full mt-3 text-xs py-2 rounded-lg font-medium border transition-colors ${
                          isDiscountActive 
                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" 
                            : "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                        }`}
                      >
                        SATIN AL
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: i === 0 ? "100%" : "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-primary">
                  <AvatarImage src={selectedStory.avatar} />
                  <AvatarFallback>{selectedStory.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-medium">{selectedStory.name}</p>
                  <p className="text-white/60 text-xs">{selectedStory.specialty} Uzmanı</p>
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
              <div className="text-center p-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="font-display text-3xl text-primary">
                      {selectedStory.name.charAt(5)}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-white">{selectedStory.name}</h3>
                  <p className="text-white/70 text-sm max-w-xs mx-auto">
                    Bugünkü ipucu: Protein alımınızı antrenman sonrası 30 dakika içinde yapın! 💪
                  </p>
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-display text-sm"
                    >
                      KOÇA MESAJ GÖNDER
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Tap Areas */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute left-0 top-0 bottom-0 w-1/3"
            />
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute right-0 top-0 bottom-0 w-1/3"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Kesfet;
