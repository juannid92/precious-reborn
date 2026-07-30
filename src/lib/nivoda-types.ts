/**
 * Tipi condivisi (client-safe) del catalogo diamanti Nivoda.
 * I campi rispecchiano esattamente la risposta della edge function
 * "nivoda-diamonds": nessun campo inventato.
 */

export type NivodaDiamond = {
  diamondId: string | null;
  priceEur: number;
  image: string | null;
  video: string | null;
  available: boolean;
  shape: string | null;
  carats: number | null;
  color: string | null;
  clarity: string | null;
  cut: string | null;
  cutLabel: string | null;
  polish: string | null;
  symmetry: string | null;
  fluorescence: string | null;
  lab: string | null;
  certNumber: string | null;
  certPdf: string | null;
};

export type NivodaSort = "price_asc" | "price_desc" | "carat_desc";

export type NivodaSearchInput = {
  shapes?: string[];
  color?: string[];
  clarity?: string[];
  cut?: string[];
  labs?: string[];
  caratFrom?: number;
  caratTo?: number;
  priceFrom?: number;
  priceTo?: number;
  sort?: NivodaSort;
  page?: number;
  pageSize?: number;
};

export type NivodaSearchResult = { items: NivodaDiamond[]; hasMore: boolean };

export const SHAPES = [
  "ROUND",
  "OVAL",
  "PRINCESS",
  "EMERALD",
  "PEAR",
  "CUSHION",
  "MARQUISE",
  "RADIANT",
  "ASSCHER",
  "HEART",
] as const;

export const SHAPE_LABELS: Record<string, string> = {
  ROUND: "Tondo",
  OVAL: "Ovale",
  PRINCESS: "Princess",
  EMERALD: "Smeraldo",
  PEAR: "Goccia",
  CUSHION: "Cuscino",
  MARQUISE: "Marquise",
  RADIANT: "Radiant",
  ASSCHER: "Asscher",
  HEART: "Cuore",
};

export const COLORS = ["D", "E", "F", "G", "H", "I", "J"] as const;
export const CLARITIES = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1"] as const;
export const CUTS = [
  { value: "EX", label: "Eccellente" },
  { value: "VG", label: "Molto buono" },
  { value: "GD", label: "Buono" },
] as const;
export const LABS = ["GIA", "IGI", "HRD"] as const;

export const CARAT_MIN = 0.3;
export const CARAT_MAX = 5;
export const PRICE_MIN = 0;
export const PRICE_MAX = 50000;
export const PAGE_SIZE = 24;

export function formatEur(value: number): string {
  return `${new Intl.NumberFormat("it-IT").format(Math.round(value))} €`;
}

export function formatCarats(value: number | null): string {
  if (value == null) return "—";
  return `${new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ct`;
}

/** Chiave di storage della pietra scelta, condivisa col configuratore. */
export const SELECTED_STONE_KEY = "cara.pietraScelta";
