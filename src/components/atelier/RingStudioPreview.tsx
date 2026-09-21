import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { getRingStudioPreview } from "@/lib/ring-studio.functions";
import { RING_STUDIO_ASSETS } from "@/lib/ring-studio-assets";

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

const FALLBACK: Images = {
  down: RING_STUDIO_ASSETS.previewPreview1,
  front: RING_STUDIO_ASSETS.previewPreview2,
  side: RING_STUDIO_ASSETS.previewPreview3,
};

const upper = (value: string | null | undefined, fallback: string) => value ? value.toUpperCase() : fallback;

function toOptions(config: RingStudioPreviewConfig, shape: string, carats: number, centerStoneType: string) {
  const hasSide = Boolean(config.sideSetting && config.sideSetting !== "none");
  return {
    center_stone_shape: upper(shape, "ROUND"),
    center_stone_size: String(carats || 1),
    center_stone_type: centerStoneType,
    head_stones_quality: "GOOD",
    head_stones_type: upper(config.headStoneType, "DIAMONDS"),
    metal_quality: config.metalType === "platinum" ? "PLATINUM" : upper(config.metalQuality, "KT_18"),
    metal_type: upper(config.metalType, "GOLD"),
    mounting_metal_color: config.metalType === "platinum" ? "WHITE_GOLD" : upper(config.shankMetalColor, "YELLOW_GOLD"),
    mounting_type: upper(config.shankType, "SINGLE"),
    peekaboo_stone: upper(config.peekaboo, "NONE"),
    ring_carving_length: upper(config.carvingLength, "HALF"),
    ring_carving_type: upper(config.carvingType, "PLAIN"),
    ring_engraving_font: config.engravingText ? upper(config.engravingFont, "CLARENDON") : null,
    ring_head_metal_color: config.metalType === "platinum" ? "WHITE_GOLD" : upper(config.headMetalColor, "YELLOW_GOLD"),
    ring_head_type: upper(config.headType, "FOUR_PRONGS"),
    ring_size: config.ringSize || (config.ringSizeSystem === "US" ? "6" : "L"),
    ring_size_type: upper(config.ringSizeSystem, "UK"),
    side_setting_type: upper(config.sideSetting, "NONE"),
    side_stones_mounting_length: hasSide ? upper(config.sideStoneLength, "HALF") : null,
    side_stones_type: hasSide ? upper(config.sideStoneType === "lab_diamond" ? "diamonds" : config.sideStoneType, "DIAMONDS") : null,
  };
}

export function RingStudioPreview({
  config,
  stoneAlt,
  stoneShape,
  stoneCarats,
  centerStoneType = "LABGROWN_DIAMOND",
  mountingImage,
}: {
  config: RingStudioPreviewConfig;
  stoneAlt: string;
  stoneShape: string;
  stoneCarats: number;
  centerStoneType?: string;
  mountingImage?: string | null;
}) {
  const getPreview = useServerFn(getRingStudioPreview);
  const [images, setImages] = useState<Images>(FALLBACK);
  const [active, setActive] = useState<keyof Images>("down");
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supplierSku = useRef<string | undefined>(undefined);
  const options = useMemo(
    () => toOptions(config, stoneShape, stoneCarats, centerStoneType),
    [config, stoneShape, stoneCarats, centerStoneType],
  );
  const requestKey = JSON.stringify(options);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPreview({ data: { sku_id: supplierSku.current, options } });
        if (cancelled) return;
        setImages(result.images);
        supplierSku.current = result.supplierSku ?? supplierSku.current;
        setLive(true);
      } catch {
        if (cancelled) return;
        setLive(false);
        setError("Il rendering fotografico si aggiornerà appena il servizio Nivoda sarà disponibile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 450);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [getPreview, requestKey]);

  const entries: Array<{ key: keyof Images; label: string }> = [
    { key: "down", label: "Vista frontale" },
    { key: "front", label: "Vista dall’alto" },
    { key: "side", label: "Vista laterale" },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-deep">Anteprima fotografica</p>
          <p className="mt-1 text-xs text-bone/50">{stoneAlt} · {stoneCarats.toLocaleString("it-IT")} ct</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${live ? "border-emerald-400/25 text-emerald-300" : "border-white/15 text-bone/45"}`}>
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : live ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
          {loading ? "Aggiornamento" : live ? "Rendering reale" : "Riferimento"}
        </span>
      </div>

      <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 sm:grid-cols-[76px_minmax(0,1fr)]">
        <div className="flex flex-col gap-2">
          {entries.map(({ key, label }) => (
            <button key={key} type="button" onClick={() => setActive(key)} aria-label={label} aria-pressed={active === key} className={`overflow-hidden rounded-lg border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${active === key ? "border-gold-deep" : "border-white/15 hover:border-gold-deep/50"}`}>
              <img src={images[key]} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white">
          <img src={images[active]} alt={`${stoneAlt}, ${entries.find((entry) => entry.key === active)?.label.toLowerCase()}`} className={`aspect-square h-full w-full object-contain transition-opacity ${loading ? "opacity-55" : "opacity-100"}`} />
          {loading && <div className="absolute inset-0 grid place-items-center bg-white/20"><Loader2 className="h-7 w-7 animate-spin text-[#1a1a1a]" /></div>}
          {mountingImage && !live && <img src={mountingImage} alt="Montatura selezionata" className="absolute bottom-3 right-3 h-16 w-16 rounded-lg border border-black/10 bg-white object-cover shadow-sm" />}
        </div>
      </div>
      {error && <p className="mt-3 text-xs leading-relaxed text-amber-200/70">{error}</p>}
      <p className="mt-3 text-[10px] leading-relaxed text-bone/35">L’immagine è un riferimento digitale. Proporzioni e finiture definitive vengono confermate dal maestro orafo.</p>
    </div>
  );
}
