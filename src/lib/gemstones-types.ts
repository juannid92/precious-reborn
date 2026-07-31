/**
 * Tipi e costanti (client-safe) del catalogo pietre di colore Nivoda.
 * I campi rispecchiano esattamente la risposta della edge function
 * "nivoda-gemstones": nessun campo inventato, nessun dato economico.
 */

export type Gemstone = {
  gemId: string | null;
  image: string | null;
  video: string | null;
  available: boolean;
  gemType: string | null;
  gemLabel: string | null;
  shape: string | null;
  shapeLabel: string | null;
  carats: number | null;
  caratsLabel: string | null;
  color: string | null;
  colorLabel: string | null;
  shadeLabel: string | null;
  colorFull: string | null;
  clarity: string | null;
  clarityLabel: string | null;
  cutLabel: string | null;
  measurements: string | null;
  ratio: string | null;
  tablePct: string | null;
  treatment: string | null;
  treatmentLabel: string | null;
  untreated: boolean;
  origin: string | null;
  pieces: string | null;
  curated: boolean;
  lab: string | null;
  certNumber: string | null;
  certPdf: string | null;
  title: string | null;
  description: string | null;
};

/** Solo ordinamenti per carati: nessun ordinamento economico. */
export type GemSort = "carat_asc" | "carat_desc";

export type GemstoneSearchInput = {
  types?: string[];
  color?: string[];
  shapes?: string[];
  caratFrom?: number;
  caratTo?: number;
  sort?: GemSort;
  page?: number;
  pageSize?: number;
};

export type GemstoneSearchResult = { items: Gemstone[]; hasMore: boolean };

export const GEM_TYPE_OPTIONS = [
  { value: "SAPPHIRE", label: "Zaffiro" },
  { value: "RUBY", label: "Rubino" },
  { value: "EMERALD", label: "Smeraldo" },
  { value: "AQUAMARINE", label: "Acquamarina" },
  { value: "TANZANITE", label: "Tanzanite" },
  { value: "SPINEL", label: "Spinello" },
  { value: "TOURMALINE", label: "Tormalina" },
  { value: "MORGANITE", label: "Morganite" },
  { value: "GARNET", label: "Granato" },
  { value: "AMETHYST", label: "Ametista" },
  { value: "CITRINE", label: "Citrino" },
  { value: "TOPAZ", label: "Topazio" },
  { value: "PERIDOT", label: "Peridoto" },
  { value: "OPAL", label: "Opale" },
  { value: "ALEXANDRITE", label: "Alessandrite" },
] as const;

export const GEM_COLOR_OPTIONS = [
  { value: "BLUE", label: "Blu" },
  { value: "RED", label: "Rosso" },
  { value: "GREEN", label: "Verde" },
  { value: "PINK", label: "Rosa" },
  { value: "YELLOW", label: "Giallo" },
  { value: "ORANGE", label: "Arancio" },
  { value: "PURPLE", label: "Porpora" },
  { value: "VIOLET", label: "Violetto" },
  { value: "TEAL", label: "Verde-azzurro" },
  { value: "PEACH", label: "Pesca" },
  { value: "WHITE", label: "Bianco" },
  { value: "BLACK", label: "Nero" },
  { value: "GRAY", label: "Grigio" },
  { value: "BROWN", label: "Marrone" },
  { value: "MULTI_COLOR", label: "Multicolore" },
] as const;

export const GEM_SHAPE_OPTIONS = [
  { value: "ROUND", label: "Rotonda" },
  { value: "OVAL", label: "Ovale" },
  { value: "CUSHION", label: "Cushion" },
  { value: "PEAR", label: "Goccia" },
  { value: "EMERALD", label: "Smeraldo" },
  { value: "MARQUISE", label: "Marquise" },
  { value: "HEART", label: "Cuore" },
  { value: "PRINCESS", label: "Principessa" },
  { value: "RADIANT", label: "Radiant" },
  { value: "ASSCHER", label: "Asscher" },
  { value: "BAGUETTE", label: "Baguette" },
  { value: "TRILLION", label: "Trilliant" },
  { value: "SQUARE", label: "Quadrata" },
  { value: "RECTANGULAR", label: "Rettangolare" },
  { value: "OCTAGONAL", label: "Ottagonale" },
] as const;

export const GEM_SORT_OPTIONS = [
  { value: "carat_asc", label: "Carati crescenti" },
  { value: "carat_desc", label: "Carati decrescenti" },
] as const;

export const GEM_CARAT_MIN = 0.3;
export const GEM_CARAT_MAX = 20;
export const GEM_PAGE_SIZE = 24;

/** Attesa imposta dal fornitore fra due ricerche consecutive (secondi). */
export const GEM_SEARCH_COOLDOWN_SECONDS = 30;
