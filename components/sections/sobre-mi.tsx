import { Reveal } from "@/components/motion/reveal"
import { SectionLink } from "@/components/layout/section-link"
import { site } from "@/lib/site"

/** Marca de resaltador plana, para los datos que busca el que escanea. */
function Marca({ children, tono = "papel" }: { children: React.ReactNode; tono?: "papel" | "plinto" | "bordo" }) {
  const tonos = { papel: "bg-papel text-tinta", plinto: "bg-plinto text-tinta", bordo: "bg-bordo text-white" }
  return <mark className={`${tonos[tono]} px-[0.1em] [box-decoration-break:clone]`}>{children}</mark>
}

// [COMPLETAR] Valentino tiene que revisar y aprobar este texto antes de publicar.
export function SobreMi() {
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-title" className="pt-28 pb-28 md:pt-40 md:pb-32">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-8">
        <h2 id="sobre-mi-title" className="text-titulo lg:col-span-4">
          Sobre mí
        </h2>
        <div className="lg:col-span-8">
          <Reveal>
            <p className="max-w-[30ch] font-display text-lead leading-[1.25] tracking-[-0.01em]">
              Soy {site.name}, asesor de <Marca tono="plinto">{site.brand}</Marca>. Acompaño a quienes buscan casa en{" "}
              <Marca>La Plata</Marca> y <Marca>City Bell</Marca>.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
              <p>
                Escucho qué necesitás, descarto lo que no vale la pena y te muestro lo que encaja. Antes de cada visita te
                cuento lo que sé de la propiedad y del barrio, y después te digo lo que vi.
              </p>
              <p>
                Los números los hablamos claros desde el principio: <Marca tono="plinto">precio, expensas y gastos</Marca>.
                Cada operación la respalda un corredor matriculado del estudio, y vos tenés mi WhatsApp directo.{" "}
                <SectionLink href="/#contacto" className="font-medium no-underline">
                  <Marca tono="bordo">Escribime y buscamos tu próxima casa.</Marca>
                </SectionLink>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
