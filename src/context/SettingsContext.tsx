import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "tr" | "en" | "de";
export type AppearanceMode = "dark" | "light";

interface NotificationSettings {
  workoutReminders: boolean;
  coachMessages: boolean;
  payments: boolean;
  communityAlerts: boolean;
}

interface SettingsContextType {
  // Notifications
  notifications: NotificationSettings;
  updateNotification: (key: keyof NotificationSettings, value: boolean) => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Appearance
  appearance: AppearanceMode;
  setAppearance: (mode: AppearanceMode) => void;
}

const defaultNotifications: NotificationSettings = {
  workoutReminders: true,
  coachMessages: true,
  payments: true,
  communityAlerts: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem("dynabolic-notifications");
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("dynabolic-language");
    return (saved as Language) || "tr";
  });

  const [appearance, setAppearanceState] = useState<AppearanceMode>(() => {
    const saved = localStorage.getItem("dynabolic-appearance");
    return (saved as AppearanceMode) || "dark";
  });

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("dynabolic-notifications", JSON.stringify(updated));
      return updated;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("dynabolic-language", lang);
  };

  const setAppearance = (mode: AppearanceMode) => {
    setAppearanceState(mode);
    localStorage.setItem("dynabolic-appearance", mode);
    // Future: Apply theme classes to document
  };

  return (
    <SettingsContext.Provider value={{
      notifications,
      updateNotification,
      language,
      setLanguage,
      appearance,
      setAppearance,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

// Language labels for UI
export const languageLabels: Record<Language, { native: string; flag: string }> = {
  tr: { native: "Türkçe", flag: "🇹🇷" },
  en: { native: "English", flag: "🇬🇧" },
  de: { native: "Deutsch", flag: "🇩🇪" },
};
