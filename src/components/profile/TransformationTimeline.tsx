import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, TrendingDown, ArrowLeftRight, ChevronLeft, ChevronRight, X, Check, ZoomIn } from "lucide-react";
import { hapticLight, hapticMedium } from "@/lib/haptics";

interface TransformationPhoto {
  id: string;
  date: string;
  dayNumber: number;
  imageUrl: string;
  weight: number;
  bodyFat: number;
}

// Mock transformation data
const mockTransformationPhotos: TransformationPhoto[] = [
  { id: "1", date: "2025-08-01", dayNumber: 1, imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop", weight: 92, bodyFat: 24.5 },
  { id: "2", date: "2025-09-01", dayNumber: 30, imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop", weight: 89, bodyFat: 22.1 },
  { id: "3", date: "2025-10-01", dayNumber: 60, imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop", weight: 85, bodyFat: 19.8 },
  { id: "4", date: "2025-11-01", dayNumber: 90, imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=600&fit=crop", weight: 82, bodyFat: 17.2 },
  { id: "5", date: "2025-12-01", dayNumber: 120, imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=600&fit=crop", weight: 79, bodyFat: 14.8 },
  { id: "6", date: "2026-01-01", dayNumber: 150, imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=600&fit=crop", weight: 78.5, bodyFat: 12.4 },
];

interface TransformationTimelineProps {
  compact?: boolean;
}

const TransformationTimeline = ({ compact = false }: TransformationTimelineProps) => {
  const [showCompare, setShowCompare] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<TransformationPhoto | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<TransformationPhoto | null>(null);
  const [selectionMode, setSelectionMode] = useState<"before" | "after" | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const photos = mockTransformationPhotos;

  // Calculate total progress
  const totalWeightLoss = photos[0].weight - photos[photos.length - 1].weight;
  const totalFatLoss = photos[0].bodyFat - photos[photos.length - 1].bodyFat;

  const handlePhotoSelect = (photo: TransformationPhoto) => {
    hapticLight();
    
    if (selectionMode === "before") {
      setBeforePhoto(photo);
      setSelectionMode("after");
    } else if (selectionMode === "after") {
      setAfterPhoto(photo);
      setSelectionMode(null);
      setShowCompare(true);
      hapticMedium();
    }
  };

  const startComparison = () => {
    hapticMedium();
    setSelectionMode("before");
    setBeforePhoto(null);
    setAfterPhoto(null);
  };

  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    hapticLight();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  const scrollTimeline = (direction: "left" | "right") => {
    if (!timelineRef.current) return;
    hapticLight();
    const scrollAmount = 200;
    timelineRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={startComparison}
        className="glass-card p-4 w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-sm text-foreground">DÖNÜŞÜM</h3>
              <p className="text-muted-foreground text-xs">Karşılaştır</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-primary font-display text-lg">-{totalWeightLoss.toFixed(1)}kg</p>
            <p className="text-muted-foreground text-[10px]">{photos.length} fotoğraf</p>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg text-foreground tracking-wide">
              DÖNÜŞÜM YOLCULUĞU
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startComparison}
            className="px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center gap-1"
          >
            <ArrowLeftRight className="w-3 h-3" />
            Karşılaştır
          </motion.button>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-primary/10 border border-primary/30 rounded-xl">
            <p className="text-primary font-display text-xl">-{totalWeightLoss.toFixed(1)}</p>
            <p className="text-muted-foreground text-[10px]">KG KAYIP</p>
          </div>
          <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <p className="text-emerald-400 font-display text-xl">-{totalFatLoss.toFixed(1)}%</p>
            <p className="text-muted-foreground text-[10px]">YAĞ ORANI</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-xl">
            <p className="text-foreground font-display text-xl">{photos[photos.length - 1].dayNumber}</p>
            <p className="text-muted-foreground text-[10px]">GÜN</p>
          </div>
        </div>

        {/* Selection Mode Indicator */}
        <AnimatePresence>
          {selectionMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary/10 border border-primary/30 rounded-xl p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectionMode === "before" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}>
                    {beforePhoto ? <Check className="w-4 h-4" /> : "1"}
                  </div>
                  <div className="w-8 h-0.5 bg-white/20" />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectionMode === "after" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}>
                    {afterPhoto ? <Check className="w-4 h-4" /> : "2"}
                  </div>
                </div>
                <p className="text-primary text-sm font-medium">
                  {selectionMode === "before" ? '"Önce" fotoğrafı seç' : '"Sonra" fotoğrafı seç'}
                </p>
                <button 
                  onClick={() => setSelectionMode(null)}
                  className="p-1 rounded-full bg-white/10"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline Navigation */}
        <div className="relative">
          <button
            onClick={() => scrollTimeline("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>

          <div
            ref={timelineRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-8"
          >
            {photos.map((photo, index) => (
              <motion.button
                key={photo.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectionMode && handlePhotoSelect(photo)}
                className={`relative flex-shrink-0 w-24 group ${
                  selectionMode ? "cursor-pointer" : ""
                } ${
                  (beforePhoto?.id === photo.id || afterPhoto?.id === photo.id) 
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-xl" 
                    : ""
                }`}
              >
                {/* Photo */}
                <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={photo.imageUrl}
                    alt={`Gün ${photo.dayNumber}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Data Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white font-display text-xs">{photo.weight}kg</p>
                    <p className="text-white/70 text-[10px]">{photo.bodyFat}%</p>
                  </div>

                  {/* Selection Indicator */}
                  {beforePhoto?.id === photo.id && (
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                      ÖNCE
                    </div>
                  )}
                  {afterPhoto?.id === photo.id && (
                    <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                      SONRA
                    </div>
                  )}

                  {/* Hover Zoom */}
                  {!selectionMode && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Day Label */}
                <div className="mt-2 text-center">
                  <p className="text-foreground text-xs font-medium">
                    {index === 0 ? "1. Gün" : index === photos.length - 1 ? "Bugün" : `${photo.dayNumber}. Gün`}
                  </p>
                  <p className="text-muted-foreground text-[10px]">
                    {new Date(photo.date).toLocaleDateString("tr-TR", { month: "short" })}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => scrollTimeline("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Progress Line */}
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary via-emerald-500 to-primary rounded-full"
          />
          {/* Day Markers */}
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background"
              style={{ left: `${(index / (photos.length - 1)) * 100}%`, transform: "translate(-50%, -50%)" }}
            />
          ))}
        </div>
      </motion.div>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && beforePhoto && afterPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/95 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-muted-foreground text-[10px]">ÖNCE</p>
                  <p className="text-foreground font-display text-sm">Gün {beforePhoto.dayNumber}</p>
                </div>
                <ArrowLeftRight className="w-4 h-4 text-primary" />
                <div className="text-center">
                  <p className="text-muted-foreground text-[10px]">SONRA</p>
                  <p className="text-foreground font-display text-sm">Gün {afterPhoto.dayNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompare(false)}
                className="p-2 rounded-full bg-white/10"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Comparison View */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div
                ref={sliderContainerRef}
                className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden touch-none select-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* After Image (Bottom Layer) */}
                <img
                  src={afterPhoto.imageUrl}
                  alt="Sonra"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

                {/* Before Image (Top Layer with Clip) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={beforePhoto.imageUrl}
                    alt="Önce"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
                  style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                >
                  {/* Handle Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-background" />
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <p className="text-white text-xs font-bold">ÖNCE</p>
                </div>
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <p className="text-primary-foreground text-xs font-bold">SONRA</p>
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-xl">
                    <p className="text-white font-display text-lg">{beforePhoto.weight}kg</p>
                    <p className="text-white/70 text-xs">{beforePhoto.bodyFat}% yağ</p>
                  </div>
                  <div className="bg-primary/90 backdrop-blur-sm px-3 py-2 rounded-xl text-right">
                    <p className="text-primary-foreground font-display text-lg">{afterPhoto.weight}kg</p>
                    <p className="text-primary-foreground/80 text-xs">{afterPhoto.bodyFat}% yağ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-white/10">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-primary font-display text-2xl">
                    -{(beforePhoto.weight - afterPhoto.weight).toFixed(1)}
                  </p>
                  <p className="text-muted-foreground text-xs">KG KAYIP</p>
                </div>
                <div>
                  <p className="text-emerald-400 font-display text-2xl">
                    -{(beforePhoto.bodyFat - afterPhoto.bodyFat).toFixed(1)}%
                  </p>
                  <p className="text-muted-foreground text-xs">YAĞ KAYBI</p>
                </div>
                <div>
                  <p className="text-foreground font-display text-2xl">
                    {afterPhoto.dayNumber - beforePhoto.dayNumber}
                  </p>
                  <p className="text-muted-foreground text-xs">GÜN ARASI</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TransformationTimeline;
