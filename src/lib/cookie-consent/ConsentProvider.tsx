import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
};

export type ConsentRecord = {
  consent: ConsentState;
  /** ISO date in cui è stata espressa la scelta */
  timestamp: string;
  /** Versione della configurazione cookie corrente */
  version: number;
};

/**
 * Versione corrente del set di cookie/servizi.
 * Incrementare quando si aggiungono/cambiano servizi → riappare il banner.
 */
export const CONSENT_VERSION = 1;

/** Durata massima del consenso (in giorni) prima di richiederlo nuovamente. */
export const CONSENT_MAX_AGE_DAYS = 180;

const STORAGE_KEY = "cara_cookie_consent_v1";
const OPEN_EVENT = "cara:open-cookie-preferences";

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
};

interface ConsentContextValue {
  /** Stato corrente del consenso (default: solo tecnici) */
  consent: ConsentState;
  /** true se l'utente ha già espresso una scelta valida */
  hasDecided: boolean;
  /** Mostra il banner principale */
  showBanner: boolean;
  /** Mostra la modal di personalizzazione */
  showPreferences: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (next: Partial<ConsentState>) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  /** Riapre il banner — usato dal link "Rivedi preferenze cookie" */
  reopenBanner: () => void;
  /** Chiusura banner con X = mantiene solo i tecnici, senza salvare consenso */
  dismissBanner: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

function isExpired(record: ConsentRecord): boolean {
  const then = new Date(record.timestamp).getTime();
  if (!Number.isFinite(then)) return true;
  const ageMs = Date.now() - then;
  return ageMs > CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
}

function readStoredConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.timestamp !== "string" ||
      typeof parsed.version !== "number" ||
      !parsed.consent
    ) {
      return null;
    }
    if (parsed.version !== CONSENT_VERSION) return null;
    if (isExpired(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistConsent(consent: ConsentState) {
  if (typeof window === "undefined") return;
  const record: ConsentRecord = {
    consent: { ...consent, necessary: true },
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* localStorage non disponibile: il banner riapparirà al prossimo accesso */
  }
}

/**
 * Pulizia best-effort dei cookie analytics quando il consenso viene revocato.
 * Non potendo agire sui cookie HttpOnly o cross-domain, eliminiamo i tipici
 * cookie di Google Analytics presenti su questo dominio.
 */
function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const domains = new Set<string>([host]);
  const parts = host.split(".");
  if (parts.length > 1) {
    domains.add("." + parts.slice(-2).join("."));
  }
  const names = document.cookie.split(";").map((c) => c.split("=")[0].trim());
  for (const name of names) {
    if (!name) continue;
    if (
      name === "_ga" ||
      name.startsWith("_ga_") ||
      name === "_gid" ||
      name === "_gat" ||
      name.startsWith("_gat_")
    ) {
      for (const d of domains) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
      }
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
  // Segnala a gtag che le storage analytics sono negate.
  type WindowWithGtag = Window & {
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  };
  const w = window as unknown as WindowWithGtag;
  try {
    w.gtag?.("consent", "update", { analytics_storage: "denied" });
  } catch {
    /* noop */
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [hasDecided, setHasDecided] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Idratazione dal localStorage al mount (client-only)
  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setConsent({ ...stored.consent, necessary: true });
      setHasDecided(true);
      setShowBanner(false);
    } else {
      setHasDecided(false);
      setShowBanner(true);
    }
  }, []);

  // Listener globale per aprire le preferenze da qualunque punto del sito
  useEffect(() => {
    const handler = () => {
      setShowPreferences(true);
    };
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  const acceptAll = useCallback(() => {
    const next: ConsentState = { necessary: true, analytics: true };
    setConsent(next);
    persistConsent(next);
    setHasDecided(true);
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const rejectAll = useCallback(() => {
    const next: ConsentState = { necessary: true, analytics: false };
    setConsent(next);
    persistConsent(next);
    setHasDecided(true);
    setShowBanner(false);
    setShowPreferences(false);
    clearAnalyticsCookies();
  }, []);

  const savePreferences = useCallback(
    (partial: Partial<ConsentState>) => {
      const next: ConsentState = {
        necessary: true,
        analytics: partial.analytics ?? consent.analytics,
      };
      const wasOn = consent.analytics;
      setConsent(next);
      persistConsent(next);
      setHasDecided(true);
      setShowBanner(false);
      setShowPreferences(false);
      if (wasOn && !next.analytics) clearAnalyticsCookies();
    },
    [consent.analytics],
  );

  const openPreferences = useCallback(() => setShowPreferences(true), []);
  const closePreferences = useCallback(() => setShowPreferences(false), []);

  const reopenBanner = useCallback(() => {
    setShowPreferences(false);
    setShowBanner(true);
  }, []);

  const dismissBanner = useCallback(() => {
    // Chiusura con X: NON salva alcun consenso, restano solo i tecnici.
    setShowBanner(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      hasDecided,
      showBanner,
      showPreferences,
      acceptAll,
      rejectAll,
      savePreferences,
      openPreferences,
      closePreferences,
      reopenBanner,
      dismissBanner,
    }),
    [
      consent,
      hasDecided,
      showBanner,
      showPreferences,
      acceptAll,
      rejectAll,
      savePreferences,
      openPreferences,
      closePreferences,
      reopenBanner,
      dismissBanner,
    ],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent deve essere usato dentro <ConsentProvider>");
  }
  return ctx;
}

/** Utility per aprire le preferenze cookie da qualunque punto (anche fuori React). */
export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}
