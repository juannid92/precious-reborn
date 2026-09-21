import { useState } from "react";
import { Check, Gem } from "lucide-react";

export type RingStudioPreviewConfig = {
  headType: string | null;
  shankType: string | null;
  peekaboo: string | null;
  sideSetting: string | null;
  sideStoneType: string | null;
  carvingType: string | null;
  metalType: string | null;
  headMetalColor: string | null;
  shankMetalColor: string | null;
};

type View = "front" | "side" | "top";

const METALS: Record<string, { light: string; mid: string; dark: string }> = {
  yellow_gold: { light: "#fff1ad", mid: "#d0a23b", dark: "#6f4a12" },
  white_gold: { light: "#ffffff", mid: "#c8ced5", dark: "#626c78" },
  rose_gold: { light: "#ffd4c1", mid: "#c98772", dark: "#704236" },
  platinum: { light: "#ffffff", mid: "#d8dbe0", dark: "#747b85" },
};

function metal(config: RingStudioPreviewConfig, part: "head" | "shank") {
  if (config.metalType === "platinum") return METALS.platinum;
  return METALS[part === "head" ? config.headMetalColor ?? "yellow_gold" : config.shankMetalColor ?? "yellow_gold"] ?? METALS.yellow_gold;
}

function stoneColor(type: string | null) {
  if (type?.includes("sapphire")) return "#4b78df";
  if (type?.includes("emerald")) return "#2ea56f";
  if (type?.includes("ruby")) return "#d2475b";
  return "#dff4ff";
}

function FacetedStone({ cx, cy, size = 58 }: { cx: number; cy: number; size?: number }) {
  const r = size / 2;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 6;
    return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
  }).join(" ");
  return (
    <g filter="url(#stoneShadow)">
      <polygon points={points} fill="url(#stone)" stroke="#fff" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.52} fill="none" stroke="#fff" strokeOpacity=".75" />
      {[0, 45, 90, 135].map((angle) => {
        const rad = angle * Math.PI / 180;
        return <line key={angle} x1={cx - Math.cos(rad) * r} y1={cy - Math.sin(rad) * r} x2={cx + Math.cos(rad) * r} y2={cy + Math.sin(rad) * r} stroke="#fff" strokeOpacity=".58" />;
      })}
    </g>
  );
}

function SideStones({ color, view }: { color: string; view: View }) {
  if (view === "side") {
    return <>{[-72, -48, -24, 24, 48, 72].map((x) => <circle key={x} cx={210 + x} cy={226 + Math.abs(x) * .12} r="6.5" fill={color} stroke="#fff" strokeWidth="1.4" />)}</>;
  }
  return <>{[-92, -68, -44, -20, 20, 44, 68, 92].map((x) => <circle key={x} cx={210 + x} cy={view === "top" ? 211 + Math.abs(x) * .09 : 236 + Math.abs(x) * .1} r="6" fill={color} stroke="#fff" strokeWidth="1.4" />)}</>;
}

