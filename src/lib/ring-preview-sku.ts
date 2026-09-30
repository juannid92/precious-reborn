/**
 * Anteprime fotografiche Nivoda per OGNI combinazione del Ring Studio.
 *
 * Nivoda genera la fotografia di un anello a partire da uno SKU (codice
 * produttore) calcolato dal configuratore con una codifica a base 35. Qui
 * replichiamo quel calcolo: per ogni scelta del cliente (forma della pietra,
 * carato, testa, gambo, peek-a-boo, incastonatura, decorazione, metallo e
 * colori di testa/gambo) otteniamo l'immagine reale corrispondente, in tre
 * viste, senza tabelle da mantenere né filtri colore.
 *
 * Le regole di disponibilità (opzioni non combinabili) sono le stesse del
 * Ring Studio di Nivoda.
 */

export type RingPreviewInput = {
  headType: string | null;
  headStoneType?: string | null;
  shankType: string | null;
  peekaboo?: string | null;
  sideSetting: string | null;
  sideStoneLength?: string | null;
  carvingType: string | null;
  carvingLength?: string | null;
  metalType: string | null;
  metalQuality: string | null;
  headMetalColor: string | null;
  shankMetalColor: string | null;
};

export type RingPreviewImages = {
  sku: string;
  down: string;
  front: string;
  side: string;
};

// Contributo di ogni scelta al codice SKU (ricavato dal Ring Studio).
const D = {
  "shape": {
    "ROUND": 0,
    "OVAL": 15,
    "CUSHION": 10,
    "PRINCESS": 5,
    "PEAR": 25,
    "EMERALD": 20,
    "MARQUISE": 30,
    "RADIANT": 35
  },
  "head": {
    "FOUR_PRONGS": 0,
    "BASKET": 25920,
    "PEG_HEAD": 51840,
    "PAVE": 77760,
    "SINGLE_HALO": 103680,
    "DOUBLE_HALO": 129600,
    "CROWN": 155520,
    "FLOWER_HALO": 285120
  },
  "mount": {
    "SINGLE": 0,
    "DOUBLE": 388800,
    "DOUBLE_TWIST": 777600,
    "KNIFE_EDGE": 1166400,
    "SQUARE_EDGE": 1555200,
    "TAPERED": 1944000,
    "CONTEMPORARY": 2332800,
    "HIDDEN_HALO": 2721600,
    "SPLIT": 3110400
  },
  "peek": {
    "NONE": 0,
    "ROUND_DIAMOND": 5443200,
    "PRINCESS_DIAMOND": 10886400
  },
  "side": {
    "NONE": 0,
    "U_PAVE": 163296000,
    "CHANNEL": 81648000,
    "PRONG": 326592000,
    "BEAD": 244944000,
    "PAVE": 408240000
  },
  "carving": {
    "PLAIN": 0,
    "LEAF": 5878656000,
    "SCROLL": 11757312000
  },
  "hcol": {
    "YELLOW_GOLD": 0,
    "WHITE_GOLD": -88179840000,
    "ROSE_GOLD": 88179840000
  },
  "mcol": {
    "YELLOW_GOLD": 0,
    "WHITE_GOLD": -264539520000,
    "ROSE_GOLD": 264539520000
  },
  "qual": {
    "KT_9": 0,
    "KT_14": 35271936000,
    "KT_18": 52907904000
  },
  "size": {
    "1": 0,
    "2": 240,
    "3": 480,
    "4": 600,
    "5": 720,
    "6": 840,
    "7": 960,
    "8": 1080,
    "9": 1200,
    "10": 1320,
    "0.25": -480,
    "0.33": -360,
    "0.5": -240,
    "0.75": -120,
    "1.5": 120,
    "2.5": 360
  },
  "len3q": 489888000,
  "clen3q": 793618560000,
  "hsSA": 17280,
  "hsBD": 8640,
  "ctNat": -40,
  "pt": -282175488000
} as const;

const BASE_N1 = 352719360561; // anello di partenza: tondo 1ct, 4 griffe, singolo, oro giallo 9kt
const BASE_N2 = 17637365;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
const IMAGE_BASE = "https://image25.thepersonalizedbest.com/image/api_image61";

const encode = (n: number): string => {
  if (n === 0) return "A";
  let out = "";
  let v = n;
  while (v > 0) {
    out = ALPHABET[v % 35] + out;
    v = Math.floor(v / 35);
  }
  return out;
};

