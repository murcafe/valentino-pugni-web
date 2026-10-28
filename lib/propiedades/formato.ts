import type { Propiedad } from "./tipos"

const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 })

export function formatoPrecio(precio: Propiedad["precio"]) {
  if (!precio) return "Consultar precio"
  const prefijo = precio.moneda === "USD" ? "US$" : "$"
  return `${prefijo} ${numero.format(precio.valor)}`
}

export function formatoExpensas(precio: Propiedad["precio"]) {
  if (!precio?.expensas) return null
  return `$ ${numero.format(precio.expensas)}`
}

export const formatoM2 = (m2: number) => `${numero.format(m2)} m²`

/**
 * Renglones del ticket de una propiedad, sin los datos que no aplican
 * (un lote no tiene ambientes ni superficie cubierta). `completa` = ficha técnica.
 */
export function renglones(p: Propiedad, completa = false): [string, string][] {
  const r: [string, string][] = []
  if (p.ambientes > 0) r.push(["Ambientes", String(p.ambientes)])
  if (p.dormitorios > 0) r.push(["Dormitorios", String(p.dormitorios)])
  if (p.banos > 0) r.push(["Baños", String(p.banos)])
  if (p.superficie.cubierta > 0) r.push(["Sup. cubierta", formatoM2(p.superficie.cubierta)])
  if (p.superficie.total && (completa || p.superficie.cubierta === 0)) r.push(["Sup. total", formatoM2(p.superficie.total)])
  const expensas = formatoExpensas(p.precio)
  if (expensas) r.push(["Expensas", expensas])
  if (completa && p.tipo !== "lote") r.push(["Cochera", p.cochera ? "Sí" : "No"])
  if (completa && p.antiguedad !== undefined) {
    r.push(["Antigüedad", p.antiguedad === 0 ? "A estrenar" : `${p.antiguedad} ${p.antiguedad === 1 ? "año" : "años"}`])
  }
  return r
}
