import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import BiometricLogin from "./pages/BiometricLogin";
import AppShell from "./components/AppShell";
import Kokpit from "./pages/Kokpit";
import Antrenman from "./pages/Antrenman";
import Beslenme from "./pages/Beslenme";
import Kesfet from "./pages/Kesfet";
import Profil from "./pages/Profil";
import CoachProfile from "./pages/CoachProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component for pages that need the AppShell
const AppPage = ({ children }: { children: React.ReactNode }) => (
  <AppShell>{children}</AppShell>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Login Screen */}
            <Route path="/" element={<BiometricLogin />} />
            
            {/* Main App Screens with Elite Dock */}
            <Route path="/kokpit" element={<AppPage><Kokpit /></AppPage>} />
            <Route path="/antrenman" element={<AppPage><Antrenman /></AppPage>} />
            <Route path="/beslenme" element={<AppPage><Beslenme /></AppPage>} />
            <Route path="/kesfet" element={<AppPage><Kesfet /></AppPage>} />
            <Route path="/profil" element={<AppPage><Profil /></AppPage>} />
            <Route path="/coach/:coachId" element={<CoachProfile />} />
            
            {/* Redirects for old routes */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="/akademi" element={<Navigate to="/kesfet" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
