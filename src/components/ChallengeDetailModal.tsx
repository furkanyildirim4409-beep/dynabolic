import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Swords, Trophy, Clock, Send, Flame, Dumbbell, 
  TrendingUp, MessageCircle, History, Target, Award,
  ChevronRight, CheckCircle, AlertCircle, Camera
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ChallengeProofSubmission, { ProofSubmission } from "./ChallengeProofSubmission";
import { 
  Challenge, 
  getChallengeTypeIcon, 
  getChallengeTypeLabel,
  getStatusLabel,
  getStatusColor 
} from "@/lib/challengeData";
import { hapticLight, hapticMedium, hapticSuccess } from "@/lib/haptics";

interface ChallengeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
}

interface ProgressUpdate {
  id: string;
  userId: string;
  userName: string;
  value: number;
  previousValue: number;
  timestamp: string;
  type: "improvement" | "new_pr" | "milestone";
}

interface ChallengeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

// Mock messages for demonstration
const mockMessages: ChallengeMessage[] = [
  {
    id: "m1",
    senderId: "1",
    senderName: "Ahmet Yılmaz",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    message: "Hadi bakalım, bu sefer seni geçeceğim! 💪",
    timestamp: "2026-01-30T10:30:00Z",
  },
  {
    id: "m2",
    senderId: "current",
    senderName: "Sen",
    senderAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop",
    message: "Hayallerinde görürsün! 😤🔥",
    timestamp: "2026-01-30T10:32:00Z",
  },
  {
    id: "m3",
    senderId: "1",
    senderName: "Ahmet Yılmaz",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    message: "Bugün 135kg yaptım, yaklaşıyorum!",
    timestamp: "2026-01-31T14:20:00Z",
  },
  {
    id: "m4",
    senderId: "current",
    senderName: "Sen",
    senderAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop",
    message: "İyi çalış ama beni geçemezsin 😏",
    timestamp: "2026-01-31T14:25:00Z",
  },
];

// Mock progress updates
const mockProgressUpdates: ProgressUpdate[] = [
  {
    id: "p1",
    userId: "1",
    userName: "Ahmet Yılmaz",
    value: 130,
    previousValue: 125,
    timestamp: "2026-01-31T09:00:00Z",
    type: "improvement",
  },
  {
    id: "p2",
    userId: "current",
    userName: "Sen",
    value: 140,
    previousValue: 140,
    timestamp: "2026-01-30T15:00:00Z",
    type: "new_pr",
  },
  {
    id: "p3",
    userId: "1",
    userName: "Ahmet Yılmaz",
    value: 135,
    previousValue: 130,
    timestamp: "2026-01-31T14:00:00Z",
    type: "improvement",
  },
];

