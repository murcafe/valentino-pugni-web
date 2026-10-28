"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Mail } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import { easePremium } from "@/lib/motion"
import { site, whatsappUrl } from "@/lib/site"
import { cn } from "@/lib/utils"
import { diaTexto, hoyISO, mensajeVisita, validarVisita, type Dia, type Franja } from "@/lib/visita"

type TipoDia = Dia["tipo"]

/**
 * «Sacá número»: el visitante elige día y franja y el ticket se imprime con
 * su turno; el botón abre WhatsApp con el mensaje armado. Sin JS, el link
 * de consulta general sigue funcionando (ver PropertyDetail).
 */
export function TurnoVisita({ titulo, slug, className }: { titulo: string; slug: string; className?: string }) {
  const uid = useId()
  const [tipoDia, setTipoDia] = useState<TipoDia>("mañana")
  const [fecha, setFecha] = useState("")
  const [franja, setFranja] = useState<Franja>("mañana")
  const [nombre, setNombre] = useState("")
  const [intentado, setIntentado] = useState(false)

  const dia: Dia = tipoDia === "fecha" ? { tipo: "fecha", fecha } : { tipo: tipoDia }
  const visita = { titulo, url: `${site.url}/propiedades/${slug}`, dia, franja, nombre }
  const error = validarVisita(visita)
  const mensaje = mensajeVisita(visita)
  const errorId = `${uid}-error`
  const turno = `${tipoDia === "fecha" && !fecha ? "Elegí la fecha" : diaTexto(dia)} · por la ${franja}`

  return (
    <div id={`turno-${slug}`} className={cn("ticket-dentado scroll-mt-24 bg-papel px-5 pt-6 pb-5 sm:px-6", className)}>
      <h3 className="text-lead leading-none">Sacá número</h3>
      <p className="mt-2 text-chico">Elegí cuándo te queda bien y te confirmo por WhatsApp.</p>

      <fieldset className="mt-6">
        <legend className="text-chico text-tinta-suave">Día</legend>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {(
            [
              ["hoy", "Hoy"],
              ["mañana", "Mañana"],
              ["fecha", "Otro día"],
            ] as const
          ).map(([value, label]) => (
            <Opcion key={value} name={`${uid}-dia`} checked={tipoDia === value} onChange={() => setTipoDia(value)}>
              {label}
            </Opcion>
          ))}
        </div>
        {tipoDia === "fecha" && (
          <label className="mt-3 block">
            <span className="sr-only">Fecha de la visita</span>
            <input
              type="date"
              min={hoyISO()}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              aria-invalid={intentado && !!error}
              aria-describedby={intentado && error ? errorId : undefined}
              className="h-12 w-full border border-control bg-papel px-3 text-cuerpo"
            />
          </label>
        )}
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-chico text-tinta-suave">Franja</legend>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {(["mañana", "tarde"] as const).map((f) => (
            <Opcion key={f} name={`${uid}-franja`} checked={franja === f} onChange={() => setFranja(f)}>
              {f === "mañana" ? "Mañana" : "Tarde"}
            </Opcion>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 block">
        <span className="text-chico text-tinta-suave">Tu nombre (opcional)</span>
        <input
          type="text"
          autoComplete="name"
          maxLength={80}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-2 h-12 w-full border border-control bg-papel px-3 text-cuerpo"
        />
      </label>

      {/* El turno impreso: cada cambio "sale" de la impresora (sube y aparece) */}
      <div className="mt-6 bg-suelo px-4 py-3" aria-live="polite">
        <p className="text-chico text-tinta-suave">Tu turno</p>
        <div className="relative mt-1 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={turno}
              className="font-medium first-letter:uppercase"
              initial={{ opacity: 0, transform: "translateY(70%)" }}
              animate={{ opacity: 1, transform: "translateY(0%)" }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.2, ease: easePremium }}
            >
              {turno}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {intentado && error && (
        <p id={errorId} role="alert" className="mt-3 text-chico font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="mt-5 grid gap-2">
        <Button asChild size="lg" className="w-full">
          <a
            href={whatsappUrl(mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!!error}
            onClick={(e) => {
              setIntentado(true)
              if (error) e.preventDefault()
            }}
          >
            <WhatsAppIcon />
            Pedir turno por WhatsApp
          </a>
        </Button>
        <a
          href={`mailto:${site.contacto.email}?subject=${encodeURIComponent(`Visita: ${titulo}`)}&body=${encodeURIComponent(mensaje)}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 text-chico font-medium underline"
        >
          <Mail className="size-4" aria-hidden="true" />
          Prefiero por mail
        </a>
      </div>
    </div>
  )
}

function Opcion({
  name,
  checked,
  onChange,
  children,
}: {
  name: string
  checked: boolean
  onChange: () => void
  children: React.ReactNode
}) {
  return (
    <label
      className={cn(
        "relative inline-flex min-h-11 cursor-pointer items-center justify-center px-2 text-chico font-medium transition-[background-color,color,scale] duration-150 active:scale-[0.97] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bordo",
        checked ? "bg-tinta text-suelo" : "bg-plinto text-tinta hover:bg-tinta/15"
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  )
}
