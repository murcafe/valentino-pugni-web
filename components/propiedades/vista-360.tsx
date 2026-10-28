"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { Dialog } from "radix-ui"
import { Expand, MoveHorizontal, X } from "lucide-react"
import { focusSection } from "@/components/layout/section-link"
import type { Foto } from "@/lib/propiedades/tipos"
import { cn } from "@/lib/utils"

/** Hacia dónde mira el visor, en grados. Lo comparten el visor de la ficha y el de pantalla completa. */
type Mirada = { yaw: number; pitch: number; fov: number; pista: boolean }

const RAD = Math.PI / 180
const FOV = { min: 35, max: 95 }
const PISTA_MS = 4500 // el giro de pista frena solo: menos de 5 s de movimiento automático
const FRENO = 0.995 // inercia por ms, como el scroll

const VERT = "attribute vec2 a;varying vec2 p;void main(){p=a;gl_Position=vec4(a,0.,1.);}"
// Por cada píxel: dirección de la mirada (pitch y después yaw) → punto de la foto equirectangular.
const FRAG = `precision highp float;
uniform sampler2D t;uniform float yaw,pitch,f,asp;varying vec2 p;
void main(){
  vec3 d=normalize(vec3(p.x*f*asp,p.y*f,-1.));
  float c=cos(pitch),s=sin(pitch);
  d=vec3(d.x,d.y*c-d.z*s,d.y*s+d.z*c);
  c=cos(yaw);s=sin(yaw);
  d=vec3(d.x*c+d.z*s,d.y,-d.x*s+d.z*c);
  gl_FragColor=texture2D(t,vec2(atan(d.x,-d.z)/6.2831853+.5,acos(clamp(d.y,-1.,1.))/3.1415927));
}`

/** Baja hasta el visor sin sumar una entrada al historial: el modal de la ficha se cierra con "atrás". */
export function IrA360({ id, className }: { id: string; className?: string }) {
  return (
    <a
      href={`#${id}`}
      className={className}
      onClick={(e) => {
        const el = document.getElementById(id)
        if (!el) return
        e.preventDefault()
        el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
        focusSection(el)
      }}
    >
      Ver en 360°
    </a>
  )
}

/**
 * Recorrido 360° de una propiedad: la foto equirectangular en la ficha y un botón
 * para verla en pantalla completa, que arranca mirando hacia el mismo lado.
 */
