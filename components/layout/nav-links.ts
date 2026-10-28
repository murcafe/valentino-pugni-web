export type NavLink = {
  /** id de la sección en el home (para el indicador activo) */
  id: string
  label: string
  href: string
}

export const navLinks: NavLink[] = [
  { id: "propiedades", label: "Propiedades", href: "/propiedades" },
  { id: "como-compro", label: "Cómo compro", href: "/#como-compro" },
  { id: "sobre-mi", label: "Sobre mí", href: "/#sobre-mi" },
  { id: "contacto", label: "Contacto", href: "/#contacto" },
]

/** Secciones del home que el scroll-spy observa (en orden). */
export const spySections = ["propiedades", "como-compro", "sobre-mi", "contacto"]
