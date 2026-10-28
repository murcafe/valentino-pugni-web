import { test } from "node:test"
import assert from "node:assert/strict"
import { formatoPrecio, renglones } from "./formato.ts"
import type { Propiedad } from "./tipos.ts"

const base = {
  tipo: "casa",
  precio: { moneda: "USD", valor: 1250000 },
  ambientes: 5,
  dormitorios: 3,
  banos: 2,
  superficie: { cubierta: 1250, total: 4800 },
  cochera: true,
  antiguedad: 1,
} as unknown as Propiedad

test("precios con separador y a consultar", () => {
  assert.equal(formatoPrecio(base.precio), "US$ 1.250.000")
  assert.equal(formatoPrecio(null), "Consultar precio")
})

test("ficha completa: separador de miles y singular de año", () => {
  const r = Object.fromEntries(renglones(base, true))
  assert.equal(r["Sup. cubierta"], "1.250 m²")
  assert.equal(r["Antigüedad"], "1 año")
})

test("un lote no muestra ambientes ni cubierta, sí la superficie total", () => {
  const lote = { ...base, tipo: "lote", ambientes: 0, dormitorios: 0, banos: 0, superficie: { cubierta: 0, total: 620 } } as Propiedad
  assert.deepEqual(renglones(lote), [["Sup. total", "620 m²"]])
})
