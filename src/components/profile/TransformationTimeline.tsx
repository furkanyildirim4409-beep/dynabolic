import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, TrendingDown, ArrowLeftRight, ChevronLeft, ChevronRight, X, Check, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
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
  
  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState(1);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

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
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsPanning(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  // Reset zoom when closing modal
  useEffect(() => {
    if (!showCompare) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [showCompare]);

  // Calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle pinch zoom start
  const handlePinchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      setInitialPinchDistance(distance);
      setInitialScale(scale);
    }
  };

  // Handle pinch zoom move
  const handlePinchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const newScale = Math.min(Math.max(initialScale * (distance / initialPinchDistance), 1), 4);
      setScale(newScale);
      
      // If zooming out to 1x, reset position
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  // Handle pinch zoom end
  const handlePinchEnd = () => {
    setInitialPinchDistance(null);
  };

  // Handle pan start (single finger when zoomed)
  const handlePanStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (scale <= 1) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsPanning(true);
    setLastPanPosition({ x: clientX, y: clientY });
  };

  // Handle pan move
  const handlePanMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isPanning || scale <= 1) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - lastPanPosition.x;
    const deltaY = clientY - lastPanPosition.y;
    
    // Calculate bounds based on zoom level
    const maxOffset = (scale - 1) * 100;
    
    setPosition(prev => ({
      x: Math.min(Math.max(prev.x + deltaX, -maxOffset), maxOffset),
      y: Math.min(Math.max(prev.y + deltaY, -maxOffset), maxOffset),
    }));
    
    setLastPanPosition({ x: clientX, y: clientY });
  };

  // Handle zoom buttons
  const handleZoomIn = () => {
    hapticLight();
    setScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    hapticLight();
    const newScale = Math.max(scale - 0.5, 1);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleResetZoom = () => {
    hapticMedium();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle double-tap to zoom
  const lastTapRef = useRef<number>(0);
  const handleDoubleTap = (e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300 && e.touches.length === 1) {
      e.preventDefault();
      if (scale > 1) {
        handleResetZoom();
      } else {
        hapticMedium();
        setScale(2.5);
      }
    }
    lastTapRef.current = now;
  };

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

            {/* Comparison View with Pinch-to-Zoom */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              <div
                ref={zoomContainerRef}
                className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden"
                onTouchStart={(e) => {
                  if (e.touches.length === 2) {
                    handlePinchStart(e);
                  } else if (e.touches.length === 1 && scale > 1) {
                    handlePanStart(e);
                  }
                  handleDoubleTap(e);
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 2) {
                    handlePinchMove(e);
                  } else if (e.touches.length === 1 && isPanning) {
                    handlePanMove(e);
                  } else if (isDragging && scale === 1) {
                    handleTouchMove(e);
                  }
                }}
                onTouchEnd={handlePinchEnd}
                onMouseDown={(e) => {
                  if (scale > 1) {
                    handlePanStart(e);
                  }
                }}
                onMouseMove={(e) => {
                  if (isPanning) {
                    handlePanMove(e);
                  } else if (isDragging && scale === 1) {
                    handleMouseMove(e);
                  }
                }}
              >
                {/* Zoomable Content Container */}
                <motion.div
                  className="absolute inset-0 touch-none select-none"
                  animate={{
                    scale: scale,
                    x: position.x,
                    y: position.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ transformOrigin: "center center" }}
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
                </motion.div>

                {/* Slider Handle - Only visible when not zoomed */}
                {scale === 1 && (
                  <div
                    ref={sliderContainerRef}
                    className="absolute inset-0"
                    onMouseMove={handleMouseMove}
                  >
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
                  </div>
                )}

                {/* Labels - Fade when zoomed */}
                <motion.div 
                  className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full z-20"
                  animate={{ opacity: scale > 1.5 ? 0 : 1 }}
                >
                  <p className="text-white text-xs font-bold">ÖNCE</p>
                </motion.div>
                <motion.div 
                  className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full z-20"
                  animate={{ opacity: scale > 1.5 ? 0 : 1 }}
                >
                  <p className="text-primary-foreground text-xs font-bold">SONRA</p>
                </motion.div>

                {/* Stats Overlay - Fade when zoomed */}
                <motion.div 
                  className="absolute bottom-4 left-4 right-4 flex justify-between z-20"
                  animate={{ opacity: scale > 1.5 ? 0 : 1 }}
                >
                  <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-xl">
                    <p className="text-white font-display text-lg">{beforePhoto.weight}kg</p>
                    <p className="text-white/70 text-xs">{beforePhoto.bodyFat}% yağ</p>
                  </div>
                  <div className="bg-primary/90 backdrop-blur-sm px-3 py-2 rounded-xl text-right">
                    <p className="text-primary-foreground font-display text-lg">{afterPhoto.weight}kg</p>
                    <p className="text-primary-foreground/80 text-xs">{afterPhoto.bodyFat}% yağ</p>
                  </div>
                </motion.div>

                {/* Zoom Level Indicator */}
                <AnimatePresence>
                  {scale > 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full z-30"
                    >
                      <p className="text-white text-xs font-medium">{scale.toFixed(1)}x</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomIn}
                disabled={scale >= 4}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center disabled:opacity-30"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomOut}
                disabled={scale <= 1}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center disabled:opacity-30"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </motion.button>
              {scale > 1 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleResetZoom}
                  className="w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm border border-primary/50 flex items-center justify-center"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </motion.button>
              )}
            </div>

            {/* Zoom Hint */}
            <AnimatePresence>
              {scale === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full z-20"
                >
                  <p className="text-white/80 text-xs flex items-center gap-2">
                    <ZoomIn className="w-3 h-3" />
                    Yakınlaştırmak için çift dokun veya kıstır
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

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
