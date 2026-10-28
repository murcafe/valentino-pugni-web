import { Reveal } from "@/components/motion/reveal"

const etapas: { titulo: string; pasos: [string, string][] }[] = [
  {
    titulo: "Primero",
    pasos: [
      ["Me contás qué buscás", "por WhatsApp"],
      ["Te paso las que encajan", "con fotos y ficha"],
    ],
  },
  {
    titulo: "Las visitas",
    pasos: [
      ["Sacás número y la vemos", "día y franja a elección"],
      ["Te cuento lo que vi", "sin vueltas"],
    ],
  },
  {
    titulo: "La compra",
    pasos: [
      ["Reserva y oferta", "por escrito"],
      ["Boleto y escritura", "con escribano"],
    ],
  },
]

/** El proceso impreso como ticket sobre un campo de tinta. */
export function ComoCompro() {
  return (
    <section id="como-compro" aria-labelledby="como-compro-title" className="on-dark bg-tinta pt-24 pb-28 text-suelo md:pt-28 md:pb-32">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <h2 id="como-compro-title" className="text-titulo">
            Cómo compro
          </h2>
          <p className="mt-6 max-w-[30ch] text-lead text-tinta-clara">
            Del primer mensaje a la escritura, te acompaño y te digo qué viene después.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <div className="ticket-dentado max-w-[34rem] bg-papel px-6 pt-7 pb-6 text-tinta">
            {etapas.map((etapa) => (
              <div key={etapa.titulo} className="mt-7 first:mt-0">
                <h3 className="font-sans text-cuerpo font-semibold tracking-normal">{etapa.titulo}</h3>
                <ul className="mt-2 grid gap-1.5">
                  {etapa.pasos.map(([que, como]) => (
                    <li key={que} className="flex flex-col text-cuerpo sm:flex-row sm:items-baseline sm:gap-2">
                      <span>{que}</span>
                      <span aria-hidden="true" className="hidden min-w-4 flex-1 translate-y-[-0.2em] border-b-[3px] border-dotted border-plinto sm:block" />
                      <span className="text-chico text-tinta-suave sm:text-right sm:text-cuerpo">{como}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="-mx-6 mt-8 flex min-h-11 flex-col bg-tinta px-6 py-3 text-suelo sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="font-medium">Las llaves en la mano</span>
              <span className="text-chico text-tinta-clara">con un corredor matriculado</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
