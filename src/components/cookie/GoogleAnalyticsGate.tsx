import { useEffect } from "react";
import { useConsent } from "@/lib/cookie-consent/ConsentProvider";
import { GA_MEASUREMENT_ID } from "@/lib/cookie-consent/services";

type GtagFn = (...args: unknown[]) => void;
type WindowWithGA = Window & {
  dataLayer?: unknown[];
  gtag?: GtagFn;
  [key: `ga-disable-${string}`]: boolean | undefined;
};

/**
 * Carica Google Analytics SOLO dopo consenso esplicito alla categoria
 * "analytics". Se il consenso viene revocato, disabilita ulteriori invii
 * tramite il flag `ga-disable-<ID>` di Google.
 */
export function GoogleAnalyticsGate() {
  const { consent } = useConsent();
  const enabled = consent.analytics;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!GA_MEASUREMENT_ID) return;

    const w = window as unknown as WindowWithGA;
    const disableKey = `ga-disable-${GA_MEASUREMENT_ID}` as const;

    if (!enabled) {
      // Spegne ulteriori invii a GA se gli script erano già stati caricati.
      w[disableKey] = true;
      return;
    }

    // Consenso dato → carica gtag.js una sola volta.
    w[disableKey] = false;
    w.dataLayer = w.dataLayer || [];
    const gtag: GtagFn = function gtag(...args: unknown[]) {
      (w.dataLayer as unknown[]).push(args);
    };
    w.gtag = w.gtag || gtag;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-ga-id="${GA_MEASUREMENT_ID}"]`,
    );
    if (!existing) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      s.setAttribute("data-ga-id", GA_MEASUREMENT_ID);
      document.head.appendChild(s);
    }

    w.gtag("js", new Date());
    w.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    w.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
    });
  }, [enabled]);

  return null;
}
