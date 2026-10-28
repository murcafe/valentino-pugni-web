"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Compartir la ficha (menú nativo en el celu; copia el link en desktop). */
export function ShareButton({ url, titulo }: { url: string; titulo: string }) {
  const [copiado, setCopiado] = useState(false)

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2200)
    } catch {
      // el usuario canceló el menú de compartir
    }
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={share} className="w-full justify-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copiado ? "ok" : "share"}
          className="inline-flex items-center gap-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {copiado ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
          {copiado ? "Link copiado" : "Compartir"}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copiado ? "Link copiado al portapapeles" : ""}
      </span>
    </Button>
  )
}
