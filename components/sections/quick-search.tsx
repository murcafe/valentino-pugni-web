"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { filtrosAQuery, operaciones, tipos } from "@/lib/propiedades/filtros"
import type { Operacion, TipoPropiedad } from "@/lib/propiedades/tipos"
import { cn } from "@/lib/utils"

type Opcion = { value: string; label: string }

/**
 * Buscador impreso como ticket → /propiedades con los filtros en la URL.
 * Sin JS funciona igual (form GET nativo).
 */
export function QuickSearch({ zonas, className }: { zonas: Opcion[]; className?: string }) {
  const router = useRouter()
  const [operacion, setOperacion] = useState<Operacion>("venta")
  const [tipo, setTipo] = useState<TipoPropiedad | "">("")
  const [zona, setZona] = useState("")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    router.push(`/propiedades${filtrosAQuery({ operacion, tipo: tipo || undefined, zona: zona || undefined })}`)
  }

  return (
    <form
      role="search"
      aria-label="Buscar propiedades"
      action="/propiedades"
      method="get"
      onSubmit={onSubmit}
      className={cn("ticket-dentado grid grid-cols-2 bg-papel text-tinta md:grid-cols-[1fr_1fr_1fr_auto]", className)}
    >
      <Field label="Operación" name="operacion" value={operacion} onChange={(v) => setOperacion(v as Operacion)}>
        {operaciones.map((o) => (
          <option key={o.value} value={o.value}>
            {o.accion}
          </option>
        ))}
      </Field>
      <Field label="Tipo" name="tipo" value={tipo} onChange={(v) => setTipo(v as TipoPropiedad | "")}>
        <option value="">Todos</option>
        {tipos.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Field>
      <Field label="Zona" name="zona" value={zona} onChange={setZona}>
        <option value="">Todas</option>
        {zonas.map((z) => (
          <option key={z.value} value={z.value}>
            {z.label}
          </option>
        ))}
      </Field>
      <button
        type="submit"
        className="inline-flex min-h-16 items-center justify-center bg-tinta px-8 text-lead font-medium text-suelo transition-colors duration-200 hover:bg-bordo"
      >
        Buscar
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  children,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  const id = `qs-${name}`
  return (
    <div className="relative flex min-h-[4.5rem] flex-col justify-center px-4 py-3 sm:px-6">
      <label htmlFor={id} className="text-chico text-tinta-suave">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-lead font-medium text-tinta focus-visible:outline-offset-2"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 bottom-4 size-4 text-tinta-suave sm:right-5"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </div>
  )
}
