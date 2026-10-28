"use client"

import { usePathname } from "next/navigation"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { mensajes, whatsappUrl } from "@/lib/site"

/** Botón fijo de WhatsApp. En la ficha no va: ahí está la barra de turno. */
export function WhatsAppFlotante() {
  const pathname = usePathname()
  if (pathname.startsWith("/propiedades/")) return null

  return (
    <a
      href={whatsappUrl(mensajes.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribime por WhatsApp (se abre en una pestaña nueva)"
      className="fixed right-[calc(1rem+env(safe-area-inset-right,0px))] bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-40 inline-flex size-14 items-center justify-center bg-bordo text-white transition-colors duration-200 hover:bg-tinta md:right-6 md:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <WhatsAppIcon className="size-6" />
    </a>
  )
}
