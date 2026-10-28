"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog } from "radix-ui"
import { AnimatePresence, motion, stagger, type Variants } from "motion/react"
import { useLenis } from "lenis/react"
import { ArrowUpRight, X } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import { useScrollToHash } from "@/components/layout/section-link"
import { navLinks } from "@/components/layout/nav-links"
import { easePremium, transitions } from "@/lib/motion"
import { mensajes, site, whatsappUrl } from "@/lib/site"

const panel: Variants = {
  closed: { clipPath: "inset(0% 0% 100% 0%)" },
  open: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.55, ease: easePremium } },
  exit: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.4, ease: easePremium, delay: 0.05 } },
}

const list: Variants = {
  closed: {},
  open: { transition: { delayChildren: stagger(0.06, { startDelay: 0.22 }) } },
  exit: { transition: { delayChildren: stagger(0.03, { from: "last" }) } },
}

const item: Variants = {
  closed: { y: "110%" },
  open: { y: "0%", transition: transitions.reveal },
  exit: { y: "110%", transition: { duration: 0.25, ease: "easeIn" } },
}

const fade: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.4, delay: 0.45 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

/** Menú mobile a pantalla completa (Radix Dialog: foco atrapado, Esc, aria). */
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pendingHash = useRef<string | null>(null)
  const pathname = usePathname()
  const lenis = useLenis()
  const scrollToHash = useScrollToHash()

  // Frena Lenis mientras el menú está abierto.
  useEffect(() => {
    if (!lenis) return
    if (open) lenis.stop()
    else lenis.start()
  }, [open, lenis])

  // Cierra al cambiar de ruta (ajuste de estado en render, sin efecto)…
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }
  // …y si la vista queda oculta por <Activity>.
  useLayoutEffect(() => () => setOpen(false), [])

  function onLinkClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const url = new URL(href, window.location.href)
    if (url.pathname === window.location.pathname && url.hash) {
      // Misma página: cerramos y scrolleamos cuando termine la salida del panel.
      e.preventDefault()
      pendingHash.current = url.hash
    }
    setOpen(false)
  }

  function onExitComplete() {
    if (pendingHash.current) {
      scrollToHash(pendingHash.current)
      pendingHash.current = null
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="relative inline-flex size-11 items-center justify-center lg:hidden"
          aria-label="Abrir menú"
        >
          <span aria-hidden="true" className="flex w-6 flex-col gap-[7px]">
            <span className="h-0.5 w-full bg-current" />
            <span className="ml-auto h-0.5 w-4 bg-current" />
          </span>
        </button>
      </Dialog.Trigger>

      <AnimatePresence onExitComplete={onExitComplete}>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Content
              forceMount
              asChild
              aria-describedby={undefined}
              onCloseAutoFocus={(e) => {
                // Si vamos a scrollear a una sección, el foco lo maneja SectionLink.
                if (pendingHash.current) e.preventDefault()
              }}
            >
              <motion.div
                key="menu"
                data-lenis-prevent
                className="on-dark fixed inset-0 z-[80] flex flex-col overflow-y-auto overscroll-contain bg-tinta pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-suelo"
                variants={panel}
                initial="closed"
                animate="open"
                exit="exit"
              >
                <Dialog.Title className="sr-only">Menú</Dialog.Title>

                <div className="container-site flex h-[4.25rem] shrink-0 items-center justify-between">
                  <span className="font-display text-[1.6rem] leading-none tracking-[-0.02em]">{site.name}</span>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex size-11 items-center justify-center"
                      aria-label="Cerrar menú"
                    >
                      <X className="size-6" strokeWidth={1.4} aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav aria-label="Menú principal" className="container-site flex flex-1 flex-col justify-center py-10">
                  <motion.ul className="flex flex-col gap-1" variants={list}>
                    {navLinks.map((link) => (
                      <li key={link.id} className="overflow-hidden">
                        <motion.div variants={item}>
                          <Link
                            href={link.href}
                            onClick={(e) => onLinkClick(e, link.href)}
                            className="flex min-h-14 items-baseline py-1 font-display text-[2.75rem] leading-[1.05] tracking-[-0.03em] transition-colors duration-200 hover:text-bordo-claro sm:text-6xl"
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      </li>
                    ))}
                  </motion.ul>
                </nav>

                <motion.div variants={fade} className="container-site grid shrink-0 gap-5 pb-8">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <a href={whatsappUrl(mensajes.general)} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon />
                      Escribime por WhatsApp
                    </a>
                  </Button>
                  <div className="grid gap-1 text-chico text-tinta-clara">
                    <a href={`mailto:${site.contacto.email}`} className="inline-flex min-h-11 items-center gap-2 text-suelo">
                      {site.contacto.email}
                    </a>
                    <a
                      href={`https://instagram.com/${site.contacto.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1.5 text-suelo"
                    >
                      @{site.contacto.instagram}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                    <p className="mt-2">
                      {site.brand} · {site.sedes.join(" · ")}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
