"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Dialog } from "radix-ui"
import { AnimatePresence, motion } from "motion/react"
import { useLenis } from "lenis/react"
import { X } from "lucide-react"
import { marcarModal } from "@/lib/propiedades/seleccion"
import { easePremium } from "@/lib/motion"

/**
 * Modal de la ficha (ruta interceptada). Técnica adaptada de "Morphing Dialog"
 * (Patrick Xin / Lumi UI, 21st.dev, MIT):
 * - La foto llega desde la card con `layoutId`; el resto del contenido aparece con fundido.
 * - Al cerrar: primero la card vuelve a verse y el modal sale con AnimatePresence
 *   (la foto regresa a la card) y recién después se vuelve atrás en el historial.
 * - Con el botón "atrás" del navegador se cierra sin animación (lo resuelve Next).
 */
export function PropertyModal({ slug, titleId, children }: { slug: string; titleId: string; children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const lenis = useLenis()
  const enSuRuta = pathname === `/propiedades/${slug}`
  const [open, setOpen] = useState(true)
  // Si Next re-muestra este componente (quedó oculto) al volver a abrir la misma ficha,
  // arranca abierto de nuevo. Ajuste de estado en render, sin efecto.
  const [ultimaRuta, setUltimaRuta] = useState(enSuRuta)
  if (enSuRuta !== ultimaRuta) {
    setUltimaRuta(enSuRuta)
    if (enSuRuta) setOpen(true)
  }
  // Abierto de verdad solo si la URL sigue siendo la de esta ficha (cubre el "atrás"
  // del navegador, donde Next puede dejar este componente montado pero oculto).
  const activo = open && enSuRuta
  const cerrando = useRef(false)

  useEffect(() => {
    marcarModal(slug, activo)
    if (activo) {
      cerrando.current = false
      lenis?.stop()
    } else {
      lenis?.start()
    }
    return () => {
      marcarModal(slug, false)
      lenis?.start()
    }
  }, [slug, activo, lenis])

  /** Vuelve atrás una sola vez y solo si el cierre lo pidió el usuario desde el modal. */
  function goBack() {
    if (!cerrando.current) return
    cerrando.current = false
    router.back()
  }

  function close() {
    cerrando.current = true
    setOpen(false)
    // Red de seguridad: si la animación de salida no corre (pestaña en segundo plano), igual se cierra.
    window.setTimeout(goBack, 900)
  }

  return (
    <Dialog.Root open={activo} onOpenChange={(o) => !o && close()}>
      <AnimatePresence onExitComplete={goBack}>
        {activo && (
          <Dialog.Portal forceMount key="modal">
            <Dialog.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 z-[90] bg-tinta/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
                transition={{ duration: 0.35 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              forceMount
              asChild
              aria-labelledby={titleId}
              aria-describedby={undefined}
              onCloseAutoFocus={(e) => {
                // Devolvemos el foco a la card que abrió el modal.
                e.preventDefault()
                document.querySelector<HTMLElement>(`a[href="/propiedades/${slug}"]`)?.focus({ preventScroll: true })
              }}
            >
              <motion.div
                layoutRoot
                layoutScroll
                data-lenis-prevent
                className="fixed inset-0 z-[91] overflow-y-auto overscroll-contain"
                onClick={(e) => {
                  if (e.target === e.currentTarget) close()
                }}
              >
                <div
                  className="flex min-h-full items-start justify-center md:px-8 md:py-10"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) close()
                  }}
                >
                  <div className="relative w-full max-w-6xl">
                    {/* Fondo del panel: solo opacity, para no tapar el morph de la foto */}
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 bg-suelo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.4, ease: easePremium }}
                    />
                    <div className="relative px-4 pt-16 sm:px-8 md:pt-8">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="absolute top-3 right-3 z-20 md:top-4 md:right-4"
                      >
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            aria-label="Cerrar ficha"
                            className="inline-flex size-11 items-center justify-center bg-papel text-tinta transition-colors hover:bg-plinto"
                          >
                            <X className="size-5" strokeWidth={1.6} aria-hidden="true" />
                          </button>
                        </Dialog.Close>
                      </motion.div>
                      {children}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
