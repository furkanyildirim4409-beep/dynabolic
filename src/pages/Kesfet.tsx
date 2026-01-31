import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, X, Heart, MessageCircle, Share2, Verified, Coins, Trophy, Star, Users, Shield, ShoppingBag } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { coaches, getLeaderboardCoaches, Coach } from "@/lib/mockData";
import ProductDetail from "@/components/ProductDetail";
import { useStory, type Story } from "@/context/StoryContext";
import { useCart } from "@/context/CartContext";
import SupplementShop from "@/components/SupplementShop";

// Bio-Coin Discount Calculator (GLOBAL RULE: Max 20% discount)
const COIN_TO_TL_RATE = 0.1; // 1000 Bio-Coin = 100 TL
const MAX_DISCOUNT_PERCENTAGE = 0.20; // 20% cap on all physical products
const USER_BIO_COINS = 2450; // Mock user balance

const calculateMaxDiscount = (productPrice: number, userCoins: number): number => {
  const maxAllowedByPercentage = productPrice * MAX_DISCOUNT_PERCENTAGE;
  const maxPossibleFromCoins = userCoins * COIN_TO_TL_RATE;
  return Math.min(maxPossibleFromCoins, maxAllowedByPercentage);
};

const calculateCoinsNeeded = (discountAmount: number): number => {
  return Math.ceil(discountAmount / COIN_TO_TL_RATE);
};

// Check if user has more coins than the 20% cap allows
const hasExcessCoins = (productPrice: number, userCoins: number): boolean => {
  const maxAllowedByPercentage = productPrice * MAX_DISCOUNT_PERCENTAGE;
  const maxPossibleFromCoins = userCoins * COIN_TO_TL_RATE;
  return maxPossibleFromCoins > maxAllowedByPercentage;
};

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

// Combine all products from all coaches for the shop
const getAllProducts = () => {
  return coaches.flatMap(coach => 
    coach.products.map(product => ({
      ...product,
      coachName: coach.name,
      coachId: coach.id
    }))
  ).slice(0, 8); // Limit to 8 products for display
};

// Combine all posts from all coaches for the feed
const getAllPosts = () => {
  return coaches.flatMap(coach => 
    coach.posts.map(post => ({
      ...post,
      coachName: coach.name,
      coachId: coach.id,
      coachAvatar: coach.avatar
    }))
  );
};

