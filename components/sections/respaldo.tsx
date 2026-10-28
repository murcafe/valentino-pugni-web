import { Reveal } from "@/components/motion/reveal"
import { site } from "@/lib/site"

/** El respaldo impreso en una tarjeta, como la que se entrega en la oficina. Solo datos confirmados. */
export function Respaldo() {
  return (
    <section aria-labelledby="respaldo-title" className="overflow-hidden bg-plinto pt-24 md:pt-28">
      <div className="container-site">
        <Reveal className="mx-auto w-full max-w-[44rem] rotate-[-1.5deg] bg-papel px-7 pt-12 pb-24 text-center sm:px-14">
          <h2 id="respaldo-title" className="text-titulo">
            Detrás, {site.brand}
          </h2>
          <p className="mx-auto mt-6 max-w-[32rem] text-lead">
            Asesoramiento inmobiliario: compra, venta e inversiones.
          </p>
          <p className="mt-10 text-lead leading-[1.6]">
            Oficinas en {site.sedes.join(" · ")}
          </p>
          <p className="mt-6 text-lead leading-[1.6]">
            Corredor responsable {site.matricula.corredor}&nbsp;·&nbsp;{site.matricula.numero}
          </p>
          <p className="mt-6 text-cuerpo text-tinta-suave">
            Cada operación pasa por el estudio: papeles, boleto y escritura con respaldo profesional.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
