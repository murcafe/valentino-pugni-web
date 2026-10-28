"use client"

import { useRef } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { useFinePointer } from "@/hooks/use-fine-pointer"
import { cn } from "@/lib/utils"

const MAX = 8 // px: sutil, no un imán de feria

/** Efecto magnético leve. Solo con mouse y sin "reducir movimiento". */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const finePointer = useFinePointer()
  const reduce = useReducedMotion()
  const enabled = finePointer && !reduce

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 })

  function onPointerMove(e: React.PointerEvent) {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) * strength
    const dy = (e.clientY - (r.top + r.height / 2)) * strength
    x.set(Math.max(-MAX, Math.min(MAX, dx)))
    y.set(Math.max(-MAX, Math.min(MAX, dy)))
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      style={enabled ? { x: springX, y: springY } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  )
}
