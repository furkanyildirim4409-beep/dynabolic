import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// BİLEŞENLER
import SplashScreen from "./components/SplashScreen";
import AppShell from "./components/AppShell";
import NotFound from "./pages/NotFound";
import BiometricLogin from "./pages/BiometricLogin";

// SAYFALAR
// Eğer dosya adın 'Index.tsx' ise burayı düzelt. Mevcut yapına göre 'Beslenme' Kokpit sayfan görünüyor.
import Kokpit from "./pages/Beslenme";
import Antrenman from "./pages/Antrenman";
import Beslenme from "./pages/Beslenme"; // Beslenme sayfası hem Kokpit hem Beslenme olarak kullanılıyor olabilir
import Kesfet from "./pages/Kesfet";
import Profil from "./pages/Profil";
import CoachProfile from "./pages/CoachProfile";
import Akademi from "./pages/Akademi";
import Tarifler from "./pages/Tarifler";

const queryClient = new QueryClient();

// AppShell Wrapper
const AppPage = ({ children }: { children: React.ReactNode }) => <AppShell>{children}</AppShell>;

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          {/* KONTEYNER: Siyah zemin, tam ekran */}
          <div className="relative min-h-screen bg-black text-foreground overflow-hidden">
            {/* 1. KATMAN: SPLASH EKRANI (En Üstte - Z-Index 50) */}
            <AnimatePresence>
              {showSplash && <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />}
            </AnimatePresence>

            {/* 2. KATMAN: ANA UYGULAMA (Arkada Hazır Bekliyor) */}
            <Routes>
              {/* ANA ROTA: Direkt Kokpit (Beslenme) Sayfasına Gider */}
              <Route
                path="/"
                element={
                  <AppPage>
                    <Kokpit />
                  </AppPage>
                }
              />

              {/* Login Sayfası (Opsiyonel Erişim) */}
              <Route path="/login" element={<BiometricLogin />} />

              {/* Diğer Sayfalar */}
              <Route
                path="/kokpit"
                element={
                  <AppPage>
                    <Kokpit />
                  </AppPage>
                }
              />
              <Route
                path="/antrenman"
                element={
                  <AppPage>
                    <Antrenman />
                  </AppPage>
                }
              />
              <Route
                path="/beslenme"
                element={
                  <AppPage>
                    <Beslenme />
                  </AppPage>
                }
              />
              <Route
                path="/kesfet"
                element={
                  <AppPage>
                    <Kesfet />
                  </AppPage>
                }
              />
              <Route
                path="/profil"
                element={
                  <AppPage>
                    <Profil />
                  </AppPage>
                }
              />
              <Route path="/coach/:coachId" element={<CoachProfile />} />
              <Route
                path="/akademi"
                element={
                  <AppPage>
                    <Akademi />
                  </AppPage>
                }
              />
              <Route
                path="/tarifler"
                element={
                  <AppPage>
                    <Tarifler />
                  </AppPage>
                }
              />

              {/* Eski index rotasını ana sayfaya yönlendir */}
              <Route path="/index" element={<Navigate to="/" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