const Kesfet = () => {
  const navigate = useNavigate();
  const { openStories } = useStory();
  const { addToCart, cartCount, openCart } = useCart();
  const [bioCoins, setBioCoins] = useState(USER_BIO_COINS);
  const [coinDiscounts, setCoinDiscounts] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const sortedCoaches = getLeaderboardCoaches();
  const allProducts = getAllProducts();
  const allPosts = getAllPosts();

  const handleCoachClick = (coachId: string) => {
    navigate(`/coach/${coachId}`);
  };

  const handleStoryClick = (coach: Coach) => {
    // Convert coach story to Story format
    const story: Story = {
      id: `coach-${coach.id}`,
      title: coach.name,
      thumbnail: coach.avatar,
      content: coach.storyContent,
    };
    
    openStories([story], 0, {
      categoryLabel: coach.specialty,
      categoryGradient: "from-primary to-primary/60",
    });
  };

  const handleLike = (postId: string, currentLikes: number) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleAddToCart = (product: any) => {
    const isDiscountActive = coinDiscounts[product.id + product.coachId] || false;
    const maxDiscount = calculateMaxDiscount(product.price, bioCoins);
    const coinsNeeded = calculateCoinsNeeded(maxDiscount);

    addToCart({
      id: `${product.id}-${product.coachId}-${Date.now()}`,
      title: product.title,
      price: product.price,
      discountedPrice: isDiscountActive ? Math.round(product.price - maxDiscount) : undefined,
      coinsUsed: isDiscountActive ? coinsNeeded : undefined,
      image: product.image,
      coachName: product.coachName,
      type: "product",
    });
    
    if (isDiscountActive) {
      setBioCoins(prev => prev - coinsNeeded);
      setCoinDiscounts(prev => ({ ...prev, [product.id + product.coachId]: false }));
    }
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
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openCart()}
              className="relative p-2"
            >
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-[10px] font-bold">{cartCount}</span>
                </div>
              )}
            </motion.button>
            <BioCoinWallet balance={bioCoins} />
          </div>
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
            {coaches.map((coach) => (
              <motion.button
                key={coach.id}
                onClick={() => handleStoryClick(coach)}
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
                      <AvatarImage src={coach.avatar} alt={coach.name} className="object-cover" />
                      <AvatarFallback className="bg-secondary text-foreground">
                        {coach.name.charAt(4)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-foreground text-xs font-medium truncate w-16">
                    {coach.name}
                  </p>
                  <p className="text-muted-foreground text-[10px]">{coach.specialty.split(" ")[0]}</p>
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
              {allPosts.map((post, index) => {
                const isLiked = likedPosts[post.id + post.coachId];
                const displayLikes = isLiked ? post.likes + 1 : post.likes;
                
                return (
                  <motion.div
                    key={`${post.id}-${post.coachId}`}
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
                        <AvatarImage src={post.coachAvatar} alt={post.coachName} className="object-cover" />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {post.coachName.charAt(4)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-foreground text-sm font-medium">{post.coachName}</span>
                          <Verified className="w-4 h-4 text-primary fill-primary" />
                        </div>
                        <span className="text-muted-foreground text-xs">Elit Koç</span>
                      </div>
                    </button>

                    {/* Transformation Images */}
                    {post.type === "transformation" && (
                      <div className="grid grid-cols-2 gap-1 px-4">
                        <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                          <img src={post.beforeImage} alt="Önce" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                            ÖNCE
                          </span>
                        </div>
                        <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden border-2 border-primary/50">
                          <img src={post.afterImage} alt="Sonra" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded">
                            SONRA
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Video Thumbnail */}
                    {post.type === "video" && post.videoThumbnail && (
                      <div className="relative aspect-video mx-4 bg-muted rounded-lg overflow-hidden">
                        <img src={post.videoThumbnail} alt="Video" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
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
                      <button 
                        onClick={() => handleLike(post.id + post.coachId, post.likes)}
                        className={`flex items-center gap-2 transition-colors ${
                          isLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? "fill-destructive" : ""}`} />
                        <span className="text-xs">{displayLikes.toLocaleString()}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs">{post.comments}</span>
                      </button>
                      <button 
                        onClick={() => toast({ title: "Link Kopyalandı (Demo)" })}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ml-auto"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
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
                        <AvatarImage src={coach.avatar} alt={coach.name} className="object-cover" />
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
                      <p className="text-primary text-xs">{coach.specialty}</p>
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
                          <p className="font-display text-lg text-primary">{coach.score.toLocaleString()}</p>
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
            {/* Sub-tabs for Ürünler and Supplementler */}
            <Tabs defaultValue="urunler" className="w-full">
              <TabsList className="w-full grid grid-cols-2 bg-secondary/50 border border-white/5 mb-4">
                <TabsTrigger value="urunler" className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  ÜRÜNLER
                </TabsTrigger>
                <TabsTrigger value="supplementler" className="font-display text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  SUPPLEMENTLER
                </TabsTrigger>
              </TabsList>

              {/* ÜRÜNLER (Products) Sub-Tab */}
              <TabsContent value="urunler" className="mt-0">
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
                  {allProducts.map((product, index) => {
                    const maxDiscount = calculateMaxDiscount(product.price, bioCoins);
                    const isDiscountActive = coinDiscounts[product.id + product.coachId] || false;
                    const coinsNeeded = calculateCoinsNeeded(maxDiscount);
                    const discountedPrice = product.price - maxDiscount;
                    const remainingCoins = bioCoins - coinsNeeded;

                    return (
                      <motion.div
                        key={`${product.id}-${product.coachId}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="glass-card overflow-hidden"
                      >
                        <button
                          onClick={() => handleProductClick(product)}
                          className="w-full text-left"
                        >
                          <div className="aspect-square bg-muted relative">
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <span className="bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                                {product.type === "ebook" ? "E-KİTAP" : product.type === "pdf" ? "PDF" : product.type === "apparel" ? "GİYİM" : "EKİPMAN"}
                              </span>
                            </div>
                            {isDiscountActive && (
                              <div className="absolute top-2 left-2">
                                <span className="bg-stat-hrv text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                                  -{Math.round(maxDiscount)}₺
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                        <div className="p-3">
                          <p className="text-foreground text-xs font-medium line-clamp-2 h-8">
                            {product.title}
                          </p>
                          <p className="text-muted-foreground text-[10px] mt-1">{product.coachName}</p>
                          
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
                          {maxDiscount > 0 && product.bioCoins && (
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
                                    setCoinDiscounts(prev => ({ ...prev, [product.id + product.coachId]: checked }));
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
                                  {hasExcessCoins(product.price, bioCoins) && (
                                    <div className="mt-1 text-[8px] text-primary/70 italic">
                                      Maksimum %20 indirim uygulanabilir
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAddToCart(product)}
                            className={`w-full mt-3 text-xs py-2 rounded-lg font-medium border transition-colors ${
                              isDiscountActive 
                                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" 
                                : "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                            }`}
                          >
                            SEPETE EKLE
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* SUPPLEMENTLER Sub-Tab */}
              <TabsContent value="supplementler" className="mt-0">
                <SupplementShop />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Story Viewer is now global - handled by StoryContext */}

      {/* Cart is now global - handled by UniversalCartDrawer in App.tsx */}

      {/* Product Detail */}
      <ProductDetail
        isOpen={showProductDetail}
        onClose={() => setShowProductDetail(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default Kesfet;
