import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Smile, Frown, Moon, Star, Flame, Sparkles, Brain, Heart } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { DailyCheckIn as DailyCheckInType } from "@/types/shared-models";

interface DailyCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: DailyCheckInType) => void;
}

interface SliderConfig {
  id: keyof Pick<DailyCheckInType, "mood" | "sleep" | "soreness" | "stress">;
  label: string;
  iconLow: React.ReactNode;
  iconHigh: React.ReactNode;
  colorClass: string;
}

const sliderConfigs: SliderConfig[] = [
  {
    id: "mood",
    label: "RUH HALİ",
    iconLow: <Frown className="w-5 h-5" />,
    iconHigh: <Smile className="w-5 h-5" />,
    colorClass: "text-yellow-400",
  },
  {
    id: "sleep",
    label: "UYKU KALİTESİ",
    iconLow: <Moon className="w-5 h-5" />,
    iconHigh: <Star className="w-5 h-5" />,
    colorClass: "text-blue-400",
  },
  {
    id: "soreness",
    label: "KAS AĞRISI",
    iconLow: <Flame className="w-5 h-5" />,
    iconHigh: <Sparkles className="w-5 h-5" />,
    colorClass: "text-orange-400",
  },
  {
    id: "stress",
    label: "STRES SEVİYESİ",
    iconLow: <Brain className="w-5 h-5" />,
    iconHigh: <Heart className="w-5 h-5" />,
    colorClass: "text-pink-400",
  },
];

const DailyCheckIn = ({ isOpen, onClose, onSubmit }: DailyCheckInProps) => {
  const [values, setValues] = useState({
    mood: 7,
    sleep: 7,
    soreness: 5,
    stress: 4,
  });
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSliderChange = (id: keyof typeof values, newValue: number[]) => {
    setValues((prev) => ({ ...prev, [id]: newValue[0] }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const checkInData: DailyCheckInType = {
      date: new Date().toISOString().split("T")[0],
      mood: values.mood,
      sleep: values.sleep,
      soreness: values.soreness,
      stress: values.stress,
      notes,
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    onSubmit?.(checkInData);
    
    toast({
      title: "Check-In Tamamlandı ✓",
      description: "Bugünkü veriler koçuna iletildi.",
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h1 className="font-display text-lg text-foreground">GÜNLÜK CHECK-IN</h1>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1" />
                    GÖNDER
                  </>
                )}
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-4 border-l-2 border-l-primary"
              >
                <p className="text-sm text-muted-foreground">
                  Günlük check-in verilerini girerek koçunun programını optimize etmesine yardımcı ol.
                </p>
              </motion.div>

              {/* Sliders */}
              {sliderConfigs.map((config, index) => (
                <motion.div
                  key={config.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm text-foreground">{config.label}</span>
                    <span className={`font-display text-lg ${config.colorClass}`}>
                      {values[config.id]}/10
                    </span>
                  </div>

                  <div className="relative">
                    <Slider
                      value={[values[config.id]]}
                      onValueChange={(val) => handleSliderChange(config.id, val)}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className={config.colorClass}>{config.iconLow}</span>
                    <span className={config.colorClass}>{config.iconHigh}</span>
                  </div>
                </motion.div>
              ))}

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <label className="font-display text-sm text-foreground">NOTLAR</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Bugün hakkında notlar... (opsiyonel)"
                  className="bg-card/40 border-white/10 min-h-[100px] resize-none"
                />
              </motion.div>

              {/* Submit Button (Mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-4 pb-8"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg"
                >
                  {isSubmitting ? "GÖNDERİLİYOR..." : "CHECK-IN GÖNDER"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyCheckIn;
