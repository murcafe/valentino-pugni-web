# Valentino Pugni · sitio web

Sitio personal de Valentino Pugni, asesor inmobiliario de Estudio Gibert en La Plata y City Bell.
Next.js 16 (App Router), Tailwind 4, Motion y Lenis.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
npm test
npm run build
```

## Dónde se cambian los datos

- **Contacto, oficina y matrícula:** `lib/site.ts`
- **Propiedades:** `data/propiedades.ts`. Hoy son todas de ejemplo (`ejemplo: true`) y se muestran con esa etiqueta.
  Las fotos van en `public/images/ejemplos/` (créditos en `CREDITOS.txt`).
- **Vista 360°:** campo `tour360` de cada propiedad, con una foto equirectangular 2:1 (cámara 360 o modo panorámica 360 del celular).
- **Datos extremos para probar el diseño (solo en desarrollo):** correr el dev server con la variable de entorno `DATOS=peor` (también `vacio` o `una`).

## Antes de publicar: [COMPLETAR]

Buscá `[COMPLETAR]` en el código. Falta:

- Logo en SVG y foto de Valentino
- Número de matrícula y colegio
- Localidad, coordenadas exactas y horario de la oficina
- Dominio definitivo (`NEXT_PUBLIC_SITE_URL`)
- Aprobar el texto de "Sobre mí"
- Propiedades reales con sus fotos (y fotos 360 si hay)
- Testimonios reales: la sección queda oculta hasta tenerlos
