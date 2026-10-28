"use client"

import { motion, type HTMLMotionProps } from "motion/react"
import { fadeUp } from "@/lib/motion"

const viewport = { once: true, amount: 0.25, margin: "0px 0px -60px 0px" } as const

/** Fundido + subida suave al entrar en pantalla (una sola vez). */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} custom={delay} {...props} />
}
