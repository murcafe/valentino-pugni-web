import { site } from "@/lib/site"

/** RealEstateAgent (schema.org). Solo datos confirmados; lo pendiente queda afuera. */
export function agenteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: `${site.name} · ${site.brand}`,
    description: site.description,
    url: site.url,
    telephone: site.contacto.whatsappVisible,
    email: site.contacto.email,
    areaServed: site.zonas.map((z) => ({ "@type": "City", name: z })),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.oficina.calle,
      addressLocality: site.oficina.localidad,
      addressRegion: site.oficina.provincia,
      addressCountry: "AR",
    },
    parentOrganization: { "@type": "RealEstateAgent", name: site.brand },
    sameAs: [`https://instagram.com/${site.contacto.instagram}`],
  }
}
