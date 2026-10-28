import type { StaticImageData } from "next/image"

export type Operacion = "venta" | "alquiler"
export type TipoPropiedad = "casa" | "departamento" | "ph" | "lote" | "local"
export type Moneda = "USD" | "ARS"

/** Una foto puede ser local (import estático) o una URL de un CRM. */
export type Foto = {
  src: StaticImageData | string
  alt: string
}

export type Propiedad = {
  id: string
  slug: string
  /** true = dato de ejemplo, se muestra con etiqueta y no debe publicarse */
  ejemplo: boolean
  titulo: string
  operacion: Operacion
  tipo: TipoPropiedad
  /** null = "Consultar precio" */
  precio: { moneda: Moneda; valor: number; expensas?: number } | null
  zona: string
  direccion: string
  /** Ubicación aproximada: el mapa muestra la zona, no la dirección exacta */
  ubicacion: { lat: number; lng: number }
  ambientes: number
  dormitorios: number
  banos: number
  superficie: { cubierta: number; total?: number }
  cochera: boolean
  antiguedad?: number
  descripcion: string
  caracteristicas: string[]
  fotos: Foto[]
  /** foto 360° equirectangular (proporción 2:1), la de una cámara 360 o el modo panorámica 360 del celular */
  tour360?: Foto
  destacada: boolean
  /** ISO yyyy-mm-dd */
  publicadaEl: string
}

export type Filtros = {
  operacion?: Operacion
  tipo?: TipoPropiedad
  zona?: string
  /** mínimo de ambientes */
  ambientes?: number
}
