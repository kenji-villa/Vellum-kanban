import React, { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

const STORAGE_KEY = "vellum_settings_v1";

const defaultSettings = {
  userName: "Juliana",
  userTitle: "Product Designer",
  userBio:
    "I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.",
  userInitials: "JR",
  theme: "light", // "light" | "dark" | "system"
  accent: "orange", // "orange" | "blue" | "purple" | "emerald" | "rose"
  defaultPriority: "medium",
  defaultLabels: [],
  compactMode: false,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored
        ? { ...defaultSettings, ...JSON.parse(stored) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    const shouldBeDark =
      settings.theme === "dark" ||
      (settings.theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", shouldBeDark);
  }, [settings.theme]);

  const updateSetting = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const resetSettings = () => setSettings(defaultSettings);

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting, resetSettings, setSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
};
