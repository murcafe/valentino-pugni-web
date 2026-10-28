/**
 * Turno de visita: arma el texto del ticket y el mensaje de WhatsApp.
 * Lógica pura (sin imports del proyecto) para poder testearla con `node --test`.
 */
export type Franja = "mañana" | "tarde"
export type Dia = { tipo: "hoy" } | { tipo: "mañana" } | { tipo: "fecha"; fecha: string } // fecha: yyyy-mm-dd

export type Visita = {
  titulo: string
  url: string
  dia: Dia
  franja: Franja
  nombre?: string
}

const TZ = "America/Argentina/Buenos_Aires"

/** Fecha de hoy en Argentina como yyyy-mm-dd (para el mínimo del input de fecha). */
export function hoyISO(ahora = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(ahora)
}

// `ahora` es opcional y el reloj se lee solo si hay una fecha elegida: leerlo al renderizar
// hace que Next saque la ficha entera del HTML (Cache Components) y sin JS queda vacía.

/** "hoy", "mañana" o "el sábado 9 de noviembre". */
export function diaTexto(dia: Dia, ahora?: Date) {
  if (dia.tipo === "hoy") return "hoy"
  if (dia.tipo === "mañana") return "mañana"
  // Mediodía UTC: el día no se corre por zona horaria.
  const d = new Date(`${dia.fecha}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return "el día que elijas"
  const texto = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(d)
  return dia.fecha === hoyISO(ahora) ? "hoy" : `el ${texto.replace(",", "")}`
}

/** null si la visita se puede pedir; si no, el problema en palabras. */
export function validarVisita(v: Visita, ahora?: Date): string | null {
  if (v.dia.tipo === "fecha") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.dia.fecha)) return "Elegí un día para la visita."
    if (v.dia.fecha < hoyISO(ahora)) return "Esa fecha ya pasó: elegí hoy o un día que venga."
  }
  if (v.nombre && v.nombre.trim().length > 60) return "El nombre es muy largo: con nombre y apellido alcanza."
  return null
}

export function mensajeVisita(v: Visita, ahora?: Date) {
  const nombre = v.nombre?.trim()
  const saludo = nombre ? `Hola Valentino, soy ${nombre}.` : "Hola Valentino."
  return `${saludo} Quiero coordinar una visita a "${v.titulo}" (${v.url}) ${diaTexto(v.dia, ahora)} por la ${v.franja}. ¿Te queda bien?`
}
