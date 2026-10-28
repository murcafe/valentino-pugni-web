"use client"

import Link from "next/link"
import { useLenis } from "lenis/react"
import type { ComponentProps, MouseEvent } from "react"

// Lenis ya respeta scroll-padding-top (= alto del navbar, ver globals.css)

/** Lleva el foco a la sección (lectores de pantalla y teclado) sin volver a scrollear. */
export function focusSection(el: HTMLElement) {
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1")
  el.focus({ preventScroll: true })
}

/** Scroll suave a un hash de la página actual. Devuelve false si no existe. */
export function useScrollToHash() {
  const lenis = useLenis()
  return (hash: string) => {
    const el = document.getElementById(decodeURIComponent(hash.replace(/^#/, "")))
    if (!el) return false
    history.replaceState(null, "", hash)
    if (lenis) {
      lenis.scrollTo(el, { force: true, onComplete: () => focusSection(el) })
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      focusSection(el)
    }
    return true
  }
}

type Props = ComponentProps<typeof Link> & { href: string }

/**
 * Link que, si apunta a una sección de la página en la que estás ("/#servicios"
 * estando en "/"), scrollea suave con Lenis en vez de dejar que Next salte.
 */
export function SectionLink({ href, onClick, ...props }: Props) {
  const scrollToHash = useScrollToHash()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    const url = new URL(href, window.location.href)
    if (url.pathname === window.location.pathname && url.hash) {
      if (scrollToHash(url.hash)) e.preventDefault()
    }
  }

  return <Link href={href} onClick={handleClick} {...props} />
}
