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
  Coins,
  Check
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { getCoachById, coaches } from "@/lib/mockData";
import ProductDetail from "@/components/ProductDetail";
import CartView, { CartItem } from "@/components/CartView";

const CoachProfile = () => {
  const navigate = useNavigate();
  const { coachId } = useParams();
  const [selectedStory, setSelectedStory] = useState<{ id: string; title: string; thumbnail: string } | null>(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Get coach by ID - fallback to first coach if not found
  const coach = getCoachById(coachId || "1") || coaches[0];

  const handleLike = (postId: string) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct({
      ...product,
      coachName: coach.name,
      coachId: coach.id
    });
    setShowProductDetail(true);
  };

  const handleAddToCart = (product: any) => {
    const cartItem: CartItem = {
      id: `${product.id}-${coach.id}-${Date.now()}`,
      title: product.title,
      price: product.price,
      image: product.image,
      coachName: coach.name,
    };

    setCart(prev => [...prev, cartItem]);
    setShowCart(true);

    toast({
      title: "Sepete Eklendi ✓",
      description: `"${product.title}" sepetinize eklendi.`,
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
    toast({
      title: "Sepet Temizlendi",
      description: "Tüm ürünler sepetten kaldırıldı.",
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Takipten Çıkıldı" : "Takip Edildi!",
      description: isFollowing ? `${coach.name} takipten çıkarıldı.` : `${coach.name} takip edilmeye başlandı.`,
    });
  };

  const handleMessage = () => {
    toast({
      title: "Mesaj (Demo)",
      description: `${coach.name} ile mesajlaşma yakında aktif olacak!`,
    });
  };

  const handlePackageSelect = (pkg: { id: string; title: string; price: number; description: string }) => {
    const cartItem: CartItem = {
      id: `pkg-${pkg.id}-${coach.id}-${Date.now()}`,
      title: pkg.title,
      price: pkg.price,
      image: coach.avatar,
      coachName: coach.name,
    };

    setCart(prev => [...prev, cartItem]);
    setShowCart(true);

    toast({
      title: "Paket Sepete Eklendi ✓",
      description: `"${pkg.title}" sepetinize eklendi.`,
    });
  };

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
                      {coach.name.charAt(4)}
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
              onClick={handleFollow}
              className={`flex-1 py-3 font-display text-sm rounded-xl flex items-center justify-center gap-2 ${
                isFollowing 
                  ? "bg-secondary text-foreground border border-white/10" 
                  : "bg-primary text-primary-foreground neon-glow"
              }`}
            >
              {isFollowing && <Check className="w-4 h-4" />}
              {isFollowing ? "TAKİP EDİLİYOR" : "TAKİP ET"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMessage}
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
            {coach.posts.map((post) => {
              const isLiked = likedPosts[post.id];
              const displayLikes = isLiked ? post.likes + 1 : post.likes;
              
              return (
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

                  {post.type === "video" && post.videoThumbnail && (
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
                    <button 
                      onClick={() => handleLike(post.id)}
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
          </TabsContent>

          {/* Shop Tab */}
          <TabsContent value="shop" className="mt-0 p-4">
            {/* Cart Button */}
            <div className="flex justify-end mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative p-2 glass-card"
              >
                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                {cart.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-[10px] font-bold">{cart.length}</span>
                  </div>
                )}
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {coach.products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-full mt-3 py-2 bg-primary text-primary-foreground font-display text-xs rounded-lg"
                    >
                      SEPETE EKLE
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
                className={`glass-card p-4 ${index === 0 ? "border-2 border-primary" : ""}`}
              >
                {index === 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                      EN POPÜLER
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display text-lg text-foreground">{pkg.title}</h3>
                    <p className="text-muted-foreground text-xs mt-1">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl text-primary">{pkg.price.toLocaleString()}₺</p>
                    <p className="text-muted-foreground text-[10px]">/ ay</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePackageSelect(pkg)}
                  className={`w-full py-3 font-display text-sm rounded-xl ${
                    index === 0 
                      ? "bg-primary text-primary-foreground neon-glow" 
                      : "bg-secondary text-foreground border border-white/10"
                  }`}
                >
                  PAKETİ SEÇ
                </motion.button>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Story/Highlight Viewer Overlay */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
            onClick={() => setSelectedStory(null)}
          >
            {/* Story Progress */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              {coach.highlights.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: selectedStory.id === coach.highlights[i].id ? "100%" : "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-primary">
                  <AvatarImage src={coach.avatar} className="object-cover" />
                  <AvatarFallback>{coach.name.charAt(4)}</AvatarFallback>
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

            {/* Content */}
            <div className="absolute inset-0">
              <img 
                src={selectedStory.thumbnail.replace("w=100&h=100", "w=800&h=1200")} 
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>

            {/* Title */}
            <div className="absolute bottom-24 left-4 right-4 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h3 className="font-display text-2xl text-white mb-2">{selectedStory.title}</h3>
                <p className="text-white/70 text-sm">{coach.name} • {coach.specialty}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <ProductDetail
        isOpen={showProductDetail}
        onClose={() => setShowProductDetail(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Cart View */}
      <CartView
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
    </>
  );
};

export default CoachProfile;
