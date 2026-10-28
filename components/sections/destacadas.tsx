"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { FilterBar } from "@/components/propiedades/filter-bar"
import { PropertyGrid } from "@/components/propiedades/property-grid"
import { filtrar, filtrosAQuery } from "@/lib/propiedades/filtros"
import type { Filtros, Propiedad } from "@/lib/propiedades/tipos"

const MAX = 6

export function Destacadas({ propiedades }: { propiedades: Propiedad[] }) {
  const [filtros, setFiltros] = useState<Filtros>({})

  // Destacadas primero; los filtros recorren todo el catálogo.
  const ordenadas = useMemo(
    () => [...propiedades].sort((a, b) => Number(b.destacada) - Number(a.destacada)),
    [propiedades]
  )
  const resultado = useMemo(() => filtrar(ordenadas, filtros), [ordenadas, filtros])
  const tiposDisponibles = useMemo(() => Array.from(new Set(propiedades.map((p) => p.tipo))), [propiedades])

  return (
    <section id="propiedades" aria-labelledby="propiedades-title" className="pt-28 pb-24 md:pt-40 md:pb-28">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 id="propiedades-title" className="text-titulo">
              Propiedades en vidriera
            </h2>
            <p className="mt-4 max-w-[36rem] text-lead">Casas, departamentos y PH en venta y alquiler. Filtrá y abrí la que te guste.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              href={`/propiedades${filtrosAQuery(filtros)}`}
              className="group inline-flex min-h-11 items-center gap-2 underline decoration-1 underline-offset-[6px] hover:text-bordo"
            >
              Ver todas las propiedades
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <FilterBar
            className="mt-12"
            filtros={filtros}
            onChange={setFiltros}
            tiposDisponibles={tiposDisponibles}
          />
        </Reveal>

        <p className="sr-only" aria-live="polite">
          {resultado.length === 1 ? "1 propiedad" : `${resultado.length} propiedades`}
        </p>

        <div className="mt-12">
          <PropertyGrid propiedades={resultado.slice(0, MAX)} onReset={() => setFiltros({})} conFiltros={propiedades.length > 0} />
        </div>
      </div>
    </section>
  )
}
