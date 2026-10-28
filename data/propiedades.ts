/**
 * Propiedades de EJEMPLO.
 *
 * Todas tienen `ejemplo: true` y se muestran con una etiqueta "Ejemplo".
 * Precios, direcciones y textos son inventados: reemplazalos por las
 * propiedades reales (o conectá un CRM, ver lib/propiedades/index.ts).
 * Fotos de ejemplo de Unsplash (créditos en public/images/ejemplos/CREDITOS.txt).
 */
import type { Propiedad } from "@/lib/propiedades/tipos"

import casaModernaNoche from "@/public/images/ejemplos/casa-moderna-noche.jpg"
import livingLuminoso from "@/public/images/ejemplos/living-luminoso.jpg"
import ventanalPileta from "@/public/images/ejemplos/ventanal-pileta.jpg"
import cocinaBlanca from "@/public/images/ejemplos/cocina-blanca.jpg"
import deptoLiving from "@/public/images/ejemplos/depto-living.jpg"
import deptoAmbiente from "@/public/images/ejemplos/depto-ambiente.jpg"
import sillonAmarillo from "@/public/images/ejemplos/sillon-amarillo.jpg"
import casaBlancaPileta from "@/public/images/ejemplos/casa-blanca-pileta.jpg"
import livingMadera from "@/public/images/ejemplos/living-madera.jpg"
import chaletMadera from "@/public/images/ejemplos/chalet-madera.jpg"
import livingVista from "@/public/images/ejemplos/living-vista.jpg"
import casaMinimalistaPileta from "@/public/images/ejemplos/casa-minimalista-pileta.jpg"
import casaContemporanea from "@/public/images/ejemplos/casa-contemporanea.jpg"
import casaGaleria from "@/public/images/ejemplos/casa-galeria.jpg"
import casaJardinPileta from "@/public/images/ejemplos/casa-jardin-pileta.jpg"
import casaVentanales360 from "@/public/images/ejemplos/360/casa-ventanales.jpg"

