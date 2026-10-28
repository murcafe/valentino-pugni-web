import type { ComponentProps, CSSProperties } from "react"
import { cn } from "@/lib/utils"

/**
 * Fundido + subida suave al entrar en pantalla, solo con CSS (ver `.reveal` en globals.css).
 * No depende del JS: si no carga, tarda o el navegador es viejo, el contenido se ve igual.
 */
export function Reveal({ delay = 0, className, style, ...props }: ComponentProps<"div"> & { delay?: number }) {
  return <div className={cn("reveal", className)} style={{ "--reveal-delay": delay, ...style } as CSSProperties} {...props} />
}
