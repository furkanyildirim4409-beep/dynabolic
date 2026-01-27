import { ReactNode } from "react";
import { motion } from "framer-motion";
import EliteDock from "./EliteDock";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Grid pattern background */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      
      {/* Mobile-first container */}
      <div className="relative mx-auto max-w-[430px] min-h-screen">
        {/* Page content with padding for dock and safe area */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="px-4 pt-6 pb-32 min-h-screen no-scrollbar"
          style={{ paddingBottom: 'calc(120px + env(safe-area-inset-bottom))' }}
        >
          {children}
        </motion.main>

        {/* Elite Dock Navigation */}
        <EliteDock />
      </div>
    </div>
  );
};

export default AppShell;
