"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, type PanInfo, type Variants } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { mediaLayoutId } from "@/lib/propiedades/seleccion"
import type { Foto } from "@/lib/propiedades/tipos"
import { transitions } from "@/lib/motion"
import { cn } from "@/lib/utils"

const slide: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "100%" : "-100%", zIndex: 1 }),
  center: { x: "0%", zIndex: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? "-28%" : "28%", opacity: 0.4, zIndex: 0 }),
}

const SWIPE = 70 // px
const SWIPE_VELOCITY = 450 // px/s

/**
 * Galería de la ficha: swipe/drag con Motion, flechas, teclado (← →),
 * contador y miniaturas. El marco comparte `layoutId` con la foto de la card.
 */
export function Gallery({
  slug,
  titulo,
  fotos,
  sizes = "(min-width: 1280px) 1100px, 100vw",
  className,
}: {
  slug: string
  titulo: string
  fotos: Foto[]
  sizes?: string
  className?: string
}) {
  const [[index, dir], setPage] = useState<[number, number]>([0, 0])
  const total = fotos.length

  function go(to: number) {
    const next = (to + total) % total
    setPage([next, to > index ? 1 : -1])
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE || info.velocity.x < -SWIPE_VELOCITY) go(index + 1)
    else if (info.offset.x > SWIPE || info.velocity.x > SWIPE_VELOCITY) go(index - 1)
  }

  const foto = fotos[index]

  return (
    <div className={className}>
      <motion.div
        layoutId={mediaLayoutId(slug)}
        role="region"
        aria-roledescription="carrusel"
        aria-label={`Fotos de ${titulo}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1)
          if (e.key === "ArrowLeft") go(index - 1)
        }}
        className="group/gallery relative aspect-[4/3] overflow-hidden bg-plinto sm:aspect-[16/10] lg:aspect-auto lg:h-[min(62svh,42rem)]"
        style={{ borderRadius: 0 }}
        transition={transitions.spring}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: transitions.spring, opacity: { duration: 0.3 } }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              sizes={sizes}
              loading="eager"
              placeholder={typeof foto.src === "string" ? "empty" : "blur"}
              draggable={false}
              className="pointer-events-none object-cover select-none"
            />
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <GalleryButton side="left" onClick={() => go(index - 1)} label="Foto anterior" />
            <GalleryButton side="right" onClick={() => go(index + 1)} label="Foto siguiente" />
            <p
              className="pointer-events-none absolute bottom-0 left-0 z-10 bg-tinta px-3 py-1.5 text-chico font-medium text-suelo"
              aria-live="polite"
            >
              {index + 1} / {total}
            </p>
          </>
        )}
      </motion.div>

      {total > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Miniaturas">
          {fotos.map((f, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Ver foto ${i + 1} de ${total}`}
                aria-current={i === index}
                className={cn(
                  "relative block h-14 w-20 overflow-hidden transition-opacity duration-200 sm:h-16 sm:w-24",
                  i === index ? "opacity-100 outline-2 outline-offset-2 outline-tinta" : "opacity-55 hover:opacity-90"
                )}
              >
                <Image src={f.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function GalleryButton({ side, onClick, label }: { side: "left" | "right"; onClick: () => void; label: string }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center bg-papel text-tinta transition-opacity duration-200 hover:bg-suelo md:opacity-0 md:group-hover/gallery:opacity-100 md:focus-visible:opacity-100",
        side === "left" ? "left-3" : "right-3"
      )}
    >
      <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
    </button>
  )
}
