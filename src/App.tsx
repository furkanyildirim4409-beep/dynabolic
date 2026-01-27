import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

import SplashScreen from "./components/SplashScreen";
import AppShell from "./components/AppShell";
import Kokpit from "./pages/Kokpit";
import Antrenman from "./pages/Antrenman";
import Beslenme from "./pages/Beslenme";
import Kesfet from "./pages/Kesfet";
import Profil from "./pages/Profil";
import CoachProfile from "./pages/CoachProfile";
import Akademi from "./pages/Akademi";
import Tarifler from "./pages/Tarifler";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component for pages that need the AppShell
const AppPage = ({ children }: { children: React.ReactNode }) => (
  <AppShell>{children}</AppShell>
);

const App = () => {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* OVERLAY ARCHITECTURE: Both layers render simultaneously */}
        <div className="relative w-full h-full">
          
          {/* LAYER 1: Main App (always mounted, z-index: 0) */}
          <div className="relative z-0">
            <BrowserRouter>
              <Routes>
                {/* Root now goes directly to Kokpit - bypass login */}
                <Route path="/" element={<AppPage><Kokpit /></AppPage>} />
                
                {/* Main App Screens with Elite Dock */}
                <Route path="/kokpit" element={<AppPage><Kokpit /></AppPage>} />
                <Route path="/antrenman" element={<AppPage><Antrenman /></AppPage>} />
                <Route path="/beslenme" element={<AppPage><Beslenme /></AppPage>} />
                <Route path="/kesfet" element={<AppPage><Kesfet /></AppPage>} />
                <Route path="/profil" element={<AppPage><Profil /></AppPage>} />
                <Route path="/coach/:coachId" element={<CoachProfile />} />
                <Route path="/akademi" element={<AppPage><Akademi /></AppPage>} />
                <Route path="/tarifler" element={<AppPage><Tarifler /></AppPage>} />
                
                {/* Redirects for old routes */}
                <Route path="/index" element={<Navigate to="/" replace />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>

          {/* LAYER 2: Splash Overlay (z-index: 50, fades out when complete) */}
          {!splashComplete && (
            <motion.div
              className="fixed inset-0 z-50"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ pointerEvents: splashComplete ? 'none' : 'auto' }}
            >
              <SplashScreen onComplete={() => setSplashComplete(true)} />
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
