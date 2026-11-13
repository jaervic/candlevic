"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Devuelve false en el servidor y true en el cliente, sin setState dentro de
 * un efecto. Evita desajustes de hidratación en componentes que leen
 * localStorage.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
