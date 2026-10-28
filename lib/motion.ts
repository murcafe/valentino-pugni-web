import type { Transition, Variants } from "motion/react"

/** Curva "premium": arranca decidida y frena largo. */
export const easePremium = [0.22, 1, 0.36, 1] as const

/** Las 3 transiciones base del sitio. Todo lo demás deriva de acá. */
export const transitions = {
  /** Hover, tap, toggles. */
  fast: { duration: 0.2, ease: "easeOut" },
  /** Entradas de contenido y reveals. */
  reveal: { duration: 0.6, ease: easePremium },
  /** Layout, modales y elementos que se reacomodan. */
  spring: { type: "spring", visualDuration: 0.45, bounce: 0.12 },
} satisfies Record<string, Transition>

/** Entrada estándar al aparecer en pantalla. `custom` = delay en segundos. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { ...transitions.reveal, delay } }),
}
