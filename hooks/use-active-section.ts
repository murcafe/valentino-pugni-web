"use client"

import { useEffect, useState } from "react"

/**
 * Scroll-spy: devuelve el id de la sección que cruza la franja central del viewport.
 * Solo cambia el estado cuando cambia la sección (no por frame).
 */
export function useActiveSection(ids: readonly string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    const visible = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting)
        const current = ids.find((id) => visible.get(id)) ?? null
        setActive((prev) => (prev === current ? prev : current))
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids, enabled])

  return enabled ? active : null
}
