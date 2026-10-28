import { test } from "node:test"
import assert from "node:assert/strict"
import { diaTexto, hoyISO, mensajeVisita, validarVisita } from "./visita.ts"

// 28/10/2026 a las 22:30 en Argentina = 29/10 01:30 UTC: tiene que seguir siendo el 28.
const ahora = new Date("2026-10-29T01:30:00Z")
const base = { titulo: "PH con patio propio", url: "https://ejemplo.com/propiedades/ph", franja: "tarde" as const }

test("hoy se calcula en hora argentina", () => {
  assert.equal(hoyISO(ahora), "2026-10-28")
})

test("el mensaje lleva propiedad, link, día y franja", () => {
  const m = mensajeVisita({ ...base, dia: { tipo: "fecha", fecha: "2026-10-31" }, nombre: " Ana " }, ahora)
  assert.equal(
    m,
    'Hola Valentino, soy Ana. Quiero coordinar una visita a "PH con patio propio" (https://ejemplo.com/propiedades/ph) el sábado 31 de octubre por la tarde. ¿Te queda bien?'
  )
})

test("sin nombre, saludo corto; hoy y mañana en palabras", () => {
  assert.match(mensajeVisita({ ...base, dia: { tipo: "mañana" } }, ahora), /^Hola Valentino\. .* mañana por la tarde\./)
  assert.equal(diaTexto({ tipo: "fecha", fecha: "2026-10-28" }, ahora), "hoy")
})

test("sin fecha elegida no se rompe", () => {
  assert.match(mensajeVisita({ ...base, dia: { tipo: "fecha", fecha: "" } }, ahora), /el día que elijas/)
})

test("validación amable", () => {
  assert.equal(validarVisita({ ...base, dia: { tipo: "hoy" } }, ahora), null)
  assert.match(validarVisita({ ...base, dia: { tipo: "fecha", fecha: "2026-10-27" } }, ahora) ?? "", /ya pasó/)
  assert.match(validarVisita({ ...base, dia: { tipo: "fecha", fecha: "" } }, ahora) ?? "", /Elegí un día/)
})
