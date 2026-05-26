import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useConsent } from "@/lib/cookie-consent/ConsentProvider";

export function CookiePreferencesModal() {
  const {
    showPreferences,
    closePreferences,
    consent,
    acceptAll,
    rejectAll,
    savePreferences,
  } = useConsent();

  const [analyticsChecked, setAnalyticsChecked] = useState<boolean>(consent.analytics);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (showPreferences) {
      setAnalyticsChecked(consent.analytics);
    }
  }, [showPreferences, consent.analytics]);

  // Focus management + lock scroll + ESC
  useEffect(() => {
    if (!showPreferences) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePreferences();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [showPreferences, closePreferences]);

  if (!showPreferences) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end justify-center bg-ink/70 px-4 py-6 backdrop-blur-sm sm:items-center sm:py-12"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePreferences();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-prefs-title"
        aria-describedby="cookie-prefs-desc"
        className="relative w-full max-w-2xl rounded-2xl bg-bone text-ink shadow-2xl"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={closePreferences}
          aria-label="Chiudi preferenze cookie"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <span aria-hidden="true" className="text-lg leading-none">×</span>
        </button>

        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
          <h2
            id="cookie-prefs-title"
            className="font-display text-2xl text-ink sm:text-3xl"
          >
            Preferenze cookie
          </h2>
          <p id="cookie-prefs-desc" className="mt-3 text-sm leading-relaxed text-ink/75">
            Scegli quali categorie di cookie autorizzare. I cookie tecnici sono
            necessari al funzionamento del sito e restano sempre attivi. Per i
            dettagli consulta la{" "}
            <Link to="/cookie-policy" className="underline-gold">
              Cookie Policy
            </Link>{" "}
            e la{" "}
            <Link to="/privacy-policy" className="underline-gold">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-6 space-y-4">
            <section className="rounded-xl border border-ink/10 bg-white/60 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-medium text-ink">
                    Tecnici necessari
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">
                    Necessari al funzionamento del sito e sempre attivi.
                  </p>
                </div>
                <span
                  aria-label="Sempre attivi"
                  className="inline-flex shrink-0 items-center rounded-full bg-ink/10 px-3 py-1 text-xs font-medium text-ink"
                >
                  Sempre ON
                </span>
              </div>
            </section>

            <section className="rounded-xl border border-ink/10 bg-white/60 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-medium text-ink">
                    Statistici / Analytics
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">
                    Utilizzati solo con il tuo consenso per raccogliere statistiche
                    sull'uso del sito tramite Google Analytics.
                  </p>
                </div>
                <label className="inline-flex shrink-0 cursor-pointer items-center gap-2">
                  <span className="sr-only">Abilita cookie statistici / Analytics</span>
                  <span className="relative inline-block h-6 w-11">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={analyticsChecked}
                      onChange={(e) => setAnalyticsChecked(e.target.checked)}
                      aria-label="Cookie statistici Analytics"
                    />
                    <span className="absolute inset-0 rounded-full bg-ink/20 transition-colors peer-checked:bg-gold peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2" />
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-bone shadow transition-transform peer-checked:translate-x-5" />
                  </span>
                </label>
              </div>
            </section>
          </div>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <button
              type="button"
              onClick={rejectAll}
              className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-ink/30 bg-transparent px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Rifiuta
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-ink/30 bg-transparent px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Accetta
            </button>
            <button
              type="button"
              onClick={() => savePreferences({ analytics: analyticsChecked })}
              className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              Salva preferenze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
