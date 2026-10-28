"use client"

import { useMemo, useState } from "react"
import { FilterBar } from "@/components/propiedades/filter-bar"
import { PropertyGrid } from "@/components/propiedades/property-grid"
import { filtrar, filtrosAQuery, hayFiltros } from "@/lib/propiedades/filtros"
import type { Filtros, Propiedad } from "@/lib/propiedades/tipos"

/**
 * Catálogo con filtros sincronizados con la URL (?operacion=&tipo=&zona=&ambientes=).
 * Filtra en el cliente para que la grilla se reacomode al instante; la URL se
 * actualiza con replaceState (compartible, sin ensuciar el historial).
 */
export function Catalogo({
  propiedades,
  zonas,
  initial,
}: {
  propiedades: Propiedad[]
  zonas: { value: string; label: string }[]
  initial: Filtros
}) {
  const [filtros, setFiltros] = useState<Filtros>(initial)
  const resultado = useMemo(() => filtrar(propiedades, filtros), [propiedades, filtros])
  const tiposDisponibles = useMemo(() => Array.from(new Set(propiedades.map((p) => p.tipo))), [propiedades])

  function update(next: Filtros) {
    setFiltros(next)
    window.history.replaceState(null, "", `/propiedades${filtrosAQuery(next)}`)
  }

  return (
    <>
      <FilterBar filtros={filtros} onChange={update} tiposDisponibles={tiposDisponibles} zonas={zonas} />

      <div className="mt-10 flex items-center justify-between text-chico text-tinta-suave">
        <p aria-live="polite">
          {resultado.length === 1 ? "1 propiedad" : `${resultado.length} propiedades`}
          {hayFiltros(filtros) ? " con estos filtros" : ""}
        </p>
        {hayFiltros(filtros) && (
          <button
            type="button"
            onClick={() => update({})}
            className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-[6px] hover:text-bordo"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="mt-8">
        <PropertyGrid propiedades={resultado} onReset={() => update({})} conFiltros={propiedades.length > 0} />
      </div>
    </>
  )
}

export function CatalogoSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 w-24 bg-plinto" />
        ))}
      </div>
      <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/3] bg-plinto" />
            <div className="mx-4 h-40 bg-papel" />
          </div>
        ))}
      </div>
    </div>
  )
}
