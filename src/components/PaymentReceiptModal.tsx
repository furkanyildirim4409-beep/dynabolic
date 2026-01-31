import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Receipt, CheckCircle2, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/types/shared-models";

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

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

const PaymentReceiptModal = ({ isOpen, onClose, invoice }: PaymentReceiptModalProps) => {
  if (!invoice) return null;

  const handleDownload = () => {
    // Create receipt content
    const receiptContent = `
=====================================
           DYNABOLIC
        ÖDEME MAKBUZU
=====================================

Makbuz No: RCP-${invoice.id}
Tarih: ${formatDate(invoice.date)}

-------------------------------------
Hizmet: ${invoice.serviceType}
Tutar: ${formatCurrency(invoice.amount)}
-------------------------------------

Durum: ✓ ÖDENDİ

Ödeme Yöntemi: Kredi Kartı
İşlem ID: TXN-${Date.now().toString(36).toUpperCase()}

-------------------------------------
Dynabolic Fitness
www.dynabolic.app
info@dynabolic.app
=====================================
    `;

    // Create and download file
    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dynabolic-makbuz-${invoice.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-background border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-green-400" />
                </div>
                <h2 className="font-display text-lg text-foreground">MAKBUZ</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-5 space-y-4">
              {/* Success Badge */}
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-green-400 font-display text-sm tracking-wider">ÖDEME TAMAMLANDI</p>
                <p className="text-foreground font-display text-2xl mt-1">
                  {formatCurrency(invoice.amount)}
                </p>
              </div>

              {/* Details */}
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Hizmet</span>
                  <span className="text-foreground text-sm font-medium">{invoice.serviceType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Makbuz No</span>
                  <span className="text-foreground text-sm font-mono">RCP-{invoice.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Tarih</span>
                  <span className="text-foreground text-sm">{formatDate(invoice.date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Ödeme Yöntemi</span>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-foreground text-sm">Kredi Kartı</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                className="w-full bg-primary/20 text-primary hover:bg-primary/30 font-display tracking-wider"
              >
                <Download className="w-4 h-4 mr-2" />
                MAKBUZU İNDİR
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentReceiptModal;
