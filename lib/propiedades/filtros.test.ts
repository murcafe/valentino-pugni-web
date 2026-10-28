import { test } from "node:test"
import assert from "node:assert/strict"
import { filtrar, filtrosAQuery, parseFiltros } from "./filtros.ts"

test("parseFiltros ignora valores inválidos y vacíos", () => {
  const f = parseFiltros(new URLSearchParams("operacion=venta&tipo=castillo&zona=&ambientes=-2"))
  assert.deepEqual(f, { operacion: "venta", tipo: undefined, zona: undefined, ambientes: undefined })
})

test("ida y vuelta por la URL", () => {
  const q = filtrosAQuery({ operacion: "alquiler", zona: "city-bell", ambientes: 3 })
  assert.equal(q, "?operacion=alquiler&zona=city-bell&ambientes=3")
  assert.deepEqual(parseFiltros(new URLSearchParams(q.slice(1))), { operacion: "alquiler", tipo: undefined, zona: "city-bell", ambientes: 3 })
})

test("filtrar por zona con tildes y ambientes mínimos", () => {
  const props = [
    { zona: "City Bell", ambientes: 4, operacion: "venta", tipo: "casa" },
    { zona: "La Plata", ambientes: 2, operacion: "venta", tipo: "departamento" },
  ] as Parameters<typeof filtrar>[0]
  assert.equal(filtrar(props, { zona: "city-bell", ambientes: 3 }).length, 1)
  assert.equal(filtrar(props, {}).length, 2)
})