export const propiedadesEjemplo: Propiedad[] = [
  {
    id: "ej-001",
    slug: "casa-contemporanea-city-bell",
    ejemplo: true,
    titulo: "Casa contemporánea con galería",
    operacion: "venta",
    tipo: "casa",
    precio: { moneda: "USD", valor: 245000 },
    zona: "City Bell",
    direccion: "Zona Camino Belgrano · [COMPLETAR]",
    ubicacion: { lat: -34.8662, lng: -58.0478 },
    ambientes: 5,
    dormitorios: 3,
    banos: 2,
    superficie: { cubierta: 210, total: 600 },
    cochera: true,
    antiguedad: 6,
    descripcion:
      "Texto de ejemplo. Casa de líneas simples en lote arbolado, con living de doble altura, cocina integrada y galería que abre al jardín. Ideal para familia que busca tranquilidad a minutos del centro de City Bell.",
    caracteristicas: ["Galería con parrilla", "Calefacción por losa", "Jardín parquizado", "Cochera doble"],
    fotos: [
      { src: casaModernaNoche, alt: "Fachada de casa contemporánea iluminada de noche (foto de ejemplo)" },
      { src: livingLuminoso, alt: "Living luminoso con sillones claros (foto de ejemplo)" },
      { src: ventanalPileta, alt: "Ventanales de piso a techo hacia la pileta (foto de ejemplo)" },
      { src: cocinaBlanca, alt: "Cocina blanca con isla y banquetas (foto de ejemplo)" },
    ],
    tour360: { src: casaVentanales360, alt: "Ambiente con ventanales de piso a techo, comedor y salamandra (foto 360 de ejemplo)" },
    destacada: true,
    publicadaEl: "2026-10-01",
  },
  {
    id: "ej-002",
    slug: "departamento-dos-ambientes-la-plata-centro",
    ejemplo: true,
    titulo: "Departamento de 2 ambientes con balcón",
    operacion: "alquiler",
    tipo: "departamento",
    precio: { moneda: "ARS", valor: 650000, expensas: 85000 },
    zona: "La Plata",
    direccion: "Centro · [COMPLETAR]",
    ubicacion: { lat: -34.9205, lng: -57.9536 },
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie: { cubierta: 48 },
    cochera: false,
    antiguedad: 12,
    descripcion:
      "Texto de ejemplo. Departamento al frente, muy luminoso, a pocas cuadras de Plaza Moreno. Cocina separada, dormitorio con placard y balcón corrido.",
    caracteristicas: ["Al frente", "Balcón", "Apto profesional", "Cerca de facultades"],
    fotos: [
      { src: deptoLiving, alt: "Living de departamento con plantas y biblioteca (foto de ejemplo)" },
      { src: deptoAmbiente, alt: "Ambiente integrado con comedor y ventanal (foto de ejemplo)" },
      { src: sillonAmarillo, alt: "Rincón de lectura con sillón amarillo (foto de ejemplo)" },
    ],
    destacada: true,
    publicadaEl: "2026-09-24",
  },
  {
    id: "ej-003",
    slug: "casa-con-pileta-gonnet",
    ejemplo: true,
    titulo: "Casa con pileta y quincho",
    operacion: "venta",
    tipo: "casa",
    precio: { moneda: "USD", valor: 320000 },
    zona: "Gonnet",
    direccion: "Gonnet · [COMPLETAR]",
    ubicacion: { lat: -34.8784, lng: -58.0186 },
    ambientes: 6,
    dormitorios: 4,
    banos: 3,
    superficie: { cubierta: 280, total: 900 },
    cochera: true,
    antiguedad: 3,
    descripcion:
      "Texto de ejemplo. Casa a estrenar en una de las calles más lindas de Gonnet. Suite principal con vestidor, pileta climatizada y quincho independiente.",
    caracteristicas: ["Pileta climatizada", "Quincho", "Suite con vestidor", "Paneles solares"],
    fotos: [
      { src: casaBlancaPileta, alt: "Casa blanca moderna con pileta (foto de ejemplo)" },
      { src: livingMadera, alt: "Living con revestimiento de madera y ventanales (foto de ejemplo)" },
      { src: cocinaBlanca, alt: "Cocina blanca con isla (foto de ejemplo)" },
    ],
    destacada: true,
    publicadaEl: "2026-09-18",
  },
  {
    id: "ej-004",
    slug: "chalet-de-madera-city-bell",
    ejemplo: true,
    titulo: "Chalet de madera en lote arbolado",
    operacion: "venta",
    tipo: "casa",
    precio: { moneda: "USD", valor: 168000 },
    zona: "City Bell",
    direccion: "City Bell norte · [COMPLETAR]",
    ubicacion: { lat: -34.8598, lng: -58.0552 },
    ambientes: 4,
    dormitorios: 2,
    banos: 2,
    superficie: { cubierta: 140, total: 750 },
    cochera: true,
    antiguedad: 18,
    descripcion:
      "Texto de ejemplo. Chalet cálido con estufa a leña, entrepiso y un parque con árboles añosos. Para quien quiere vivir el verde todo el año.",
    caracteristicas: ["Estufa a leña", "Parque arbolado", "Entrepiso", "Galería"],
    fotos: [
      { src: chaletMadera, alt: "Chalet de madera iluminado al atardecer (foto de ejemplo)" },
      { src: livingLuminoso, alt: "Living con luz natural (foto de ejemplo)" },
    ],
    destacada: true,
    publicadaEl: "2026-09-10",
  },
  {
    id: "ej-005",
    slug: "departamento-tres-ambientes-la-loma",
    ejemplo: true,
    titulo: "Departamento de 3 ambientes con vista abierta",
    operacion: "venta",
    tipo: "departamento",
    precio: { moneda: "USD", valor: 98000 },
    zona: "La Plata",
    direccion: "La Loma · [COMPLETAR]",
    ubicacion: { lat: -34.9081, lng: -57.9712 },
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    superficie: { cubierta: 72 },
    cochera: true,
    antiguedad: 8,
    descripcion:
      "Texto de ejemplo. Piso alto con vista despejada, dos dormitorios, cocina integrada y cochera cubierta. Edificio con amenities.",
    caracteristicas: ["Piso alto", "Cochera cubierta", "SUM y parrilla", "Apto crédito"],
    fotos: [
      { src: livingVista, alt: "Living con ventanales y vista abierta (foto de ejemplo)" },
      { src: sillonAmarillo, alt: "Detalle de living con sillón amarillo (foto de ejemplo)" },
      { src: cocinaBlanca, alt: "Cocina blanca equipada (foto de ejemplo)" },
    ],
    destacada: true,
    publicadaEl: "2026-09-02",
  },
  {
    id: "ej-006",
    slug: "casa-minimalista-villa-elisa",
    ejemplo: true,
    titulo: "Casa minimalista a estrenar",
    operacion: "venta",
    tipo: "casa",
    precio: { moneda: "USD", valor: 275000 },
    zona: "Villa Elisa",
    direccion: "Villa Elisa · [COMPLETAR]",
    ubicacion: { lat: -34.8459, lng: -58.0795 },
    ambientes: 5,
    dormitorios: 3,
    banos: 3,
    superficie: { cubierta: 230, total: 800 },
    cochera: true,
    antiguedad: 0,
    descripcion:
      "Texto de ejemplo. Arquitectura contemporánea, aberturas de alta prestación y una planta baja que se abre completa a la pileta.",
    caracteristicas: ["A estrenar", "Pileta", "Aberturas DVH", "Domótica"],
    fotos: [
      { src: casaMinimalistaPileta, alt: "Casa minimalista blanca con pileta (foto de ejemplo)" },
      { src: casaContemporanea, alt: "Fachada contemporánea con jardín (foto de ejemplo)" },
      { src: ventanalPileta, alt: "Ventanales hacia la pileta (foto de ejemplo)" },
    ],
    destacada: false,
    publicadaEl: "2026-08-28",
  },
  {
    id: "ej-007",
    slug: "ph-con-patio-la-plata",
    ejemplo: true,
    titulo: "PH con patio propio",
    operacion: "alquiler",
    tipo: "ph",
    precio: { moneda: "ARS", valor: 820000 },
    zona: "La Plata",
    direccion: "Barrio Norte · [COMPLETAR]",
    ubicacion: { lat: -34.9105, lng: -57.9461 },
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    superficie: { cubierta: 85, total: 120 },
    cochera: false,
    antiguedad: 40,
    descripcion:
      "Texto de ejemplo. PH reciclado sin expensas, con patio propio y terraza. Techos altos y pisos de pinotea.",
    caracteristicas: ["Sin expensas", "Patio y terraza", "Reciclado", "Techos altos"],
    fotos: [
      { src: deptoAmbiente, alt: "Ambiente principal luminoso (foto de ejemplo)" },
      { src: deptoLiving, alt: "Living con plantas (foto de ejemplo)" },
    ],
    destacada: false,
    publicadaEl: "2026-08-20",
  },
  {
    id: "ej-008",
    slug: "casa-familiar-con-jardin-city-bell",
    ejemplo: true,
    titulo: "Casa familiar con jardín y pileta",
    operacion: "alquiler",
    tipo: "casa",
    precio: { moneda: "ARS", valor: 1900000 },
    zona: "City Bell",
    direccion: "City Bell centro · [COMPLETAR]",
    ubicacion: { lat: -34.8701, lng: -58.0432 },
    ambientes: 5,
    dormitorios: 3,
    banos: 2,
    superficie: { cubierta: 190, total: 650 },
    cochera: true,
    antiguedad: 15,
    descripcion:
      "Texto de ejemplo. Casa amplia cerca del centro comercial de City Bell, con jardín, pileta y dependencia de servicio.",
    caracteristicas: ["Pileta", "Jardín", "Dependencia", "Cerca de colegios"],
    fotos: [
      { src: casaGaleria, alt: "Casa con galería y jardín (foto de ejemplo)" },
      { src: casaJardinPileta, alt: "Jardín con pileta y palmeras (foto de ejemplo)" },
      { src: livingLuminoso, alt: "Living luminoso (foto de ejemplo)" },
    ],
    destacada: false,
    publicadaEl: "2026-08-12",
  },
]
