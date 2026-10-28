import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { WhatsAppFlotante } from "@/components/layout/whatsapp-flotante"
import { MotionProvider } from "@/components/providers/motion-provider"
import { SmoothScroll } from "@/components/providers/smooth-scroll"
import { agenteJsonLd } from "@/lib/json-ld"
import { site } from "@/lib/site"
import "./globals.css"

// Fontshare (ITF Free Font License), servidas desde el proyecto.
const zodiak = localFont({
  src: "./fonts/zodiak-400.woff2",
  weight: "400",
  variable: "--font-zodiak",
  display: "swap",
})

const switzer = localFont({
  src: [
    { path: "./fonts/switzer-400.woff2", weight: "400" },
    { path: "./fonts/switzer-500.woff2", weight: "500" },
    { path: "./fonts/switzer-600.woff2", weight: "600" },
  ],
  variable: "--font-switzer",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Valentino Pugni · Casas en La Plata y City Bell",
    template: "%s · Valentino Pugni",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: `${site.name} · ${site.brand}`,
  },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: "#f1f1ee",
  colorScheme: "light",
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
}

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${zodiak.variable} ${switzer.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only z-[110] bg-tinta px-4 py-3 text-suelo focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(agenteJsonLd()) }}
        />
        <MotionProvider>
          <SmoothScroll>
            <ScrollProgress />
            <Navbar />
            {children}
            <Footer />
            <WhatsAppFlotante />
            {modal}
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  )
}
