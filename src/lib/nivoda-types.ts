/**
 * Tipi condivisi (client-safe) del catalogo pietre Nivoda.
 * I campi rispecchiano esattamente la risposta della edge function
 * "nivoda-diamonds": nessun campo inventato, nessun dato economico.
 */

export type NivodaDiamond = {
  diamondId: string | null;
  image: string | null;
  video: string | null;
  available: boolean;
  shape: string | null;
  shapeLabel: string | null;
  fullShape: string | null;
  carats: number | null;
  caratsLabel: string | null;
  color: string | null;
  clarity: string | null;
  cut: string | null;
  cutLabel: string | null;
  polish: string | null;
  polishLabel: string | null;
  symmetry: string | null;
  symmetryLabel: string | null;
  fluorescence: string | null;
  fluorescenceColor: string | null;
  measurements: string | null;
  ratio: string | null;
  tablePct: string | null;
  depthPct: string | null;
  crownAngle: string | null;
  pavAngle: string | null;
  girdle: string | null;
  culet: string | null;
  eyeClean: string | null;
  luster: string | null;
  shade: string | null;
  bowtie: string | null;
  origin: string | null;
  cutStyle: string | null;
  treated: string | null;
  natural: string | null;
  lab: string | null;
  certNumber: string | null;
  certPdf: string | null;
  title: string | null;
  description: string | null;
};


/** Solo ordinamenti per carati: nessun ordinamento economico. */
export type NivodaSort = "carat_asc" | "carat_desc";

export type NivodaSearchInput = {
  shapes?: string[];
  color?: string[];
  clarity?: string[];
  cut?: string[];
  caratFrom?: number;
  caratTo?: number;
  sort?: NivodaSort;
  page?: number;
  pageSize?: number;
};

export type NivodaSearchResult = { items: NivodaDiamond[]; hasMore: boolean };

export const SHAPE_OPTIONS = [
  { value: "ROUND", label: "Rotondo brillante" },
  { value: "OVAL", label: "Ovale" },
  { value: "PRINCESS", label: "Principessa" },
  { value: "EMERALD", label: "Smeraldo" },
  { value: "PEAR", label: "Goccia" },
  { value: "CUSHION", label: "Cushion" },
  { value: "MARQUISE", label: "Marquise" },
  { value: "RADIANT", label: "Radiant" },
  { value: "ASSCHER", label: "Asscher" },
  { value: "HEART", label: "Cuore" },
] as const;

export const SHAPE_LABELS: Record<string, string> = Object.fromEntries(
  SHAPE_OPTIONS.map((s) => [s.value, s.label]),
);

export const COLORS = ["D", "E", "F", "G", "H", "I", "J"] as const;
export const CLARITIES = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1"] as const;

/** Qualità di taglio (enum Nivoda). */
export const CUT_OPTIONS = [
  { value: "ID", label: "Ideale" },
  { value: "EX", label: "Eccellente" },
  { value: "VG", label: "Molto buono" },
  { value: "GD", label: "Buono" },
] as const;

/**
 * Selezione di partenza dell'atelier: solo pietre che vale la pena mostrare.
 * Tagli ideali/eccellenti, colore alto, purezza occhio-pulito.
 */
export const CURATED_CUT = ["ID", "EX"];
export const CURATED_COLORS = ["D", "E", "F", "G"];
export const CURATED_CLARITIES = ["IF", "VVS1", "VVS2", "VS1", "VS2"];
export const CURATED_CARAT_FROM = 0.5;
export const CURATED_CARAT_TO = 3;

export const CARAT_MIN = 0.3;
export const CARAT_MAX = 5;
export const PAGE_SIZE = 24;

/** Attesa imposta dal fornitore fra due ricerche consecutive (secondi). */
export const SEARCH_COOLDOWN_SECONDS = 30;

export function formatCarats(value: number | null): string {
  if (value == null) return "—";
  return `${new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ct`;
}

/** Chiave di storage della pietra scelta, condivisa col configuratore. */
export const SELECTED_STONE_KEY = "cara.pietraScelta";