const ChallengeDetailModal = ({ 
  isOpen, 
  onClose, 
  challenge,
  onAccept,
  onDecline
}: ChallengeDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<"progress" | "proof" | "messages" | "history">("progress");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [proofs, setProofs] = useState<ProofSubmission[]>([
    // Mock opponent proof for testing verification
    {
      id: "mock-opponent-proof-1",
      type: "photo",
      url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      weight: 135,
      note: "Bugünkü PR denemem!",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "pending",
      submittedBy: "opponent",
      submittedByName: "Ahmet Yılmaz",
      submittedByAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    // Mock my rejected proof for testing dispute
    {
      id: "mock-my-rejected-proof",
      type: "photo",
      url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
      weight: 140,
      note: "PR denemesi",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "rejected",
      submittedBy: "current",
      submittedByName: "Sen",
      submittedByAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop",
      rejectionReason: "Video açısı uygun değil, ağırlık plakları net görünmüyor",
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simulate live progress updates
  const [liveProgress, setLiveProgress] = useState({
    challenger: 0,
    challenged: 0,
  });

  useEffect(() => {
    if (challenge && isOpen) {
      // Animate progress bars on open
      const timer = setTimeout(() => {
        setLiveProgress({
          challenger: challenge.challengerValue,
          challenged: challenge.challengedValue || 0,
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [challenge, isOpen]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen || !challenge) return null;

  const TypeIcon = getChallengeTypeIcon(challenge.type);
  const isIncoming = challenge.challengedId === "current" && challenge.status === "pending";
  const isActive = challenge.status === "active";
  const isCompleted = challenge.status === "completed";
  const isWinner = isCompleted && challenge.winnerId === "current";
  const isChallenger = challenge.challengerId === "current";
  
  const opponent = isChallenger 
    ? { 
        id: challenge.challengedId,
        name: challenge.challengedName, 
        avatar: challenge.challengedAvatar, 
        value: challenge.challengedValue || 0 
      }
    : { 
        id: challenge.challengerId,
        name: challenge.challengerName, 
        avatar: challenge.challengerAvatar, 
        value: challenge.challengerValue 
      };

  const yourValue = isChallenger ? challenge.challengerValue : (challenge.challengedValue || 0);
  const targetValue = challenge.targetValue;
  
  // Calculate progress percentages
  const yourProgress = Math.min(100, (yourValue / targetValue) * 100);
  const opponentProgress = Math.min(100, (opponent.value / targetValue) * 100);

  // Days remaining
  const daysRemaining = Math.max(0, Math.ceil(
    (new Date(challenge.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    hapticLight();
    const msg: ChallengeMessage = {
      id: `m${Date.now()}`,
      senderId: "current",
      senderName: "Sen",
      senderAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage("");
  };

  const handleAccept = () => {
    hapticSuccess();
    onAccept?.(challenge.id);
    onClose();
  };

  const handleDecline = () => {
    hapticMedium();
    onDecline?.(challenge.id);
    onClose();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-background rounded-t-3xl border-t border-white/10 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              challenge.type === "pr" ? "bg-orange-500/20" : "bg-red-500/20"
            }`}>
              <TypeIcon className={`w-5 h-5 ${
                challenge.type === "pr" ? "text-orange-400" : "text-red-400"
              }`} />
            </div>
            <div>
              <h2 className="font-display text-base text-foreground tracking-wide">
                {getChallengeTypeLabel(challenge.type)}
              </h2>
              {challenge.exercise && (
                <p className="text-muted-foreground text-xs">{challenge.exercise}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(challenge.status)}`}>
              {getStatusLabel(challenge.status)}
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* VS Display & Live Progress */}
        <div className="p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-4">
            {/* You */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <Avatar className="w-16 h-16 ring-2 ring-primary">
                  <AvatarImage 
                    src={isChallenger ? challenge.challengerAvatar : challenge.challengedAvatar} 
                    alt="Sen" 
                    className="object-cover" 
                  />
                  <AvatarFallback className="bg-primary/20 text-primary">SEN</AvatarFallback>
                </Avatar>
                {isWinner && isChallenger && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-foreground text-sm font-medium mt-2">Sen</p>
              <motion.p 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-primary font-display text-2xl"
              >
                {yourValue}
                <span className="text-sm text-muted-foreground ml-1">
                  {challenge.type === "pr" ? "kg" : "gün"}
                </span>
              </motion.p>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center px-4">
              <Swords className="w-8 h-8 text-muted-foreground mb-1" />
              <span className="text-muted-foreground text-xs font-display">VS</span>
              {!isCompleted && (
                <div className="flex items-center gap-1 mt-2 text-muted-foreground text-[10px]">
                  <Clock className="w-3 h-3" />
                  {daysRemaining} gün
                </div>
              )}
            </div>

            {/* Opponent */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <Avatar className="w-16 h-16 ring-2 ring-orange-500/50">
                  <AvatarImage src={opponent.avatar} alt={opponent.name} className="object-cover" />
                  <AvatarFallback className="bg-orange-500/20 text-orange-400">
                    {opponent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isWinner && !isChallenger && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-foreground text-sm font-medium mt-2">{opponent.name.split(" ")[0]}</p>
              <motion.p 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-orange-400 font-display text-2xl"
              >
                {opponent.value}
                <span className="text-sm text-muted-foreground ml-1">
                  {challenge.type === "pr" ? "kg" : "gün"}
                </span>
              </motion.p>
            </div>
          </div>

          {/* Progress Bars */}
          {(isActive || isCompleted) && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-primary font-medium">Senin İlerlemen</span>
                  <span className="text-muted-foreground">{yourProgress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${yourProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-orange-400 font-medium">{opponent.name.split(" ")[0]}</span>
                  <span className="text-muted-foreground">{opponentProgress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${opponentProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                <Target className="w-3 h-3" />
                Hedef: {targetValue}{challenge.type === "pr" ? "kg" : " gün"}
              </div>
            </div>
          )}

          {/* Reward */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-display">{challenge.bioCoinsReward}</span>
              <span className="text-muted-foreground text-xs">coin</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-primary font-display">{challenge.xpReward}</span>
              <span className="text-muted-foreground text-xs">XP</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => { hapticLight(); setActiveTab(v as typeof activeTab); }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="mx-4 mt-2 grid grid-cols-4 bg-secondary/50 border border-white/5 shrink-0">
            <TabsTrigger 
              value="progress"
              className="font-display text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              İlerleme
            </TabsTrigger>
            <TabsTrigger 
              value="proof"
              className="font-display text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
            >
              <Camera className="w-3 h-3" />
              Kanıt
            </TabsTrigger>
            <TabsTrigger 
              value="messages"
              className="font-display text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              Mesaj
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="font-display text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1"
            >
              <History className="w-3 h-3" />
              Geçmiş
            </TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="flex-1 overflow-auto px-4 pb-4 mt-4">
            <div className="space-y-3">
              {mockProgressUpdates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-3 flex items-center gap-3 ${
                    update.userId === "current" ? "border-l-2 border-l-primary" : "border-l-2 border-l-orange-500"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    update.type === "new_pr" 
                      ? "bg-emerald-500/20" 
                      : update.type === "milestone"
                      ? "bg-yellow-500/20"
                      : "bg-primary/20"
                  }`}>
                    {update.type === "new_pr" && <Award className="w-4 h-4 text-emerald-400" />}
                    {update.type === "milestone" && <Trophy className="w-4 h-4 text-yellow-400" />}
                    {update.type === "improvement" && <TrendingUp className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm font-medium">
                      {update.userId === "current" ? "Sen" : update.userName.split(" ")[0]}
                      {update.type === "new_pr" && " yeni PR kırdı! 🎉"}
                      {update.type === "improvement" && " ilerleme kaydetti"}
                      {update.type === "milestone" && " kilometre taşına ulaştı"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(update.timestamp)}</span>
                      <span>•</span>
                      <span>{formatTime(update.timestamp)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-lg ${
                      update.userId === "current" ? "text-primary" : "text-orange-400"
                    }`}>
                      {update.value}
                      <span className="text-xs text-muted-foreground ml-1">
                        {challenge.type === "pr" ? "kg" : "gün"}
                      </span>
                    </p>
                    {update.previousValue !== update.value && (
                      <p className="text-emerald-400 text-xs">
                        +{update.value - update.previousValue}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Proof Tab */}
          <TabsContent value="proof" className="flex-1 overflow-auto px-4 pb-4 mt-4">
            <ChallengeProofSubmission
              challengeId={challenge.id}
              challengeType={challenge.type}
              exercise={challenge.exercise}
              targetValue={challenge.targetValue}
              existingProofs={proofs}
              onProofSubmitted={(proof) => setProofs(prev => [...prev, proof])}
              onProofVerified={(proofId, verified, reason) => {
                setProofs(prev => prev.map(p => 
                  p.id === proofId 
                    ? { 
                        ...p, 
                        status: verified ? "verified" : "rejected",
                        verifiedAt: new Date().toISOString(),
                        rejectionReason: reason
                      } 
                    : p
                ));
              }}
              opponentName={opponent.name}
              opponentAvatar={opponent.avatar}
            />
          </TabsContent>
          <TabsContent value="messages" className="flex-1 flex flex-col overflow-hidden px-4 pb-4 mt-0">
            <ScrollArea className="flex-1 -mx-4 px-4">
              <div className="space-y-3 py-4">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === "current";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                    >
                      {!isMe && (
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarImage src={msg.senderAvatar} className="object-cover" />
                          <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`px-3 py-2 rounded-2xl ${
                          isMe 
                            ? "bg-primary text-primary-foreground rounded-br-sm" 
                            : "bg-secondary text-foreground rounded-bl-sm"
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <p className="text-muted-foreground text-[10px] mt-1 px-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/10 shrink-0">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesaj yaz..."
                className="flex-1 bg-secondary border-white/10"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-primary hover:bg-primary/90 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="flex-1 overflow-auto px-4 pb-4 mt-4">
            <div className="space-y-3">
              {/* Challenge Created */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Swords className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground text-sm">Meydan okuma oluşturuldu</p>
                  <p className="text-muted-foreground text-xs">{formatDate(challenge.createdAt)}</p>
                </div>
              </div>

              {/* Status Changes */}
              {challenge.status !== "pending" && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">Meydan okuma kabul edildi</p>
                    <p className="text-muted-foreground text-xs">
                      {challenge.challengedName} meydan okumayı kabul etti
                    </p>
                  </div>
                </div>
              )}

              {/* Deadline Warning */}
              {isActive && daysRemaining <= 3 && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">Son {daysRemaining} gün!</p>
                    <p className="text-muted-foreground text-xs">Süre dolmak üzere</p>
                  </div>
                </div>
              )}

              {/* Completion */}
              {isCompleted && challenge.completedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">
                      {isWinner ? "Kazandın! 🏆" : "Kaybettin"}
                    </p>
                    <p className="text-muted-foreground text-xs">{formatDate(challenge.completedAt)}</p>
                  </div>
                </div>
              )}

              {/* Challenge Info */}
              <div className="glass-card p-4 mt-4">
                <h4 className="text-foreground text-sm font-medium mb-3">Meydan Okuma Detayları</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tür</span>
                    <span className="text-foreground">{getChallengeTypeLabel(challenge.type)}</span>
                  </div>
                  {challenge.exercise && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Hareket</span>
                      <span className="text-foreground">{challenge.exercise}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hedef</span>
                    <span className="text-foreground">
                      {targetValue}{challenge.type === "pr" ? "kg" : " gün"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Son Tarih</span>
                    <span className="text-foreground">
                      {new Date(challenge.deadline).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ödül</span>
                    <span className="text-yellow-400">{challenge.bioCoinsReward} coin</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons for Pending Challenges */}
        {isIncoming && (
          <div className="p-4 border-t border-white/10 flex gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <X className="w-4 h-4 mr-2" />
              Reddet
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Kabul Et
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChallengeDetailModal;
