import { motion } from "framer-motion";
import { Smartphone, Watch, Wifi, WifiOff, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface WearableDeviceSyncProps {
  simulationEnabled: boolean;
  onSimulationToggle: (enabled: boolean) => void;
}

const WearableDeviceSync = ({ simulationEnabled, onSimulationToggle }: WearableDeviceSyncProps) => {
  const handleConnect = (device: string) => {
    toast({
      title: `${device} Bağlantısı (Demo)`,
      description: "Bu özellik yakında gerçek cihazlarla entegre olacak. Şimdilik simülasyon modunu kullanabilirsiniz.",
    });
  };

  const devices = [
    {
      id: "apple",
      name: "Apple Health",
      icon: "🍎",
      color: "from-white/20 to-white/5",
      borderColor: "border-white/20",
    },
    {
      id: "google",
      name: "Google Health Connect",
      icon: "💚",
      color: "from-green-500/20 to-green-500/5",
      borderColor: "border-green-500/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-5 h-5 text-primary" />
        <h2 className="font-display text-lg text-foreground tracking-wide">
          CİHAZ BAĞLANTISI
        </h2>
      </div>

      {/* Device Cards */}
      <div className="space-y-3 mb-4">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl bg-gradient-to-r ${device.color} border ${device.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{device.icon}</span>
                <div>
                  <p className="font-medium text-foreground text-sm">{device.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <WifiOff className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Bağlı Değil</span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleConnect(device.name)}
                className="text-xs h-8 px-3 border-white/20 hover:bg-white/10"
              >
                BAĞLAN
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Simulation Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={`p-4 rounded-xl border transition-all ${
          simulationEnabled 
            ? "bg-primary/10 border-primary/30" 
            : "bg-secondary/50 border-white/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              simulationEnabled ? "bg-primary/20" : "bg-secondary"
            }`}>
              <Zap className={`w-5 h-5 ${simulationEnabled ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className={`font-medium text-sm ${simulationEnabled ? "text-primary" : "text-foreground"}`}>
                Simülasyon Modu
              </p>
              <p className="text-xs text-muted-foreground">
                Demo verilerini göster
              </p>
            </div>
          </div>
          <Switch
            checked={simulationEnabled}
            onCheckedChange={onSimulationToggle}
          />
        </div>
        
        {simulationEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-primary/20"
          >
            <div className="flex items-center gap-2 text-xs text-primary">
              <Wifi className="w-3 h-3" />
              <span>Simülasyon aktif - Demo verileri gösteriliyor</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WearableDeviceSync;
