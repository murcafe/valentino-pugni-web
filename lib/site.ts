/**
 * Datos de contacto y marca. Todo lo que dice [COMPLETAR] se reemplaza
 * antes de publicar (ver la lista completa en el README).
 */
export const site = {
  name: "Valentino Pugni",
  role: "Asesor inmobiliario",
  brand: "Estudio Gibert",
  description:
    "Valentino Pugni, asesor inmobiliario de Estudio Gibert. Compra, venta, alquiler y tasaciones en La Plata y City Bell.",
  // [COMPLETAR] dominio definitivo (se usa para Open Graph, sitemap y JSON-LD)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://valentinopugni.com.ar",
  locale: "es_AR",
  zonas: ["La Plata", "City Bell"],

  contacto: {
    whatsapp: "5492213068664", // formato internacional para wa.me
    whatsappVisible: "+54 9 221 306-8664",
    email: "vpugni@estudiogibert.com.ar",
    instagram: "pugniv.estudiogibert",
  },

  oficina: {
    calle: "Calle 473 bis y 14 A",
    localidad: "City Bell", // [COMPLETAR] confirmar localidad
    provincia: "Buenos Aires",
    // [COMPLETAR] coordenadas exactas de la oficina para el mapa
    lat: -34.8696,
    lng: -58.0449,
    horario: "Horario [COMPLETAR]", // ej.: "Lun a vie, 9 a 18 h"
  },

  sedes: ["La Plata", "City Bell", "Pinamar"],

  matricula: {
    corredor: "Jorge Gibert",
    numero: "[COMPLETAR] Mat. N.º",
    colegio: "[COMPLETAR] Colegio de Martilleros y Corredores Públicos",
  },
} as const

export type Site = typeof site

/** Arma un link de WhatsApp con el mensaje ya escrito. */
export function whatsappUrl(mensaje?: string) {
  const base = `https://wa.me/${site.contacto.whatsapp}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

export const mensajes = {
  general: "Hola Valentino, te escribo desde tu web. Quería hacerte una consulta.",
  propiedad: (titulo: string, url: string) =>
    `Hola Valentino, me interesa la propiedad "${titulo}" (${url}). ¿Me pasás más info?`,
  tasacion: "Hola Valentino, quiero tasar mi propiedad.",
}
