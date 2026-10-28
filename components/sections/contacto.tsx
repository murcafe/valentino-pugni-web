import { mensajes, site, whatsappUrl } from "@/lib/site"

const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.oficina.calle}, ${site.oficina.localidad}, ${site.oficina.provincia}`)}`
// [COMPLETAR] coordenadas exactas de la oficina (lib/site.ts); el marcador usa las de ahí.
const { lat, lng } = site.oficina
const mapaEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
  [lng - 0.006, lat - 0.004, lng + 0.006, lat + 0.004].map((n) => n.toFixed(5)).join(",")
)}&layer=mapnik&marker=${lat},${lng}`

const fila =
  "flex min-h-[5.25rem] items-end px-4 pt-4 pb-4 font-display text-titulo leading-none tracking-[-0.03em] md:min-h-[8.5rem] md:px-6 md:pb-6"

/** La dirección en renglones grandes, alternando dos tonos, y el mapa de la oficina al lado. */
export function Contacto() {
  const filas: { texto: string; href?: string; externo?: boolean }[] = [
    { texto: site.brand },
    { texto: site.oficina.calle.replace("Calle ", ""), href: mapaLink, externo: true },
    { texto: site.oficina.localidad },
    { texto: site.oficina.horario },
    { texto: site.contacto.whatsappVisible.replace("+54 9 ", ""), href: `tel:+${site.contacto.whatsapp}` },
  ]

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="pt-28 md:pt-40">
      <div className="container-site">
        <h2 id="contacto-title" className="text-titulo">
          Contacto
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-0">
          <ul>
            {filas.map((f, i) => (
              <li key={f.texto} className={i % 2 ? "bg-plinto" : "bg-suelo"}>
                {f.href ? (
                  <a
                    href={f.href}
                    className={`${fila} hover:text-bordo`}
                    {...(f.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {f.texto}
                  </a>
                ) : (
                  <p className={fila}>{f.texto}</p>
                )}
              </li>
            ))}
            <li className="bg-bordo text-white">
              <a href={whatsappUrl(mensajes.general)} target="_blank" rel="noopener noreferrer" className={`${fila} group gap-6`}>
                Escribime
                <span className="mb-[0.12em] inline-flex size-[0.9em] shrink-0 items-center justify-center bg-tinta text-suelo transition-colors duration-200 group-hover:bg-white group-hover:text-bordo">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[0.45em]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </a>
            </li>
          </ul>
          <figure className="relative min-h-[22rem] bg-plinto lg:min-h-0">
            <iframe
              title={`Mapa de la oficina de ${site.brand} en ${site.oficina.localidad}`}
              src={mapaEmbed}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full grayscale-[0.85] contrast-[1.05]"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}