export function Vista360({ foto, titulo, className }: { foto: Foto; titulo: string; className?: string }) {
  const [abierto, setAbierto] = useState(false)
  const mirada = useRef<Mirada>({ yaw: 0, pitch: 0, fov: 75, pista: true })

  return (
    <div className={cn("relative aspect-[4/3] bg-plinto sm:aspect-[16/9]", className)}>
      <Visor foto={foto} titulo={titulo} mirada={mirada} activo={!abierto} className="absolute inset-0" />
      <Dialog.Root open={abierto} onOpenChange={setAbierto}>
        <Dialog.Trigger className="absolute top-0 right-0 z-10 inline-flex min-h-11 items-center gap-2 bg-papel px-4 text-chico font-medium text-tinta transition-colors duration-200 hover:bg-suelo">
          <Expand className="size-4" strokeWidth={1.8} aria-hidden="true" />
          Pantalla completa
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content
            data-lenis-prevent
            aria-describedby={undefined}
            className="fixed inset-0 z-[100] bg-tinta duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
          >
            <Dialog.Title className="sr-only">Vista 360° de {titulo}</Dialog.Title>
            <Visor foto={foto} titulo={titulo} mirada={mirada} expandido className="absolute inset-0" />
            <Dialog.Close
              aria-label="Cerrar la vista 360°"
              className="absolute top-[calc(0.75rem+env(safe-area-inset-top,0px))] right-[calc(0.75rem+env(safe-area-inset-right,0px))] inline-flex size-12 items-center justify-center bg-papel text-tinta transition-colors duration-200 hover:bg-suelo"
            >
              <X className="size-5" strokeWidth={1.8} aria-hidden="true" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

function Visor({
  foto,
  titulo,
  mirada,
  expandido = false,
  activo = true,
  className,
}: {
  foto: Foto
  titulo: string
  mirada: RefObject<Mirada>
  /** pantalla completa: mirar arriba/abajo con el dedo y acercar con dos dedos o la rueda */
  expandido?: boolean
  /** false mientras está abierta la pantalla completa: no gira ni dibuja */
  activo?: boolean
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pedirRef = useRef<() => void>(() => {})
  const activoRef = useRef(activo)
  const [estado, setEstado] = useState<"esperando" | "cargando" | "listo" | "error">("esperando")
  const [tocado, setTocado] = useState(false)
  const src = typeof foto.src === "string" ? foto.src : foto.src.src
  const blur = typeof foto.src === "string" ? undefined : foto.src.blurDataURL

  useEffect(() => {
    activoRef.current = activo
    if (activo) pedirRef.current() // vuelve de pantalla completa mirando hacia donde quedó
  }, [activo])

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false })
    if (!gl) {
      setEstado("error")
      return
    }
    const m = mirada.current
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches
    let u: Record<"yaw" | "pitch" | "f" | "asp", WebGLUniformLocation | null>
    let listo = false
    let cargada = false
    let muerto = false
    let raf = 0
    let antes = 0
    let enVista = false
    let pistaDesde = 0
    let vel = [0, 0] // grados por ms, al soltar
    const dedos = new Map<number, { x: number; y: number }>()
    let historial: { x: number; y: number; t: number }[] = []
    let pinza = { d: 0, fov: 0 }

    function iniciar() {
      const prog = gl!.createProgram()!
      for (const [tipo, codigo] of [
        [gl!.VERTEX_SHADER, VERT],
        [gl!.FRAGMENT_SHADER, FRAG],
      ] as const) {
        const sh = gl!.createShader(tipo)!
        gl!.shaderSource(sh, codigo)
        gl!.compileShader(sh)
        gl!.attachShader(prog, sh)
      }
      gl!.linkProgram(prog)
      gl!.useProgram(prog)
      gl!.bindBuffer(gl!.ARRAY_BUFFER, gl!.createBuffer())
      gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl!.STATIC_DRAW) // un triángulo que tapa todo
      gl!.enableVertexAttribArray(0)
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0)
      u = { yaw: gl!.getUniformLocation(prog, "yaw"), pitch: gl!.getUniformLocation(prog, "pitch"), f: gl!.getUniformLocation(prog, "f"), asp: gl!.getUniformLocation(prog, "asp") }
    }

    async function cargar() {
      cargada = true
      setEstado("cargando")
      try {
        // Decodificar fuera del hilo principal: con un <img> la subida de 4096 px trababa la página ~400 ms.
        const res = await fetch(src)
        if (!res.ok) throw new Error(String(res.status))
        const bmp = await createImageBitmap(await res.blob(), { colorSpaceConversion: "none", premultiplyAlpha: "none" })
        if (muerto) return
        // Las fotos de cámaras 360 pueden pasar el máximo de la GPU: se achican antes de subirlas.
        const max = gl!.getParameter(gl!.MAX_TEXTURE_SIZE) as number
        let fuente: ImageBitmap | HTMLCanvasElement = bmp
        if (bmp.width > max) {
          const c = document.createElement("canvas")
          c.width = max
          c.height = max / 2
          c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height)
          fuente = c
        }
        gl!.pixelStorei(gl!.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl!.NONE)
        gl!.bindTexture(gl!.TEXTURE_2D, gl!.createTexture())
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
        // Se sube de a franjas, una por cuadro: de una sola vez trababa el scroll más de 100 ms.
        const { width: w, height: h } = fuente
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null)
        for (let y = 0; y < h; y += 128) {
          const franja = await createImageBitmap(fuente, 0, y, w, Math.min(128, h - y))
          await new Promise(requestAnimationFrame)
          if (muerto) return
          gl!.texSubImage2D(gl!.TEXTURE_2D, 0, 0, y, gl!.RGBA, gl!.UNSIGNED_BYTE, franja)
          franja.close()
        }
        listo = true
        setEstado("listo")
        pedir()
      } catch {
        if (!muerto) setEstado("error")
      }
    }

    function dibujar() {
      const dpr = Math.min(devicePixelRatio, 2)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (!w || !h) return
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl!.viewport(0, 0, w, h)
      gl!.uniform1f(u.yaw, m.yaw * RAD)
      gl!.uniform1f(u.pitch, m.pitch * RAD)
      gl!.uniform1f(u.f, Math.tan((m.fov * RAD) / 2))
      gl!.uniform1f(u.asp, w / h)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    }

    const limitarPitch = (p: number) => Math.max(-85, Math.min(85, p))
    const limitarFov = (f: number) => Math.max(FOV.min, Math.min(FOV.max, f))
    const gradosPorPx = () => m.fov / canvas.clientHeight // así la foto sigue al dedo

    // Solo hay un loop mientras algo se mueve (inercia o pista); quieto no gasta batería.
    function cuadro(t: number) {
      raf = 0
      const dt = antes ? Math.min(t - antes, 50) : 16
      antes = t
      let sigue = false
      if (!activoRef.current) {
        antes = 0
        return
      }
      if (dedos.size === 0 && (vel[0] || vel[1])) {
        m.yaw += vel[0] * dt
        m.pitch = limitarPitch(m.pitch + vel[1] * dt)
        const k = Math.pow(FRENO, dt)
        vel = [vel[0] * k, vel[1] * k]
        if (Math.hypot(vel[0], vel[1]) < 0.002) vel = [0, 0]
        else sigue = true
      } else if (m.pista && listo && enVista && !expandido && !quieto) {
        pistaDesde ||= t
        const resto = 1 - (t - pistaDesde) / PISTA_MS
        if (resto > 0) {
          m.yaw -= 0.016 * resto * resto * dt // arranca a 16°/s y frena hasta parar
          sigue = true
        } else m.pista = false
      }
      if (listo) dibujar()
      if (sigue) pedir()
      else antes = 0
    }
    function pedir() {
      if (!raf && !muerto) raf = requestAnimationFrame(cuadro)
    }
    pedirRef.current = pedir

    function tocar() {
      m.pista = false
      vel = [0, 0]
      setTocado(true)
    }

    function abajo(e: PointerEvent) {
      if (e.pointerType === "mouse" && e.button !== 0) return
      canvas.setPointerCapture(e.pointerId)
      dedos.set(e.pointerId, { x: e.clientX, y: e.clientY })
      historial = [{ x: e.clientX, y: e.clientY, t: e.timeStamp }]
      if (dedos.size === 2) {
        const [a, b] = [...dedos.values()]
        pinza = { d: Math.hypot(a.x - b.x, a.y - b.y), fov: m.fov }
      }
      tocar()
    }
    function mover(e: PointerEvent) {
      const dedo = dedos.get(e.pointerId)
      if (!dedo) return
      const dx = e.clientX - dedo.x
      const dy = e.clientY - dedo.y
      dedo.x = e.clientX
      dedo.y = e.clientY
      if (dedos.size === 2) {
        if (!expandido) return
        const [a, b] = [...dedos.values()]
        m.fov = limitarFov((pinza.fov * pinza.d) / Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)))
      } else {
        const k = gradosPorPx()
        m.yaw += dx * k
        m.pitch = limitarPitch(m.pitch + dy * k)
        historial.push({ x: e.clientX, y: e.clientY, t: e.timeStamp })
        if (historial.length > 5) historial.shift()
      }
      pedir()
    }
    function arriba(e: PointerEvent) {
      if (!dedos.delete(e.pointerId)) return
      if (dedos.size) {
        historial = [] // de la pinza a un dedo: sin inercia
        return
      }
      const a = historial[0]
      const b = historial.at(-1)
      // Al soltar con envión, sigue girando y frena (con movimiento reducido, se queda donde la dejaste).
      if (!quieto && e.type === "pointerup" && a && b && b.t > a.t && e.timeStamp - b.t < 80) {
        const k = gradosPorPx() / (b.t - a.t)
        vel = [(b.x - a.x) * k, (b.y - a.y) * k]
        pedir()
      }
    }
    function rueda(e: WheelEvent) {
      e.preventDefault()
      m.fov = limitarFov(m.fov * Math.exp(e.deltaY * 0.0015))
      tocar()
      pedir()
    }
    function tecla(e: KeyboardEvent) {
      const paso: Record<string, () => void> = {
        ArrowLeft: () => (m.yaw += 15),
        ArrowRight: () => (m.yaw -= 15),
        ArrowUp: () => (m.pitch = limitarPitch(m.pitch + 10)),
        ArrowDown: () => (m.pitch = limitarPitch(m.pitch - 10)),
        "+": () => (m.fov = limitarFov(m.fov - 10)),
        "=": () => (m.fov = limitarFov(m.fov - 10)),
        "-": () => (m.fov = limitarFov(m.fov + 10)),
      }
      if (!paso[e.key]) return
      e.preventDefault()
      paso[e.key]()
      tocar()
      pedir()
    }

    const io = new IntersectionObserver(
      ([e]) => {
        enVista = e.intersectionRatio >= 0.6
        if (e.isIntersecting && !cargada) cargar()
        pedir()
      },
      { threshold: [0, 0.6] }
    )
    const ro = new ResizeObserver(() => pedir())
    function perdido(e: Event) {
      e.preventDefault()
      listo = false
    }
    function recuperado() {
      iniciar()
      cargar()
    }

    iniciar()
    io.observe(canvas)
    ro.observe(canvas)
    canvas.addEventListener("pointerdown", abajo)
    canvas.addEventListener("pointermove", mover)
    canvas.addEventListener("pointerup", arriba)
    canvas.addEventListener("pointercancel", arriba)
    canvas.addEventListener("keydown", tecla)
    canvas.addEventListener("webglcontextlost", perdido)
    canvas.addEventListener("webglcontextrestored", recuperado)
    // En la ficha la rueda sigue scrolleando la página; solo acerca en pantalla completa.
    if (expandido) canvas.addEventListener("wheel", rueda, { passive: false })

    return () => {
      muerto = true
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener("pointerdown", abajo)
      canvas.removeEventListener("pointermove", mover)
      canvas.removeEventListener("pointerup", arriba)
      canvas.removeEventListener("pointercancel", arriba)
      canvas.removeEventListener("keydown", tecla)
      canvas.removeEventListener("webglcontextlost", perdido)
      canvas.removeEventListener("webglcontextrestored", recuperado)
      canvas.removeEventListener("wheel", rueda)
    }
  }, [src, expandido, mirada])

  return (
    <div className={cn("overflow-hidden", className)}>
      {blur && estado !== "listo" && (
        // eslint-disable-next-line @next/next/no-img-element -- miniatura borrosa de 8 px mientras carga
        <img src={blur} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-110 object-cover blur-lg" />
      )}
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-roledescription="vista 360°"
        aria-label={`${foto.alt}. Arrastrá o usá las flechas para mirar alrededor${expandido ? "; con + y - acercás o alejás" : ""}.`}
        aria-busy={estado === "cargando"}
        className={cn(
          "absolute inset-0 size-full cursor-grab select-none transition-opacity duration-500 focus-visible:outline-offset-[-4px] active:cursor-grabbing",
          expandido ? "touch-none" : "touch-pan-y",
          estado === "listo" ? "opacity-100" : "opacity-0"
        )}
      />
      {estado === "error" && (
        <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-tinta-suave">
          Este navegador no puede mostrar la vista 360°. Mirá las fotos de {titulo} más arriba.
        </p>
      )}
      {estado === "cargando" && (
        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 bg-tinta px-3 py-1.5 text-chico text-suelo">
          Cargando vista 360°…
        </p>
      )}
      <p
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 bg-tinta px-3 py-1.5 text-chico whitespace-nowrap text-suelo transition-opacity duration-300",
          estado === "listo" && !tocado ? "opacity-100" : "opacity-0"
        )}
      >
        <MoveHorizontal className="size-4" strokeWidth={1.8} />
        Arrastrá para mirar alrededor
      </p>
    </div>
  )
}
