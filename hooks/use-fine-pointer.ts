"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(hover: hover) and (pointer: fine)"

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

/** true solo con mouse/trackpad (nunca en touch). En el servidor, false. */
export function useFinePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}
