import { Check, MapPin } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import Image from "next/image"
import { FadeIn } from "@/components/motion/fade-in"
import { Reveal } from "@/components/motion/reveal"
import { Gallery } from "@/components/propiedades/gallery"
import { MapaZona } from "@/components/propiedades/mapa-zona"
import { Renglon } from "@/components/propiedades/property-card"
import { ShareButton } from "@/components/propiedades/share-button"
import { TurnoVisita } from "@/components/propiedades/turno-visita"
import { IrA360, Vista360 } from "@/components/propiedades/vista-360"
import { formatoExpensas, formatoPrecio, renglones } from "@/lib/propiedades/formato"
import { tipos } from "@/lib/propiedades/filtros"
import type { Propiedad } from "@/lib/propiedades/tipos"
import { mensajes, site, whatsappUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Ficha completa de una propiedad. Se usa igual en la página (/propiedades/[slug])
 * y dentro del modal; solo cambia el nivel del título.
 */
export function PropertyDetail({
  propiedad: p,
  titleAs: Title = "h1",
  titleId,
  entrance = false,
  className,
}: {
  propiedad: Propiedad
  titleAs?: "h1" | "h2"
  titleId?: string
  /** en el modal: el texto entra con fundido mientras la foto hace el morph */
  entrance?: boolean
  className?: string
}) {
  const Wrap = entrance ? FadeIn : "div"
  const tipoLabel = tipos.find((t) => t.value === p.tipo)?.label ?? p.tipo
  const url = `${site.url}/propiedades/${p.slug}`
  const precio = formatoPrecio(p.precio)
  const expensas = formatoExpensas(p.precio)

  const ficha = renglones(p, true)

  return (
    <article className={cn("pb-16", className)}>
      {/* Título primero: en el primer pantallazo se sabe qué es y dónde queda */}
      <Wrap {...(entrance ? { delay: 0.1 } : {})}>
        <Title id={titleId} className="max-w-4xl text-[1.75rem] md:text-titulo">
          {p.titulo}
        </Title>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-lead">
          <span>
            {p.operacion === "venta" ? "Venta" : "Alquiler"} · {tipoLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
            {p.zona} · {p.direccion}
          </span>
          {p.ejemplo && <span className="font-medium text-bordo">Propiedad de ejemplo</span>}
        </p>
      </Wrap>

      <div className="relative mt-8">
        <Gallery slug={p.slug} titulo={p.titulo} fotos={p.fotos} />
        {p.tour360 && (
          <Wrap className="absolute top-0 left-0 z-10" {...(entrance ? { delay: 0.25 } : {})}>
            <IrA360
              id={`${p.slug}-360`}
              className="inline-flex min-h-11 items-center bg-tinta px-4 text-chico font-medium text-suelo transition-colors duration-200 hover:bg-bordo"
            />
          </Wrap>
        )}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0">
          <Reveal>
          <section aria-labelledby={`${p.slug}-ficha`}>
            <h3 id={`${p.slug}-ficha`} className="text-lead leading-none">
              Ficha técnica
            </h3>
            <dl className="ticket-dentado mt-5 grid max-w-xl gap-2 bg-papel px-5 pt-5 pb-4 text-cuerpo">
              {ficha.map(([label, value]) => (
                <Renglon key={label} label={label}>
                  {value}
                </Renglon>
              ))}
            </dl>
          </section>
          </Reveal>

          {p.tour360 && (
            <Reveal>
            <section id={`${p.slug}-360`} aria-labelledby={`${p.slug}-360-title`} className="mt-12 scroll-mt-24">
              <h3 id={`${p.slug}-360-title`} className="text-lead leading-none">
                Recorrido 360°
              </h3>
              <Vista360 foto={p.tour360} titulo={p.titulo} className="mt-5" />
            </section>
            </Reveal>
          )}

          <Reveal>
          <section aria-labelledby={`${p.slug}-desc`} className="mt-12">
            <h3 id={`${p.slug}-desc`} className="text-lead leading-none">
              Descripción
            </h3>
            <p className="mt-4 max-w-2xl whitespace-pre-line">{p.descripcion}</p>
            {p.caracteristicas.length > 0 && (
              <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {p.caracteristicas.map((c) => (
                  <li key={c} className="flex items-start gap-2.5">
                    <Check className="mt-1 size-4 shrink-0 text-bordo" strokeWidth={2} aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </section>
          </Reveal>

          {p.fotos.length > 1 && (
            <section aria-labelledby={`${p.slug}-fotos`} className="mt-12">
              <h3 id={`${p.slug}-fotos`} className="text-lead leading-none">
                Fotos
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.fotos.slice(1).map((f, i) => (
                  <Reveal key={i} delay={(i % 2) * 0.07} className="relative aspect-[4/3] overflow-hidden bg-plinto">
                    <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" placeholder={typeof f.src === "string" ? "empty" : "blur"} className="object-cover" />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          <Reveal>
          <section aria-labelledby={`${p.slug}-mapa`} className="mt-12">
            <h3 id={`${p.slug}-mapa`} className="mb-5 text-lead leading-none">
              La zona
            </h3>
            <MapaZona lat={p.ubicacion.lat} lng={p.ubicacion.lng} zona={p.zona} />
          </section>
          </Reveal>
        </div>

        <Wrap className="lg:sticky lg:top-8 lg:self-start" {...(entrance ? { delay: 0.25 } : {})}>
        <aside aria-label="Precio y turno de visita">
          {/* Etiqueta de precio */}
          <p className="inline-block bg-bordo px-4 py-3 text-white">
            <span className="block text-chico text-bordo-claro">{p.operacion === "venta" ? "Precio de venta" : "Alquiler mensual"}</span>
            <span className="font-display text-lead leading-none">{precio}</span>
          </p>
          {expensas && <p className="mt-2 text-chico text-tinta-suave">+ {expensas} de expensas</p>}

          <TurnoVisita titulo={p.titulo} slug={p.slug} className="mt-6" />

          <div className="mt-6 grid gap-1">
            <a
              href={whatsappUrl(mensajes.propiedad(p.titulo, url))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-chico font-medium underline"
            >
              <WhatsAppIcon className="size-4" />
              Hacer otra consulta
            </a>
            <ShareButton url={url} titulo={p.titulo} />
          </div>

          <p className="mt-6 text-chico">
            Te responde <span className="text-tinta">{site.name}</span>, {site.role.toLowerCase()} de {site.brand}. Corredor
            responsable: {site.matricula.corredor} · {site.matricula.numero}
          </p>
        </aside>
        </Wrap>
      </div>

      {/* En el celular: precio y turno siempre a mano */}
      <div className="sticky bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-20 mt-10 flex items-center justify-between gap-4 bg-tinta py-2 pr-2 pl-4 text-suelo lg:hidden">
        <p className="text-lead font-medium">{precio}</p>
        <a href={`#turno-${p.slug}`} className="inline-flex min-h-11 items-center bg-bordo px-5 font-medium text-white">
          Sacar número
        </a>
      </div>
    </article>
  )
}
