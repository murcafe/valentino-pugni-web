import type { Metadata } from "next"
import { formatoPrecio } from "./formato"
import { tipos } from "./filtros"
import type { Propiedad } from "./tipos"
import { site } from "@/lib/site"

/**
 * URL de Open Graph: la primera foto pasada por el optimizador de Next
 * (1200 px, JPG liviano) para que WhatsApp muestre la vista previa.
 */
function ogImage(p: Propiedad) {
  const foto = p.fotos[0]
  if (!foto) return undefined
  const src = typeof foto.src === "string" ? foto.src : foto.src.src
  return `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`
}

export function propiedadMetadata(p: Propiedad): Metadata {
  const tipo = tipos.find((t) => t.value === p.tipo)?.label ?? p.tipo
  const operacion = p.operacion === "venta" ? "en venta" : "en alquiler"
  const title = `${p.titulo} · ${tipo} ${operacion} en ${p.zona}`
  const description = `${formatoPrecio(p.precio)} · ${p.ambientes} ambientes · ${p.superficie.cubierta} m² cubiertos. ${p.descripcion}`.slice(0, 200)
  const image = ogImage(p)
  const url = `/propiedades/${p.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    // Las propiedades de ejemplo no se indexan.
    robots: p.ejemplo ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url,
      title: `${p.titulo} · ${formatoPrecio(p.precio)}`,
      description,
      siteName: `${site.name} · ${site.brand}`,
      locale: site.locale,
      images: image ? [{ url: image, width: 1200, alt: p.fotos[0].alt }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  }
}
