import React from "react";
import Modal from "./UI/Modal";
import { KeyCombo } from "./UI/KeyCombo";
import { SHORTCUT_GROUPS } from "../utils/shortcuts";

const ShortcutsModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Keyboard shortcuts">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
      {SHORTCUT_GROUPS.map((g) => (
        <section key={g.title}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            {g.title}
          </h3>
          <ul className="space-y-1.5">
            {g.items.map((s) => (
              <li
                key={s.label}
                className="flex items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-200"
              >
                <span>{s.label}</span>
                <KeyCombo keys={s.keys} then={s.then} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </Modal>
);

export default ShortcutsModal;
