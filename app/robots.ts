import type { MetadataRoute } from "next"
import { site } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    // Sin dominio propio todavía hay datos de ejemplo y [COMPLETAR]: que Google no lo indexe.
    rules: process.env.NEXT_PUBLIC_SITE_URL ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
