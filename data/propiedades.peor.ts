/**
 * SOLO DESARROLLO: datos de peor caso realistas (títulos largos como los de Tokko,
 * precio a consultar, lote sin cubierta, monoambiente, 1 y 12 fotos, zonas largas).
 * Se activa con DATOS=peor (ver lib/propiedades/index.ts). Nunca en producción.
 */
import type { Propiedad } from "@/lib/propiedades/tipos"
import { propiedadesEjemplo } from "./propiedades"

const [a, b, c, d] = propiedadesEjemplo
const todasLasFotos = propiedadesEjemplo.flatMap((p) => p.fotos).slice(0, 12)

export const propiedadesPeorCaso: Propiedad[] = [
  {
    ...a,
    id: "peor-1",
    slug: "casa-dos-plantas-quincho-pileta-depto-independiente-manuel-b-gonnet",
    titulo: "Casa en dos plantas con quincho, pileta climatizada y departamento independiente al fondo",
    zona: "Manuel B. Gonnet",
    direccion: "Calle 13 entre 471 y 472 bis, a media cuadra de Camino Centenario",
    precio: { moneda: "USD", valor: 1250000 },
    superficie: { cubierta: 1250, total: 4800 },
    ambientes: 9,
    dormitorios: 6,
    banos: 5,
    fotos: todasLasFotos,
    caracteristicas: [
      "Pileta climatizada", "Quincho con parrilla", "Departamento independiente", "Cochera para 4 autos",
      "Calefacción por losa radiante", "Aire acondicionado frío/calor en todos los ambientes", "Paneles solares",
      "Riego automático", "Alarma monitoreada", "Portón eléctrico", "Lavadero cubierto", "Vestidor en suite principal",
      "Bodega", "Apto crédito hipotecario",
    ],
    descripcion: (a.descripcion + " ").repeat(8).trim(),
  },
  {
    ...b,
    id: "peor-2",
    slug: "ph",
    titulo: "PH",
    tipo: "ph",
    precio: null,
    ambientes: 1,
    dormitorios: 0,
    banos: 1,
    superficie: { cubierta: 28 },
    fotos: [b.fotos[0]],
    caracteristicas: [],
  },
  {
    ...c,
    id: "peor-3",
    slug: "lote-barrio-cerrado-grand-bell",
    titulo: "Lote en barrio cerrado",
    tipo: "lote",
    zona: "City Bell",
    direccion: "Barrio Cerrado Grand Bell II, lote 214",
    precio: { moneda: "USD", valor: 58000 },
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    superficie: { cubierta: 0, total: 620 },
    cochera: false,
    antiguedad: undefined,
    fotos: [c.fotos[0]],
  },
  {
    ...d,
    id: "peor-4",
    slug: "departamento-monoambiente-alquiler-temporario-plaza-moreno",
    titulo: "Monoambiente amoblado a una cuadra de Plaza Moreno",
    operacion: "alquiler",
    tipo: "departamento",
    zona: "La Plata",
    precio: { moneda: "ARS", valor: 12500000, expensas: 450000 },
    ambientes: 1,
    dormitorios: 0,
    banos: 1,
    superficie: { cubierta: 32 },
  },
]

export const propiedadesVacias: Propiedad[] = []
export const propiedadUna: Propiedad[] = [propiedadesEjemplo[0]]
