"use client"

import { motion, type HTMLMotionProps } from "motion/react"
import { easePremium } from "@/lib/motion"

/** Fundido de entrada al montar (y de salida dentro de AnimatePresence). */
export function FadeIn({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: easePremium, delay } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      {...props}
    />
  )
}
