import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Activity, Moon, Footprints, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { wearableMetrics, rhrTrend, hrvTrend } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";

interface BioMetricsDashboardProps {
  isActive: boolean;
}

// Mini sparkline chart component
const MiniTrendChart = ({ 
  data, 
  color, 
  gradientId 
}: { 
  data: { day: string; value: number }[]; 
  color: string; 
  gradientId: string;
}) => (
  <div className="h-16 mt-2">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="day" 
          axisLine={false} 
          tickLine={false}
          tick={{ fill: 'hsl(240 5% 50%)', fontSize: 9 }}
          interval={0}
        />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(240 6% 10%)',
            border: '1px solid hsl(240 5% 20%)',
            borderRadius: '8px',
            fontSize: '11px',
            padding: '6px 10px'
          }}
          labelStyle={{ color: 'hsl(240 5% 65%)', marginBottom: '2px' }}
          formatter={(value: number, name: string) => [value, name === 'value' ? '' : name]}
          labelFormatter={(label) => label}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const BioMetricsDashboard = ({ isActive }: BioMetricsDashboardProps) => {
  const navigate = useNavigate();
  const metrics = isActive ? wearableMetrics : null;

  const metricCards = [
    {
      id: "rhr",
      label: "Dinlenme Nabzı",
      icon: Heart,
      value: metrics?.rhr.value,
      unit: metrics?.rhr.unit,
      change: metrics?.rhr.change,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      chartColor: "#f87171",
      trendData: isActive ? rhrTrend : null,
    },
    {
      id: "hrv",
      label: "HRV",
      icon: Activity,
      value: metrics?.hrv.value,
      unit: metrics?.hrv.unit,
      change: metrics?.hrv.change,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      chartColor: "#60a5fa",
      trendData: isActive ? hrvTrend : null,
    },
    {
      id: "sleep",
      label: "Uyku Kalitesi",
      icon: Moon,
      value: metrics?.sleep.total,
      unit: metrics?.sleep.unit,
      subtext: metrics ? `Derin: %${metrics.sleep.deep}` : undefined,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      id: "steps",
      label: "Günlük Adım",
      icon: Footprints,
      value: metrics?.steps.value,
      unit: "",
      change: metrics?.steps.change,
      progress: metrics ? (metrics.steps.value / metrics.steps.goal) * 100 : undefined,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg text-foreground tracking-wide">
            BİYO-METRİK PANELİ
          </h2>
        </div>
        {metrics && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{metrics.lastSync}</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-2 gap-3"
          >
            {metricCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl ${card.bgColor} border ${card.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                  <span className="text-xs text-muted-foreground">{card.label}</span>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <motion.span
                    key={card.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-display text-2xl ${card.color}`}
                  >
                    {card.value?.toLocaleString()}
                  </motion.span>
                  {card.unit && (
                    <span className="text-xs text-muted-foreground">{card.unit}</span>
                  )}
                </div>

                {/* Change indicator or subtext */}
                {card.change !== undefined && !card.trendData && (
                  <div className={`flex items-center gap-1 mt-1 text-xs ${
                    card.change > 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    <span>{card.change > 0 ? "↑" : "↓"}{Math.abs(card.change)}</span>
                    <span className="text-muted-foreground">dün</span>
                  </div>
                )}

                {card.subtext && (
                  <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
                )}

                {/* Progress bar for steps */}
                {card.progress !== undefined && (
                  <div className="mt-2">
                    <Progress value={card.progress} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">
                      {Math.round(card.progress)}% hedef
                    </p>
                  </div>
                )}

                {/* Mini trend chart for RHR and HRV */}
                {card.trendData && card.chartColor && (
                  <MiniTrendChart 
                    data={card.trendData} 
                    color={card.chartColor}
                    gradientId={`${card.id}Gradient`}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="inactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">Veri bulunamadı</p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              Simülasyon modunu etkinleştirin veya cihaz bağlayın
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7-Day Trend Summary */}
      {isActive && metrics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">7 Günlük Trend Özeti</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-secondary/30 rounded-xl">
              <p className="text-[10px] text-muted-foreground mb-1">RHR Ortalaması</p>
              <p className="font-display text-lg text-red-400">
                {Math.round(rhrTrend.reduce((a, b) => a + b.value, 0) / rhrTrend.length)} bpm
              </p>
              <p className="text-[10px] text-green-400">↓4 geçen haftaya göre</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-xl">
              <p className="text-[10px] text-muted-foreground mb-1">HRV Ortalaması</p>
              <p className="font-display text-lg text-blue-400">
                {Math.round(hrvTrend.reduce((a, b) => a + b.value, 0) / hrvTrend.length)} ms
              </p>
              <p className="text-[10px] text-green-400">↑7 geçen haftaya göre</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sleep Breakdown (shown when active) */}
      {isActive && metrics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <p className="text-xs text-muted-foreground mb-2">Uyku Aşamaları</p>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-purple-600 rounded-l-full" 
              style={{ width: `${metrics.sleep.deep}%` }}
            />
            <div 
              className="bg-purple-400" 
              style={{ width: `${metrics.sleep.rem}%` }}
            />
            <div 
              className="bg-purple-200/30 rounded-r-full" 
              style={{ width: `${metrics.sleep.light}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>Derin %{metrics.sleep.deep}</span>
            <span>REM %{metrics.sleep.rem}</span>
            <span>Hafif %{metrics.sleep.light}</span>
          </div>
        </motion.div>
      )}

      {/* View All Trends Button */}
      {isActive && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/saglik-trendleri")}
          className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-primary/20 text-primary rounded-xl text-sm font-medium hover:bg-primary/30 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          TÜM TRENDLERİ GÖR
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default BioMetricsDashboard;