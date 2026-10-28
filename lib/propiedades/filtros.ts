import type { Filtros, Operacion, Propiedad, TipoPropiedad } from "./tipos"

export const operaciones: { value: Operacion; label: string; accion: string }[] = [
  { value: "venta", label: "Venta", accion: "Comprar" },
  { value: "alquiler", label: "Alquiler", accion: "Alquilar" },
]

export const tipos: { value: TipoPropiedad; label: string; plural: string }[] = [
  { value: "casa", label: "Casa", plural: "Casas" },
  { value: "departamento", label: "Departamento", plural: "Departamentos" },
  { value: "ph", label: "PH", plural: "PH" },
  { value: "lote", label: "Lote", plural: "Lotes" },
  { value: "local", label: "Local u oficina", plural: "Locales y oficinas" },
]

export const opcionesAmbientes = [1, 2, 3, 4] as const

export function slugZona(zona: string) {
  return zona
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
}

const esOperacion = (v: unknown): v is Operacion => operaciones.some((o) => o.value === v)
const esTipo = (v: unknown): v is TipoPropiedad => tipos.some((t) => t.value === v)

type ParamsLike = URLSearchParams | Record<string, string | string[] | undefined>

function leer(params: ParamsLike, key: string) {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined
  const v = params[key]
  return Array.isArray(v) ? v[0] : v
}

/** Query params → filtros tipados (ignora valores inválidos). */
export function parseFiltros(params: ParamsLike): Filtros {
  const operacion = leer(params, "operacion")
  const tipo = leer(params, "tipo")
  const zona = leer(params, "zona")
  const ambientes = Number(leer(params, "ambientes"))
  return {
    operacion: esOperacion(operacion) ? operacion : undefined,
    tipo: esTipo(tipo) ? tipo : undefined,
    zona: zona || undefined,
    ambientes: Number.isInteger(ambientes) && ambientes > 0 ? ambientes : undefined,
  }
}

/** Aplica los filtros (sirve en servidor y en cliente). */
export function filtrar(propiedades: Propiedad[], filtros: Filtros) {
  return propiedades
    .filter((p) => !filtros.operacion || p.operacion === filtros.operacion)
    .filter((p) => !filtros.tipo || p.tipo === filtros.tipo)
    .filter((p) => !filtros.zona || slugZona(p.zona) === filtros.zona)
    .filter((p) => !filtros.ambientes || p.ambientes >= filtros.ambientes)
}

export function hayFiltros(filtros: Filtros) {
  return Boolean(filtros.operacion || filtros.tipo || filtros.zona || filtros.ambientes)
}

/** Filtros → query string ("?operacion=venta&zona=city-bell"). */
export function filtrosAQuery(filtros: Filtros) {
  const q = new URLSearchParams()
  if (filtros.operacion) q.set("operacion", filtros.operacion)
  if (filtros.tipo) q.set("tipo", filtros.tipo)
  if (filtros.zona) q.set("zona", filtros.zona)
  if (filtros.ambientes) q.set("ambientes", String(filtros.ambientes))
  const s = q.toString()
  return s ? `?${s}` : ""
}
