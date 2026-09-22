import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { getRingStudioPreset } from "@/lib/ring-studio-presets";

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

export function RingStudioPreview({
  config,
  stoneAlt,
  stoneShape,
  stoneCarats,
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
  const preset = useMemo(() => getRingStudioPreset(config, stoneShape), [config, stoneShape]);
  const images = useMemo<Images>(() => {
    if (!config.headType && mountingImage) {
      return { down: mountingImage, front: mountingImage, side: mountingImage };
    }
    return preset.images;
  }, [config.headType, mountingImage, preset]);

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
              <img src={images[key]} alt="" className="aspect-square w-full object-contain" />
            </button>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white">
          <img
            key={`${preset.code}-${active}`}
            src={images[active]}
            alt={`${stoneAlt}, ${entries.find((entry) => entry.key === active)?.label.toLowerCase()}`}
            className="aspect-square h-full w-full object-contain transition-opacity duration-300"
          />
        </div>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-bone/35">
        Anteprima fotografica Nivoda della configurazione più vicina alle scelte effettuate. Il
        maestro orafo confermerà proporzioni e finiture definitive.
      </p>
    </div>
  );
}
