import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, X, Trophy, Settings, MessageCircle, ClipboardCheck } from "lucide-react";
import EnergyBank from "@/components/EnergyBank";
import CoachUplink from "@/components/CoachUplink";
import BentoStats from "@/components/BentoStats";
import CoachChat from "@/components/CoachChat";
import DailyCheckIn from "@/components/DailyCheckIn";
import StoriesRing from "@/components/StoriesRing";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { assignedCoach, notifications } from "@/lib/mockData";

const Kokpit = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Record<string, boolean>>({});

  const unreadCount = notifications.filter(n => !n.read && !readNotifications[n.id]).length;

  const handleNotificationClick = (notificationId: string, coachId?: string) => {
    setReadNotifications(prev => ({ ...prev, [notificationId]: true }));
    if (coachId) {
      setShowNotifications(false);
      navigate(`/coach/${coachId}`);
    }
  };

  const handleOpenChat = () => {
    setShowChat(true);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl text-foreground">KOKPİT</h1>
          <p className="text-muted-foreground text-sm">Misyon Kontrol Merkezi</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Check-In Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCheckIn(true)}
            className="relative p-2"
          >
            <ClipboardCheck className="w-5 h-5 text-primary" />
          </motion.button>

          {/* Chat Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChat(true)}
            className="relative p-2"
          >
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {/* Notifications Bell */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(true)}
            className="relative p-2"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">{unreadCount}</span>
              </div>
            )}
          </motion.button>

          <div className="text-right">
            <p className="text-primary font-display text-lg">27 OCAK</p>
            <p className="text-muted-foreground text-xs">Pazartesi</p>
          </div>
          
          {/* Coach Avatar - Clicking navigates to Coach Profile */}
          <motion.button
            onClick={() => navigate(`/coach/${assignedCoach.id}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary via-primary/80 to-primary neon-glow-sm">
              <Avatar className="w-10 h-10">
                <AvatarImage src={assignedCoach.avatar} alt={assignedCoach.name} className="object-cover" />
                <AvatarFallback className="bg-secondary text-foreground text-sm font-display">
                  {assignedCoach.name.charAt(4)}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-stat-hrv border-2 border-background" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stories Ring */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <StoriesRing />
      </motion.div>

      {/* Energy Bank - Hero Widget */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card py-8 px-6 flex justify-center"
      >
        <EnergyBank
          level={84}
          label="GÜNLÜK ENERJİ"
          subtext="Yüksek Yoğunluk İçin Uygun"
        />
      </motion.div>

      {/* Coach Uplink */}
      <CoachUplink
        coachName="KOÇ SERDAR"
        status="online"
        message="Bugün bacak antrenmanında tempoyu düşürme. Vision AI sonuçlarını bekliyorum."
        onMessageClick={() => setShowChat(true)}
      />

      {/* Bento Grid Stats */}
      <div>
        <h2 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          SAĞLIK VERİLERİ
        </h2>
        <BentoStats />
      </div>

      {/* Daily Check-In Modal */}
      <DailyCheckIn isOpen={showCheckIn} onClose={() => setShowCheckIn(false)} />

      {/* Coach Chat */}
      <CoachChat isOpen={showChat} onClose={() => setShowChat(false)} />

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-white/10"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-lg text-foreground">BİLDİRİMLER</h2>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-80px)]">
                {notifications.map((notification, index) => {
                  const isRead = notification.read || readNotifications[notification.id];
                  
                  return (
                    <motion.button
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification.id, notification.coachId)}
                      className={`w-full text-left glass-card p-4 flex items-start gap-3 hover:bg-white/5 transition-colors ${
                        !isRead ? "border-l-2 border-l-primary" : ""
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === "coach" ? "bg-primary/20" :
                        notification.type === "achievement" ? "bg-yellow-500/20" :
                        "bg-secondary"
                      }`}>
                        {notification.type === "coach" && <MessageCircle className="w-5 h-5 text-primary" />}
                        {notification.type === "achievement" && <Trophy className="w-5 h-5 text-yellow-500" />}
                        {notification.type === "system" && <Settings className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm ${isRead ? "text-muted-foreground" : "text-foreground"}`}>
                            {notification.title}
                          </p>
                          {!isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-muted-foreground/50 text-[10px] mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Kokpit;