const up = (v: string | null | undefined) => (v ?? "").toString().trim().toUpperCase();

export const RING_SHAPES = [
  "ROUND", "OVAL", "CUSHION", "PRINCESS", "PEAR", "EMERALD", "MARQUISE", "RADIANT",
] as const;

const SHAPE_ALIAS: Record<string, string> = {
  ASSCHER: "EMERALD",
  "EMERALD-CUT": "EMERALD",
  BRILLIANT: "ROUND",
  ROTONDO: "ROUND",
  OVALE: "OVAL",
  CUSCINO: "CUSHION",
  PERA: "PEAR",
  SMERALDO: "EMERALD",
  NAVETTE: "MARQUISE",
};

/** Forma della pietra supportata da Nivoda, o null se non rappresentabile. */
export function nivodaShape(shape: string | null | undefined): string | null {
  const s = up(shape).replace(/\s+/g, "");
  const v = SHAPE_ALIAS[s] ?? s;
  return (RING_SHAPES as readonly string[]).includes(v) ? v : null;
}

const SIZES = ["0.25", "0.33", "0.5", "0.75", "1", "1.5", "2", "2.5", "3", "4", "5", "6", "7", "8", "9", "10"];

/** Misura del catalogo Nivoda più vicina al carato della pietra. */
export function nivodaSize(carats: number | null | undefined): string {
  const c = Number(carats);
  if (!Number.isFinite(c) || c <= 0) return "1";
  let best = SIZES[0];
  for (const s of SIZES) if (Math.abs(Number(s) - c) < Math.abs(Number(best) - c)) best = s;
  return best;
}

// ---------------------------------------------------------------- regole
export const HEADS_ORDER = ["FOUR_PRONGS", "BASKET", "PEG_HEAD", "PAVE", "SINGLE_HALO", "DOUBLE_HALO", "CROWN", "FLOWER_HALO"];
export const SHANKS_ORDER = ["SINGLE", "DOUBLE", "DOUBLE_TWIST", "KNIFE_EDGE", "SQUARE_EDGE", "TAPERED", "CONTEMPORARY", "HIDDEN_HALO", "SPLIT"];
export const SIDES_ORDER = ["NONE", "U_PAVE", "CHANNEL", "PRONG", "BEAD", "PAVE"];
const PLAIN_HEADS = ["FOUR_PRONGS", "BASKET", "PEG_HEAD"];

/** Il doppio halo non esiste da 1,5 ct in su. */
export function isHeadDisabled(head: string, carats?: number | null): boolean {
  return up(head) === "DOUBLE_HALO" && Number(nivodaSize(carats)) >= 1.5;
}

export function isShankDisabled(shank: string, head: string): boolean {
  return up(shank) === "HIDDEN_HALO" && ["PEG_HEAD", "BASKET", "DOUBLE_HALO"].includes(up(head));
}

export function isSideDisabled(side: string, shank: string): boolean {
  const s = up(side);
  const m = up(shank);
  if (s === "PAVE" && ["DOUBLE", "DOUBLE_TWIST", "CONTEMPORARY", "SPLIT"].includes(m)) return true;
  if (m === "KNIFE_EDGE" && (s === "CHANNEL" || s === "PRONG")) return true;
  if (m === "SPLIT" && s === "CHANNEL") return true;
  if (m === "CONTEMPORARY" && s === "NONE") return true;
  return false;
}

export const isPeekabooAvailable = (shank: string) => ["SINGLE", "DOUBLE"].includes(up(shank));
export const hasHeadStones = (head: string) => !PLAIN_HEADS.includes(up(head));
export const isCarvingAvailable = (shank: string, side: string) =>
  up(shank) !== "KNIFE_EDGE" && !["U_PAVE", "PRONG", "PAVE"].includes(up(side));

const low = (v: string) => v.toLowerCase();
const firstEnabled = (list: string[], disabled: (v: string) => boolean, fallback: string) =>
  list.find((v) => !disabled(v)) ?? fallback;

type NormalizableConfig = RingPreviewInput & {
  sideStoneType?: string | null;
  [key: string]: unknown;
};

/**
 * Applica al configuratore le stesse regole di Nivoda: se una scelta non è
 * più compatibile con le altre, viene sostituita con la prima disponibile.
 */
