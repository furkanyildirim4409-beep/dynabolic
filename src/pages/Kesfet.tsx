import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, ShoppingBag, X, Heart, MessageCircle, Share2, Verified, Coins } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Coach {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  hasNewStory: boolean;
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
  coachAvatar: string;
  type: "transformation" | "motivation";
  beforeImage?: string;
  afterImage?: string;
  content?: string;
  likes: number;
  comments: number;
}

const eliteCoaches: Coach[] = [
  { id: "1", name: "Koç Serdar", avatar: "/placeholder.svg", specialty: "Hipertrofi", hasNewStory: true },
  { id: "2", name: "Koç Elif", avatar: "/placeholder.svg", specialty: "Beslenme", hasNewStory: true },
  { id: "3", name: "Koç Mert", avatar: "/placeholder.svg", specialty: "Güç", hasNewStory: false },
  { id: "4", name: "Koç Ayşe", avatar: "/placeholder.svg", specialty: "Mobilite", hasNewStory: true },
  { id: "5", name: "Koç Burak", avatar: "/placeholder.svg", specialty: "Dayanıklılık", hasNewStory: false },
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
    coachAvatar: "/placeholder.svg",
    type: "motivation",
    content: "\"Başarı, her gün tekrarlanan küçük çabaların toplamıdır.\" Bugün de devam! 🔥",
    likes: 1523,
    comments: 89,
  },
  {
    id: "3",
    coach: "Koç Mert",
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

const Kesfet = () => {
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<Coach | null>(null);
  const [bioCoins] = useState(1250);

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
                onClick={() => navigate(`/coach/${coach.id}`)}
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

        {/* Shop Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-display text-sm text-foreground tracking-wide">
                MAĞAZA
              </h2>
            </div>
            <span className="text-xs text-primary">Tümünü Gör</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {shopProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                className="flex-shrink-0 w-40 bg-secondary/50 rounded-xl overflow-hidden border border-white/5"
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
                </div>
                <div className="p-3">
                  <p className="text-foreground text-xs font-medium line-clamp-2 h-8">
                    {product.title}
                  </p>
                  <p className="text-muted-foreground text-[10px] mt-1">{product.coach}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary font-display text-sm">{product.price}₺</span>
                    {product.bioCoins && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Coins className="w-3 h-3" />
                        <span className="text-[10px]">{product.bioCoins}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feed Section */}
        <div>
          <h2 className="font-display text-lg text-foreground mb-4 tracking-wide">
            AKIŞ
          </h2>

          <div className="space-y-4">
            {feedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass-card overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.coachAvatar} alt={post.coach} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {post.coach.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-foreground text-sm font-medium">{post.coach}</span>
                      <Verified className="w-4 h-4 text-primary fill-primary" />
                    </div>
                    <span className="text-muted-foreground text-xs">Elit Koç</span>
                  </div>
                </div>

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
        </div>
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