function HeadDetails({ config, view, headStroke }: { config: RingStudioPreviewConfig; view: View; headStroke: string }) {
  const halo = config.headType === "single_halo" || config.headType === "double_halo" || config.headType === "flower_halo";
  if (view === "side") {
    return (
      <g>
        <path d="M177 169h66M188 170l9 44M232 170l-9 44" fill="none" stroke={headStroke} strokeWidth="7" strokeLinecap="round" />
        <FacetedStone cx={210} cy={143} size={62} />
        {config.peekaboo && config.peekaboo !== "none" && <circle cx="210" cy="190" r="8" fill="url(#stone)" stroke="#fff" />}
      </g>
    );
  }
  return (
    <g>
      {halo && <circle cx="210" cy={view === "top" ? 185 : 142} r="48" fill="none" stroke="#eaf8ff" strokeWidth="10" strokeDasharray="3 5" />}
      {config.headType === "double_halo" && <circle cx="210" cy={view === "top" ? 185 : 142} r="59" fill="none" stroke="#eaf8ff" strokeWidth="8" strokeDasharray="3 5" />}
      <FacetedStone cx={210} cy={view === "top" ? 185 : 142} size={70} />
      <path d={view === "top" ? "M174 152l10 13M246 152l-10 13M174 218l12-13M246 218l-12-13" : "M178 111l13 14M242 111l-13 14M181 176l13-13M239 176l-13-13"} stroke={headStroke} strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

export function RingStudioPreview({ config, stoneImage, stoneAlt, mountingImage }: { config: RingStudioPreviewConfig; stoneImage?: string | null; stoneAlt: string; mountingImage?: string | null }) {
  const [view, setView] = useState<View>("front");
  const head = metal(config, "head");
  const shank = metal(config, "shank");
  const hasSideStones = Boolean(config.sideSetting && config.sideSetting !== "none");
  const sideColor = stoneColor(config.sideStoneType);
  const split = config.shankType === "split" || config.shankType === "double" || config.shankType === "double_twist";

  const bandPath = view === "front"
    ? "M68 275 Q210 173 352 275"
    : view === "side"
      ? "M80 224 C90 345 330 345 340 224"
      : "M75 190 C80 85 340 85 345 190 C340 300 80 300 75 190";
  const bandPath2 = view === "front" ? "M78 292 Q210 204 342 292" : view === "side" ? "M92 230 C106 326 314 326 328 230" : "M92 190 C96 105 324 105 328 190 C324 280 96 280 92 190";

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-[#b8894b]">Anteprima configurazione</p>
          <p className="mt-1 text-xs text-white/50">Rappresentazione illustrativa, non in scala</p>
        </div>
        <div className="grid shrink-0 grid-cols-3 rounded-lg border border-white/15 bg-[#111] p-1" role="tablist" aria-label="Vista anello">
          {(["front", "side", "top"] as const).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={view === item} onClick={() => setView(item)} className={`min-h-9 rounded-md px-2 text-[11px] transition-colors ${view === item ? "bg-[#b8894b] text-[#090909]" : "text-white/65 hover:text-white"}`}>
              {item === "front" ? "Fronte" : item === "side" ? "Profilo" : "Alto"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_35%,#25221d_0%,#0b0b0b_68%)]">
        <svg viewBox="0 0 420 360" className="block h-auto w-full" role="img" aria-label={`Anteprima illustrata di ${stoneAlt}, vista ${view}`}>
          <defs>
            <linearGradient id="headMetal" x1="0" y1="0" x2="1" y2="1"><stop stopColor={head.light}/><stop offset=".48" stopColor={head.mid}/><stop offset="1" stopColor={head.dark}/></linearGradient>
            <linearGradient id="shankMetal" x1="0" y1="0" x2="1" y2="1"><stop stopColor={shank.light}/><stop offset=".5" stopColor={shank.mid}/><stop offset="1" stopColor={shank.dark}/></linearGradient>
            <radialGradient id="stone"><stop stopColor="#fff"/><stop offset=".42" stopColor="#dff5ff"/><stop offset="1" stopColor="#708da8"/></radialGradient>
            <filter id="stoneShadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity=".55"/></filter>
            <filter id="ringShadow"><feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity=".55"/></filter>
          </defs>
          <ellipse cx="210" cy="315" rx="132" ry="18" fill="#000" opacity=".35" />
          <g filter="url(#ringShadow)">
            <path d={bandPath} fill="none" stroke="url(#shankMetal)" strokeWidth={config.shankType === "knife_edge" ? 18 : 25} strokeLinecap="round" />
            {split && <path d={bandPath2} fill="none" stroke="url(#shankMetal)" strokeWidth="11" strokeLinecap="round" />}
            {hasSideStones && <SideStones color={sideColor} view={view} />}
            {config.carvingType === "leaf" && <path d="M108 265q15-22 28 0m148 0q15-22 28 0" fill="none" stroke={shank.dark} strokeWidth="3" />}
            {config.carvingType === "scroll" && <path d="M105 266q18-25 35 0t35 0m70 0q18-25 35 0t35 0" fill="none" stroke={shank.dark} strokeWidth="3" />}
            <HeadDetails config={config} view={view} headStroke="url(#headMetal)" />
          </g>
        </svg>
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/65 px-3 py-2 backdrop-blur">
          {stoneImage ? <img src={stoneImage} alt="" className="h-9 w-9 rounded-md object-cover" /> : <Gem className="h-5 w-5 text-gold-deep" />}
          <div><p className="max-w-[160px] truncate text-xs text-bone/85">{stoneAlt}</p><p className="text-[10px] text-bone/40">Pietra selezionata</p></div>
        </div>
        {mountingImage && <div className="absolute bottom-3 right-3 hidden sm:block"><img src={mountingImage} alt="Montatura selezionata" className="h-14 w-14 rounded-lg border border-white/15 object-cover" /></div>}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-bone/45"><Check className="h-3.5 w-3.5 text-gold-deep" />Le modifiche alle opzioni aggiornano questa anteprima.</div>
    </div>
  );
}
