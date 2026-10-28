# Spec: Rediseño web de Valentino Pugni (Estudio Gibert)

> Estado: **aprobada** (2026-10-28). Reemplaza la dirección "boutique editorial" de la etapa anterior.
> Referencia de estilo: [The Drop Store](https://thedropstore.org): estructura de tienda (cada propiedad se presenta como un "producto"), titulares grandes y sobrios, mucho blanco, tarjetas que flotan con el scroll. Se mantiene el bordó de Estudio Gibert como único acento.

## Objetivo

Que alguien que busca **comprar una casa en La Plata o City Bell** entre, vea propiedades enseguida, confíe en Valentino y **pida una visita** o le escriba.

Conversiones, en orden:
1. **Coordinar visita** a una propiedad (WhatsApp o formulario, con propiedad, día y franja horaria ya escritos).
2. **Escribir por WhatsApp** (consulta general).
3. **Tasar mi propiedad** (secundaria: el público principal compra, no vende).

No es objetivo: login, favoritos guardados, pagos, ni agenda con turnos reales.

## Mapa del sitio y contenido

Todo el texto es real, en español rioplatense (vos). Nada de lorem ipsum: lo que falta es `[COMPLETAR]`, visible y fácil de buscar.

### Home (`/`)
| # | Sección | Contenido | Estado actual |
|---|---|---|---|
| 1 | ~~Intro~~ | Eliminada (decisión del usuario): se entra directo a la vidriera | Se borra |
| 2 | Navbar | Logo, Propiedades · Cómo compro · Sobre mí · Contacto, botón WhatsApp siempre visible | Existe, se re-estiliza |
| 3 | Hero "vidriera" | Titular grande centrado ("Tu próxima casa en La Plata y City Bell"), buscador rápido, y 4–6 propiedades flotando alrededor con parallax (como los productos de The Drop Store). Cada una lleva a su ficha. | Se rehace |
| 4 | Propiedades | Grilla de "productos": foto, precio grande tipo etiqueta, ambientes/m², zona. Filtros venta/alquiler, tipo, ambientes. Link al catálogo. | Existe, se re-estiliza |
| 5 | Cómo compro con Valentino | 4 pasos para el comprador: búsqueda → visita → reserva y oferta → escritura. Línea que se dibuja al scrollear. | Nuevo |
| 6 | Respaldo | Estudio Gibert: 3 oficinas, corredor matriculado, plazo de respuesta `[CONFIRMAR]`. Sin años ni cantidad de operaciones de Valentino. | Existe (Números), se simplifica |
| 7 | Sobre Valentino | Foto `[COMPLETAR]` + texto corto en primera persona | Nuevo |
| 8 | ¿Querés vender? | Bloque chico: "Tasá tu propiedad" → WhatsApp con mensaje armado | Nuevo (reemplaza el formulario largo de tasación) |
| 9 | Testimonios | Carrusel arrastrable. **Oculto** mientras no haya reseñas reales | Nuevo |
| 10 | Contacto + footer | WhatsApp, mail, Instagram, oficina (473 bis y 14 A, City Bell `[CONFIRMAR]`), mapa, matrícula de Jorge Gibert `[COMPLETAR]`, botón flotante de WhatsApp | Nuevo |

### Catálogo (`/propiedades`)
Grilla tipo tienda con filtros en la URL (`?operacion=&tipo=&zona=&ambientes=`), contador de resultados y estado vacío con CTA. **Existe**, se re-estiliza.

### Ficha (`/propiedades/[slug]`)
Galería con swipe, precio, ficha técnica, descripción, mapa de la zona (aproximado), compartir. Se abre como modal desde una card y como página por link directo, con vista previa para WhatsApp (Open Graph). **Existe.** Se agrega:
- **"Coordinar visita"**: día preferido (hoy / mañana / fecha), franja (mañana / tarde), nombre. Arma el mensaje de WhatsApp con la propiedad y su link. Alternativa por mail.
- En celular, barra fija abajo con precio + "Coordinar visita".

## Tech Stack
Ya instalado, no se suma nada sin preguntar: Next.js 16.4 (App Router, cacheComponents) · React 19.3 · TypeScript · Tailwind 4 · shadcn/ui (Radix) · Motion 14.3 · Lenis 1.3 · lucide-react.

## Commands
```bash
npm run dev            # http://localhost:3000
npm run lint
npm run build          # parar el dev server antes: la PC tiene 3,2 GB de RAM
npm run start -- --port 3001
node --test lib/**/*.test.ts   # tests de lógica pura (Node 24 corre TS directo)
```
En PowerShell usar `npx.cmd` en vez de `npx` (la política de ejecución bloquea `npx.ps1`).

## Project Structure
```
app/                       rutas (home, /propiedades, /propiedades/[slug], @modal interceptado)
components/sections/       secciones del home
components/propiedades/    card, grilla, filtros, ficha, galería, modal, mapa
components/layout/         navbar, menú mobile, progreso de scroll
components/motion/         piezas de animación reutilizables (Reveal, Counter, Magnetic…)
lib/propiedades/           capa de datos (lista para cambiar por Tokko sin tocar componentes)
lib/site.ts                contacto, marca, matrícula y mensajes de WhatsApp
data/propiedades.ts        8 propiedades marcadas EJEMPLO
public/images/             fotos (las de ejemplo son de Unsplash)
```

## Code Style
Componentes chicos, copy en español, comentarios solo para el "por qué", animaciones con las transiciones base de `lib/motion.ts`:
```tsx
const viewport = { once: true, amount: 0.25, margin: "0px 0px -60px 0px" } as const

/** Fundido + subida suave al entrar en pantalla (una sola vez). */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} custom={delay} {...props} />
}
```

## Testing Strategy
- **Lógica pura** (filtros, armado de mensajes de WhatsApp/visita): tests con `node --test`, sin dependencias nuevas.
- **Visual y de interacción**: navegador a 375 px y 1440 px, capturas antes de entregar cada etapa.
- **Calidad**: `npm run lint` y `npm run build` sin errores; Lighthouse mobile.

## Boundaries
- **Siempre:** mobile primero; animar solo `transform`/`opacity` (clipPath puntual); respetar "reducir movimiento"; áreas táctiles ≥ 44 px; foco visible; `[COMPLETAR]` en vez de inventar; lint + build antes de cada entrega.
- **Preguntar antes:** sumar dependencias; bajar código de 21st (quedan 2 por día); cambiar la paleta de la marca; borrar secciones existentes; publicar.
- **Nunca:** inventar cifras, testimonios o matrícula; indexar las propiedades de ejemplo; commitear claves; tocar la política de ejecución de PowerShell.

## Success Criteria
1. En celular (375 px), sin scrollear, se ve el titular, el buscador y al menos una propiedad real del catálogo.
2. Desde cualquier propiedad, "Coordinar visita" está a 1 toque y genera un mensaje de WhatsApp con título, link, día y franja (verificado con test).
3. Sin scroll horizontal de 375 a 1440 px; todos los controles ≥ 44 × 44 px.
4. Con "reducir movimiento": sin parallax, sin intro, sin smooth scroll; todo se ve y funciona.
5. Lighthouse mobile: Performance ≥ 90, Accesibilidad ≥ 95, SEO 100.
6. Ninguna animación usa `width`/`height`/`top`/`left`; ninguna cambia estado de React por frame.
7. Cero lorem ipsum. Cada dato faltante aparece como `[COMPLETAR]` o `[CONFIRMAR]` y está listado en el README.
8. JSON-LD de RealEstateAgent, sitemap y Open Graph por propiedad.

## Open Questions
1. ~~Tasación~~: confirmado, bloque chico.
2. ~~Tipografía~~: Zodiak (titulares) + Switzer (texto), elegida por el usuario. Mundo: «El ticket de la tienda».
3. ~~Intro~~: confirmado, se elimina.
4. **Datos pendientes**: foto de Valentino, logo en SVG, matrícula, horario y coordenadas de la oficina, dominio, plazo de respuesta.
