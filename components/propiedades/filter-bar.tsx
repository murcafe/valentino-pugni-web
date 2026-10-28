"use client"

import { opcionesAmbientes, operaciones, tipos } from "@/lib/propiedades/filtros"
import type { Filtros, Operacion, TipoPropiedad } from "@/lib/propiedades/tipos"
import { cn } from "@/lib/utils"

type Opcion<T> = { value: T | undefined; label: string }

/**
 * Filtros como grupos de chips; el activo se invierte (tinta).
 */
export function FilterBar({
  filtros,
  onChange,
  tiposDisponibles,
  zonas,
  className,
}: {
  filtros: Filtros
  onChange: (filtros: Filtros) => void
  /** solo se muestran los tipos que existen en el catálogo */
  tiposDisponibles: TipoPropiedad[]
  /** si viene, se muestra el grupo de zonas */
  zonas?: { value: string; label: string }[]
  className?: string
}) {
  const gruposOperacion: Opcion<Operacion>[] = [
    { value: undefined, label: "Todas" },
    ...operaciones.map((o) => ({ value: o.value, label: o.label })),
  ]
  const gruposTipo: Opcion<TipoPropiedad>[] = [
    { value: undefined, label: "Todos" },
    ...tipos.filter((t) => tiposDisponibles.includes(t.value)).map((t) => ({ value: t.value, label: t.plural })),
  ]
  const gruposAmbientes: Opcion<number>[] = [
    { value: undefined, label: "Todos" },
    ...opcionesAmbientes.map((n) => ({ value: n, label: `${n}+` })),
  ]

  return (
      <div className={cn("flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-10", className)}>
        <ChipGroup
          label="Operación"
          opciones={gruposOperacion}
          value={filtros.operacion}
          onSelect={(v) => onChange({ ...filtros, operacion: v })}
        />
        <ChipGroup
          label="Tipo"
          opciones={gruposTipo}
          value={filtros.tipo}
          onSelect={(v) => onChange({ ...filtros, tipo: v })}
        />
        <ChipGroup
          label="Ambientes"
          opciones={gruposAmbientes}
          value={filtros.ambientes}
          onSelect={(v) => onChange({ ...filtros, ambientes: v })}
        />
        {zonas && (
          <ChipGroup
            label="Zona"
            opciones={[{ value: undefined, label: "Todas" }, ...zonas]}
            value={filtros.zona}
            onSelect={(v) => onChange({ ...filtros, zona: v })}
          />
        )}
      </div>
  )
}

function ChipGroup<T extends string | number>({
  label,
  opciones,
  value,
  onSelect,
}: {
  label: string
  opciones: Opcion<T>[]
  value: T | undefined
  onSelect: (value: T | undefined) => void
}) {
  return (
    <div role="group" aria-label={label} className="min-w-0">
      <p className="mb-2 text-chico text-tinta-suave" aria-hidden="true">
        {label}
      </p>
      <div>
        <div className="flex flex-wrap gap-1.5">
          {opciones.map((o) => {
            const active = o.value === value
            return (
              <button
                key={o.label}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(o.value)}
                className={cn(
                  "inline-flex min-h-11 items-center px-4 text-chico font-medium transition-[background-color,color,scale] duration-150 active:scale-[0.97]",
                  active ? "bg-tinta text-suelo" : "bg-plinto text-tinta hover:bg-tinta/15"
                )}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
