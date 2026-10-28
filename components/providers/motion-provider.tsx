"use client"

import { LayoutGroup, MotionConfig } from "motion/react"
import { transitions } from "@/lib/motion"

/**
 * - Con "reducir movimiento" activo, Motion apaga transforms y layout y deja solo fundidos.
 * - LayoutGroup global: la card (en la página) y el modal (en el slot @modal)
 *   viven en árboles distintos y tienen que medirse juntos para el morph.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={transitions.reveal}>
      <LayoutGroup>{children}</LayoutGroup>
    </MotionConfig>
  )
}
