import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { getRingStudioPreset } from "@/lib/ring-studio-presets";
import { ringPreviewImages } from "@/lib/ring-preview-sku";

export type RingStudioPreviewConfig = {
  headType: string | null;
  headStoneType: string | null;
  shankType: string | null;
  peekaboo: string | null;
  sideSetting: string | null;
  sideStoneType: string | null;
  sideStoneLength: string | null;
  carvingType: string | null;
  carvingLength?: string | null;
  metalType: string | null;
  metalQuality: string | null;
  headMetalColor: string | null;
  shankMetalColor: string | null;
  engravingText: string;
  engravingFont?: string | null;
  ringSizeSystem: string | null;
  ringSize: string | null;
};

type Images = { down: string; front: string; side: string };

const FINITURE: Record<string, { label: string; color: string }> = {
  yellow_gold: { label: "Oro giallo", color: "#D4AF37" },
  white_gold: { label: "Oro bianco", color: "#E5E4E2" },
  rose_gold: { label: "Oro rosa", color: "#E0A98F" },
  platinum: { label: "Platino", color: "#CFD3D6" },
};

function finitura(metalType: string | null, color: string | null) {
  if ((metalType ?? "").toLowerCase().includes("platin")) return FINITURE.platinum;
  return FINITURE[color ?? "yellow_gold"] ?? FINITURE.yellow_gold;
}

export function RingStudioPreview({
  config,
  stoneAlt,
  stoneShape,
  stoneCarats,
  centerStoneType,
  mountingImage,
}: {
  config: RingStudioPreviewConfig;
  stoneAlt: string;
  stoneShape: string;
  stoneCarats: number;
  centerStoneType?: string;
  mountingImage?: string | null;
}) {
  const [active, setActive] = useState<keyof Images>("down");
  const [failedSku, setFailedSku] = useState<string | null>(null);
  const preset = useMemo(() => getRingStudioPreset(config, stoneShape), [config, stoneShape]);

  /** Fotografia Nivoda reale della configurazione esatta (forma, carato, testa, gambo, metallo…). */
  const generated = useMemo(
    () =>
      ringPreviewImages(config, {
        shape: stoneShape,
        carats: stoneCarats,
        natural: /natural/i.test(centerStoneType ?? ""),
      }),
    [config, stoneShape, stoneCarats, centerStoneType],
  );

  const esatta = !!generated && failedSku !== generated.sku && !!config.headType;
  const images = useMemo<Images>(() => {
    if (esatta && generated) return generated as Images;
    if (!config.headType && mountingImage) {
      return { down: mountingImage, front: mountingImage, side: mountingImage };
    }
    return preset.images;
  }, [esatta, generated, config.headType, mountingImage, preset]);

  const entries: Array<{ key: keyof Images; label: string }> = [
    { key: "down", label: "Vista frontale" },
    { key: "front", label: "Vista dall’alto" },
    { key: "side", label: "Vista laterale" },
  ];

  const fin = finitura(config.metalType, config.shankMetalColor);
  const finTesta = finitura(config.metalType, config.headMetalColor);
  const bicolore = fin.label !== finTesta.label;

  return (
    <div className="w-full">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-deep">Anteprima fotografica</p>
          <p className="mt-1 text-xs text-bone/50">
            {stoneAlt} · {stoneCarats.toLocaleString("it-IT")} ct
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 px-2.5 py-1 text-[10px] uppercase tracking-wider text-emerald-300">
          <Check className="h-3 w-3" />
          Anteprima Nivoda
        </span>
      </div>

      <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 sm:grid-cols-[76px_minmax(0,1fr)]">
        <div className="flex flex-col gap-2">
          {entries.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              aria-label={label}
              aria-pressed={active === key}
              className={`overflow-hidden rounded-lg border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${active === key ? "border-gold-deep" : "border-white/15 hover:border-gold-deep/50"}`}
            >
              <img src={images[key]} alt="" loading="lazy" className="aspect-square w-full object-contain" />
            </button>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white">
          <img
            key={images[active]}
            src={images[active]}
            alt={`${stoneAlt}, ${entries.find((entry) => entry.key === active)?.label.toLowerCase()}, ${fin.label.toLowerCase()}`}
            onError={() => generated && setFailedSku(generated.sku)}
            className="aspect-square h-full w-full object-contain transition-opacity duration-300"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
          <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: fin.color }} />
          <span className="text-[11px] text-bone/70">
            {fin.label}
            {config.metalQuality ? ` ${config.metalQuality.replace("KT_", "")}KT` : ""}
          </span>
        </span>
        {bicolore && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
            <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: finTesta.color }} />
            <span className="text-[11px] text-bone/70">Testa {finTesta.label.toLowerCase()}</span>
          </span>
        )}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-bone/35">
        {esatta
          ? "Fotografia Nivoda della configurazione selezionata: forma e carato della pietra, testa, gambo, incastonatura, decorazione e colore del metallo. Il maestro orafo confermerà proporzioni e finiture definitive."
          : "Anteprima fotografica della configurazione più vicina alle scelte effettuate. Il maestro orafo confermerà proporzioni e finiture definitive."}
      </p>
    </div>
  );
}

export default RingStudioPreview;
