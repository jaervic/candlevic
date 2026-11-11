"use client";

import { create } from "zustand";

type UIStore = {
  settingsOpen: boolean;
  focusMode: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  toggleFocus: () => void;
  setFocus: (value: boolean) => void;
};

export const useUI = create<UIStore>((set) => ({
  settingsOpen: false,
  focusMode: false,
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  toggleFocus: () => set((state) => ({ focusMode: !state.focusMode })),
  setFocus: (focusMode) => set({ focusMode }),
}));
