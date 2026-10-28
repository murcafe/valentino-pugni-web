/**
 * Mapa de la zona con OpenStreetMap (sin API key, sin cookies de terceros).
 * Muestra el área aproximada, nunca la dirección exacta.
 */
export function MapaZona({ lat, lng, zona }: { lat: number; lng: number; zona: string }) {
  const dLat = 0.009
  const dLng = 0.014
  const bbox = [lng - dLng, lat - dLat, lng + dLng, lat + dLat].map((n) => n.toFixed(5)).join(",")
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik`

  return (
    <figure>
      <div className="relative aspect-[16/10] overflow-hidden bg-plinto sm:aspect-[16/8]">
        <iframe
          title={`Mapa de la zona de ${zona}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full grayscale-[0.85] contrast-[1.05]"
        />
        {/* Área aproximada */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bordo/20"
        />
      </div>
      <figcaption className="mt-3 text-chico">
        Ubicación aproximada en {zona}. La dirección exacta te la paso cuando coordinemos la visita. Mapa ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          OpenStreetMap
        </a>
        .
      </figcaption>
    </figure>
  )
}
