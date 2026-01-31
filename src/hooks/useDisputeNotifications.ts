import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { hapticSuccess, hapticError, hapticMedium } from "@/lib/haptics";
import type { DisputeStatus } from "@/components/DisputeResolutionModal";

export interface DisputeNotification {
  id: string;
  disputeId: string;
  type: "status_change" | "new_message" | "resolution";
  title: string;
  message: string;
  status: DisputeStatus;
  previousStatus?: DisputeStatus;
  timestamp: string;
  read: boolean;
  challengeType?: "pr" | "streak";
  exercise?: string;
}

const STORAGE_KEY = "dispute_notifications";

export const useDisputeNotifications = () => {
  const [notifications, setNotifications] = useState<DisputeNotification[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<DisputeNotification, "id" | "timestamp" | "read">) => {
    const newNotification: DisputeNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Trigger toast based on notification type
    if (notification.type === "status_change" || notification.type === "resolution") {
      const isApproved = notification.status === "resolved_approved";
      const isRejected = notification.status === "resolved_rejected";
      const isUnderReview = notification.status === "under_review";

      if (isApproved) {
        hapticSuccess();
        toast({
          title: "🎉 İtiraz Onaylandı!",
          description: notification.message,
          className: "bg-emerald-500/20 border-emerald-500/50",
        });
      } else if (isRejected) {
        hapticError();
        toast({
          title: "❌ İtiraz Reddedildi",
          description: notification.message,
          variant: "destructive",
        });
      } else if (isUnderReview) {
        hapticMedium();
        toast({
          title: "⚖️ İtiraz İnceleniyor",
          description: notification.message,
        });
      }
    } else if (notification.type === "new_message") {
      hapticMedium();
      toast({
        title: "💬 Yeni Mesaj",
        description: notification.message,
      });
    }

    // Request browser notification permission and show if granted
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        showBrowserNotification(notification);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            showBrowserNotification(notification);
          }
        });
      }
    }
  }, []);

  const showBrowserNotification = (notification: Omit<DisputeNotification, "id" | "timestamp" | "read">) => {
    const icon = notification.status === "resolved_approved" 
      ? "✅" 
      : notification.status === "resolved_rejected" 
      ? "❌" 
      : "⚖️";
    
    new Notification(`${icon} ${notification.title}`, {
      body: notification.message,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: `dispute-${notification.disputeId}`,
      requireInteraction: notification.type === "resolution",
    });
  };

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Simulate status change notifications for demo
  const simulateStatusChange = useCallback((
    disputeId: string, 
    newStatus: DisputeStatus, 
    previousStatus: DisputeStatus,
    challengeType?: "pr" | "streak",
    exercise?: string
  ) => {
    let title = "";
    let message = "";

    switch (newStatus) {
      case "under_review":
        title = "İtiraz İncelemeye Alındı";
        message = `${exercise || "Düello"} itirazınız Koç Serdar tarafından inceleniyor`;
        break;
      case "resolved_approved":
        title = "İtiraz Onaylandı!";
        message = `${exercise || "Düello"} kanıtınız kabul edildi. Tebrikler! 🎉`;
        break;
      case "resolved_rejected":
        title = "İtiraz Reddedildi";
        message = `${exercise || "Düello"} itirazınız koç tarafından reddedildi`;
        break;
      default:
        return;
    }

    addNotification({
      disputeId,
      type: newStatus.startsWith("resolved") ? "resolution" : "status_change",
      title,
      message,
      status: newStatus,
      previousStatus,
      challengeType,
      exercise,
    });
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    simulateStatusChange,
  };
};
