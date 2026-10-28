"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/motion/magnetic"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { SectionLink } from "@/components/layout/section-link"
import { navLinks, spySections } from "@/components/layout/nav-links"
import { useActiveSection } from "@/hooks/use-active-section"
import { easePremium, transitions } from "@/lib/motion"
import { mensajes, site, whatsappUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

const HIDE_AFTER = 160 // px antes de empezar a esconderse
const DELTA = 6 // px mínimos de scroll para cambiar de dirección

/** Barra simple: nombre, cuatro links y una acción. Se esconde al bajar y vuelve al subir. */
export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  const spied = useActiveSection(spySections, isHome)
  const active = pathname.startsWith("/propiedades") ? "propiedades" : spied

  // Solo cambia estado cuando cambia la dirección (no por frame).
  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - (scrollY.getPrevious() ?? 0)
    if (y < HIDE_AFTER) setHidden(false)
    else if (diff > DELTA) setHidden(true)
    else if (diff < -DELTA) setHidden(false)
  })

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 bg-suelo pt-[env(safe-area-inset-top)] text-tinta"
      initial={false}
      animate={{ transform: hidden ? "translateY(-100%)" : "translateY(0%)" }}
      transition={{ duration: 0.45, ease: easePremium }}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="container-site flex h-[4.25rem] items-center justify-between gap-6">
        <Link href="/" className="inline-flex min-h-11 items-center font-display text-[1.6rem] leading-none tracking-[-0.02em]">
          {site.name}
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id}>
                  <SectionLink
                    href={link.href}
                    aria-current={isActive ? (link.href.includes("#") ? "location" : "page") : undefined}
                    className="relative isolate inline-flex min-h-11 items-center px-4 text-chico font-medium"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-plinto"
                        transition={transitions.spring}
                      />
                    )}
                    {link.label}
                  </SectionLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Magnetic>
            <Button asChild size="sm" className={cn("px-3 sm:px-5")}>
              <a
                href={whatsappUrl(mensajes.general)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribime por WhatsApp (se abre en una pestaña nueva)"
              >
                <WhatsAppIcon />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </Button>
          </Magnetic>
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  )
}
