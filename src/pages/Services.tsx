import { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, Apple, Dumbbell, Check, Star, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import PaymentModal, { PaymentDetails } from "@/components/PaymentModal";
import { toast } from "@/hooks/use-toast";

interface CoachingPackage {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
  color: string;
}

const coachingPackages: CoachingPackage[] = [
  {
    id: "pkg-1",
    title: "1 Aylık Uzaktan Eğitim",
    subtitle: "Kişisel antrenman programı",
    price: 1500,
    duration: "1 Ay",
    icon: <Dumbbell className="w-6 h-6" />,
    features: [
      "Haftalık program güncelleme",
      "7/24 mesaj desteği",
      "Video form analizi",
      "Haftalık check-in görüşmesi",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "pkg-2",
    title: "Beslenme Danışmanlığı",
    subtitle: "Kişiselleştirilmiş diyet planı",
    price: 1200,
    duration: "1 Ay",
    icon: <Apple className="w-6 h-6" />,
    features: [
      "Detaylı beslenme analizi",
      "Makro hesaplama",
      "Supplement önerileri",
      "Haftalık menü planı",
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "pkg-3",
    title: "VIP Koçluk Paketi",
    subtitle: "Antrenman + Beslenme + Yaşam Koçluğu",
    price: 3500,
    duration: "1 Ay",
    icon: <Star className="w-6 h-6" />,
    features: [
      "Sınırsız iletişim",
      "Günlük program ayarı",
      "Aylık yüz yüze görüşme",
      "Özel supplement planı",
      "Mental koçluk desteği",
      "Öncelikli destek",
    ],
    popular: true,
    color: "from-primary to-yellow-500",
  },
  {
    id: "pkg-4",
    title: "3 Aylık Dönüşüm",
    subtitle: "Uzun vadeli hedefler için",
    price: 4000,
    duration: "3 Ay",
    icon: <Calendar className="w-6 h-6" />,
    features: [
      "12 haftalık periodizasyon",
      "Aylık vücut analizi",
      "Progress fotoğraf takibi",
      "Deload hafta planlaması",
      "%20 indirimli fiyat",
    ],
    color: "from-purple-500 to-pink-500",
  },
];

const fireConfetti = () => {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ["#CDDC39", "#8BC34A", "#4CAF50"] });
  fire(0.2, { spread: 60, colors: ["#CDDC39", "#8BC34A", "#4CAF50"] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#CDDC39", "#8BC34A", "#4CAF50"] });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ["#CDDC39", "#8BC34A", "#4CAF50"] });
};

const Services = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<CoachingPackage | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePurchase = (pkg: CoachingPackage) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const getPaymentDetails = (): PaymentDetails | null => {
    if (!selectedPackage) return null;
    return {
      amount: selectedPackage.price,
      title: selectedPackage.title,
      description: `${selectedPackage.duration} • ${selectedPackage.subtitle}`,
      type: "coaching",
      referenceId: selectedPackage.id,
    };
  };

  const handlePaymentSuccess = () => {
    fireConfetti();
    toast({
      title: "Paket Satın Alındı! 🎉",
      description: `${selectedPackage?.title} başarıyla aktif edildi.`,
    });
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl text-foreground">HİZMETLER</h1>
            <p className="text-muted-foreground text-xs">Koçluk Paketleri</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-lg text-foreground mb-2">
            ELİT KOÇLUK DENEYİMİ
          </h2>
          <p className="text-muted-foreground text-sm">
            Profesyonel koçlarımızla hedeflerinize ulaşın. Kişiselleştirilmiş programlar, 7/24 destek.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-green-500" />
            <span>%100 Memnuniyet Garantisi</span>
          </div>
        </motion.div>

        {/* Packages Grid */}
        <div className="space-y-4">
          {coachingPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-5 relative overflow-hidden ${
                pkg.popular ? "border-primary/50" : ""
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                  POPÜLER
                </div>
              )}

              {/* Gradient Background */}
              <div 
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pkg.color} opacity-10 blur-3xl rounded-full`}
              />

              <div className="flex items-start gap-4 relative">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center text-white flex-shrink-0`}>
                  {pkg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-sm text-foreground">{pkg.title}</h3>
                      <p className="text-xs text-muted-foreground">{pkg.subtitle}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display text-xl text-primary">{pkg.price}₺</p>
                      <p className="text-[10px] text-muted-foreground">{pkg.duration}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-3 space-y-1.5">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Purchase Button */}
                  <Button
                    onClick={() => handlePurchase(pkg)}
                    className={`w-full mt-4 h-10 font-display text-sm tracking-wider ${
                      pkg.popular 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "bg-white/10 text-foreground hover:bg-white/20"
                    }`}
                  >
                    SATIN AL
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 py-4"
        >
          <div className="text-center">
            <p className="font-display text-xl text-primary">500+</p>
            <p className="text-[10px] text-muted-foreground">Başarılı Dönüşüm</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="font-display text-xl text-primary">4.9</p>
            <p className="text-[10px] text-muted-foreground">Ortalama Puan</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="font-display text-xl text-primary">10+</p>
            <p className="text-[10px] text-muted-foreground">Yıl Deneyim</p>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        payment={getPaymentDetails()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Services;
