import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, Video, Upload, X, Check, Play, 
  Image as ImageIcon, Loader2, CheckCircle, Clock,
  ThumbsUp, ThumbsDown, ShieldCheck, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { hapticLight, hapticSuccess, hapticMedium, hapticError } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";

export interface ProofSubmission {
  id: string;
  type: "photo" | "video";
  url: string;
  thumbnail?: string;
  weight?: number;
  note?: string;
  timestamp: string;
  status: "pending" | "verified" | "rejected";
  submittedBy: string;
  submittedByName?: string;
  submittedByAvatar?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

interface ChallengeProofSubmissionProps {
  challengeId: string;
  challengeType: "pr" | "streak";
  exercise?: string;
  targetValue: number;
  existingProofs?: ProofSubmission[];
  onProofSubmitted?: (proof: ProofSubmission) => void;
  onProofVerified?: (proofId: string, verified: boolean, reason?: string) => void;
  isOpponent?: boolean;
  opponentName?: string;
  opponentAvatar?: string;
}

const ChallengeProofSubmission = ({
  challengeId,
  challengeType,
  exercise,
  targetValue,
  existingProofs = [],
  onProofSubmitted,
  onProofVerified,
  isOpponent = false,
  opponentName,
  opponentAvatar,
}: ChallengeProofSubmissionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"photo" | "video" | null>(null);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [verifyingProofId, setVerifyingProofId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Separate proofs into mine and opponent's
  const myProofs = existingProofs.filter(p => p.submittedBy === "current");
  const opponentProofs = existingProofs.filter(p => p.submittedBy !== "current");
  const pendingOpponentProofs = opponentProofs.filter(p => p.status === "pending");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB for videos, 10MB for photos)
    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Dosya çok büyük",
        description: `Maksimum boyut: ${type === "video" ? "50MB" : "10MB"}`,
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewType(type);
    setShowForm(true);
    hapticLight();
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const handleVideoCapture = () => {
    videoInputRef.current?.click();
  };

  const handleCancelPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewType(null);
    setShowForm(false);
    setWeight("");
    setNote("");
    hapticLight();
  };

  const handleSubmitProof = async () => {
    if (!previewUrl || !previewType) return;
    
    // Validate weight for PR challenges
    if (challengeType === "pr" && !weight) {
      toast({
        title: "Ağırlık gerekli",
        description: "Lütfen kaldırdığınız ağırlığı girin",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    hapticMedium();

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 150));
      setUploadProgress(i);
    }

    // Create proof object
    const proof: ProofSubmission = {
      id: `proof-${Date.now()}`,
      type: previewType,
      url: previewUrl,
      weight: challengeType === "pr" ? parseFloat(weight) : undefined,
      note: note || undefined,
      timestamp: new Date().toISOString(),
      status: "pending",
      submittedBy: "current",
      submittedByName: "Sen",
      submittedByAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop",
    };

    setIsUploading(false);
    setUploadProgress(0);
    hapticSuccess();

    toast({
      title: "Kanıt yüklendi! 📸",
      description: "Rakibin onayı bekleniyor",
    });

    onProofSubmitted?.(proof);
    handleCancelPreview();
  };

  const handleVerifyProof = async (proofId: string, verified: boolean) => {
    setVerifyingProofId(proofId);
    hapticMedium();
    
    // Simulate verification process
    await new Promise(r => setTimeout(r, 500));
    
    if (verified) {
      hapticSuccess();
      toast({
        title: "Kanıt onaylandı! ✅",
        description: "Rakibinin kanıtı kabul edildi",
      });
      onProofVerified?.(proofId, true);
    } else {
      if (!rejectionReason.trim()) {
        setShowRejectionForm(proofId);
        setVerifyingProofId(null);
        return;
      }
      hapticError();
      toast({
        title: "Kanıt reddedildi",
        description: "Rakibine bildirim gönderildi",
      });
      onProofVerified?.(proofId, false, rejectionReason);
      setShowRejectionForm(null);
      setRejectionReason("");
    }
    
    setVerifyingProofId(null);
  };

