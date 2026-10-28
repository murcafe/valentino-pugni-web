"use client"

import { AnimatePresence, motion } from "motion/react"
import { PropertyCard } from "@/components/propiedades/property-card"
import type { Propiedad } from "@/lib/propiedades/tipos"
import { easePremium, transitions } from "@/lib/motion"

/**
 * Grilla que se reacomoda al filtrar: `layout` + AnimatePresence "popLayout"
 * (las cards que salen dejan de ocupar lugar al instante y el resto se desliza).
 */
export function PropertyGrid({
  propiedades,
  onReset,
  conFiltros = true,
}: {
  propiedades: Propiedad[]
  onReset?: () => void
  /** false = el catálogo está vacío de verdad (no es culpa de los filtros) */
  conFiltros?: boolean
}) {
  return (
    <div className="relative">
      <motion.ul layout className="relative grid gap-x-6 gap-y-16 sm:grid-cols-2 xl:grid-cols-3" transition={transitions.spring}>
        <AnimatePresence mode="popLayout" initial={false}>
          {propiedades.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              className="vidriera-entra [animation-fill-mode:backwards]"
              style={{ ["--i" as string]: i % 6 }}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: "easeIn" } }}
              transition={{ ...transitions.spring, opacity: { duration: 0.35, ease: easePremium } }}
            >
              <PropertyCard propiedad={p} priority={i < 2} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {propiedades.length === 0 && (
          <motion.div
            key="vacio"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-plinto px-6 py-16 text-center"
          >
            <p className="font-display text-lead leading-none">
              {conFiltros ? "No hay propiedades con esos filtros." : "Estoy cargando las propiedades."}
            </p>
            <p className="mt-3 text-tinta-suave">
              {conFiltros
                ? "Probá con menos filtros o escribime y te aviso cuando entre algo así."
                : "Escribime por WhatsApp y te cuento lo que tengo disponible."}
            </p>
            {onReset && conFiltros && (
              <button
                type="button"
                onClick={onReset}
                className="mt-6 inline-flex min-h-11 items-center underline decoration-1 underline-offset-[6px] hover:text-bordo"
              >
                Limpiar filtros
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
