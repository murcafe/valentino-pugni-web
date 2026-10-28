import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PropertyDetail } from "@/components/propiedades/property-detail"
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

/** Ficha como página completa (entrada directa por link, refresh o WhatsApp). */
export default function PropiedadPage({ params }: PageProps<"/propiedades/[slug]">) {
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <div className="container-site pt-28 md:pt-32">
        <Suspense fallback={<FichaSkeleton />}>
          <Ficha params={params} />
        </Suspense>
      </div>
    </main>
  )
}

async function Ficha({ params }: { params: PageProps<"/propiedades/[slug]">["params"] }) {
  const { slug } = await params
  const propiedad = await getPropiedad(slug)
  if (!propiedad) notFound()
  return <PropertyDetail propiedad={propiedad} />
}

function FichaSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-[4/3] bg-plinto sm:aspect-[16/10]" />
      <div className="mt-10 h-12 w-2/3 bg-plinto" />
      <div className="mt-4 h-6 w-1/3 bg-plinto" />
    </div>
  )
}
