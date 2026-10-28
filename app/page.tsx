import { ComoCompro } from "@/components/sections/como-compro"
import { Contacto } from "@/components/sections/contacto"
import { Destacadas } from "@/components/sections/destacadas"
import { Hero } from "@/components/sections/hero"
import { Respaldo } from "@/components/sections/respaldo"
import { SobreMi } from "@/components/sections/sobre-mi"
import { Vender } from "@/components/sections/vender"
import { getDestacadas, getPropiedades, getZonas } from "@/lib/propiedades"

// Testimonios: fuera hasta tener reseñas reales (no se inventan).
export default async function Home() {
  const [zonas, propiedades, destacadas] = await Promise.all([getZonas(), getPropiedades(), getDestacadas()])

  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <Hero zonas={zonas} vidriera={destacadas} />
      <Destacadas propiedades={propiedades} />
      <ComoCompro />
      <Respaldo />
      <SobreMi />
      <Vender />
      <Contacto />
    </main>
  )
}
