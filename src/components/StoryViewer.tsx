import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useStory } from "@/context/StoryContext";
import { toast } from "@/hooks/use-toast";

const STORY_DURATION = 5000;
const PROGRESS_INTERVAL = 50;

const StoryViewer = () => {
  const { isOpen, stories, initialIndex, categoryLabel, categoryIcon, categoryGradient, closeStories, onComplete } =
    useStory();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Güvenlik kontrolü: Eğer stories boşsa veya index hatalıysa
  const safeIndex = stories[currentIndex] ? currentIndex : 0;
  const currentStory = stories[safeIndex];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goNext = useCallback(() => {
    clearTimer();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      progressRef.current = 0;
    } else {
      // SON STORY BİTTİĞİNDE
      if (onComplete) {
        // ZİNCİRLEME GEÇİŞ:
        // Burada kapatmıyoruz, onComplete yeni datayı yükleyecek.
        // Biz sadece progress'i sıfırlayıp bekliyoruz.
        onComplete();
      } else {
        closeStories();
      }
    }
  }, [currentIndex, stories.length, closeStories, clearTimer, onComplete]);

  const goPrev = useCallback(() => {
    clearTimer();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    setProgress(0);
    progressRef.current = 0;
  }, [currentIndex, clearTimer]);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      progressRef.current += (PROGRESS_INTERVAL / STORY_DURATION) * 100;

      if (progressRef.current >= 100) {
        goNext();
      } else {
        setProgress(progressRef.current);
      }
    }, PROGRESS_INTERVAL);
  }, [clearTimer, goNext]);

  useEffect(() => {
    if (!isOpen) return;
    if (isPaused || isInputFocused) {
      clearTimer();
    } else {
      startTimer();
    }
    return () => clearTimer();
  }, [isOpen, isPaused, isInputFocused, currentIndex, startTimer, clearTimer]);

  // RESET STATE: Sadece pencere ilk açıldığında VEYA kategori değiştiğinde
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      progressRef.current = 0;
      setIsPaused(false);
      setReplyText("");
      setIsInputFocused(false);
    }
  }, [isOpen, initialIndex, stories]); // stories değişince (yeni kategori) burası tetiklenir ve index sıfırlanır.

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (isInputFocused) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.changedTouches[0].clientX : e.clientX;
    const tapPosition = (clientX - rect.left) / rect.width;
    if (tapPosition < 0.5) goPrev();
    else goNext();
  };

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.closest(".reply-container")) return;
    setIsPaused(true);
  };

  const handlePressEnd = () => {
    if (!isInputFocused) setIsPaused(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!replyText.trim()) return;
    toast({
      title: "Mesaj Gönderildi ✓",
      description: `"${replyText.slice(0, 30)}${replyText.length > 30 ? "..." : ""}" koça iletildi.`,
    });
    setReplyText("");
    setIsInputFocused(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setIsPaused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    setIsPaused(false);
  };

  // isOpen true ise ama henüz story yüklenmediyse null döndür
  if (!isOpen || !currentStory) return null;

  return (
    <AnimatePresence>
      {/* ÖNEMLİ DÜZELTME:
        key={stories[0]?.id} K KALDIRILDI.
        Yerine sabit bir key veya sadece isOpen kontrolü kullanıyoruz.
        Böylece kategori değiştiğinde pencere kapanıp açılmıyor, sadece İÇERİK değişiyor.
      */}
      {isOpen && (
        <motion.div
          key="story-viewer-modal"
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-black touch-none select-none"
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onClick={handleTap}
        >
          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
            {stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                  style={{
                    width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-10 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {categoryIcon && categoryGradient && (
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${categoryGradient} flex items-center justify-center text-white shadow-lg`}
                >
                  {categoryIcon}
                </div>
              )}
              <div>
                {categoryLabel && (
                  <p className="text-white font-display text-sm tracking-wide">{categoryLabel.toUpperCase()}</p>
                )}
                <p className="text-white/60 text-xs">{currentStory.title}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeStories();
              }}
              className="p-2 text-white/80 hover:text-white transition-colors z-30"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Story Content (Image) */}
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            {/* AnimatePresence burada kullanıyoruz ki resimler arası geçiş yumuşak olsun 
               ama arka plan siyah kalsın.
            */}
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentStory.id} // Resim değişince animasyon çalışır
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.8 }} // Çok hafif bir fade-out, titremeyi önler
                transition={{ duration: 0.15 }} // Çok hızlı geçiş
                src={currentStory.content.image}
                alt={currentStory.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
          </div>

          {/* Text Overlay */}
          <div className="absolute bottom-36 left-4 right-4 z-20">
            <motion.div
              key={currentStory.id + "-text"} // Metin değişince animasyon
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4"
            >
              <p className="text-white text-sm leading-relaxed">{currentStory.content.text}</p>
            </motion.div>
          </div>

          {/* Reply Input */}
          <div className="reply-container absolute bottom-6 left-4 right-4 z-30" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSendReply} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Koça mesaj gönder..."
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm placeholder:text-white/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all touch-auto select-auto"
                />
              </div>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${replyText.trim() ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/40"}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Pause Indicator */}
          <AnimatePresence>
            {isPaused && !isInputFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-6 bg-white rounded-sm" />
                    <div className="w-2 h-6 bg-white rounded-sm" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryViewer;
