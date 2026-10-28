# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Personas que buscan **comprar una casa** en La Plata o City Bell (y alrededores: Gonnet, Villa Elisa). Llegan desde Instagram, WhatsApp (Valentino les manda el link de una propiedad) o Google, casi siempre desde el celular. Su tarea: ver propiedades, entender precio y características, y coordinar una visita. Secundario: propietarios que quieren tasar para vender.

## Product Purpose
Web personal de Valentino Pugni, asesor inmobiliario de Estudio Gibert. Éxito = el visitante pide una visita a una propiedad o le escribe por WhatsApp. Tasar es la tercera conversión.

## Positioning
Un asesor joven y cercano, con la estructura de un estudio con oficinas en La Plata, City Bell y Pinamar y un corredor matriculado (Jorge Gibert) en cada operación. Respuesta personal por WhatsApp.

## Operating Context
- Valentino comparte fichas por WhatsApp: cada propiedad tiene URL propia con vista previa (Open Graph).
- "Reservar" = pedir una visita (día y franja horaria) por WhatsApp o mail. No hay agenda con turnos ni backend.
- Propiedades: hoy 8 de EJEMPLO en `data/propiedades.ts`; la capa `lib/propiedades/` está lista para conectar un CRM (por ejemplo Tokko Broker).

## Capabilities and Constraints
- Next.js 16.4 (App Router, cacheComponents), Tailwind 4, shadcn/Radix, Motion 14.3, Lenis. No sumar dependencias sin preguntar.
- Catálogo con filtros en la URL, ficha como página y como modal (ruta interceptada), galería con swipe, mapa de zona aproximada (OpenStreetMap).
- Equipo de desarrollo con 3,2 GB de RAM: parar el dev server antes de compilar.
- Copy en español rioplatense (vos).

## Brand Commitments
- Marca: **Estudio Gibert** (singular). Logo: monograma "GG" + "ESTUDIO | GIBERT", blanco sobre bordó; leyenda "Asesoramiento inmobiliario · Compra, venta e inversiones"; sedes La Plata – City Bell – Pinamar. Logo en SVG: pendiente.
- El bordó de Estudio Gibert (`#7A2620` aprox.) es el único acento obligatorio.
- Referencia explícita del usuario: [The Drop Store](https://thedropstore.org), tomando su **estructura de tienda** (cada propiedad como un producto, titulares grandes y sobrios, tarjetas que flotan con el scroll), no su paleta.
- Contacto: WhatsApp +54 9 221 306-8664 · vpugni@estudiogibert.com.ar · Instagram @pugniv.estudiogibert · Oficina 473 bis y 14 A (City Bell, a confirmar).

## Evidence on Hand
- No hay: foto de Valentino, fotos propias de propiedades, testimonios, operaciones cerradas, número de matrícula, años de trayectoria del estudio. No inventarlos.
- Fotos de ejemplo (Unsplash) en `public/images/ejemplos/` con créditos.
- Valentino tiene ~3 años en ventas y 2 meses en inmobiliaria: decisión del usuario, **no mostrar** años ni cantidad de operaciones.

## Product Principles
1. Las propiedades primero: en el primer pantallazo del celular se ve al menos una.
2. Cada propiedad a un toque de "Coordinar visita".
3. Nada inventado: lo que falta se muestra como `[COMPLETAR]` hasta tenerlo.
4. Rápido y fluido en un celular de gama media; el movimiento nunca traba ni tapa contenido.

## Accessibility & Inclusion
WCAG AA: contraste 4.5:1, foco visible, teclado, áreas táctiles de 44 px, `prefers-reduced-motion` respetado en todo (parallax, smooth scroll, entradas).
