import { Suspense } from "react"
import type { Metadata } from "next"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Catalogo, CatalogoSkeleton } from "@/components/propiedades/catalogo"
import { Button } from "@/components/ui/button"
import { getPropiedades, getZonas } from "@/lib/propiedades"
import { parseFiltros } from "@/lib/propiedades/filtros"
import { mensajes, site, whatsappUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Propiedades en venta y alquiler en La Plata y City Bell",
  description: `Casas, departamentos y PH en venta y alquiler en La Plata y City Bell. ${site.name}, ${site.brand}.`,
  alternates: { canonical: "/propiedades" },
}

export default function PropiedadesPage({ searchParams }: PageProps<"/propiedades">) {
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <section className="container-site pt-32 pb-24 md:pt-40 md:pb-32" aria-labelledby="catalogo-title">
        <h1 id="catalogo-title" className="hero-entra max-w-4xl text-vidriera">
          Todas las propiedades
        </h1>
        <p className="hero-entra mt-6 max-w-[36rem] text-lead [animation-delay:80ms]">
          Casas, departamentos y PH en venta y alquiler en La Plata y City Bell. Filtrá, abrí la que te guste y sacá número
          para verla.
        </p>

        <div className="mt-14">
          {/* Los filtros dependen de la URL: se resuelven por request dentro de Suspense */}
          <Suspense fallback={<CatalogoSkeleton />}>
            <CatalogoConDatos searchParams={searchParams} />
          </Suspense>
        </div>

        <div className="on-dark mt-28 flex flex-col gap-8 bg-tinta p-8 text-suelo md:p-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-titulo">¿No está la que buscás?</h2>
            <p className="mt-4 text-lead text-tinta-clara">Decime zona, presupuesto y ambientes, y te escribo cuando entre algo así.</p>
          </div>
          <Button asChild size="lg">
            <a href={whatsappUrl(mensajes.general)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Escribime por WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </main>
  )
}

async function CatalogoConDatos({ searchParams }: { searchParams: PageProps<"/propiedades">["searchParams"] }) {
  const params = await searchParams
  const filtros = parseFiltros(params)
  const [propiedades, zonas] = await Promise.all([getPropiedades(), getZonas()])
  // key: si se llega con otros filtros desde el buscador del home, se reinicia el estado.
  return <Catalogo key={JSON.stringify(filtros)} propiedades={propiedades} zonas={zonas} initial={filtros} />
}
