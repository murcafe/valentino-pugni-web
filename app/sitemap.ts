import type { MetadataRoute } from "next"
import { getPropiedades } from "@/lib/propiedades"
import { site } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const propiedades = await getPropiedades()
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/propiedades`, changeFrequency: "daily", priority: 0.9 },
    // Las propiedades de ejemplo no se indexan.
    ...propiedades
      .filter((p) => !p.ejemplo)
      .map((p) => ({ url: `${site.url}/propiedades/${p.slug}`, lastModified: p.publicadaEl, priority: 0.8 })),
  ]
}
