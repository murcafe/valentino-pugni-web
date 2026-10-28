/**
 * Capa de datos de propiedades.
 *
 * Los componentes SOLO usan estas funciones. Para conectar un CRM
 * (por ejemplo Tokko Broker), reemplazá la implementación de `fuente`
 * por un adaptador que traiga los datos de la API y los convierta al
 * tipo `Propiedad`. Ningún componente tiene que cambiar.
 */
import { propiedadesEjemplo } from "@/data/propiedades"
import { filtrar, slugZona } from "./filtros"
import type { Filtros, Propiedad } from "./tipos"

export type { Filtros, Propiedad } from "./tipos"

type FuenteDePropiedades = {
  listar: () => Promise<Propiedad[]>
}

/**
 * Fuente actual: archivo local con propiedades de ejemplo.
 * Solo en desarrollo, DATOS=peor | vacio | una cambia a los datos de prueba de data/propiedades.peor.ts.
 */
const fuente: FuenteDePropiedades = {
  listar: async () => {
    if (process.env.NODE_ENV !== "production" && process.env.DATOS) {
      const prueba = await import("@/data/propiedades.peor")
      const sets = { peor: prueba.propiedadesPeorCaso, vacio: prueba.propiedadesVacias, una: prueba.propiedadUna }
      return sets[process.env.DATOS as keyof typeof sets] ?? propiedadesEjemplo
    }
    return propiedadesEjemplo
  },
}

const porFecha = (a: Propiedad, b: Propiedad) => b.publicadaEl.localeCompare(a.publicadaEl)

export async function getPropiedades(filtros: Filtros = {}): Promise<Propiedad[]> {
  const todas = await fuente.listar()
  return filtrar(todas, filtros).sort(porFecha)
}

export async function getDestacadas(): Promise<Propiedad[]> {
  const todas = await fuente.listar()
  return todas.filter((p) => p.destacada).sort(porFecha)
}

export async function getPropiedad(slug: string): Promise<Propiedad | undefined> {
  const todas = await fuente.listar()
  return todas.find((p) => p.slug === slug)
}

export async function getSlugs(): Promise<string[]> {
  const todas = await fuente.listar()
  return todas.map((p) => p.slug)
}

/** Zonas presentes en el catálogo, para los selects de búsqueda. */
export async function getZonas(): Promise<{ value: string; label: string }[]> {
  const todas = await fuente.listar()
  const zonas = Array.from(new Set(todas.map((p) => p.zona))).sort((a, b) => a.localeCompare(b, "es"))
  return zonas.map((z) => ({ value: slugZona(z), label: z }))
}
