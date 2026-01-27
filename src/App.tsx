import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "./components/SplashScreen";

// KOKPİT SAYFASI (Eğer sayfanın adı 'Beslenme' ise import Beslenme from ... yap)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* ÖNEMLİ DEĞİŞİKLİK: 
             Eskiden {showSplash ? <Splash/> : <Routes/>} yapıyorduk. Bu yanlıştı.
             Şimdi ikisini de aynı anda render ediyoruz. Splash en üstte (z-index) duruyor.
          */}

          <div className="relative min-h-screen bg-black">
            {/* 1. KATMAN: SPLASH EKRANI (En Üstte) */}
            <AnimatePresence>
              {showSplash && <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />}
            </AnimatePresence>

            {/* 2. KATMAN: ANA UYGULAMA (Arkada Hazır Bekliyor) */}
            {/* Splash bitince burası zaten render edilmiş olduğu için anında görünür */}
            <Routes>
              {/* ANA ROTA: Direkt Index (Kokpit) Sayfasına Gider */}
              <Route path="/" element={<Index />} />

              {/* Diğer Rotalar */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
