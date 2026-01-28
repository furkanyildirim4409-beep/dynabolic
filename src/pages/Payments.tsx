import { motion } from "framer-motion";
import { CreditCard, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { invoices } from "@/lib/mockData";
import type { Invoice } from "@/types/shared-models";

const statusConfig = {
  paid: {
    label: "Ödendi",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle2,
  },
  pending: {
    label: "Bekliyor",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: Clock,
  },
  overdue: {
    label: "Gecikmiş",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: AlertCircle,
  },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
};

const Payments = () => {
  const totalPending = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const nextDueInvoice = invoices
    .filter((inv) => inv.status === "pending" && inv.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())[0];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl text-foreground">ÖDEMELER</h1>
        <p className="text-muted-foreground text-sm">Fatura ve ödeme geçmişi</p>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider">Bekleyen Toplam</p>
            <p className="font-display text-3xl text-foreground mt-1">{formatCurrency(totalPending)}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/20">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
        </div>

        {nextDueInvoice && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Sonraki son ödeme: <span className="text-foreground">{formatDate(nextDueInvoice.dueDate!)}</span>
            </span>
          </div>
        )}
      </motion.div>

      {/* Invoice List */}
      <div className="space-y-3">
        <h2 className="font-display text-lg text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          FATURALAR
        </h2>

        {invoices.map((invoice, index) => {
          const status = statusConfig[invoice.status];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{invoice.serviceType || "Hizmet"}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${status.className} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{formatDate(invoice.date)}</p>
                  {invoice.dueDate && invoice.status !== "paid" && (
                    <p className="text-muted-foreground text-xs mt-1">
                      Son ödeme: {formatDate(invoice.dueDate)}
                    </p>
                  )}
                </div>
                <p className={`font-display text-lg ${invoice.status === "overdue" ? "text-red-400" : "text-foreground"}`}>
                  {formatCurrency(invoice.amount)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Payments;
