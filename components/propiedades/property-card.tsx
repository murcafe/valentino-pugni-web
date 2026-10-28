"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { useFinePointer } from "@/hooks/use-fine-pointer"
import { formatoPrecio, renglones } from "@/lib/propiedades/formato"
import { tipos } from "@/lib/propiedades/filtros"
import { mediaLayoutId, seleccionarPropiedad, useSeleccion } from "@/lib/propiedades/seleccion"
import type { Propiedad } from "@/lib/propiedades/tipos"
import { easePremium, transitions } from "@/lib/motion"
import { cn } from "@/lib/utils"

const SIZES = "(min-width: 1280px) 440px, (min-width: 640px) 50vw, 100vw"

/**
 * La casa como producto: la foto sobre su plinto con la etiqueta de precio
 * bordó y, debajo, el ticket con sus especificaciones.
 * - Con mouse: mover el puntero sobre la foto pasa las fotos (sin timers).
 * - Hover: zoom leve de la foto (solo transform).
 * - Al abrirla, la foto se transforma en la del modal (layoutId compartido).
 */
export function PropertyCard({ propiedad, priority = false }: { propiedad: Propiedad; priority?: boolean }) {
  const { slug, fotos } = propiedad
  const mediaRef = useRef<HTMLDivElement>(null)
  const finePointer = useFinePointer()
  const [index, setIndex] = useState(0)
  const [armed, setArmed] = useState(false) // el resto de las fotos se carga recién al primer hover
  const seleccion = useSeleccion()
  const esLaAbierta = seleccion.slug === slug
  const oculta = esLaAbierta && seleccion.abierto
  const tipoLabel = tipos.find((t) => t.value === propiedad.tipo)?.label ?? propiedad.tipo

  function onPointerMove(e: React.PointerEvent) {
    if (!finePointer || !mediaRef.current || fotos.length < 2) return
    const r = mediaRef.current.getBoundingClientRect()
    if (e.clientY > r.bottom) return // solo sobre la foto
    const x = Math.min(Math.max(e.clientX - r.left, 0), r.width - 1)
    const next = Math.floor((x / r.width) * fotos.length)
    if (next !== index) setIndex(next)
  }

  return (
    <motion.article
      className="group relative"
      initial="rest"
      animate="rest"
      whileHover="hover"
      onPointerEnter={() => finePointer && setArmed(true)}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setIndex(0)}
    >
      <div ref={mediaRef} className="relative" style={{ opacity: oculta ? 0 : 1 }}>
        <motion.div
          layoutId={esLaAbierta ? mediaLayoutId(slug) : undefined}
          className="relative aspect-[4/3] overflow-hidden bg-plinto"
          transition={transitions.spring}
        >
          <motion.div
            className="absolute inset-0"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.045 } }}
            transition={{ duration: 0.9, ease: easePremium }}
          >
            {fotos.map((foto, i) =>
              i === 0 || armed ? (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: i === index ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Image
                    src={foto.src}
                    alt={i === 0 ? foto.alt : ""}
                    fill
                    sizes={SIZES}
                    placeholder={typeof foto.src === "string" ? "empty" : "blur"}
                    loading={priority && i === 0 ? "eager" : "lazy"}
                    className="object-cover"
                  />
                </motion.div>
              ) : null
            )}
          </motion.div>
        </motion.div>

        {/* Etiqueta de precio (fuera del layoutId para que no se deforme en el morph) */}
        <p className="absolute bottom-0 left-0 bg-bordo px-4 py-2 text-lead font-medium text-white">
          {formatoPrecio(propiedad.precio)}
          {propiedad.operacion === "alquiler" && propiedad.precio && <span className="text-cuerpo"> / mes</span>}
        </p>

        {propiedad.tour360 && (
          <p className="pointer-events-none absolute top-0 left-0 bg-tinta px-3 py-1.5 text-chico font-medium text-suelo">Vista 360°</p>
        )}

        {/* Cuántas fotos hay y cuál se ve (solo mouse) */}
        {fotos.length > 1 && (
          <div className="pointer-events-none absolute top-3 right-3 hidden gap-1 md:flex" aria-hidden="true">
            {fotos.map((_, i) => (
              <span key={i} className={cn("size-2 transition-colors duration-300", i === index ? "bg-white" : "bg-white/45")} />
            ))}
          </div>
        )}
      </div>

      {/* Ticket con las especificaciones */}
      <div className="ticket-dentado mx-3 bg-papel px-5 pt-5 pb-4 sm:mx-4">
        <p className="flex flex-wrap gap-x-2 text-chico text-tinta-suave">
          <span>
            {propiedad.operacion === "venta" ? "Venta" : "Alquiler"} · {tipoLabel} · {propiedad.zona}
          </span>
          {propiedad.ejemplo && <span className="font-medium text-bordo">Propiedad de ejemplo</span>}
        </p>
        <h3 className="mt-2 line-clamp-2 text-lead leading-[1.05]">
          <Link
            href={`/propiedades/${slug}`}
            prefetch={true}
            scroll={false}
            onClick={() => seleccionarPropiedad(slug)}
            className="transition-colors duration-200 group-hover:text-bordo after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-bordo"
          >
            {propiedad.titulo}
          </Link>
        </h3>
        <dl className="mt-4 grid gap-1.5 text-chico">
          {renglones(propiedad).map(([label, valor]) => (
            <Renglon key={label} label={label}>
              {valor}
            </Renglon>
          ))}
        </dl>
      </div>
    </motion.article>
  )
}

/** Renglón de ticket: concepto a la izquierda, valor a la derecha y puntos entre los dos. */
export function Renglon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-tinta-suave">{label}</dt>
      <span aria-hidden="true" className="min-w-4 flex-1 translate-y-[-0.2em] border-b-[3px] border-dotted border-plinto" />
      <dd className="font-medium">{children}</dd>
    </div>
  )
}
