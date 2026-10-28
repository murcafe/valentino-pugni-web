"use client"

import { useEffect, useRef } from "react"
import { ReactLenis, type LenisRef } from "lenis/react"
import { cancelFrame, frame } from "motion/react"

/**
 * Smooth scroll con Lenis, sincronizado con el loop de frames de Motion.
 * - En touch el scroll queda nativo (syncTouch: false).
 * - Con "reducir movimiento" Lenis desactiva el suavizado solo (respectReducedMotion).
 * - Las anclas las maneja <SectionLink>; los modales usan data-lenis-prevent.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp)
    }
    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.11, stopInertiaOnNavigate: true }}
    >
      {children}
    </ReactLenis>
  )
}
