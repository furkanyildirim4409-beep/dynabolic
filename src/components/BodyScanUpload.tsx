import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface BodyScanUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type UploadSlot = "front" | "side";

interface UploadState {
  front: { image: string | null; progress: number };
  side: { image: string | null; progress: number };
}

const BodyScanUpload = ({ isOpen, onClose, onComplete }: BodyScanUploadProps) => {
  const [uploads, setUploads] = useState<UploadState>({
    front: { image: null, progress: 0 },
    side: { image: null, progress: 0 },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (slot: UploadSlot) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload progress
    setUploads(prev => ({
      ...prev,
      [slot]: { ...prev[slot], progress: 10 },
    }));

    const reader = new FileReader();
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploads(prev => {
        const current = prev[slot].progress;
        if (current >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return {
          ...prev,
          [slot]: { ...prev[slot], progress: current + 20 },
        };
      });
    }, 100);

    reader.onload = () => {
      clearInterval(progressInterval);
      setUploads(prev => ({
        ...prev,
        [slot]: { image: reader.result as string, progress: 100 },
      }));
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (slot: UploadSlot) => {
    setUploads(prev => ({
      ...prev,
      [slot]: { image: null, progress: 0 },
    }));
    // Reset the file input
    if (slot === "front" && frontInputRef.current) {
      frontInputRef.current.value = "";
    } else if (slot === "side" && sideInputRef.current) {
      sideInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!uploads.front.image || !uploads.side.image) {
      toast({
        title: "Eksik Fotoğraf",
        description: "Lütfen her iki açıdan da fotoğraf yükleyin.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Fotoğraflar Gönderildi",
      description: "Koçunuz en kısa sürede inceleyecek.",
    });

    onComplete?.();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setUploads({
        front: { image: null, progress: 0 },
        side: { image: null, progress: 0 },
      });
      setIsSubmitted(false);
      onClose();
    }
  };

  const renderUploadSlot = (slot: UploadSlot, label: string, inputRef: React.RefObject<HTMLInputElement>) => {
    const { image, progress } = uploads[slot];
    const isUploading = progress > 0 && progress < 100;

    return (
      <div className="flex-1">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageSelect(slot)}
          className="hidden"
          id={`${slot}-upload`}
        />
        
        <motion.label
          htmlFor={`${slot}-upload`}
          className={`
            relative flex flex-col items-center justify-center
            aspect-[3/4] rounded-2xl border-2 border-dashed cursor-pointer
            transition-colors overflow-hidden
            ${image 
              ? "border-primary/50 bg-primary/5" 
              : "border-white/20 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50"
            }
          `}
          whileHover={{ scale: image ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {image ? (
            <>
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
                src={image}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveImage(slot);
                }}
                className="absolute top-2 right-2 p-2 bg-destructive/80 rounded-full hover:bg-destructive transition-colors z-10"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
              
              <span className="absolute bottom-3 left-3 text-white text-sm font-medium">
                {label}
              </span>
            </>
          ) : (
            <>
              {isUploading ? (
                <div className="flex flex-col items-center gap-3 p-4 w-full">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <Progress value={progress} className="w-full h-1" />
                  <span className="text-muted-foreground text-xs">{progress}%</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground text-sm font-medium">{label}</span>
                  <span className="text-muted-foreground text-xs">Dokunun</span>
                </div>
              )}
            </>
          )}
        </motion.label>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 top-12 bg-background rounded-t-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg text-foreground">VÜCUT TARAMA</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-stat-hrv/20 flex items-center justify-center">
                    <Check className="w-10 h-10 text-stat-hrv" />
                  </div>
                  <h3 className="font-display text-xl text-foreground">GÖNDERILDI</h3>
                  <div className="inline-block bg-stat-hrv/20 text-stat-hrv text-xs px-4 py-2 rounded-full">
                    Koç Onayı Bekleniyor
                  </div>
                  <p className="text-muted-foreground text-sm text-center max-w-xs">
                    Fotoğraflarınız koçunuza iletildi. İnceleme sonucu size bildirilecek.
                  </p>
                  <Button onClick={handleClose} variant="outline" className="mt-4">
                    Kapat
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Upload Slots */}
                  <div className="flex gap-4">
                    {renderUploadSlot("front", "ÖN GÖRÜNÜM", frontInputRef)}
                    {renderUploadSlot("side", "YAN GÖRÜNÜM", sideInputRef)}
                  </div>

                  {/* Instructions */}
                  <div className="glass-card p-4 space-y-2">
                    <p className="text-foreground text-sm font-medium">📸 Fotoğraf İpuçları</p>
                    <ul className="text-muted-foreground text-xs space-y-1">
                      <li>• Fotoğraf çekerken düz durun</li>
                      <li>• Aydınlık bir ortamda çekim yapın</li>
                      <li>• Sıkı kıyafetler tercih edin</li>
                      <li>• Aynı pozisyonu koruyun</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!uploads.front.image || !uploads.side.image || isSubmitting}
                    className="w-full h-14 text-lg font-display neon-glow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        GÖNDERİLİYOR...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        KOÇA GÖNDER
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BodyScanUpload;
