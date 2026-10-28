import { QuickSearch } from "@/components/sections/quick-search"
import { Vidriera } from "@/components/sections/vidriera"
import type { Propiedad } from "@/lib/propiedades/tipos"
import { site } from "@/lib/site"

/**
 * Vidriera: el titular en el centro, el buscador impreso como ticket y casas
 * reales del catálogo alrededor, cada una con su etiqueta de precio.
 * En pantallas chicas las casas pasan a una grilla bajo el buscador.
 */
export function Hero({ zonas, vidriera }: { zonas: { value: string; label: string }[]; vidriera: Propiedad[] }) {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-[calc(var(--nav-h)+1.5rem)] pb-16 lg:min-h-[max(100svh,46rem)] lg:pb-0"
    >
      <div className="container-site relative z-10 lg:flex lg:min-h-[max(calc(100svh-var(--nav-h)-1.5rem),40rem)] lg:flex-col lg:items-center lg:justify-center">
        <h1
          id="hero-title"
          className="hero-entra text-center text-vidriera"
        >
          Casas en La Plata <br className="hidden sm:block" />y City Bell
        </h1>
        <p className="hero-entra mx-auto mt-6 max-w-[34rem] text-center text-lead [animation-delay:80ms]">
          Soy {site.name}, asesor de {site.brand}. Elegí una casa, sacá número y te la muestro.
        </p>
        <QuickSearch zonas={zonas} className="hero-entra mx-auto mt-10 w-full max-w-[47.5rem] [animation-delay:160ms] lg:max-w-[min(47.5rem,56vw)]" />
      </div>

      <Vidriera propiedades={vidriera.slice(0, 4)} />
    </section>
  )
}
