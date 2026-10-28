import Link from "next/link"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import { mensajes, site, whatsappUrl } from "@/lib/site"

/** Cierre: invitación, links y el nombre enorme cortado por el borde inferior. */
export function Footer() {
  return (
    <footer className="on-dark relative flex flex-col overflow-hidden bg-tinta text-suelo lg:min-h-[100svh]">
      <div className="container-site grid gap-10 pt-24 md:grid-cols-12 md:pt-32">
        <div className="md:col-span-7">
          <p className="font-display text-titulo leading-[0.95] tracking-[-0.03em]">
            ¿Vemos una casa juntos?
          </p>
          <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
            <a href={whatsappUrl(mensajes.general)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Escribime por WhatsApp
            </a>
          </Button>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 md:col-span-4 md:col-start-9 md:flex-col">
          <li>
            <Link href="/propiedades" className="inline-flex min-h-11 items-center hover:text-bordo-claro">
              Propiedades
            </Link>
          </li>
          <li>
            <a href={`mailto:${site.contacto.email}`} className="inline-flex min-h-11 items-center break-all hover:text-bordo-claro">
              {site.contacto.email}
            </a>
          </li>
          <li>
            <a
              href={`https://instagram.com/${site.contacto.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center hover:text-bordo-claro"
            >
              Instagram @{site.contacto.instagram}
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-20 lg:mt-auto">
        <div className="container-site flex flex-col gap-1 pb-3 text-chico text-tinta-clara md:flex-row md:justify-between">
          <p>
            © {site.name} · {site.brand} · Corredor responsable {site.matricula.corredor} ·{" "}
            {site.matricula.numero}
          </p>
          <p>Fotos de ejemplo: Unsplash · Mapas: © OpenStreetMap</p>
        </div>
        <p
          aria-hidden="true"
          className="translate-y-[30%] pl-3 font-display text-[34vw] leading-[0.78] tracking-[-0.04em] whitespace-nowrap select-none md:text-[26vw]"
        >
          {site.name}
        </p>
      </div>
    </footer>
  )
}
