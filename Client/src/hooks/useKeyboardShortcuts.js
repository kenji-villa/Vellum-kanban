import { useEffect } from "react";

/**
 * Register global keyboard shortcuts.
 * Pass a map: { "n": () => {...}, "/": () => {...} }
 * Ignores key presses when typing in inputs/textareas/contenteditable.
 */
export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handler = (e) => {
      const target = e.target;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // Escape always works
      if (e.key === "Escape") {
        if (shortcuts["Escape"]) {
          shortcuts["Escape"](e);
        }
        return;
      }

      if (isTyping) return;

      const key = e.key.toLowerCase();
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key](e);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
};