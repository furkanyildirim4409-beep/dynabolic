import { useEffect, useCallback, useState } from "react";
import { invoices } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

interface PaymentReminder {
  invoiceId: string;
  serviceType: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  isOverdue: boolean;
}

const REMINDER_STORAGE_KEY = "payment_reminders_shown";
const REMINDER_THRESHOLD_DAYS = 3;

export const usePaymentReminders = () => {
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);

  // Get reminders already shown today (to avoid spamming)
  const getShownReminders = useCallback((): Record<string, string> => {
    try {
      const stored = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (!stored) return {};
      const data = JSON.parse(stored);
      // Clean up old entries (older than 24 hours)
      const now = Date.now();
      const cleaned: Record<string, string> = {};
      Object.entries(data).forEach(([key, timestamp]) => {
        if (now - Number(timestamp) < 24 * 60 * 60 * 1000) {
          cleaned[key] = timestamp as string;
        }
      });
      return cleaned;
    } catch {
      return {};
    }
  }, []);

  const markReminderShown = useCallback((invoiceId: string) => {
    const shown = getShownReminders();
    shown[invoiceId] = Date.now().toString();
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(shown));
  }, [getShownReminders]);

  // Calculate days until due date
  const getDaysUntilDue = useCallback((dueDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  // Check for payment reminders
  const checkPaymentReminders = useCallback(() => {
    const pendingInvoices = invoices.filter(
      (inv) => inv.status === "pending" && inv.dueDate
    );

    const upcomingReminders: PaymentReminder[] = [];

    pendingInvoices.forEach((invoice) => {
      if (!invoice.dueDate) return;

      const daysUntilDue = getDaysUntilDue(invoice.dueDate);

      // Only include if within reminder threshold (3 days or less) or overdue
      if (daysUntilDue <= REMINDER_THRESHOLD_DAYS) {
        upcomingReminders.push({
          invoiceId: invoice.id,
          serviceType: invoice.serviceType || "Ödeme",
          amount: invoice.amount,
          dueDate: invoice.dueDate,
          daysUntilDue,
          isOverdue: daysUntilDue < 0,
        });
      }
    });

    // Also include overdue invoices
    const overdueInvoices = invoices.filter((inv) => inv.status === "overdue");
    overdueInvoices.forEach((invoice) => {
      const daysUntilDue = invoice.dueDate ? getDaysUntilDue(invoice.dueDate) : -1;
      upcomingReminders.push({
        invoiceId: invoice.id,
        serviceType: invoice.serviceType || "Ödeme",
        amount: invoice.amount,
        dueDate: invoice.dueDate || "",
        daysUntilDue,
        isOverdue: true,
      });
    });

    setReminders(upcomingReminders);
    return upcomingReminders;
  }, [getDaysUntilDue]);

  // Show toast notifications for reminders
  const showReminderNotifications = useCallback(() => {
    const shownReminders = getShownReminders();
    const upcomingReminders = checkPaymentReminders();

    upcomingReminders.forEach((reminder) => {
      // Skip if already shown today
      if (shownReminders[reminder.invoiceId]) return;

      const formatAmount = (amount: number) =>
        new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
          minimumFractionDigits: 0,
        }).format(amount);

      let title: string;
      let description: string;
      let variant: "default" | "destructive" = "default";

      if (reminder.isOverdue) {
        title = "⚠️ Gecikmiş Ödeme!";
        description = `${reminder.serviceType} için ${formatAmount(reminder.amount)} ödemeniz gecikti. Hemen ödeyin.`;
        variant = "destructive";
      } else if (reminder.daysUntilDue === 0) {
        title = "🔔 Ödeme Bugün Son Gün!";
        description = `${reminder.serviceType} için ${formatAmount(reminder.amount)} ödemesi bugün. Gecikmemesi için hemen ödeyin.`;
        variant = "destructive";
      } else if (reminder.daysUntilDue === 1) {
        title = "⏰ Yarın Son Ödeme Günü";
        description = `${reminder.serviceType} için ${formatAmount(reminder.amount)} ödemeniz yarın. Şimdiden ödemeyi düşünün.`;
      } else {
        title = `📅 Ödeme Hatırlatması`;
        description = `${reminder.serviceType} için ${formatAmount(reminder.amount)} ödemenize ${reminder.daysUntilDue} gün kaldı.`;
      }

      toast({
        title,
        description,
        variant,
        duration: 8000,
      });

      markReminderShown(reminder.invoiceId);
    });
  }, [checkPaymentReminders, getShownReminders, markReminderShown]);

  // Run check on mount
  useEffect(() => {
    // Small delay to avoid blocking initial render
    const timer = setTimeout(() => {
      showReminderNotifications();
    }, 2000);

    return () => clearTimeout(timer);
  }, [showReminderNotifications]);

  return {
    reminders,
    checkPaymentReminders,
    showReminderNotifications,
  };
};

// Helper function to get formatted reminder text
export const getPaymentReminderMessage = (daysUntilDue: number): string => {
  if (daysUntilDue < 0) {
    return `${Math.abs(daysUntilDue)} gün gecikti!`;
  } else if (daysUntilDue === 0) {
    return "Bugün son gün!";
  } else if (daysUntilDue === 1) {
    return "Yarın son gün";
  } else {
    return `${daysUntilDue} gün kaldı`;
  }
};