export function normalizeRingConfig<T extends NormalizableConfig>(config: T, carats?: number | null): T {
  const c: NormalizableConfig = { ...config };
  let head = up(c.headType) || "FOUR_PRONGS";
  if (isHeadDisabled(head, carats)) head = firstEnabled(HEADS_ORDER, (v) => isHeadDisabled(v, carats), "FOUR_PRONGS");
  c.headType = low(head);
  if (!hasHeadStones(head)) c.headStoneType = null;
  else if (!c.headStoneType) c.headStoneType = "diamonds";

  let shank = up(c.shankType) || "SINGLE";
  if (isShankDisabled(shank, head)) shank = firstEnabled(SHANKS_ORDER, (v) => isShankDisabled(v, head), "SINGLE");
  c.shankType = low(shank);

  if (!isPeekabooAvailable(shank)) c.peekaboo = "none";
  else if (!c.peekaboo) c.peekaboo = "none";

  let side = up(c.sideSetting) || "NONE";
  if (isSideDisabled(side, shank)) side = firstEnabled(SIDES_ORDER, (v) => isSideDisabled(v, shank), "NONE");
  c.sideSetting = low(side);
  if (side === "NONE") {
    c.sideStoneType = null;
    c.sideStoneLength = null;
  } else {
    c.sideStoneType = c.sideStoneType || "lab_diamond";
    c.sideStoneLength = c.sideStoneLength || "half";
  }

  if (!isCarvingAvailable(shank, side)) c.carvingType = "plain";
  else if (!c.carvingType) c.carvingType = "plain";
  return c as T;
}

// ------------------------------------------------------------------ SKU
export function ringPreviewSku(
  input: RingPreviewInput,
  opts: { shape: string | null | undefined; carats?: number | null; natural?: boolean },
): string | null {
  const shape = nivodaShape(opts.shape);
  if (!shape) return null;
  const c = normalizeRingConfig(input as NormalizableConfig, opts.carats);

  const head = up(c.headType);
  const shank = up(c.shankType);
  const side = up(c.sideSetting);
  const carving = isCarvingAvailable(shank, side) ? up(c.carvingType) || "PLAIN" : "PLAIN";
  const platinum = up(c.metalType).includes("PLATIN");

  let n = BASE_N1;
  n += D.shape[shape as keyof typeof D.shape] ?? 0;
  n += D.size[nivodaSize(opts.carats) as keyof typeof D.size] ?? 0;
  n += D.head[head as keyof typeof D.head] ?? 0;
  n += D.mount[shank as keyof typeof D.mount] ?? 0;
  n += D.peek[(up(c.peekaboo) || "NONE") as keyof typeof D.peek] ?? 0;
  n += D.side[side as keyof typeof D.side] ?? 0;
  n += D.carving[carving as keyof typeof D.carving] ?? 0;
  if (opts.natural) n += D.ctNat;

  if (hasHeadStones(head)) {
    const hs = up(c.headStoneType);
    if (hs === "SAPPHIRE") n += D.hsSA;
    else if (hs === "BLACK_DIAMONDS") n += D.hsBD;
  }

  const sideLen = side !== "NONE" && up(c.sideStoneLength) === "THREE_QUARTERS";
  if (sideLen) n += D.len3q;
  if (carving !== "PLAIN") {
    if (up(c.carvingLength) === "THREE_QUARTERS") n += D.clen3q;
  } else if (sideLen) {
    n += D.clen3q;
  }

  if (platinum) {
    n += D.pt;
  } else {
    const q = up(c.metalQuality) as keyof typeof D.qual;
    n += D.qual[q] ?? 0;
    n += D.hcol[(up(c.headMetalColor) || "YELLOW_GOLD") as keyof typeof D.hcol] ?? 0;
    n += D.mcol[(up(c.shankMetalColor) || "YELLOW_GOLD") as keyof typeof D.mcol] ?? 0;
  }
  return `6${encode(n)}0${encode(BASE_N2)}`;
}

/** Le tre fotografie Nivoda (frontale, dall'alto, laterale) della configurazione. */
export function ringPreviewImages(
  input: RingPreviewInput,
  opts: { shape: string | null | undefined; carats?: number | null; natural?: boolean },
): RingPreviewImages | null {
  const sku = ringPreviewSku(input, opts);
  if (!sku) return null;
  const url = (v: number) => `${IMAGE_BASE}/${sku}.jpg?v=${v}`;
  return { sku, down: url(1), front: url(2), side: url(3) };
}
