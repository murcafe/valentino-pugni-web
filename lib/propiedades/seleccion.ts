"use client"

import { useSyncExternalStore } from "react"

/**
 * Estado compartido card ↔ modal (técnica adaptada de "Morphing Dialog",
 * Patrick Xin / Lumi UI, 21st.dev, MIT):
 * - Solo la card abierta lleva el `layoutId` que comparte con el modal, así no
 *   chocan cards de distintas páginas que Next mantiene montadas (ocultas).
 * - Mientras el modal está abierto, esa card se esconde (si no, se ven las dos).
 * - Al cerrar, la card vuelve a verse y el modal "regresa" a ella.
 */
type Estado = { slug: string | null; abierto: boolean }

let estado: Estado = { slug: null, abierto: false }
const listeners = new Set<() => void>()

function set(next: Estado) {
  if (next.slug === estado.slug && next.abierto === estado.abierto) return
  estado = next
  listeners.forEach((l) => l())
}

export function seleccionarPropiedad(slug: string) {
  set({ slug, abierto: estado.abierto })
}

export function marcarModal(slug: string, abierto: boolean) {
  set({ slug, abierto })
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

const servidor: Estado = { slug: null, abierto: false }

export function useSeleccion() {
  return useSyncExternalStore(
    subscribe,
    () => estado,
    () => servidor
  )
}

export const mediaLayoutId = (slug: string) => `propiedad-media-${slug}`
