import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PropertyDetail } from "@/components/propiedades/property-detail"
import { PropertyModal } from "@/components/propiedades/property-modal"
import { getPropiedad, getSlugs } from "@/lib/propiedades"
import { propiedadMetadata } from "@/lib/propiedades/metadata"

export async function generateStaticParams() {
  const slugs = await getSlugs()
  // shortcut: con Cache Components Next exige al menos un param; si el catálogo está vacío va uno que da 404.
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "sin-propiedades" }]
}

export async function generateMetadata({ params }: PageProps<"/propiedades/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const propiedad = await getPropiedad(slug)
  return propiedad ? propiedadMetadata(propiedad) : {}
}

/**
 * Ficha en modal: se abre al navegar desde una card (ruta interceptada).
 * `params` es dato de la URL: va dentro de Suspense y las cards lo resuelven
 * antes del click con <Link prefetch={true}>, así el modal abre al instante.
 */
export default function PropiedadModal({ params }: PageProps<"/propiedades/[slug]">) {
  return (
    <Suspense fallback={null}>
      <ModalConFicha params={params} />
    </Suspense>
  )
}

async function ModalConFicha({ params }: { params: PageProps<"/propiedades/[slug]">["params"] }) {
  const { slug } = await params
  const propiedad = await getPropiedad(slug)
  if (!propiedad) notFound()
  const titleId = `modal-${slug}-titulo`

  return (
    <PropertyModal slug={slug} titleId={titleId}>
      <PropertyDetail propiedad={propiedad} titleAs="h2" titleId={titleId} entrance />
    </PropertyModal>
  )
}
