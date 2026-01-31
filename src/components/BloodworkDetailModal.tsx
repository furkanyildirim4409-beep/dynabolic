import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  User,
  TrendingUp
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip,
  Area,
  AreaChart
} from "recharts";
import type { BloodworkReport } from "@/types/shared-models";
import { bloodworkTrends, flaggedBiomarkers } from "@/lib/mockData";

interface BloodworkDetailModalProps {
  report: BloodworkReport | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
};

const BloodworkDetailModal = ({ report, isOpen, onClose }: BloodworkDetailModalProps) => {
  if (!report) return null;

  const biomarkers = flaggedBiomarkers[report.id as keyof typeof flaggedBiomarkers] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="absolute inset-0 bg-background overflow-y-auto touch-pan-y"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-400" />
                <h2 className="font-display text-lg text-foreground">RAPOR DETAYI</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 pb-40 space-y-6">
              {/* Report Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{report.fileName}</p>
                    
                    {/* Date Comparison */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Yükleme:</span>
                        <span className="text-foreground">{formatDate(report.uploadDate)}</span>
                      </div>
                      {report.analysisDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-muted-foreground">Analiz:</span>
                          <span className="text-green-400">{formatDate(report.analysisDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Coach Notes */}
              {report.coachNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="glass-card p-4 border border-primary/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-display text-sm text-primary">KOÇ NOTU</h3>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    {report.coachNotes}
                  </p>
                </motion.div>
              )}

              {/* Flagged Biomarkers */}
              {biomarkers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-display text-sm text-foreground">DİKKAT GEREKTİREN DEĞERLER</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {biomarkers.map((marker, index) => (
                      <motion.div
                        key={marker.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                        className={`p-4 rounded-xl border ${
                          marker.severity === "critical"
                            ? "bg-red-500/10 border-red-500/30"
                            : "bg-amber-500/10 border-amber-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            marker.severity === "critical" ? "bg-red-500" : "bg-amber-500"
                          }`} />
                          <span className={`text-xs font-medium ${
                            marker.severity === "critical" ? "text-red-400" : "text-amber-400"
                          }`}>
                            {marker.severity === "critical" ? "KRİTİK" : "SINIRDA"}
                          </span>
                        </div>
                        <p className="font-display text-lg text-foreground">{marker.name}</p>
                        <p className={`text-xl font-bold ${
                          marker.severity === "critical" ? "text-red-400" : "text-amber-400"
                        }`}>
                          {marker.value} {marker.unit}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Normal: {marker.normalRange}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Hormone Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-sm text-foreground">HORMON TRENDİ</h3>
                  <span className="text-xs text-muted-foreground ml-auto">Testosteron/Kortizol Oranı</span>
                </div>

                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bloodworkTrends}>
                      <defs>
                        <linearGradient id="ratioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(68, 100%, 50%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(68, 100%, 50%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: 'hsl(240 5% 65%)', fontSize: 11 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: 'hsl(240 5% 65%)', fontSize: 11 }}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(240 6% 10%)',
                          border: '1px solid hsl(240 5% 20%)',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                        labelStyle={{ color: 'hsl(240 5% 65%)' }}
                        formatter={(value: number) => [`${value.toFixed(1)}`, 'T/C Oranı']}
                      />
                      <Area
                        type="monotone"
                        dataKey="ratio"
                        stroke="hsl(68, 100%, 50%)"
                        strokeWidth={2}
                        fill="url(#ratioGradient)"
                        dot={{ fill: 'hsl(68, 100%, 50%)', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: 'hsl(68, 100%, 50%)' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Testosteron</p>
                    <p className="font-display text-lg text-foreground">640 ng/dL</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Kortizol</p>
                    <p className="font-display text-lg text-foreground">15 µg/dL</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">T/C Oranı</p>
                    <p className="font-display text-lg text-primary">42.7</p>
                  </div>
                </div>
              </motion.div>

              {/* Status Indicator */}
              {report.status === "pending" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                >
                  <p className="text-amber-400 text-sm text-center">
                    Koçunuz tahlil sonuçlarınızı inceliyor. Analiz tamamlandığında bildirim alacaksınız.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BloodworkDetailModal;
