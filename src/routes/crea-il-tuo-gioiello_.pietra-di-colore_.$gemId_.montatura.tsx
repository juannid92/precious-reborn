import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Gem, Settings, Palette, Ruler, FileText } from "lucide-react";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { RingStudioPreview } from "@/components/atelier/RingStudioPreview";
import { getNivodaGemstone } from "@/lib/gemstones.functions";
import type { Gemstone } from "@/lib/gemstones-types";
import { getMontature, getConfigSito, inviaRichiesta } from "@/lib/montature.functions";
import type { Montatura } from "@/lib/montature.server";

export const Route = createFileRoute(
  "/crea-il-tuo-gioiello_/pietra-di-colore_/$gemId_/montatura",
)({
  validateSearch: ((search: Record<string, unknown>) => ({
    gioiello: typeof search.gioiello === "string" ? search.gioiello : "",
    montatura: typeof search.montatura === "string" ? search.montatura : "",
    metallo: typeof search.metallo === "string" ? search.metallo : "",
    misura: typeof search.misura === "string" ? search.misura : "",
    passo: typeof search.passo === "string" ? search.passo : "1",
    config: typeof search.config === "string" ? search.config : "",
  })) as (search: Record<string, unknown>) => {
    gioiello?: string;
    montatura?: string;
    metallo?: string;
    misura?: string;
    passo?: string;
    config?: string;
  },
  head: () => ({
    meta: [
      { title: "Progetta il tuo gioiello · Cara Preziosi" },
      {
        name: "description",
        content:
          "Scegli la montatura, il metallo e la misura per creare il tuo gioiello personalizzato con il maestro orafo Nicola Caradonna.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: MontaturaGemmaPage,
});

// ─── CONFIGURAZIONE ────────────────────────────────────────────────────────

export type Configurazione = {
  version: 1;
  headType: string | null;
  headStoneType: string | null;
  shankType: string | null;
  peekaboo: string | null;
  sideSetting: string | null;
  sideStoneType: string | null;
  sideStoneLength: string | null;
  carvingType: string | null;
  metalType: string | null;
  metalQuality: string | null;
  headMetalColor: string | null;
  shankMetalColor: string | null;
  engravingText: string;
  ringSizeSystem: string | null;
  ringSize: string | null;
};

export const DEFAULT_CONFIG: Configurazione = {
  version: 1,
  headType: "four_prongs",
  headStoneType: null,
  shankType: "single",
  peekaboo: "none",
  sideSetting: "none",
  sideStoneType: null,
  sideStoneLength: null,
  carvingType: "plain",
  metalType: "gold",
  metalQuality: "KT_18",
  headMetalColor: "yellow_gold",
  shankMetalColor: "yellow_gold",
  engravingText: "",
  ringSizeSystem: "UK",
  ringSize: "",
};

export function parseConfig(raw: string | undefined | null): Configurazione {
  if (!raw) return { ...DEFAULT_CONFIG };
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return { ...DEFAULT_CONFIG, ...parsed } as Configurazione;
    }
    return { ...DEFAULT_CONFIG };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function serializeConfig(config: Configurazione): string {
  return JSON.stringify(config);
}

// ─── COSTANTI UI ───────────────────────────────────────────────────────────

const STEP_LABELS = ["Tipo", "Montatura", "Personalizza", "Materiali", "Riepilogo", "Conferma"];

function capitalize(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CATEGORIE: { valore: string; etichetta: string }[] = [
  { valore: "anello", etichetta: "Anello" },
  { valore: "veretta", etichetta: "Veretta" },
  { valore: "pendente", etichetta: "Pendente" },
  { valore: "orecchini", etichetta: "Orecchini" },
];

// ─── OPZIONI PERSONALIZZAZIONE ─────────────────────────────────────────────

type Opt<T extends string> = { value: T; label: string; image?: string };

const HEAD_TYPE_OPTIONS: Opt<string>[] = [
  { value: "four_prongs", image: "/ring-studio/head-four-prongs.svg", label: "4 griffe" },
  { value: "basket", image: "/ring-studio/head-basket.svg", label: "Cestino" },
  { value: "peg_head", image: "/ring-studio/head-peg-head.svg", label: "Testa a perno" },
  { value: "pave", image: "/ring-studio/head-pave.svg", label: "Pave" },
  { value: "single_halo", image: "/ring-studio/head-single-halo.svg", label: "Halo singolo" },
  { value: "double_halo", image: "/ring-studio/head-double-halo.svg", label: "Doppio halo" },
  { value: "crown", image: "/ring-studio/head-crown.svg", label: "Corona" },
  { value: "flower_halo", image: "/ring-studio/head-flower-halo.svg", label: "Halo a fiore" },
];

const HEAD_TYPES_WITH_STONES = new Set(["pave", "single_halo", "double_halo", "crown", "flower_halo"]);

const HEAD_STONE_OPTIONS: Opt<string>[] = [
  { value: "diamonds", label: "Diamanti" },
  { value: "sapphire", label: "Zaffiri" },
];

const SHANK_TYPE_OPTIONS: Opt<string>[] = [
  { value: "single", image: "/ring-studio/shank-single.svg", label: "Singolo" },
  { value: "double", image: "/ring-studio/shank-double.svg", label: "Doppio" },
  { value: "double_twist", image: "/ring-studio/shank-double-twist.svg", label: "Doppio intreccio" },
  { value: "knife_edge", image: "/ring-studio/shank-knife-edge.svg", label: "Bordo a lama" },
  { value: "square_edge", image: "/ring-studio/shank-square-edge.svg", label: "Bordo squadrato" },
  { value: "tapered", image: "/ring-studio/shank-tapered.svg", label: "Graduato" },
  { value: "contemporary", image: "/ring-studio/shank-contemporary.svg", label: "Contemporaneo" },
  { value: "hidden_halo", image: "/ring-studio/shank-hidden-halo.svg", label: "Halo nascosto" },
  { value: "split", image: "/ring-studio/shank-split.svg", label: "Gambo diviso" },
];

const PEEKABOO_OPTIONS: Opt<string>[] = [
  { value: "none", image: "/ring-studio/peek-none.svg", label: "Nessuna" },
  { value: "round_diamond", image: "/ring-studio/peek-round-diamond.svg", label: "Diamante rotondo" },
  { value: "princess_diamond", image: "/ring-studio/peek-princess-diamond.svg", label: "Diamante princess" },
];

const SIDE_SETTING_OPTIONS: Opt<string>[] = [
  { value: "none", image: "/ring-studio/setting-none.svg", label: "Nessuna" },
  { value: "u_pave", image: "/ring-studio/setting-u-pave.svg", label: "Pave a U" },
  { value: "channel", image: "/ring-studio/setting-channel.svg", label: "Incastonatura a canale" },
  { value: "prong", image: "/ring-studio/setting-prong.svg", label: "Griffe" },
  { value: "bead", image: "/ring-studio/setting-bead.svg", label: "Grani" },
  { value: "pave", image: "/ring-studio/setting-pave.svg", label: "Pave" },
];

const SIDE_STONE_OPTIONS: Opt<string>[] = [
  { value: "lab_diamond", label: "Diamanti di laboratorio" },
  { value: "sapphire_alternating", label: "Zaffiri alternati" },
  { value: "emerald_alternating", label: "Smeraldi alternati" },
  { value: "ruby_alternating", label: "Rubini alternati" },
];

const SIDE_STONE_LENGTH_OPTIONS: Opt<string>[] = [
  { value: "half", label: "Metà" },
  { value: "three_quarters", label: "Tre quarti" },
];

const CARVING_TYPE_OPTIONS: Opt<string>[] = [
  { value: "plain", image: "/ring-studio/carving-plain.svg", label: "Liscio" },
  { value: "leaf", image: "/ring-studio/carving-leaf.svg", label: "Foglia" },
  { value: "scroll", image: "/ring-studio/carving-scroll.svg", label: "Voluta" },
];

// ─── OPZIONI MATERIALI ─────────────────────────────────────────────────────

const METAL_TYPE_OPTIONS: Opt<string>[] = [
  { value: "gold", label: "Oro" },
  { value: "platinum", label: "Platino" },
];

const METAL_QUALITY_OPTIONS: Opt<string>[] = [
  { value: "KT_9", label: "9KT" },
  { value: "KT_14", label: "14KT" },
  { value: "KT_18", label: "18KT" },
];

const METAL_COLOR_OPTIONS: Opt<string>[] = [
  { value: "yellow_gold", label: "Oro giallo" },
  { value: "white_gold", label: "Oro bianco" },
  { value: "rose_gold", label: "Oro rosa" },
];

const RING_SIZE_SYSTEM_OPTIONS: Opt<string>[] = [
  { value: "UK", label: "UK" },
  { value: "US", label: "US" },
];

const UK_RING_SIZES = ["G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const US_RING_SIZES = ["3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13"];

function getMetalColorLabel(color: string | null): string {
  if (!color) return "";
  const found = METAL_COLOR_OPTIONS.find((o) => o.value === color);
  return found?.label ?? color;
}

function getMetalQualityLabel(quality: string | null): string {
  if (!quality) return "";
  const found = METAL_QUALITY_OPTIONS.find((o) => o.value === quality);
  return found?.label ?? quality;
}

function buildMetalloText(config: Configurazione): string {
  if (config.metalType === "platinum") {
    return "Platino";
  }
  if (config.metalType === "gold" && config.metalQuality) {
    const qualita = getMetalQualityLabel(config.metalQuality);
    const testa = getMetalColorLabel(config.headMetalColor);
    const gambo = getMetalColorLabel(config.shankMetalColor);
    
    if (testa === gambo || (!testa && !gambo)) {
      return `${testa || "Oro"} ${qualita}`;
    }
    
    if (!testa) {
      return `Gambo in ${gambo} ${qualita}`;
    }
    if (!gambo) {
      return `Testa in ${testa} ${qualita}`;
    }
    
    return `Testa in ${testa} ${qualita}, gambo in ${gambo} ${qualita}`;
  }
  return "";
}

function optionLabel(options: Opt<string>[], value: string | null): string {
  if (!value) return "";
  return options.find((option) => option.value === value)?.label ?? value;
}

function buildRiepilogoConfigurazione(
  config: Configurazione,
  gioiello: string,
  montatura: Montatura | null,
): string {
  const righe = [
    `Gioiello: ${capitalize(gioiello)}`,
    `Montatura: ${montatura?.nome ?? "Da definire"}`,
    `Metallo: ${buildMetalloText(config) || "Da definire"}`,
  ];

  if (gioiello === "anello") {
    righe.push(`Testa: ${optionLabel(HEAD_TYPE_OPTIONS, config.headType) || "Da definire"}`);
    if (config.headStoneType) righe.push(`Pietre della testa: ${optionLabel(HEAD_STONE_OPTIONS, config.headStoneType)}`);
    righe.push(`Gambo: ${optionLabel(SHANK_TYPE_OPTIONS, config.shankType) || "Da definire"}`);
    if (config.peekaboo && config.peekaboo !== "none") righe.push(`Peek-a-boo: ${optionLabel(PEEKABOO_OPTIONS, config.peekaboo)}`);
    if (config.sideSetting && config.sideSetting !== "none") {
      righe.push(`Incastonatura laterale: ${optionLabel(SIDE_SETTING_OPTIONS, config.sideSetting)}`);
      if (config.sideStoneType) righe.push(`Pietre laterali: ${optionLabel(SIDE_STONE_OPTIONS, config.sideStoneType)}`);
      if (config.sideStoneLength) righe.push(`Lunghezza pietre laterali: ${optionLabel(SIDE_STONE_LENGTH_OPTIONS, config.sideStoneLength)}`);
    }
    if (config.carvingType) righe.push(`Decorazione: ${optionLabel(CARVING_TYPE_OPTIONS, config.carvingType)}`);
  }

  if ((gioiello === "anello" || gioiello === "veretta") && config.ringSize) {
    righe.push(`Misura: ${config.ringSizeSystem ?? ""} ${config.ringSize}`.trim());
  }
  if (config.engravingText.trim()) righe.push(`Incisione: ${config.engravingText.trim()}`);
  return righe.join("\n");
}

// ─── STEP INDICATOR ────────────────────────────────────────────────────────

function StepIndicator({ passo, gemId }: { passo: number; gemId: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center gap-2 mb-14">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = passo === n;
        const done = passo > n;
        return (
          <div key={label} className="flex items-center">
            <button
              type="button"
              onClick={() => {
                void navigate({
                  to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
                  params: { gemId },
                  search: (prev) => ({ ...prev, passo: String(n) }),
                });
              }}
              disabled={!done && !active}
              aria-pressed={active}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
                active
                  ? "bg-gold-deep text-bone shadow-md"
                  : done
                    ? "bg-gold-deep/20 text-gold-deep cursor-pointer hover:bg-gold-deep/30"
                    : "bg-white/5 text-bone/30"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </button>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-6 h-px mx-1 ${
                passo > n ? "bg-gold-deep/40" : "bg-white/10"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── CARD MONTATURA ────────────────────────────────────────────────────────

function MontaturaCard({
  montatura,
  selected,
  stoneCarats,
  onClick,
}: {
  montatura: Montatura;
  selected: boolean;
  stoneCarats: number | null;
  onClick: () => void;
}) {
  const outOfRange =
    stoneCarats !== null &&
    montatura.carati_min !== null &&
    montatura.carati_max !== null &&
    (stoneCarats < montatura.carati_min || stoneCarats > montatura.carati_max);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full text-left rounded-2xl border-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
        selected
          ? "border-gold-deep bg-gold-deep/5"
          : "border-white/10 bg-white/[0.03] hover:border-gold-deep/40 hover:bg-gold-deep/5"
      }`}
    >
      {montatura.immagine ? (
        <div className="aspect-[4/3] rounded-t-xl overflow-hidden">
          <img
            src={montatura.immagine}
            alt={montatura.nome}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] rounded-t-xl bg-[#0a0a0a] border-b border-white/5 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gold-deep/30 flex items-center justify-center">
            <Gem className="h-4 w-4 text-gold-deep/40" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-bone/20">
            Immagine in preparazione
          </p>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-display text-lg leading-tight">{montatura.nome}</p>
          {selected && (
            <div className="shrink-0 w-5 h-5 rounded-full bg-gold-deep flex items-center justify-center">
              <Check className="h-3 w-3 text-bone" />
            </div>
          )}
        </div>

        {montatura.descrizione && (
          <p className="text-bone/50 text-sm leading-relaxed mb-3 line-clamp-2">
            {montatura.descrizione}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {montatura.metalli.map((m) => (
            <span
              key={m}
              className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/10 text-bone/60"
            >
              {capitalize(m)}
            </span>
          ))}
        </div>

        {montatura.carati_min !== null && montatura.carati_max !== null && (
          <p className="text-[10px] text-bone/35">
            {montatura.carati_min}–{montatura.carati_max} ct
          </p>
        )}

        {outOfRange && (
          <p className="mt-2 text-[10px] text-amber-400/80 italic">
            Compatibilità da verificare con il gioielliere
          </p>
        )}
      </div>
    </button>
  );
}

// ─── CATEGORIA CARD ────────────────────────────────────────────────────────

function CategoriaCard({
  valore,
  etichetta,
  selected,
  onClick,
}: {
  valore: string;
  etichetta: string;
  selected: boolean;
  onClick: () => void;
}) {
  const icons: Record<string, React.ReactNode> = {
    anello: <Gem className="h-7 w-7" />,
    veretta: <Settings className="h-7 w-7" />,
    pendente: <Palette className="h-7 w-7" />,
    orecchini: <Gem className="h-7 w-7" />,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex flex-col items-center gap-4 rounded-2xl border-2 p-8 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
        selected
          ? "border-gold-deep bg-gold-deep/5"
          : "border-white/10 bg-white/[0.03] hover:border-gold-deep/40 hover:bg-gold-deep/5"
      }`}
    >
      <div
        className={`transition-colors ${
          selected ? "text-gold-deep" : "text-bone/40 group-hover:text-gold-deep/70"
        }`}
      >
        {icons[valore] ?? <Gem className="h-7 w-7" />}
      </div>
      <div className="text-center">
        <p className={`font-display text-xl transition-colors ${
          selected ? "text-gold-deep" : "text-bone/80 group-hover:text-bone"
        }`}>
          {etichetta}
        </p>
      </div>
      {selected && (
        <div className="w-2 h-2 rounded-full bg-gold-deep" />
      )}
    </button>
  );
}

// ─── CARD OPZIONE GENERICA ─────────────────────────────────────────────────

function OptionCard({
  label,
  image,
  selected,
  onClick,
}: {
  label: string;
  image?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border-2 p-4 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
        selected
          ? "border-gold-deep bg-gold-deep/5"
          : "border-white/10 bg-white/[0.03] hover:border-gold-deep/40 hover:bg-gold-deep/5"
      }`}
    >
      {image && (
        <span className="mb-3 block overflow-hidden rounded-lg border border-white/10 bg-[#0c0c0c]">
          <img src={image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
        </span>
      )}
      <span className={`block text-sm font-medium transition-colors ${
        selected ? "text-gold-deep" : "text-bone/80"
      }`}>
        {label}
      </span>
    </button>
  );
}

// ─── SEZIONE PERSONALIZZAZIONE ─────────────────────────────────────────────

function PersonalizzazioneSezione({
  config,
  onUpdate,
}: {
  config: Configurazione;
  onUpdate: (updated: Configurazione) => void;
}) {
  const updateField = <K extends keyof Configurazione>(key: K, value: Configurazione[K]) => {
    onUpdate({ ...config, [key]: value });
  };

  const handleHeadTypeChange = (value: string) => {
    const needsStones = HEAD_TYPES_WITH_STONES.has(value);
    onUpdate({
      ...config,
      headType: value,
      headStoneType: needsStones ? (config.headStoneType ?? "diamonds") : null,
    });
  };

  const handleSideSettingChange = (value: string) => {
    onUpdate({
      ...config,
      sideSetting: value,
      sideStoneType: value === "none" ? null : (config.sideStoneType ?? "lab_diamond"),
      sideStoneLength: value === "none" ? null : (config.sideStoneLength ?? "half"),
    });
  };

  return (
    <div className="space-y-12">
      <section>
        <h3 className="font-display text-lg mb-1">Testa dell&apos;anello</h3>
        <p className="text-bone/50 text-sm mb-6">
          La forma della testa che incastra la pietra principale.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HEAD_TYPE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              image={opt.image}
              selected={config.headType === opt.value}
              onClick={() => handleHeadTypeChange(opt.value)}
            />
          ))}
        </div>
      </section>

      {config.headType && HEAD_TYPES_WITH_STONES.has(config.headType) && (
        <section>
          <h3 className="font-display text-lg mb-1">Pietre della testa</h3>
          <p className="text-bone/50 text-sm mb-6">
            Pietre decorative intorno alla pietra principale.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {HEAD_STONE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
              image={opt.image}
                selected={config.headStoneType === opt.value}
                onClick={() => updateField("headStoneType", opt.value)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="font-display text-lg mb-1">Tipo di gambo</h3>
        <p className="text-bone/50 text-sm mb-6">
          La forma della banda che scorre lungo il dito.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SHANK_TYPE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              image={opt.image}
              selected={config.shankType === opt.value}
              onClick={() => updateField("shankType", opt.value)}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-display text-lg mb-1">Pietra peek-a-boo</h3>
        <p className="text-bone/50 text-sm mb-6">
          Piccola pietra nascosta sotto la testa dell&apos;anello.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {PEEKABOO_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              image={opt.image}
              selected={config.peekaboo === opt.value}
              onClick={() => updateField("peekaboo", opt.value)}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-display text-lg mb-1">Incastonatura laterale</h3>
        <p className="text-bone/50 text-sm mb-6">
          Come sono incastonate le pietre lungo il gambo.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SIDE_SETTING_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              image={opt.image}
              selected={config.sideSetting === opt.value}
              onClick={() => handleSideSettingChange(opt.value)}
            />
          ))}
        </div>
      </section>

      {config.sideSetting && config.sideSetting !== "none" && (
        <section>
          <h3 className="font-display text-lg mb-1">Pietre laterali</h3>
          <p className="text-bone/50 text-sm mb-6">
            Tipo di pietre lungo il gambo dell&apos;anello.
          </p>
          <div className="space-y-6">
            <div>
              <p className="text-bone/60 text-xs uppercase tracking-widest mb-3">Materiale</p>
              <div className="grid grid-cols-2 gap-3">
                {SIDE_STONE_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
              image={opt.image}
                    selected={config.sideStoneType === opt.value}
                    onClick={() => updateField("sideStoneType", opt.value)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-bone/60 text-xs uppercase tracking-widest mb-3">Lunghezza</p>
              <div className="grid grid-cols-2 gap-3">
                {SIDE_STONE_LENGTH_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
              image={opt.image}
                    selected={config.sideStoneLength === opt.value}
                    onClick={() => updateField("sideStoneLength", opt.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <h3 className="font-display text-lg mb-1">Decorazione del gambo</h3>
        <p className="text-bone/50 text-sm mb-6">
          Lavorazione decorativa sulla superficie del gambo.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {CARVING_TYPE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              image={opt.image}
              selected={config.carvingType === opt.value}
              onClick={() => updateField("carvingType", opt.value)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── SEZIONE MATERIALI E MISURA ─────────────────────────────────────────────

function MaterialiSezione({
  config,
  onUpdate,
  showRingOptions,
}: {
  config: Configurazione;
  onUpdate: (updated: Configurazione) => void;
  showRingOptions: boolean;
}) {
  const updateField = <K extends keyof Configurazione>(key: K, value: Configurazione[K]) => {
    onUpdate({ ...config, [key]: value });
  };

  const handleMetalTypeChange = (value: string) => {
    onUpdate(value === "platinum"
      ? {
          ...config,
          metalType: "platinum",
          metalQuality: null,
          headMetalColor: null,
          shankMetalColor: null,
        }
      : {
          ...config,
          metalType: "gold",
          metalQuality: "KT_18",
          headMetalColor: "yellow_gold",
          shankMetalColor: "yellow_gold",
        });
  };

  const handleRingSizeSystemChange = (value: string) => {
    onUpdate({ ...config, ringSizeSystem: value, ringSize: "" });
  };

  const handleEngravingChange = (value: string) => {
    // Taglia a 24 caratteri
    if (value.length > 24) {
      updateField("engravingText", value.slice(0, 24));
    } else {
      updateField("engravingText", value);
    }
  };

  const ringSizes = config.ringSizeSystem === "US" ? US_RING_SIZES : UK_RING_SIZES;
  const isGold = config.metalType === "gold";

  return (
    <div className="space-y-12">
      {/* TIPO DI METALLO */}
      <section>
        <h3 className="font-display text-lg mb-1">Tipo di metallo</h3>
        <p className="text-bone/50 text-sm mb-6">
          Il materiale della montatura.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {METAL_TYPE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              image={opt.image}
              selected={config.metalType === opt.value}
              onClick={() => handleMetalTypeChange(opt.value)}
            />
          ))}
        </div>
      </section>

      {/* QUALITÀ DEL METALLO (solo oro) */}
      {isGold && (
        <section>
          <h3 className="font-display text-lg mb-1">Qualità dell&apos;oro</h3>
          <p className="text-bone/50 text-sm mb-6">
            La purezza dell&apos;oro utilizzato.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {METAL_QUALITY_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
              image={opt.image}
                selected={config.metalQuality === opt.value}
                onClick={() => updateField("metalQuality", opt.value)}
              />
            ))}
          </div>
        </section>
      )}

      {/* COLORE DELLA TESTA (solo oro) */}
      {isGold && (
        <section>
          <h3 className="font-display text-lg mb-1">Colore della testa</h3>
          <p className="text-bone/50 text-sm mb-6">
            Il colore dell&apos;oro nella parte superiore della montatura.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {METAL_COLOR_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
              image={opt.image}
                selected={config.headMetalColor === opt.value}
                onClick={() => updateField("headMetalColor", opt.value)}
              />
            ))}
          </div>
        </section>
      )}

      {/* COLORE DEL GAMBO (solo oro) */}
      {isGold && (
        <section>
          <h3 className="font-display text-lg mb-1">Colore del gambo</h3>
          <p className="text-bone/50 text-sm mb-6">
            Il colore dell&apos;oro nella banda dell&apos;anello. Può essere diverso dalla testa per creare combinazioni bicolore.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {METAL_COLOR_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
              image={opt.image}
                selected={config.shankMetalColor === opt.value}
                onClick={() => updateField("shankMetalColor", opt.value)}
              />
            ))}
          </div>
        </section>
      )}

      {/* VALORE METALLO SELEZIONATO */}
      {isGold && (
        <div className="rounded-xl border border-gold-deep/20 bg-gold-deep/5 p-5">
          <p className="text-xs uppercase tracking-widest text-bone/50 mb-1">Montatura in</p>
          <p className="font-display text-lg text-gold-deep">{buildMetalloText(config)}</p>
        </div>
      )}

      {/* SISTEMA MISURA E MISURA (solo anello e veretta) */}
      {showRingOptions && (
        <>
          <section>
            <h3 className="font-display text-lg mb-1">Sistema di misura</h3>
            <p className="text-bone/50 text-sm mb-6">
              Il sistema di misura dell&apos;anello.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {RING_SIZE_SYSTEM_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
              image={opt.image}
                  selected={config.ringSizeSystem === opt.value}
                  onClick={() => handleRingSizeSystemChange(opt.value)}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-display text-lg mb-1">Misura{config.ringSizeSystem ? ` (${config.ringSizeSystem})` : ""}</h3>
            <p className="text-bone/50 text-sm mb-6">
              Seleziona la misura dell&apos;anello.
            </p>
            <select
              value={config.ringSize ?? ""}
              onChange={(e) => updateField("ringSize", e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-4 py-3 text-bone focus:outline-none focus:border-gold-deep transition-colors cursor-pointer"
            >
              <option value="">Seleziona una misura</option>
              {ringSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </section>

          {/* INCISIONE */}
          <section>
            <h3 className="font-display text-lg mb-1">Incisione</h3>
            <p className="text-bone/50 text-sm mb-6">
              Testo da incidere all&apos;interno dell&apos;anello. Facoltativo.
            </p>
            <div className="relative">
              <input
                type="text"
                value={config.engravingText}
                onChange={(e) => handleEngravingChange(e.target.value)}
                placeholder="Es. Maria & Luigi"
                maxLength={24}
                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 pr-16 text-bone placeholder:text-bone/30 focus:outline-none focus:border-gold-deep transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-bone/40">
                {config.engravingText.length}/24
              </span>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

function MontaturaGemmaPage() {
  const { gemId } = Route.useParams();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const passo = Number(search.passo) || 1;

  const [item, setItem] = useState<Gemstone | null>(null);
  const [stoneStatus, setStoneStatus] = useState<"loading" | "ready" | "error">("loading");
  const [montature, setMontature] = useState<Montatura[]>([]);
  const [montatureStatus, setMontatureStatus] = useState<"loading" | "ready">("loading");
  const [whatsappNum, setWhatsappNum] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const fetchGem = useServerFn(getNivodaGemstone);
  const fetchMontature = useServerFn(getMontature);
  const fetchConfig = useServerFn(getConfigSito);

  const config = useMemo(() => parseConfig(search.config), [search.config]);

  useEffect(() => {
    let alive = true;
    setStoneStatus("loading");
    fetchGem({ data: { gemId } })
      .then((res) => {
        if (!alive) return;
        setItem(res.item);
        setStoneStatus(res.item ? "ready" : "error");
      })
      .catch(() => {
        if (alive) setStoneStatus("error");
      });
    return () => { alive = false; };
  }, [gemId, fetchGem]);

  useEffect(() => {
    fetchConfig({ data: undefined })
      .then((cfg) => {
        const num = cfg.whatsapp?.replace(/\D/g, "") ?? null;
        setWhatsappNum(num && num !== "NUMERO_WHATSAPP" ? num : null);
      })
      .catch(() => {});
  }, [fetchConfig]);

  useEffect(() => {
    if (!item?.shape) return;
    setMontatureStatus("loading");
    fetchMontature({ data: { forma: item.shape } })
      .then((m) => { setMontature(m); setMontatureStatus("ready"); })
      .catch(() => { setMontature([]); setMontatureStatus("ready"); });
  }, [item?.shape, fetchMontature]);

  const title = item?.title ?? item?.gemLabel ?? item?.shapeLabel ?? "Pietra certificata";
  const gioiello = search.gioiello ?? "";
  const montaturaCodice = search.montatura ?? "";

  const montaturaSel = useMemo(
    () => montature.find((m) => m.codice === montaturaCodice) ?? null,
    [montature, montaturaCodice],
  );

  const stoneCarats = item?.carats ?? null;
  const isAnello = gioiello === "anello";
  const isVeretta = gioiello === "veretta";
  const showRingOptions = isAnello || isVeretta;

  // ─── NAVIGAZIONE PASSI ──────────────────────────────────────────────────

  const goTo = (step: number) => {
    const metalloText = buildMetalloText(config);
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: {
        ...search,
        passo: String(step),
        metallo: metalloText,
        misura: showRingOptions ? (config.ringSize ?? "") : "",
      },
    });
  };

  const goToWithConfig = (step: number, currentConfig: Configurazione) => {
    const metalloText = buildMetalloText(currentConfig);
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: {
        ...search,
        passo: String(step),
        config: serializeConfig(currentConfig),
        metallo: metalloText,
        misura: showRingOptions ? (currentConfig.ringSize ?? "") : "",
      },
    });
  };

  const goNext = () => { if (passo < 6) goTo(passo + 1); };
  const goPrev = () => { if (passo > 1) goTo(passo - 1); };

  const setGioiello = (val: string) => {
    const isNewAnello = val === "anello";
    const resetConfig: Configurazione = {
      ...DEFAULT_CONFIG,
      headType: isNewAnello ? "four_prongs" : null,
      headStoneType: null,
      shankType: isNewAnello ? "single" : null,
      peekaboo: isNewAnello ? "none" : null,
      sideSetting: isNewAnello ? "none" : null,
      sideStoneType: null,
      sideStoneLength: null,
      carvingType: isNewAnello ? "plain" : null,
      metalType: "gold",
      metalQuality: "KT_18",
      headMetalColor: "yellow_gold",
      shankMetalColor: "yellow_gold",
      engravingText: "",
      ringSizeSystem: isNewAnello || val === "veretta" ? "UK" : null,
      ringSize: "",
    };
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: {
        ...search,
        gioiello: val,
        montatura: "",
        metallo: "",
        misura: "",
        passo: "2",
        config: serializeConfig(resetConfig),
      },
    });
  };

  const setMontatura_ = (codice: string) => {
    const metalloText = buildMetalloText(config);
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: {
        ...search,
        montatura: codice,
        metallo: metalloText,
        passo: "3",
      },
    });
  };

  const setConfigInUrl = (updated: Configurazione) => {
    const metalloText = buildMetalloText(updated);
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: {
        ...search,
        config: serializeConfig(updated),
        metallo: metalloText,
        misura: showRingOptions ? (updated.ringSize ?? "") : "",
      },
    });
  };

  const submitRichiesta = async (canale: "sito" | "whatsapp") => {
    if (isSubmitting || !item || !montaturaSel) return;
    const form = document.getElementById("form-riepilogo") as HTMLFormElement | null;
    if (!form || !form.reportValidity()) return;

    const fd = new FormData(form);
    const nome = String(fd.get("nome") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const telefono = String(fd.get("telefono") ?? "").trim();
    const note = String(fd.get("note") ?? "").trim();
    const configToSave: Configurazione = {
      ...config,
      engravingText: config.engravingText.trim(),
      ringSize: showRingOptions ? (config.ringSize || null) : null,
      ringSizeSystem: showRingOptions ? config.ringSizeSystem : null,
    };
    const riepilogo = buildRiepilogoConfigurazione(configToSave, gioiello, montaturaSel);
    const popup = canale === "whatsapp" ? window.open("", "_blank") : null;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await inviaRichiesta({
        data: {
          cliente_nome: nome,
          cliente_email: email,
          cliente_telefono: telefono,
          pietra_tipo: "gemma",
          pietra_id: gemId,
          pietra_titolo: title,
          gioiello,
          montatura_codice: montaturaSel.codice,
          metallo: buildMetalloText(configToSave),
          misura: showRingOptions ? (configToSave.ringSize ?? "") : "",
          note,
          canale,
          configurazione: configToSave,
          riepilogo_configurazione: riepilogo,
          immagine_pietra: item.image ?? null,
          immagine_montatura: montaturaSel.immagine ?? null,
        },
      });
      if (!result.id) throw new Error("La richiesta non e stata salvata");

      setRequestId(result.id);
      if (canale === "whatsapp" && whatsappNum) {
        const messaggio = [
          "Richiesta di progetto dal sito Cara Preziosi",
          `Identificativo: ${result.id}`,
          `Cliente: ${nome}`,
          `Pietra: ${title}`,
          `Codice pietra: ${gemId}`,
          riepilogo,
          note ? `Note: ${note}` : "",
          `Contatti: ${email}${telefono ? ` · ${telefono}` : ""}`,
        ].filter(Boolean).join("\n");
        const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(messaggio)}`;
        if (popup) popup.location.href = whatsappUrl;
        else window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      } else {
        popup?.close();
      }
      goToWithConfig(6, configToSave);
    } catch (error) {
      popup?.close();
      console.error("[configuratore-gemma] invio fallito", error);
      setSubmitError("Non siamo riusciti a inviare la richiesta. Riprova tra qualche istante.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitRichiesta("sito");
  };

  // ─── STATI DI CARICAMENTO ──────────────────────────────────────────────

  if (stoneStatus === "loading") {
    return (
      <main className="bg-obsidian text-bone min-h-screen">
        <section className="pt-36 md:pt-44 pb-24 md:pb-36">
          <div className="container-cara">
            <div className="flex items-center gap-3 text-bone/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento…
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (stoneStatus === "error" || !item) {
    return (
      <main className="bg-obsidian text-bone min-h-screen">
        <section className="pt-36 md:pt-44 pb-24 md:pb-36">
          <div className="container-cara text-center">
            <p className="font-display text-2xl mb-4">
              Configuratore momentaneamente non disponibile. Riprova tra qualche istante.
            </p>
            <Link to="/crea-il-tuo-gioiello/pietra-di-colore" className="btn-primary mt-8 inline-flex">
              Torna al catalogo
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (passo === 6) {
    return (
      <main className="bg-obsidian text-bone min-h-screen">
        <section className="pt-36 md:pt-44 pb-24 md:pb-36">
          <div className="container-cara max-w-xl text-center">
            <div className="w-16 h-16 rounded-full bg-gold-deep/20 flex items-center justify-center mx-auto mb-8">
              <Check className="h-8 w-8 text-gold-deep" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl mb-6">Richiesta ricevuta</h1>
            <p className="text-bone/70 text-lg leading-relaxed mb-4">
              Grazie. Il maestro orafo Nicola Caradonna analizzerà la tua richiesta e ti contatterà per definire insieme i dettagli del progetto.
            </p>
            <p className="text-bone/50 text-sm mb-4">
              Nessuna fretta: ogni gioiello viene studiato con cura prima di ogni proposta.
            </p>
            {requestId && (
              <p className="text-xs text-gold-deep mb-12">Identificativo richiesta: {requestId}</p>
            )}
            <Link to="/crea-il-tuo-gioiello/pietra-di-colore" className="btn-primary inline-flex">
              Continua a esplorare
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ─── LAYOUT PRINCIPALE ─────────────────────────────────────────────────

  const montaturaFiltrate = montature.filter((m) => m.categoria === gioiello);

  return (
    <main className="bg-obsidian text-bone min-h-screen">
      <section className="pt-36 md:pt-44 pb-24 md:pb-36">
        <div className="container-cara">
          <Link
            to="/crea-il-tuo-gioiello/pietra-di-colore/$gemId"
            params={{ gemId }}
            className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-bone/50 hover:text-gold-deep transition-colors mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Torna alla pietra
          </Link>
          <PageBreadcrumb current="Progetta il tuo gioiello" className="mb-10" />

          <div className="mb-6">
            <p className="eyebrow text-gold-deep mb-3">Pietra selezionata</p>
            <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
          </div>

          <StepIndicator passo={passo} gemId={gemId} />

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* COLONNA PRINCIPALE */}
            <div className="lg:col-span-7">

              {/* ── PASSO 1: TIPO DI GIOIELLO ── */}
              {passo === 1 && (
                <div>
                  <h2 className="font-display text-2xl mb-2">Che tipo di gioiello desideri?</h2>
                  <p className="text-bone/60 mb-10">Scegli la famiglia di gioiello per iniziare a progettare.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CATEGORIE.map((cat) => (
                      <CategoriaCard
                        key={cat.valore}
                        valore={cat.valore}
                        etichetta={cat.etichetta}
                        selected={gioiello === cat.valore}
                        onClick={() => setGioiello(cat.valore)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── PASSO 2: MONTATURA ── */}
              {passo === 2 && (
                <div>
                  <h2 className="font-display text-2xl mb-2">Scegli la montatura</h2>
                  {montaturaFiltrate.length > 0 ? (
                    <>
                      <p className="text-bone/60 mb-8">
                        {montaturaFiltrate.length} montatura{montaturaFiltrate.length !== 1 ? "e" : ""} disponibili per {capitalize(gioiello ?? "")}.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {montaturaFiltrate.map((m) => (
                          <MontaturaCard
                            key={m.codice}
                            montatura={m}
                            selected={montaturaCodice === m.codice}
                            stoneCarats={stoneCarats}
                            onClick={() => setMontatura_(m.codice)}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                      <p className="text-bone/70 text-sm leading-relaxed">
                        Per questa forma non abbiamo ancora montature a catalogo.{' '}
                        <Link to="/contatti" search={{ richiesta: "", pietra: "" }} className="text-gold-deep underline underline-offset-4 hover:text-gold-deep/80 transition-colors">
                          Scrivici e la realizziamo su misura.
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── PASSO 3: PERSONALIZZAZIONE ── */}
              {passo === 3 && (
                <div>
                  <h2 className="font-display text-2xl mb-2">Personalizza il tuo gioiello</h2>
                  <p className="text-bone/60 mb-10">
                    {isAnello
                      ? "Scegli le caratteristiche tecniche della montatura."
                      : "Definisci le caratteristiche per questa tipologia di gioiello."}
                  </p>

                  {isAnello ? (
                    <PersonalizzazioneSezione
                      config={config}
                      onUpdate={setConfigInUrl}
                    />
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                      <p className="text-bone/60 text-sm">
                        La personalizzazione per {capitalize(gioiello ?? "")} è disponibile nella fase successiva.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── PASSO 4: MATERIALI E MISURA ── */}
              {passo === 4 && (
                <div>
                  <h2 className="font-display text-2xl mb-2">Materiali e misura</h2>
                  <p className="text-bone/60 mb-10">
                    Scegli il metallo, i colori e la misura della montatura.
                  </p>

                  <MaterialiSezione
                    config={config}
                    onUpdate={setConfigInUrl}
                    showRingOptions={showRingOptions}
                  />
                </div>
              )}

              {/* ── PASSO 5: RIEPILOGO (temporaneo) ── */}
              {passo === 5 && (
                <div>
                  <h2 className="font-display text-2xl mb-8">Riepilogo e invio</h2>
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                      <p className="eyebrow text-gold-deep mb-4">La tua configurazione</p>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-bone/50">Pietra</dt>
                          <dd className="text-bone text-right">{title}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-bone/50">Gioiello</dt>
                          <dd className="text-bone text-right">{capitalize(gioiello ?? "—")}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-bone/50">Montatura</dt>
                          <dd className="text-bone text-right">{montaturaSel?.nome ?? "—"}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-bone/50">Metallo</dt>
                          <dd className="text-bone text-right">{search.metallo || "—"}</dd>
                        </div>
                        {search.misura && (
                          <div className="flex justify-between gap-4">
                            <dt className="text-bone/50">Misura</dt>
                            <dd className="text-bone text-right">{search.misura}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <form id="form-riepilogo" onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <label className="block">
                          <span className="eyebrow text-bone/50 block mb-3">Nome<span className="text-gold-deep">*</span></span>
                          <input name="nome" type="text" required className="w-full bg-transparent border-b border-white/20 py-3 text-base text-bone focus:outline-none focus:border-gold-deep transition-colors" />
                        </label>
                        <label className="block">
                          <span className="eyebrow text-bone/50 block mb-3">Telefono</span>
                          <input name="telefono" type="tel" className="w-full bg-transparent border-b border-white/20 py-3 text-base text-bone focus:outline-none focus:border-gold-deep transition-colors" />
                        </label>
                      </div>
                      <label className="block">
                        <span className="eyebrow text-bone/50 block mb-3">Email<span className="text-gold-deep">*</span></span>
                        <input name="email" type="email" required className="w-full bg-transparent border-b border-white/20 py-3 text-base text-bone focus:outline-none focus:border-gold-deep transition-colors" />
                      </label>
                      <label className="block">
                        <span className="eyebrow text-bone/50 block mb-3">Note</span>
                        <textarea name="note" rows={3} className="w-full bg-transparent border-b border-white/20 py-3 text-base text-bone focus:outline-none focus:border-gold-deep transition-colors resize-none" />
                      </label>
                      {submitError && (
                        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                          {submitError}
                        </p>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {/* ── NAVIGAZIONE PASSI ── */}
              {passo > 1 && passo < 6 && (
                <div className="mt-12 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-bone/70 hover:border-gold-deep/50 hover:text-bone transition-all"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Indietro
                  </button>
                  {passo < 5 ? (
                    <button
                      type="button"
                      onClick={() => goToWithConfig(passo + 1, config)}
                      disabled={
                        (passo === 2 && !montaturaCodice)
                      }
                      className="btn-primary disabled:opacity-40"
                    >
                      Avanti
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        form="form-riepilogo"
                        disabled={isSubmitting}
                        className="btn-primary disabled:opacity-50"
                      >
                        {isSubmitting ? "Invio in corso…" : "Invia la richiesta"}
                      </button>
                      {whatsappNum && (
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => void submitRichiesta("whatsapp")}
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-bone/70 hover:border-gold-deep/50 hover:text-bone transition-all disabled:opacity-50"
                        >
                          Invia su WhatsApp
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* COLONNA PREVIEW */}
            {passo >= 2 && (
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <div className="rounded-2xl border border-gold-deep/20 bg-[#0a0a0a]/80 p-4 sm:p-6 backdrop-blur-sm">
                    <RingStudioPreview
                      config={config}
                      stoneImage={item?.image ?? null}
                      stoneAlt={title}
                      mountingImage={montaturaSel?.immagine ?? null}
                    />
                    {montaturaSel && (
                      <div className="mt-5 border-t border-white/10 pt-4 text-center">
                        <p className="text-sm text-bone/75">{montaturaSel.nome}</p>
                        <p className="mt-1 text-xs text-bone/45">{buildMetalloText(config) || "Materiale da definire"}{config.ringSize ? ` · Misura ${config.ringSizeSystem} ${config.ringSize}` : ""}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
