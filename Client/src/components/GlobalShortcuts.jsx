import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import ShortcutsModal from "./ShortcutsModal";
import CommandPalette from "./CommandPalette";
import { GO_TO } from "../utils/shortcuts";

const GlobalShortcuts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { settings, updateSetting } = useSettings();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const enabled = isAuthenticated && settings.shortcutsEnabled !== false;
  const openRef = useRef({});
  openRef.current = { paletteOpen, helpOpen };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    updateSetting("theme", isDark ? "light" : "dark");
  };

  // Keyboard handling
  useEffect(() => {
    if (!enabled) return;
    let gPending = false;
    let gTimer;

    const onKey = (e) => {
      const t = e.target;
      const typing =
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.tagName === "SELECT" ||
        t.isContentEditable;

      // The palette works even while typing
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }

      if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (openRef.current.paletteOpen || openRef.current.helpOpen) return;

      // "G" then a letter
      if (gPending) {
        gPending = false;
        clearTimeout(gTimer);
        const dest = GO_TO[e.key.toLowerCase()];
        if (dest) {
          e.preventDefault();
          navigate(dest.path);
        }
        return;
      }

      switch (e.key) {
        case "g":
          gPending = true;
          gTimer = setTimeout(() => (gPending = false), 1200);
          break;
        case "?":
          e.preventDefault();
          setHelpOpen(true);
          break;
        case "/": {
          const el = document.querySelector("[data-shortcut-search]");
          if (el) {
            e.preventDefault();
            el.focus();
          }
          break;
        }
        case "n":
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("vellum:new-task"));
          break;
        case "b":
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("vellum:new-board"));
          break;
        case "D": // Shift + D
          e.preventDefault();
          toggleTheme();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(gTimer);
    };
  }, [enabled, navigate, updateSetting]);

  // Buttons elsewhere (Settings) can open these too
  useEffect(() => {
    if (!isAuthenticated) return;
    const openPalette = () => setPaletteOpen(true);
    const openHelp = () => setHelpOpen(true);
    window.addEventListener("vellum:open-palette", openPalette);
    window.addEventListener("vellum:open-shortcuts", openHelp);
    return () => {
      window.removeEventListener("vellum:open-palette", openPalette);
      window.removeEventListener("vellum:open-shortcuts", openHelp);
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <>
      <ShortcutsModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onToggleTheme={toggleTheme}
        onShowShortcuts={() => setHelpOpen(true)}
      />
    </>
  );
};

export default GlobalShortcuts;
