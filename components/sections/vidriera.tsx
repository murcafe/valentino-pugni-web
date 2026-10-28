"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react"
import { formatoPrecio } from "@/lib/propiedades/formato"
import type { Propiedad } from "@/lib/propiedades/tipos"
import { cn } from "@/lib/utils"

const lugar = [
  "lg:left-8 lg:top-[14%] lg:w-[17vw] lg:aspect-[4/5]",
  "lg:right-8 lg:top-[11%] lg:w-[20vw] lg:aspect-[5/4]",
  "lg:left-8 lg:bottom-[5%] lg:w-[19vw] lg:aspect-[5/4]",
  "lg:right-8 lg:bottom-0 lg:w-[16vw] lg:aspect-[4/5]",
]
// La etiqueta va hacia el centro de la vidriera (por defecto abajo a la izquierda).
const etiqueta = ["", "lg:left-auto lg:right-0", "lg:bottom-auto lg:top-0", "lg:bottom-auto lg:top-0 lg:left-auto lg:right-0"]
// Cada casa se desplaza a su propia velocidad al scrollear (px al salir el hero).
const deriva = [-90, -150, -40, -110]

const PASO_MS = 2800 // cada cuánto cambia la foto de UNA casa (en ronda)
const FUNDIDO_S = 1.6

/**
 * Casas reales alrededor del titular. Movimiento distintivo: de a una por vez,
 * cada casa cambia de foto con un fundido lento, como luz que cambia en una vidriera.
 * Se pausa con la pestaña oculta; con "reducir movimiento" queda la primera foto.
 */
export function Vidriera({ propiedades }: { propiedades: Propiedad[] }) {
  const reduce = useReducedMotion()
  const [fotoDe, setFotoDe] = useState<number[]>(() => propiedades.map(() => 0))
  // Las otras fotos se montan recién en el primer cambio: no compiten con la carga inicial.
  const [armada, setArmada] = useState(false)

  useEffect(() => {
    if (reduce) return
    let turno = 0
    const id = window.setInterval(() => {
      if (document.hidden) return
      const i = turno++ % propiedades.length
      setArmada(true)
      setFotoDe((prev) => prev.map((f, j) => (j === i ? (f + 1) % propiedades[j].fotos.length : f)))
    }, PASO_MS)
    return () => window.clearInterval(id)
  }, [reduce, propiedades])

  return (
    <ul
      aria-label="Algunas propiedades del catálogo"
      className="container-site mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:pointer-events-none lg:absolute lg:inset-0 lg:m-0 lg:block lg:max-w-none lg:p-0"
    >
      {propiedades.map((p, i) => (
        <Producto key={p.id} propiedad={p} indice={i} foto={fotoDe[i]} armada={armada} reduce={!!reduce} />
      ))}
    </ul>
  )
}

function Producto({
  propiedad: p,
  indice,
  foto,
  armada,
  reduce,
}: {
  propiedad: Propiedad
  indice: number
  foto: number
  armada: boolean
  reduce: boolean
}) {
  const ref = useRef<HTMLLIElement>(null)
  const { scrollY } = useScroll()
  // Parallax solo en desktop (en mobile la grilla queda quieta); transform completo, sin atajos.
  const y = useTransform(scrollY, [0, 900], [0, reduce ? 0 : deriva[indice]])
  const transform = useMotionTemplate`translate3d(0, ${y}px, 0)`

  return (
    <motion.li
      ref={ref}
      style={{ transform, ["--i" as string]: indice }}
      className={cn("vidriera-entra relative aspect-[4/5] bg-plinto max-lg:!transform-none lg:pointer-events-auto lg:absolute", lugar[indice])}
    >
      <Link href={`/propiedades/${p.slug}`} prefetch={true} className="group block h-full w-full overflow-hidden">
        {p.fotos.map((f, j) =>
          j === 0 || armada ? (
            <motion.div
              key={j}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: j === foto ? 1 : 0 }}
              transition={{ duration: FUNDIDO_S, ease: "easeInOut" }}
            >
              <Image
                src={f.src}
                alt={j === 0 ? f.alt : ""}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 25vw, 50vw"
                loading={indice < 2 && j === 0 ? "eager" : "lazy"}
                placeholder={typeof f.src === "string" ? "empty" : "blur"}
                className="object-cover transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.04]"
              />
            </motion.div>
          ) : null
        )}
        <span
          className={cn(
            "absolute bottom-0 left-0 bg-bordo px-2.5 py-1.5 text-chico font-medium text-white lg:px-4 lg:py-2 lg:text-lead",
            etiqueta[indice]
          )}
        >
          {formatoPrecio(p.precio)}
          <span className="sr-only">: {p.titulo}, {p.zona}</span>
        </span>
      </Link>
    </motion.li>
  )
}
