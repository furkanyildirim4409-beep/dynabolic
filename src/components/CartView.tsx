import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  discountedPrice?: number;
  coinsUsed?: number;
  image: string;
  coachName: string;
}

interface CartViewProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const CartView = ({ isOpen, onClose, items, onRemoveItem, onClearCart }: CartViewProps) => {
  const subtotal = items.reduce((acc, item) => acc + (item.discountedPrice || item.price), 0);
  const totalCoinsUsed = items.reduce((acc, item) => acc + (item.coinsUsed || 0), 0);

  const handleCheckout = () => {
    toast({
      title: "Ödeme Sayfasına Yönlendiriliyorsunuz (Demo)",
      description: `Toplam: ${subtotal}₺ • ${items.length} ürün`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 w-full max-w-[430px] mx-auto bg-background border-t border-white/10 rounded-t-3xl max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg text-foreground">SEPETİM</h2>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex flex-col h-[calc(100%-72px)]">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-foreground font-medium">Sepetiniz Boş</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Mağazadan ürün ekleyerek alışverişe başlayın
                  </p>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card p-3 flex gap-3"
                      >
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground text-sm font-medium line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            {item.coachName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.discountedPrice ? (
                              <>
                                <span className="text-muted-foreground text-xs line-through">
                                  {item.price}₺
                                </span>
                                <span className="text-primary font-display text-sm">
                                  {item.discountedPrice}₺
                                </span>
                              </>
                            ) : (
                              <span className="text-primary font-display text-sm">
                                {item.price}₺
                              </span>
                            )}
                            {item.coinsUsed && item.coinsUsed > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Coins className="w-3 h-3" />
                                -{item.coinsUsed}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Cart Footer */}
                  <div className="border-t border-white/10 p-4 space-y-4">
                    {/* Summary */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Ara Toplam</span>
                        <span className="text-foreground">{subtotal}₺</span>
                      </div>
                      {totalCoinsUsed > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Coins className="w-4 h-4 text-primary" />
                            Kullanılan Coin
                          </span>
                          <span className="text-primary">{totalCoinsUsed.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-foreground font-display">TOPLAM</span>
                        <span className="text-primary font-display text-xl">{subtotal}₺</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display"
                      >
                        ÖDEMEYE GEÇ
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onClearCart}
                        className="w-full border-white/10 text-muted-foreground hover:text-destructive"
                      >
                        Sepeti Temizle
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartView;
