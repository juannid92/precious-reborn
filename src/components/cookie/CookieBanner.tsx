import { Link } from "@tanstack/react-router";
import { useConsent } from "@/lib/cookie-consent/ConsentProvider";

export function CookieBanner() {
  const { showBanner, showPreferences, acceptAll, rejectAll, openPreferences } = useConsent();

  if (!showBanner || showPreferences) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[1000] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="container-cara mx-auto max-w-5xl">
        <div className="rounded-2xl border border-bone/10 bg-obsidian/95 text-bone shadow-2xl backdrop-blur-md">
          <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
            <div>
              <h2 id="cookie-banner-title" className="font-display text-xl text-gold sm:text-2xl">
                La tua scelta sui cookie
              </h2>
              <p id="cookie-banner-desc" className="mt-3 text-sm leading-relaxed text-bone/80">
                Usiamo tecnologie necessarie per sicurezza e funzionamento. Google Analytics resta
                disattivato finché non scegli “Accetta”. Puoi rifiutare senza limitazioni o
                personalizzare la scelta. I font sono ospitati localmente e Google Maps non viene
                caricato automaticamente.
              </p>
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-bone/60">
                <Link to="/cookie-policy" className="underline-gold hover:text-gold">
                  Cookie Policy
                </Link>
                <Link to="/privacy-policy" className="underline-gold hover:text-gold">
                  Privacy Policy
                </Link>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:flex-col md:items-stretch">
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex min-w-[150px] items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                Accetta Analytics
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="inline-flex min-w-[150px] items-center justify-center rounded-full bg-bone px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-bone/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                Rifiuta Analytics
              </button>
              <button
                type="button"
                onClick={openPreferences}
                className="inline-flex min-w-[150px] items-center justify-center rounded-full border border-bone/50 bg-transparent px-5 py-2.5 text-sm font-medium tracking-wide text-bone transition-colors hover:bg-bone/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                Personalizza
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
