import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Activity, 
  Moon, 
  Footprints, 
  TrendingUp,
  Calendar,
  ChevronDown
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Extended mock data for weekly and monthly views
const weeklyRhrData = [
  { day: "Pzt", value: 62, min: 58, max: 68 },
  { day: "Sal", value: 60, min: 56, max: 65 },
  { day: "Çar", value: 59, min: 55, max: 64 },
  { day: "Per", value: 61, min: 57, max: 66 },
  { day: "Cum", value: 58, min: 54, max: 63 },
  { day: "Cmt", value: 57, min: 53, max: 62 },
  { day: "Paz", value: 58, min: 54, max: 63 },
];

const weeklyHrvData = [
  { day: "Pzt", value: 35, baseline: 40 },
  { day: "Sal", value: 38, baseline: 40 },
  { day: "Çar", value: 40, baseline: 40 },
  { day: "Per", value: 37, baseline: 40 },
  { day: "Cum", value: 42, baseline: 40 },
  { day: "Cmt", value: 45, baseline: 40 },
  { day: "Paz", value: 42, baseline: 40 },
];

const weeklySleepData = [
  { day: "Pzt", total: 6.5, deep: 1.5, rem: 1.2, light: 3.8 },
  { day: "Sal", total: 7.2, deep: 1.8, rem: 1.4, light: 4.0 },
  { day: "Çar", total: 7.8, deep: 2.0, rem: 1.5, light: 4.3 },
  { day: "Per", total: 6.8, deep: 1.6, rem: 1.3, light: 3.9 },
  { day: "Cum", total: 7.5, deep: 1.9, rem: 1.4, light: 4.2 },
  { day: "Cmt", total: 8.2, deep: 2.2, rem: 1.6, light: 4.4 },
  { day: "Paz", total: 7.2, deep: 1.7, rem: 1.3, light: 4.2 },
];

const weeklyStepsData = [
  { day: "Pzt", value: 8456, goal: 10000 },
  { day: "Sal", value: 12340, goal: 10000 },
  { day: "Çar", value: 9870, goal: 10000 },
  { day: "Per", value: 7650, goal: 10000 },
  { day: "Cum", value: 11200, goal: 10000 },
  { day: "Cmt", value: 15400, goal: 10000 },
  { day: "Paz", value: 6200, goal: 10000 },
];

const monthlyRhrData = [
  { week: "1. Hafta", avg: 62, min: 56, max: 68 },
  { week: "2. Hafta", avg: 60, min: 54, max: 66 },
  { week: "3. Hafta", avg: 58, min: 52, max: 64 },
  { week: "4. Hafta", avg: 57, min: 51, max: 63 },
];

const monthlyHrvData = [
  { week: "1. Hafta", avg: 36, baseline: 40 },
  { week: "2. Hafta", avg: 38, baseline: 40 },
  { week: "3. Hafta", avg: 41, baseline: 40 },
  { week: "4. Hafta", avg: 43, baseline: 40 },
];

const monthlySleepData = [
  { week: "1. Hafta", avg: 6.8, quality: 72 },
  { week: "2. Hafta", avg: 7.1, quality: 78 },
  { week: "3. Hafta", avg: 7.4, quality: 82 },
  { week: "4. Hafta", avg: 7.2, quality: 80 },
];

const monthlyStepsData = [
  { week: "1. Hafta", avg: 8500, total: 59500 },
  { week: "2. Hafta", avg: 9200, total: 64400 },
  { week: "3. Hafta", avg: 10100, total: 70700 },
  { week: "4. Hafta", avg: 9800, total: 68600 },
];

// Metric configurations
const metrics = [
  {
    id: "rhr",
    label: "Dinlenme Nabzı",
    shortLabel: "RHR",
    icon: Heart,
    color: "#f87171",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    unit: "bpm",
    currentValue: 58,
    weeklyChange: -4,
    monthlyChange: -7,
  },
  {
    id: "hrv",
    label: "Kalp Atış Değişkenliği",
    shortLabel: "HRV",
    icon: Activity,
    color: "#60a5fa",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    unit: "ms",
    currentValue: 42,
    weeklyChange: 7,
    monthlyChange: 12,
  },
  {
    id: "sleep",
    label: "Uyku Süresi",
    shortLabel: "Uyku",
    icon: Moon,
    color: "#a78bfa",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/30",
    unit: "saat",
    currentValue: 7.2,
    weeklyChange: 0.4,
    monthlyChange: 0.8,
  },
  {
    id: "steps",
    label: "Günlük Adım",
    shortLabel: "Adım",
    icon: Footprints,
    color: "#4ade80",
    bgClass: "bg-green-500/10",
    borderClass: "border-green-500/30",
    unit: "",
    currentValue: 8456,
    weeklyChange: 1200,
    monthlyChange: 2500,
  },
];

