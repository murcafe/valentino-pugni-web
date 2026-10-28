import { mensajes, whatsappUrl } from "@/lib/site"

/** Toda la banda es un solo link: tasar por WhatsApp. */
export function Vender() {
  return (
    <section aria-labelledby="vender-title" className="on-dark">
      <a
        href={whatsappUrl(mensajes.tasacion)}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex min-h-[46svh] flex-col justify-between overflow-hidden bg-bordo px-5 pt-6 text-white transition-colors duration-150 hover:bg-tinta focus-visible:outline-offset-[-6px] md:min-h-[60svh] md:px-8"
      >
        <span className="flex items-start justify-between gap-6">
          <span className="max-w-[24rem] text-lead">¿Querés vender? Te digo cuánto vale tu casa. Escribime por WhatsApp.</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8 shrink-0 md:size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
        <h2 id="vender-title" className="-mb-[0.18em] text-[26vw] leading-[0.8] tracking-[-0.04em]">
          Tasar
        </h2>
      </a>
    </section>
  )
}
