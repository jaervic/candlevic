"use client";

import { create } from "zustand";

type UIStore = {
  settingsOpen: boolean;
  focusMode: boolean;
  searchOpen: boolean;
  tocOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  toggleFocus: () => void;
  setFocus: (value: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
  openToc: () => void;
  closeToc: () => void;
};

export const useUI = create<UIStore>((set) => ({
  settingsOpen: false,
  focusMode: false,
  searchOpen: false,
  tocOpen: false,
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  toggleFocus: () => set((state) => ({ focusMode: !state.focusMode })),
  setFocus: (focusMode) => set({ focusMode }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  openToc: () => set({ tocOpen: true }),
  closeToc: () => set({ tocOpen: false }),
}));
