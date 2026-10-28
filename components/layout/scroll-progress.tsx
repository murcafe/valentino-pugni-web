"use client"

import { motion, useScroll, useSpring } from "motion/react"

/** Barra de progreso de lectura (solo transform: scaleX). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-bordo"
      style={{ scaleX }}
    />
  )
}
