import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, RotateCcw, Search } from "lucide-react";
import { MediaPietraNivoda } from "@/components/MediaPietraNivoda";

import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchNivodaGemstones } from "@/lib/gemstones.functions";
import {
  GEM_CARAT_MAX,
  GEM_CARAT_MIN,
  GEM_COLOR_OPTIONS,
  GEM_PAGE_SIZE,
  GEM_SEARCH_COOLDOWN_SECONDS,
  GEM_SHAPE_OPTIONS,
  GEM_SORT_OPTIONS,
  GEM_TYPE_OPTIONS,
  type GemSort,
  type Gemstone,
} from "@/lib/gemstones-types";

export const Route = createFileRoute("/crea-il-tuo-gioiello_/pietra-di-colore")({
  head: () => ({
    meta: [
      { title: "Pietre di colore · Cara Preziosi" },
      {
        name: "description",
        content:
          "Zaffiri, rubini, smeraldi e altre gemme certificate per il tuo gioiello su misura, selezionate dall'atelier Cara Preziosi a Bari.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Pietre di colore · Cara Preziosi" },
      {
        property: "og:description",
        content:
          "Gemme colorate certificate, selezionate singolarmente dall'atelier Cara Preziosi di Bari.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PietreDiColorePage,
});

type Filters = {
  types: string[];
  color: string[];
  shapes: string[];
  caratFrom: number;
  caratTo: number;
  sort: GemSort;
};

const DEFAULT_FILTERS: Filters = {
  types: [],
  color: [],
  shapes: [],
  caratFrom: GEM_CARAT_MIN,
  caratTo: GEM_CARAT_MAX,
  sort: "carat_asc",
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function buildBody(f: Filters, page: number) {
  const body: Record<string, unknown> = {
    caratFrom: f.caratFrom,
    caratTo: f.caratTo,
    sort: f.sort,
    page,
    pageSize: GEM_PAGE_SIZE,
  };
  if (f.types.length) body.types = f.types;
  if (f.color.length) body.color = f.color;
  if (f.shapes.length) body.shapes = f.shapes;
  return body;
}

function PietreDiColorePage() {
  const search = useServerFn(searchNivodaGemstones);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [items, setItems] = useState<Gemstone[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "loadingMore" | "error">("loading");
  const [cooldown, setCooldown] = useState(0);

  // filtri effettivamente applicati all'ultima ricerca
  const appliedRef = useRef<Filters>(DEFAULT_FILTERS);
  const firstLoad = useRef(true);

  // Conto alla rovescia fra due richieste consecutive al fornitore.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const run = useCallback(
    async (f: Filters, nextPage: number, append: boolean) => {
      setStatus(append ? "loadingMore" : "loading");
      setCooldown(GEM_SEARCH_COOLDOWN_SECONDS);
      try {
        const res = await search({ data: buildBody(f, nextPage) });
        setItems((prev) => (append ? [...prev, ...res.items] : res.items));
        setHasMore(res.hasMore);
        setPage(nextPage);
        appliedRef.current = f;
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    },
    [search],
  );

  useEffect(() => {
    if (!firstLoad.current) return;
    firstLoad.current = false;
    void run(DEFAULT_FILTERS, 0, false);
  }, [run]);

  const loading = status === "loading";
  const blocked = loading || status === "loadingMore" || cooldown > 0;

  const searchLabel = loading ? "Ricerca…" : cooldown > 0 ? `Attendi ${cooldown}s` : "Cerca";

  return (
    <main className="bg-bone text-ink">
      <section className="relative pt-36 md:pt-44 pb-12 md:pb-16 overflow-hidden">
        <span
          className="glow-orb glow-orb-bone block"
          style={{ width: "680px", height: "680px", top: "-12%", right: "-200px" }}
        />
        <div className="container-cara relative">
          <Link
            to="/crea-il-tuo-gioiello"
            className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-ink/60 hover:text-gold-deep transition-colors mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Torna al configuratore
          </Link>
          <PageBreadcrumb current="Pietre di colore" className="mb-8" />
          <p className="eyebrow text-gold-deep mb-6">
            Il secondo passo, se desideri una gemma colorata al posto del diamante.
          </p>
          <h1
            className="font-display leading-[1] text-ink max-w-[16ch]"
            style={{ fontSize: "clamp(2.3rem, 5vw, 4.5rem)" }}
          >
            Pietre di<span className="italic text-gold-deep"> colore.</span>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Ogni gemma è selezionata singolarmente e certificata. Il prezzo viene definito insieme
            a te in base alla creazione che sceglierai: contattaci per un preventivo dedicato.
          </p>
        </div>
      </section>

      <section className="pb-32 md:pb-44">
        <div className="container-cara">
          {/* ── Filtri ── */}
          <div className="rounded-2xl border border-ink/12 bg-bone/60 p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <FilterBlock label="Tipo di pietra">
                <div className="flex flex-wrap gap-2">
                  {GEM_TYPE_OPTIONS.map((t) => (
                    <Chip
                      key={t.value}
                      active={filters.types.includes(t.value)}
                      onClick={() =>
                        setFilters((f) => ({ ...f, types: toggle(f.types, t.value) }))
                      }
                    >
                      {t.label}
                    </Chip>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock label="Colore">
                <div className="flex flex-wrap gap-2">
                  {GEM_COLOR_OPTIONS.map((c) => (
                    <Chip
                      key={c.value}
                      active={filters.color.includes(c.value)}
                      onClick={() =>
                        setFilters((f) => ({ ...f, color: toggle(f.color, c.value) }))
                      }
                    >
                      {c.label}
                    </Chip>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock label="Forma">
                <div className="flex flex-wrap gap-2">
                  {GEM_SHAPE_OPTIONS.map((s) => (
                    <Chip
                      key={s.value}
                      active={filters.shapes.includes(s.value)}
                      onClick={() =>
                        setFilters((f) => ({ ...f, shapes: toggle(f.shapes, s.value) }))
                      }
                    >
                      {s.label}
                    </Chip>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock label="Carati">
                <div className="flex flex-wrap items-end gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-ink/55">Da</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={100}
                      step={0.1}
                      value={filters.caratFrom}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, caratFrom: Number(e.target.value) }))
                      }
                      className="w-28 rounded-full border border-ink/15 bg-bone px-4 py-2 text-sm text-ink outline-none focus:border-gold-deep"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-ink/55">A</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={100}
                      step={0.1}
                      value={filters.caratTo}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, caratTo: Number(e.target.value) }))
                      }
                      className="w-28 rounded-full border border-ink/15 bg-bone px-4 py-2 text-sm text-ink outline-none focus:border-gold-deep"
                    />
                  </label>
                </div>
              </FilterBlock>

              <FilterBlock label="Ordina per">
                <Select
                  value={filters.sort}
                  onValueChange={(v) => setFilters((f) => ({ ...f, sort: v as GemSort }))}
                >
                  <SelectTrigger className="w-full rounded-full border-ink/15 bg-bone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GEM_SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterBlock>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-6">
              <button
                type="button"
                onClick={() => void run(filters, 0, false)}
                disabled={blocked}
                className="btn-primary group inline-flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {searchLabel}
              </button>
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink/60 hover:text-gold-deep transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Azzera filtri
              </button>
              <p className="text-xs text-muted-foreground">
                La ricerca parte solo quando premi «Cerca».
              </p>
            </div>
          </div>

          {/* ── Risultati ── */}
          <div className="mt-12 md:mt-16">
            {status === "error" && (
              <div className="rounded-2xl border border-ink/12 bg-bone/60 p-10 text-center">
                <p className="font-display text-2xl text-ink">
                  Catalogo pietre momentaneamente non disponibile. Riprova tra qualche istante.
                </p>
                <button
                  type="button"
                  onClick={() => void run(appliedRef.current, 0, false)}
                  disabled={cooldown > 0}
                  className="btn-primary mt-8 disabled:opacity-60"
                >
                  {cooldown > 0 ? `Attendi ${cooldown}s` : "Riprova"}
                </button>
              </div>
            )}

            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: GEM_PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-ink/10 overflow-hidden">
                    <div className="aspect-square animate-pulse bg-ink/5" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-2/3 animate-pulse rounded bg-ink/5" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-ink/5" />
                      <div className="h-4 w-1/3 animate-pulse rounded bg-ink/10" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && status !== "error" && items.length === 0 && (
              <div className="rounded-2xl border border-ink/12 bg-bone/60 p-10 text-center">
                <p className="font-display text-2xl text-ink">
                  Nessuna pietra corrisponde ai criteri scelti. Prova ad ampliare la ricerca.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                    void run(DEFAULT_FILTERS, 0, false);
                  }}
                  disabled={cooldown > 0}
                  className="btn-primary mt-8 disabled:opacity-60"
                >
                  {cooldown > 0 ? `Attendi ${cooldown}s` : "Azzera filtri"}
                </button>
              </div>
            )}

            {!loading && status !== "error" && items.length > 0 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {items.map((g, i) => (
                    <GemstoneCard key={`${g.gemId ?? "x"}-${i}`} gem={g} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-14 flex justify-center">
                    <button
                      type="button"
                      onClick={() => void run(appliedRef.current, page + 1, true)}
                      disabled={blocked}
                      className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                    >
                      {status === "loadingMore" && <Loader2 className="h-4 w-4 animate-spin" />}
                      {status === "loadingMore"
                        ? "Caricamento…"
                        : cooldown > 0
                          ? `Attendi ${cooldown}s`
                          : "Carica altre pietre"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-ink/55 mb-3">{label}</p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs tracking-wide transition-all duration-300 ${
        active
          ? "border-gold-deep bg-gold-deep text-bone"
          : "border-ink/15 bg-bone/60 text-ink/70 hover:border-gold-deep/60 hover:text-ink"
      }`}
    >
      {active && <Check className="h-3 w-3" strokeWidth={3} />}
      {children}
    </button>
  );
}

function GemstoneCard({ gem }: { gem: Gemstone }) {
  const navigate = useNavigate();

  const title = gem.title ?? gem.gemLabel ?? "Pietra certificata";

  const specLine = [gem.shapeLabel, gem.caratsLabel, gem.clarityLabel].filter(
    (v): v is string => Boolean(v),
  );

  const tags = [
    gem.untreated ? "Non trattata" : null,
    gem.curated ? "Selezione curata" : null,
  ].filter((v): v is string => Boolean(v));

  const go = () => {
    if (!gem.gemId) return;
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId",
      params: { gemId: gem.gemId },
    });
  };

  return (
    <article
      onClick={go}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      }}
      className="group flex cursor-pointer flex-col rounded-2xl border border-ink/12 bg-bone/50 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-gold-deep/60 hover:shadow-[0_18px_50px_-28px_oklch(0.58_0.085_60/0.6)]"
    >
      <div className="relative aspect-square overflow-hidden bg-bone-deep/40">
        <MediaPietraNivoda 
          image={gem.image} 
          video={gem.video} 
          alt={title} 
        />
        <div className="absolute inset-0 z-20" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-lg font-semibold leading-tight text-ink">{title}</p>
        {specLine.length > 0 && (
          <p className="mt-1.5 text-[11px] text-ink/55">{specLine.join(" · ")}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-ink/10 bg-ink/[0.04] px-2.5 py-1 text-[10px] tracking-wide text-ink/55"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {gem.origin && (
          <p className="mt-2.5 text-xs uppercase tracking-[0.18em] text-ink/45">
            Origine: {gem.origin}
          </p>
        )}
      </div>
    </article>
  );
}
