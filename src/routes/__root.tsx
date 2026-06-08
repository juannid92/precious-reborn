import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import "@fontsource/fraunces/300.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/300-italic.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import inter400 from "@fontsource/inter/files/inter-latin-400-normal.woff2?url";
import fraunces400 from "@fontsource/fraunces/files/fraunces-latin-400-normal.woff2?url";
import cormorant300italic from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2?url";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Atmosphere } from "@/components/motion/Atmosphere";
import { brand } from "@/content/site";
import { ConsentProvider } from "@/lib/cookie-consent/ConsentProvider";
import { CookieBanner } from "@/components/cookie/CookieBanner";
import { CookiePreferencesModal } from "@/components/cookie/CookiePreferencesModal";
import { GoogleAnalyticsGate } from "@/components/cookie/GoogleAnalyticsGate";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { httpEquiv: "content-language", content: "it-IT" },
      { title: `${brand.name} — Laboratorio orafo a Bari` },
      { name: "description", content: brand.shortDescription },
      { name: "author", content: "Nicola Caradonna — Cara Preziosi" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "theme-color", content: "#c9a84c" },
      { name: "geo.region", content: "IT-BA" },
      { name: "geo.placename", content: "Bari, Puglia, Italia" },
      { name: "ICBM", content: "41.1177, 16.8512" },
      { property: "og:site_name", content: brand.name },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${brand.name} — Laboratorio orafo a Bari` },
      { property: "og:description", content: brand.shortDescription },
      { property: "og:image", content: "https://www.carapreziosi.it/brand/cara-preziosi-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${brand.name} — Laboratorio orafo a Bari` },
      { name: "twitter:description", content: brand.shortDescription },
      { name: "twitter:image", content: "https://www.carapreziosi.it/brand/cara-preziosi-logo.png" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", href: "/favicon-192.png", sizes: "192x192" },
      { rel: "icon", type: "image/png", href: "/favicon-512.png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      {
        rel: "preload",
        as: "font",
        href: inter400,
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        href: fraunces400,
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        href: cormorant300italic,
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://www.carapreziosi.it/#website",
              name: "Cara Preziosi",
              url: "https://www.carapreziosi.it/",
              inLanguage: "it-IT",
              publisher: { "@id": "https://www.carapreziosi.it/#business" },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.carapreziosi.it/cerca?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "JewelryStore",
              "@id": "https://www.carapreziosi.it/#business",
              additionalType: "https://schema.org/LocalBusiness",
              name: "Cara Preziosi",
              description:
                "Cara Preziosi è un atelier orafo artigianale a Bari specializzato in gioielli su misura, restauro e manutenzione professionale.",
              url: "https://www.carapreziosi.it/",
              image:
                "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0229c937-7c28-4ea0-8257-25c6ab4e4415/id-preview-990a0072--8f416fe5-a54e-4f07-a4e6-84f14f7f4dd2.lovable.app-1779116023030.png",
              telephone: "+39 393 953 6607",
              email: "info@carapreziosi.it",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via Antonio Beatillo 14",
                addressLocality: "Bari",
                postalCode: "70121",
                addressRegion: "BA",
                addressCountry: "IT",
              },
              vatID: "IT08895310723",
              areaServed: ["Bari", "Puglia", "Italia"],
              openingHours: "Mo-Sa 08:30-19:00",
              founder: { "@id": "https://www.carapreziosi.it/#nicola-caradonna" },
              priceRange: "€€€",
              currenciesAccepted: "EUR",
              paymentAccepted: "Cash, Credit Card, Bank Transfer",
              sameAs: [
                "https://www.instagram.com/carapreziosi",
                "https://www.facebook.com/carapreziosi",
              ],
            },
            {
              "@type": "Person",
              "@id": "https://www.carapreziosi.it/#nicola-caradonna",
              name: "Nicola Caradonna",
              jobTitle: "Maestro orafo",
              description:
                "Nicola Caradonna è un maestro orafo attivo a Bari da oltre 40 anni, specializzato nella creazione artigianale di gioielli unici su misura.",
              worksFor: { "@id": "https://www.carapreziosi.it/#business" },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
        <meta name="apple-mobile-web-app-title" content="Cara Preziosi" />
        
        
      </head>
      <body className="antialiased selection:bg-gold selection:text-ink">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ConsentProvider>
        <SmoothScroll />
        <Atmosphere />
        <div className="relative z-[1] flex min-h-screen flex-col text-foreground">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <GoogleAnalyticsGate />
        <CookieBanner />
        <CookiePreferencesModal />
      </ConsentProvider>
    </QueryClientProvider>

  );
}