const SaglikTrendleri = () => {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState("rhr");
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly");

  const currentMetric = metrics.find(m => m.id === selectedMetric)!;

  const getChartData = () => {
    if (timeRange === "weekly") {
      switch (selectedMetric) {
        case "rhr": return weeklyRhrData;
        case "hrv": return weeklyHrvData;
        case "sleep": return weeklySleepData;
        case "steps": return weeklyStepsData;
        default: return [];
      }
    } else {
      switch (selectedMetric) {
        case "rhr": return monthlyRhrData;
        case "hrv": return monthlyHrvData;
        case "sleep": return monthlySleepData;
        case "steps": return monthlyStepsData;
        default: return [];
      }
    }
  };

  const renderChart = () => {
    const data = getChartData();
    const xKey = timeRange === "weekly" ? "day" : "week";

    if (selectedMetric === "rhr") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rhrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
            <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(240 6% 10%)', border: '1px solid hsl(240 5% 20%)', borderRadius: '12px', fontSize: '12px' }}
              labelStyle={{ color: 'hsl(240 5% 65%)' }}
            />
            <Area type="monotone" dataKey={timeRange === "weekly" ? "value" : "avg"} stroke="#f87171" strokeWidth={2} fill="url(#rhrGradient)" dot={{ fill: '#f87171', strokeWidth: 0, r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (selectedMetric === "hrv") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
            <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(240 6% 10%)', border: '1px solid hsl(240 5% 20%)', borderRadius: '12px', fontSize: '12px' }}
              labelStyle={{ color: 'hsl(240 5% 65%)' }}
            />
            <Line type="monotone" dataKey="baseline" stroke="hsl(240 5% 40%)" strokeWidth={1} strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey={timeRange === "weekly" ? "value" : "avg"} stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', strokeWidth: 0, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (selectedMetric === "sleep") {
      if (timeRange === "weekly") {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(240 6% 10%)', border: '1px solid hsl(240 5% 20%)', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: 'hsl(240 5% 65%)' }}
              />
              <Bar dataKey="deep" stackId="sleep" fill="#7c3aed" radius={[0, 0, 0, 0]} name="Derin" />
              <Bar dataKey="rem" stackId="sleep" fill="#a78bfa" radius={[0, 0, 0, 0]} name="REM" />
              <Bar dataKey="light" stackId="sleep" fill="#c4b5fd" radius={[4, 4, 0, 0]} name="Hafif" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(240 6% 10%)', border: '1px solid hsl(240 5% 20%)', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: 'hsl(240 5% 65%)' }}
              />
              <Area type="monotone" dataKey="avg" stroke="#a78bfa" strokeWidth={2} fill="url(#sleepGradient)" dot={{ fill: '#a78bfa', strokeWidth: 0, r: 4 }} name="Ortalama" />
            </AreaChart>
          </ResponsiveContainer>
        );
      }
    }

    if (selectedMetric === "steps") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" />
            <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(240 6% 10%)', border: '1px solid hsl(240 5% 20%)', borderRadius: '12px', fontSize: '12px' }}
              labelStyle={{ color: 'hsl(240 5% 65%)' }}
              formatter={(value: number) => [value.toLocaleString(), timeRange === "weekly" ? "Adım" : "Ortalama"]}
            />
            {timeRange === "weekly" && <Bar dataKey="goal" fill="hsl(240 5% 25%)" radius={[4, 4, 4, 4]} name="Hedef" />}
            <Bar dataKey={timeRange === "weekly" ? "value" : "avg"} fill="#4ade80" radius={[4, 4, 4, 4]} name={timeRange === "weekly" ? "Adım" : "Ortalama"} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const getStats = () => {
    const data = getChartData();
    if (selectedMetric === "rhr") {
      const values = data.map((d: any) => d.value || d.avg);
      return [
        { label: "Ortalama", value: `${Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length)} bpm` },
        { label: "Minimum", value: `${Math.min(...data.map((d: any) => d.min || d.avg))} bpm` },
        { label: "Maksimum", value: `${Math.max(...data.map((d: any) => d.max || d.avg))} bpm` },
      ];
    }
    if (selectedMetric === "hrv") {
      const values = data.map((d: any) => d.value || d.avg);
      return [
        { label: "Ortalama", value: `${Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length)} ms` },
        { label: "Baz Çizgisi", value: "40 ms" },
        { label: "Trend", value: currentMetric.weeklyChange > 0 ? "↑ Yükseliyor" : "↓ Düşüyor" },
      ];
    }
    if (selectedMetric === "sleep") {
      if (timeRange === "weekly") {
        const totals = data.map((d: any) => d.total);
        return [
          { label: "Ortalama", value: `${(totals.reduce((a: number, b: number) => a + b, 0) / totals.length).toFixed(1)} saat` },
          { label: "En İyi Gece", value: `${Math.max(...totals)} saat` },
          { label: "Derin Uyku", value: `%${Math.round((data.reduce((a: any, d: any) => a + d.deep, 0) / data.reduce((a: any, d: any) => a + d.total, 0)) * 100)}` },
        ];
      } else {
        return [
          { label: "Aylık Ort.", value: `${(data.reduce((a: any, d: any) => a + d.avg, 0) / data.length).toFixed(1)} saat` },
          { label: "Kalite Skoru", value: `%${Math.round(data.reduce((a: any, d: any) => a + d.quality, 0) / data.length)}` },
          { label: "Trend", value: "↑ İyileşiyor" },
        ];
      }
    }
    if (selectedMetric === "steps") {
      if (timeRange === "weekly") {
        const values = data.map((d: any) => d.value);
        const total = values.reduce((a: number, b: number) => a + b, 0);
        return [
          { label: "Toplam", value: total.toLocaleString() },
          { label: "Günlük Ort.", value: Math.round(total / 7).toLocaleString() },
          { label: "Hedef Günler", value: `${values.filter((v: number) => v >= 10000).length}/7` },
        ];
      } else {
        return [
          { label: "Aylık Toplam", value: data.reduce((a: any, d: any) => a + d.total, 0).toLocaleString() },
          { label: "Haftalık Ort.", value: Math.round(data.reduce((a: any, d: any) => a + d.avg, 0) / data.length).toLocaleString() },
          { label: "Trend", value: "↑ Artıyor" },
        ];
      }
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-white/10 p-4"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-lg text-foreground">SAĞLIK TRENDLERİ</h1>
            <p className="text-xs text-muted-foreground">Detaylı bio-metrik analiz</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Ocak 2026</span>
          </div>
        </div>
      </motion.div>

      <div className="p-4 pb-24 space-y-6">
        {/* Metric Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-4 gap-2"
        >
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`p-3 rounded-xl border transition-all ${
                selectedMetric === metric.id
                  ? `${metric.bgClass} ${metric.borderClass}`
                  : "bg-secondary/30 border-transparent hover:bg-secondary/50"
              }`}
            >
              <metric.icon 
                className={`w-5 h-5 mx-auto mb-1 ${
                  selectedMetric === metric.id ? "" : "text-muted-foreground"
                }`}
                style={{ color: selectedMetric === metric.id ? metric.color : undefined }}
              />
              <p className={`text-[10px] text-center ${
                selectedMetric === metric.id ? "text-foreground" : "text-muted-foreground"
              }`}>
                {metric.shortLabel}
              </p>
            </button>
          ))}
        </motion.div>

        {/* Current Value Card */}
        <motion.div
          key={selectedMetric}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-2xl ${currentMetric.bgClass} border ${currentMetric.borderClass}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{currentMetric.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl" style={{ color: currentMetric.color }}>
                  {currentMetric.currentValue.toLocaleString()}
                </span>
                <span className="text-muted-foreground">{currentMetric.unit}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm ${currentMetric.weeklyChange > 0 ? "text-green-400" : "text-red-400"}`}>
                {currentMetric.weeklyChange > 0 ? "↑" : "↓"} {Math.abs(currentMetric.weeklyChange)} {currentMetric.unit}
              </div>
              <p className="text-xs text-muted-foreground">bu hafta</p>
            </div>
          </div>
        </motion.div>

        {/* Time Range Tabs */}
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "weekly" | "monthly")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/30">
            <TabsTrigger value="weekly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Haftalık
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Aylık
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Main Chart */}
        <motion.div
          key={`${selectedMetric}-${timeRange}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">
              {timeRange === "weekly" ? "7 Günlük" : "4 Haftalık"} Trend
            </h3>
          </div>
          <div className="h-56">
            {renderChart()}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {getStats().map((stat, index) => (
            <div key={index} className="glass-card p-4 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{stat.label}</p>
              <p className="font-display text-lg" style={{ color: currentMetric.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4 border border-primary/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-foreground">AI Öngörüsü</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {selectedMetric === "rhr" && "Dinlenme nabzınız son 4 haftada %11 düştü. Bu, kardiyovasküler kondisyonunuzun iyileştiğini gösteriyor. Antrenman yoğunluğunuzu koruyarak bu trendi sürdürün."}
            {selectedMetric === "hrv" && "HRV değerleriniz bazal çizginin üzerinde seyrediyor. Toparlanmanız mükemmel seviyede. Yoğun antrenmanlar için ideal bir dönemdesiniz."}
            {selectedMetric === "sleep" && "Uyku kaliteniz hafta sonlarında artış gösteriyor. Hafta içi uyku düzeninizi optimize etmek için yatış saatinizi 30 dakika erkene almanızı öneriyoruz."}
            {selectedMetric === "steps" && "Günlük adım hedefinize haftanın %57'sinde ulaştınız. Hafta içi aktivitenizi artırmak için öğle molasında 10 dakikalık yürüyüşler ekleyebilirsiniz."}
          </p>
        </motion.div>

        {/* Quick Navigation to Other Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-xs text-muted-foreground font-medium">DİĞER METRİKLER</h3>
          {metrics.filter(m => m.id !== selectedMetric).map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className="w-full flex items-center justify-between p-4 glass-card hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${metric.bgClass} flex items-center justify-center`}>
                  <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {metric.currentValue.toLocaleString()} {metric.unit}
                  </p>
                </div>
              </div>
              <div className={`text-sm ${metric.weeklyChange > 0 ? "text-green-400" : "text-red-400"}`}>
                {metric.weeklyChange > 0 ? "↑" : "↓"}{Math.abs(metric.weeklyChange)}
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SaglikTrendleri;
