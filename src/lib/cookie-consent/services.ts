/**
 * Configurazione centralizzata dei servizi di terze parti.
 * Per aggiungere un nuovo servizio basta estendere questo array e
 * (se necessario) creare un Gate che ascolti `useConsent()`.
 */

export type ConsentCategory = "necessary" | "analytics";

export interface ServiceConfig {
  name: string;
  provider: string;
  purpose: string;
  category: ConsentCategory;
  requiresConsent: boolean;
  defaultEnabled: boolean;
}

export const SERVICES: ServiceConfig[] = [
  {
    name: "Google Analytics",
    provider: "Google",
    category: "analytics",
    requiresConsent: true,
    defaultEnabled: false,
    purpose: "misurazione statistica del traffico e dell'utilizzo del sito",
  },
];

/**
 * Misuration ID di Google Analytics (es. "G-XXXXXXX").
 * Va impostato come variabile d'ambiente VITE_GA_MEASUREMENT_ID.
 * Se mancante, il Gate non carica nulla.
 */
export const GA_MEASUREMENT_ID: string = (
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() ||
  "G-RLXD2KNB2S"
);