  const getStatusBadge = (status: ProofSubmission["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 text-yellow-400 text-[10px]">
            <Clock className="w-3 h-3" />
            Bekliyor
          </span>
        );
      case "verified":
        return (
          <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
            <CheckCircle className="w-3 h-3" />
            Onaylandı
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-red-400 text-[10px]">
            <X className="w-3 h-3" />
            Reddedildi
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "photo")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "video")}
      />

      {/* Pending Opponent Proofs to Verify */}
      {pendingOpponentProofs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            <h4 className="text-foreground text-sm font-medium">Onay Bekleyen Kanıtlar</h4>
            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-medium">
              {pendingOpponentProofs.length}
            </span>
          </div>
          
          {pendingOpponentProofs.map((proof) => (
            <motion.div
              key={proof.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-3 space-y-3 border-yellow-500/30"
            >
              {/* Submitter Info */}
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={proof.submittedByAvatar || opponentAvatar} className="object-cover" />
                  <AvatarFallback className="bg-orange-500/20 text-orange-400 text-xs">
                    {(proof.submittedByName || opponentName || "R").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-foreground text-sm font-medium">
                    {proof.submittedByName || opponentName || "Rakip"}
                  </p>
                  <p className="text-muted-foreground text-[10px]">
                    {new Date(proof.timestamp).toLocaleDateString("tr-TR", { 
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" 
                    })}
                  </p>
                </div>
                {proof.weight && (
                  <span className="px-2 py-1 rounded-lg bg-primary/20 text-primary font-display text-sm">
                    {proof.weight}kg
                  </span>
                )}
              </div>

              {/* Media Preview */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-secondary">
                {proof.type === "photo" ? (
                  <img
                    src={proof.url}
                    alt="Proof"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={proof.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Note if exists */}
              {proof.note && (
                <p className="text-muted-foreground text-xs italic">"{proof.note}"</p>
              )}

              {/* Rejection Form */}
              <AnimatePresence>
                {showRejectionForm === proof.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      Reddetme sebebi gerekli
                    </div>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Neden bu kanıtı reddediyorsun?"
                      className="bg-secondary border-red-500/30 text-sm min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowRejectionForm(null);
                          setRejectionReason("");
                        }}
                        className="flex-1"
                      >
                        İptal
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleVerifyProof(proof.id, false)}
                        disabled={!rejectionReason.trim() || verifyingProofId === proof.id}
                        className="flex-1 bg-red-500 hover:bg-red-600"
                      >
                        {verifyingProofId === proof.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-1" />
                            Reddet
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verification Buttons */}
              {showRejectionForm !== proof.id && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerifyProof(proof.id, false)}
                    disabled={verifyingProofId === proof.id}
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Reddet
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleVerifyProof(proof.id, true)}
                    disabled={verifyingProofId === proof.id}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  >
                    {verifyingProofId === proof.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Onayla
                      </>
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* My Submitted Proofs */}
      {myProofs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-foreground text-sm font-medium">Senin Kanıtların</h4>
          <div className="grid grid-cols-2 gap-2">
            {myProofs.map((proof) => (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-secondary"
              >
                {proof.type === "photo" ? (
                  <img
                    src={proof.url}
                    alt="Proof"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={proof.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
                  {getStatusBadge(proof.status)}
                </div>

                {/* Weight Badge for PR */}
                {proof.weight && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-primary/80 backdrop-blur-sm">
                    <span className="text-primary-foreground text-xs font-display">
                      {proof.weight}kg
                    </span>
                  </div>
                )}

                {/* Rejection reason tooltip */}
                {proof.status === "rejected" && proof.rejectionReason && (
                  <div className="absolute bottom-2 right-2 left-2 px-2 py-1 rounded-lg bg-red-500/80 backdrop-blur-sm">
                    <p className="text-white text-[10px] truncate">{proof.rejectionReason}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Opponent Proofs */}
      {opponentProofs.filter(p => p.status !== "pending").length > 0 && (
        <div className="space-y-2">
          <h4 className="text-foreground text-sm font-medium">Rakip Kanıtları</h4>
          <div className="grid grid-cols-2 gap-2">
            {opponentProofs.filter(p => p.status !== "pending").map((proof) => (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-secondary"
              >
                {proof.type === "photo" ? (
                  <img
                    src={proof.url}
                    alt="Proof"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={proof.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
                  {getStatusBadge(proof.status)}
                </div>

                {/* Weight Badge */}
                {proof.weight && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-orange-500/80 backdrop-blur-sm">
                    <span className="text-white text-xs font-display">
                      {proof.weight}kg
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Preview */}
      <AnimatePresence>
        {showForm && previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Preview */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-secondary">
              {previewType === "photo" ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Cancel button */}
              <button
                onClick={handleCancelPreview}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Upload progress overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                  <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <p className="text-white text-sm mt-2">{uploadProgress}%</p>
                </div>
              )}
            </div>

            {/* Weight input for PR challenges */}
            {challengeType === "pr" && (
              <div>
                <label className="text-muted-foreground text-xs mb-1 block">
                  Kaldırılan Ağırlık (kg)
                </label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`Hedef: ${targetValue}kg`}
                  className="bg-secondary border-white/10 text-lg font-display text-center"
                />
              </div>
            )}

            {/* Note input */}
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">
                Not (opsiyonel)
              </label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Eklemek istediğin bir şey var mı?"
                className="bg-secondary border-white/10"
              />
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmitProof}
              disabled={isUploading || (challengeType === "pr" && !weight)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Kanıt Gönder
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Buttons */}
      {!showForm && (
        <div className="space-y-3">
          <h4 className="text-foreground text-sm font-medium">PR Kanıtı Yükle</h4>
          <p className="text-muted-foreground text-xs">
            {challengeType === "pr" 
              ? `${exercise || "Hareket"} için ${targetValue}kg'ı geçtiğini kanıtla`
              : "Antrenman serisini kanıtla"
            }
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCameraCapture}
              className="glass-card p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <span className="text-foreground text-sm font-medium">Fotoğraf</span>
              <span className="text-muted-foreground text-[10px]">Kamera veya galeri</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVideoCapture}
              className="glass-card p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Video className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-foreground text-sm font-medium">Video</span>
              <span className="text-muted-foreground text-[10px]">Tam kaldırış kaydı</span>
            </motion.button>
          </div>

          <p className="text-muted-foreground text-[10px] text-center">
            Fotoğraf max 10MB • Video max 50MB
          </p>
        </div>
      )}
    </div>
  );
};

export default ChallengeProofSubmission;
