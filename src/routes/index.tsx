import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { brand, categories, home, rings, processSteps, atelierManifesto } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { PinnedProcess } from "@/components/motion/PinnedProcess";



const Marquee = lazy(() => import("@/components/motion/Marquee").then(mod => ({ default: mod.Marquee })));
const PremiumServicesVideo = lazy(() => import("@/components/motion/PremiumServicesVideo").then(mod => ({ default: mod.PremiumServicesVideo })));


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cara Preziosi — Atelier Orafo Artigianale a Bari" },
      {
        name: "description",
        content:
          "Atelier orafo artigianale di Nicola Caradonna a Bari. Gioielli unici su misura con configuratore 3D, restauro e manutenzione professionale.",
      },
      { property: "og:title", content: "Cara Preziosi — Atelier Orafo Artigianale a Bari" },
      {
        property: "og:description",
        content:
          "Atelier orafo artigianale di Nicola Caradonna a Bari. Gioielli unici su misura con configuratore 3D, restauro e manutenzione professionale.",
      },
      { property: "og:url", content: "https://www.carapreziosi.it/" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:image", content: `https://www.carapreziosi.it${home.heroImage}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cara Preziosi — Atelier Orafo Artigianale a Bari" },
      {
        name: "twitter:description",
        content:
          "Atelier orafo artigianale di Nicola Caradonna a Bari. Gioielli unici su misura con configuratore 3D, restauro e manutenzione professionale.",
      },
      { name: "twitter:image", content: `https://www.carapreziosi.it${home.heroImage}` },
    ],
    links: [{ rel: "canonical", href: "https://www.carapreziosi.it/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const heroImgRef = useRef<HTMLVideoElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // ─── Entrance — leggera, condivisa tra breakpoint ───
      const title = heroTitleRef.current;
      if (title) {
        const words = title.querySelectorAll("[data-word]");
        gsap.from(words, {
          yPercent: 110,
          duration: 1.3,
          stagger: 0.09,
          delay: 0.35,
          ease: "power4.out",
        });
      }
      gsap.from("[data-hero-eyebrow]", {
        autoAlpha: 0,
        y: 16,
        duration: 0.9,
        delay: 0.2,
        ease: "power2.out",
      });
      gsap.from("[data-hero-meta]", {
        autoAlpha: 0,
        y: 18,
        duration: 1,
        delay: 1.05,
        ease: "power2.out",
      });

      // ─── Image: mask reveal + Ken Burns lentissimo (anche mobile) ───
      if (heroImgRef.current) {
        gsap.from(heroImgRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.6,
          delay: 0.3,
          ease: "power4.out",
        });
        gsap.to(heroImgRef.current, {
          scale: 1.08,
          duration: 18,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      }

      // ─── Parallax: solo desktop, no su mobile ───
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(heroImgRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, heroRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  const heroWords = ["Gioielli", "che si", "riconoscono."];

  return (
    <>
      {/* ───── HERO — H-A · Editorial Still, foto protagonista (unified mobile) ───── */}
      <section
        ref={heroRef}
        className="relative bg-bone text-ink overflow-hidden min-h-[100svh] lg:min-h-screen"
      >
        {/* Foto protagonista
           Mobile: full-bleed background della hero (composizione unica)
           Desktop: bleed a destra ~60% */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[58%] xl:w-[60%]">
          <div className="absolute inset-0 overflow-hidden bg-bone-deep">
            <video
              ref={heroImgRef}
              src="/media/hero.mp4"
              aria-label="Gioiello Cara Preziosi — atelier orafo Bari"
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              controls={false}
              preload="auto"
              poster={home.heroImage}
              onEnded={(e) => {
                const v = e.currentTarget;
                v.currentTime = 0;
                void v.play().catch(() => {});
              }}
              onPause={(e) => {
                const v = e.currentTarget;
                if (!v.ended) void v.play().catch(() => {});
              }}
            />

            {/* MOBILE: warm bone gradient bottom→top */}
            <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-bone via-bone/80 via-35% to-bone/10 pointer-events-none" />
            {/* DESKTOP: warm bone fade verso sinistra */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bone via-bone/60 to-transparent pointer-events-none" />
            <div className="hidden lg:block absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/25 via-ink/5 to-transparent pointer-events-none" />
          </div>

          <div className="hidden lg:flex absolute bottom-8 right-10 text-bone text-[11px] tracking-[0.28em] uppercase mix-blend-difference">
            <span className="text-gold">№ 01</span>
            <span className="mx-3 opacity-50">·</span>
            Anello con diamante · oro 18kt
          </div>
        </div>

        {/* Layer testo: mobile sotto la foto, desktop colonna sinistra */}
        <div className="relative container-cara min-h-[100svh] lg:min-h-screen flex flex-col justify-end lg:justify-center pt-[52vh] lg:pt-32 pb-12 lg:pb-24">
          <div className="lg:max-w-[48%] xl:max-w-[46%]">
            <p
              data-hero-eyebrow
              className="eyebrow text-gold-deep mb-6 md:mb-10 flex items-center gap-4"
            >
              <span className="inline-block h-px w-10 bg-gold-deep" />
              Atelier orafo · Bari · dal 1985
            </p>

            <h1
              ref={heroTitleRef}
              className="font-display font-light leading-[0.98] tracking-[-0.025em] text-[clamp(2.25rem,5.6vw,5.25rem)]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 35' }}
              aria-label={heroWords.join(" ")}
            >
              {heroWords.map((w, i) => (
                <span key={i} className="block overflow-hidden">
                  <span data-word className="block">
                    {i === 2 ? (
                      <em className="font-display text-gold-deep" style={{ fontStyle: "italic" }}>
                        {w}
                      </em>
                    ) : (
                      w
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <div
              data-hero-meta
              className="mt-7 md:mt-14 space-y-6 md:space-y-8 lg:max-w-md"
            >
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-md">
                Quarant'anni di mestiere. Niente serie, niente catalogo infinito.
                Solo creazioni uniche, pensate per durare oltre chi le indossa.
              </p>
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <Link to="/categorie" className="btn-primary group">
                  Le collezioni
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <Link to="/contatti" className="btn-ghost text-ink">
                  Su appuntamento
                </Link>
              </div>

              <p className="lg:hidden text-[10px] tracking-[0.28em] uppercase text-ink/50 pt-2">
                <span className="text-gold-deep">№ 01</span>
                <span className="mx-2 opacity-50">·</span>
                Orecchino Charlotte con perla e diamanti · oro 18kt
              </p>
            </div>
          </div>

          <div className="hidden lg:flex absolute bottom-10 left-[max(1.25rem,4vw)] items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
            <span className="inline-block h-px w-8 bg-muted-foreground/50" />
            Scorri
          </div>
        </div>
      </section>


      {/* ───── §01 INTRO MANIFESTO ───── */}
      <section className="bg-bone text-ink py-32 md:py-48 section-cv">
        <div className="container-cara grid gap-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-2 md:pt-2">
            <p className="eyebrow text-gold-deep">§ 01</p>
          </div>
          <Reveal as="div" className="md:col-span-7">
            <h2 className="display-lg">
              Dal <em className="italic font-display text-gold-deep not-italic" style={{ fontStyle: "italic" }}>1985</em>,
              ogni gioiello passa dalle stesse mani.
            </h2>
          </Reveal>
          <Reveal as="div" delay={0.15} className="md:col-span-3 md:pb-3">
            <p className="text-muted-foreground text-base leading-relaxed">
              Quelle di Nicola Caradonna. Maestro orafo, disegnatore,
              incastonatore. Tutto in un solo laboratorio, a Bari.
            </p>
          </Reveal>
        </div>
      </section>


      {/* ───── PINNED PROCESS WIZARD ───── */}
      <PinnedProcess
        eyebrow="Il processo"
        title="Cinque atti, una creazione"
        steps={processSteps}
      />


      {/* ───── §02 COLLEZIONI — magazine asimmetrico ───── */}
      <section className="bg-bone text-ink py-32 md:py-48 section-cv">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 md:items-end mb-20">
            <div className="md:col-span-2">
              <p className="eyebrow text-gold-deep">§ 02</p>
            </div>
            <Reveal as="div" className="md:col-span-7">
              <h2 className="display-lg">{home.intro.title}</h2>
            </Reveal>
            <Reveal as="p" delay={0.1} className="md:col-span-3 text-muted-foreground leading-relaxed md:pb-3">
              {home.intro.body}
            </Reveal>
          </div>

          {/* Asymmetric magazine */}
          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            {/* Anelli — large vertical */}
            <Reveal className="md:col-span-7 md:row-span-2">
              <CollectionCard cat={categories[0]} ratio="aspect-[4/5] md:aspect-[3/4]" big />
            </Reveal>
            <Reveal className="md:col-span-5" delay={0.1}>
              <CollectionCard cat={categories[1]} ratio="aspect-[4/3]" />
            </Reveal>
            <Reveal className="md:col-span-5" delay={0.2}>
              <CollectionCard cat={categories[2]} ratio="aspect-[4/3]" />
            </Reveal>
          </div>
        </div>
      </section>


      {/* ───── MARQUEE — creazioni atelier (baroque rail) ───── */}
      <section className="bg-bone-deep text-ink py-16 md:py-20 overflow-hidden section-cv">
        <p className="eyebrow text-gold-deep text-center mb-6">Le creazioni · Atelier Caradonna</p>
        <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
          {/* Baroque frame */}
          <div
            className="relative rounded-[2px] p-[2px]"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.215 0.130 265) 0%, oklch(0.72 0.082 75) 50%, oklch(0.215 0.130 265) 100%)",
              boxShadow:
                "0 10px 40px -20px oklch(0.215 0.130 265 / 0.45), inset 0 0 0 1px oklch(0.72 0.082 75 / 0.35)",
            }}
          >
            {/* Inner bar */}
            <div
              className="relative overflow-hidden rounded-[2px] py-3 md:py-4"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.20 0.135 265) 0%, oklch(0.27 0.130 265) 50%, oklch(0.20 0.135 265) 100%)",
              }}
            >
              {/* Baroque corner flourishes */}
              <span aria-hidden className="pointer-events-none absolute top-1 left-2 text-gold/70 text-sm select-none">❦</span>
              <span aria-hidden className="pointer-events-none absolute top-1 right-2 text-gold/70 text-sm select-none">❦</span>
              <span aria-hidden className="pointer-events-none absolute bottom-1 left-2 text-gold/70 text-sm select-none">❦</span>
              <span aria-hidden className="pointer-events-none absolute bottom-1 right-2 text-gold/70 text-sm select-none">❦</span>

              {/* Edge fades */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10" style={{ background: "linear-gradient(90deg, oklch(0.20 0.135 265) 0%, transparent 100%)" }} />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10" style={{ background: "linear-gradient(270deg, oklch(0.20 0.135 265) 0%, transparent 100%)" }} />

              <Suspense fallback={<div className="h-8 md:h-10" />}>
                <Marquee speed={55}>
                  {[
                    "Anelli di fidanzamento",
                    "Fedi nuziali",
                    "Solitari",
                    "Trilogy",
                    "Orecchini a lobo",
                    "Pendenti",
                    "Collane in oro",
                    "Bracciali tennis",
                    "Girocollo",
                    "Ciondoli",
                    "Anelli eternity",
                    "Orecchini chandelier",
                    "Bracciali rigidi",
                    "Pezzi unici",
                    "Su misura",
                    "Rimontaggi",
                  ].map((w, i) => (
                    <span
                      key={i}
                      className="font-display italic whitespace-nowrap text-2xl md:text-3xl tracking-wide"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, oklch(0.72 0.082 75) 0%, oklch(0.92 0.06 85) 50%, oklch(0.72 0.082 75) 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {w}
                      <span aria-hidden className="not-italic mx-6 text-gold/70">✦</span>
                    </span>
                  ))}
                </Marquee>
              </Suspense>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/categorie" className="underline-gold text-sm uppercase tracking-[0.28em]">
            Vedi la collezione
          </Link>
        </div>
      </section>

      {/* ───── COME NASCE UN GIOIELLO — editorial vertical narrative ───── */}
      <div className="section-cv atm-bridge-down">
        <JewelGenesisSection />
      </div>


      {/* ───── §03 MANIFESTO ATELIER — tipografia gigante ───── */}
      <section className="relative bg-obsidian text-bone py-32 md:py-56 noise overflow-hidden section-cv atm-bridge-up atm-bridge-down">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-16">
            <div className="md:col-span-2">
              <p className="eyebrow text-gold">§ 03</p>
            </div>
            <Reveal className="md:col-span-10">
              <p className="eyebrow text-gold/80">{atelierManifesto.eyebrow}</p>
            </Reveal>
          </div>
          <Reveal>
            <h2 className="display-xl whitespace-pre-line">
              {atelierManifesto.bigQuote.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? <em className="text-gold font-display" style={{ fontStyle: "italic" }}>{line}</em> : line}
                </span>
              ))}
            </h2>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-12 mt-20">
            <div className="md:col-span-2" />
            <Reveal as="p" delay={0.1} className="md:col-span-6 text-bone/70 text-lg leading-relaxed">
              {atelierManifesto.body}
            </Reveal>
            <Reveal delay={0.2} className="md:col-span-3 md:col-start-10 self-end">
              <p className="font-display italic text-gold text-xl mb-4">{atelierManifesto.signature}</p>
              <Link to="/storia" className="underline-gold text-sm uppercase tracking-[0.28em] text-bone">
                Conosci l'atelier
              </Link>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ───── §04 SERVIZI — video ───── */}
      <Suspense fallback={<div className="bg-bone" />}>
        <PremiumServicesVideo />
      </Suspense>


      {/* Sotto-stripe ponte verso "tutti i servizi" */}
      <section className="bg-bone text-ink py-16 md:py-24 section-cv">
        <div className="container-cara flex flex-wrap items-center gap-6 justify-between">
          <p className="font-display italic text-xl md:text-2xl text-ink/80 max-w-xl">
            Ogni servizio si svolge interamente nel nostro laboratorio di Bari.
          </p>
          <Link to="/servizi" className="underline-gold text-sm uppercase tracking-[0.28em]">
            Tutti i servizi
          </Link>
        </div>
      </section>


      {/* ───── CLOSING APPOINTMENT ───── */}
      <section className="bg-bone-deep text-ink py-32 md:py-48 noise section-cv atm-bridge-up">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-8">
            <p className="eyebrow text-gold-deep mb-6">L'incontro</p>
            <h2 className="display-lg">
              Veniamo al sodo:<br />
              <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>prenota una visita</em> in atelier.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-4 space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Bevi un caffè, racconta cosa hai in mente. Esci con un'idea chiara
              di cosa diventerà il tuo gioiello.
            </p>
            <Link to="/contatti" className="btn-primary group">
              Prenota una visita
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function CollectionCard({
  cat,
  ratio,
  big = false,
}: {
  cat: (typeof categories)[number];
  ratio: string;
  big?: boolean;
}) {
  return (
    <Link
      to={cat.to}
      className={`group relative block ${ratio} overflow-hidden bg-obsidian`}
    >
      <img
        src={cat.image}
        alt={
          cat.slug === "anelli"
            ? "Anelli Cara Preziosi"
            : cat.slug === "orecchini"
            ? "Orecchini Cara Preziosi"
            : "Collane e bracciali Cara Preziosi"
        }
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between text-bone">
        <div className="flex items-start justify-between">
          <p className="eyebrow text-gold">{cat.number}</p>
          <span className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <ArrowUpRight className="h-6 w-6 text-bone" />
          </span>
        </div>
        <div>
          <h3 className={big ? "display-lg text-bone" : "display-md text-bone"}>{cat.name}</h3>
          <p className="mt-4 text-bone/75 max-w-md leading-relaxed text-sm md:text-base">
            {cat.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ───────────────────────────────────────────────────────────
 * Come nasce un gioiello — sezione narrativa editoriale
 * Layout verticale, step alternati, hairline connector dorato,
 * numerali italici giganti, reveal scroll-trigger leggero.
 * ─────────────────────────────────────────────────────────── */
function JewelGenesisSection() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      // Step reveal animations rimosse — testo sempre visibile, niente ritardo durante lo scroll
      // Hairline draw
      gsap.utils.toArray<HTMLElement>("[data-genesis-rail]").forEach((rail) => {
        gsap.from(rail, {
          scaleY: 0,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: { trigger: rail, start: "top 90%", end: "bottom 60%", scrub: true },
        });
      });
      setTimeout(() => ScrollTrigger.refresh(), 200);
    }, el);
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      n: "01",
      eyebrow: "Ascolto",
      title: "Si comincia da un racconto.",
      body: "Una persona da celebrare, un ricordo, una promessa. Il gioiello nasce qui, molto prima della matita.",
    },
    {
      n: "02",
      eyebrow: "Disegno",
      title: "L'idea prende forma a mano.",
      body: "Lo schizzo studia proporzioni, volumi, equilibri. Si torna sul foglio finché ogni linea è giusta.",
    },
    {
      n: "03",
      eyebrow: "Materia",
      title: "Si scelgono oro e pietre.",
      body: "Ogni elemento è selezionato, mai accumulato. Si valuta colore, taglio, purezza — uno per uno.",
    },
    {
      n: "04",
      eyebrow: "Mano",
      title: "Il laboratorio entra in scena.",
      body: "Fusione, modellazione, incastonatura. Tutto in atelier, sotto le stesse mani da quarant'anni.",
    },
    {
      n: "05",
      eyebrow: "Consegna",
      title: "Lucidato, controllato, pronto.",
      body: "Rifinitura finale, verifica, presentazione. Esce dall'atelier un pezzo unico, pronto a essere portato.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-bone text-ink py-32 md:py-48 overflow-hidden"
    >
      {/* Glow orb ambientale — luce showroom */}
      <span className="glow-orb glow-orb-bone block" style={{ width: "640px", height: "640px", top: "10%", right: "-160px" }} />
      <span className="glow-orb block" style={{ width: "520px", height: "520px", bottom: "5%", left: "-140px", opacity: 0.35 }} />

      <div className="container-cara relative">
        {/* Intestazione */}
        <div className="grid gap-10 md:grid-cols-12 md:items-end mb-24 md:mb-32">
          <div className="md:col-span-2">
            <p className="eyebrow text-gold-deep">§ ·</p>
          </div>
          <Reveal as="div" className="md:col-span-7" start="top bottom">
            <h2 className="display-lg">
              Come <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>nasce</em> un gioiello.
            </h2>
          </Reveal>
          <Reveal as="p" delay={0.1} className="md:col-span-3 text-muted-foreground leading-relaxed md:pb-3" start="top bottom">
            Cinque gesti, in un unico laboratorio. Niente serie, niente scorciatoie: solo la traiettoria che porta un'idea a diventare materia preziosa.
          </Reveal>
        </div>

        {/* Steps verticali, alternati */}
        <div className="relative md:pl-[8%] lg:pl-[10%] md:pr-[6%] lg:pr-[8%] md:mx-auto md:max-w-5xl lg:max-w-6xl">
          {steps.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <div key={s.n} data-genesis-step className="relative pb-20 md:pb-28 last:pb-0">
                {/* Hairline connector verticale tra gli step (no sull'ultimo) */}
                {i < steps.length - 1 && (
                  <span
                    data-genesis-rail
                    aria-hidden="true"
                    className="absolute left-3 md:left-[2px] top-16 md:top-20 bottom-0 w-px"
                    style={{
                      background:
                        "linear-gradient(to bottom, oklch(0.72 0.082 75 / 0.6) 0%, oklch(0.72 0.082 75 / 0.15) 60%, transparent 100%)",
                    }}
                  />
                )}

                {/* Marker dot dorato a inizio step */}
                <span
                  aria-hidden="true"
                  className="absolute left-2 md:-left-1 top-3 md:top-5 h-2 w-2 rounded-full bg-gold-deep"
                  style={{ boxShadow: "0 0 0 6px oklch(0.72 0.082 75 / 0.12)" }}
                />

                <div className={`grid gap-8 md:gap-14 md:grid-cols-12 items-start pl-10 md:pl-12 ${reverse ? "md:[direction:rtl]" : ""}`}>
                  {/* Numerale grande */}
                  <div className="md:col-span-4 md:[direction:ltr]">
                    <p
                      data-genesis-num
                      className="font-display italic leading-none text-gold-deep"
                      style={{
                        fontSize: "clamp(4.5rem, 9vw, 9rem)",
                        fontStyle: "italic",
                        fontVariationSettings: '"opsz" 144, "SOFT" 50',
                      }}
                    >
                      {s.n}
                    </p>
                  </div>

                  {/* Testo */}
                  <div
                    data-genesis-body
                    className="md:col-span-7 md:col-start-6 md:[direction:ltr] space-y-5 max-w-xl"
                  >
                    <p className="eyebrow text-gold-deep">{s.eyebrow}</p>
                    <h3 className="display-md leading-tight">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{s.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA chiusura — ponte verso configuratore atelier */}
        <Reveal start="top bottom" className="mt-20 md:mt-28 md:pl-[8%] lg:pl-[10%] md:pr-[6%] lg:pr-[8%] md:mx-auto md:max-w-5xl lg:max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-gold-deep/30 bg-obsidian text-bone p-8 md:p-12">
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(70% 60% at 80% 20%, oklch(0.72 0.082 75 / 0.18) 0%, transparent 60%), radial-gradient(50% 50% at 10% 90%, oklch(0.58 0.085 60 / 0.22) 0%, transparent 70%)",
              }}
            />
            <div className="relative grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8 space-y-4">
                <p className="eyebrow text-gold-deep">Atelier · Nuova esperienza</p>
                <h3 className="font-display leading-[1.02]" style={{ fontSize: "clamp(1.875rem, 3.6vw, 3rem)" }}>
                  Trasforma un'ispirazione in <em className="italic text-gold-deep" style={{ fontStyle: "italic" }}>una creazione su misura.</em>
                </h3>
                <p className="text-bone/70 text-base md:text-lg leading-relaxed max-w-xl">
                  Carica un'immagine, definisci il tuo stile, scopri la prima interpretazione del nostro atelier.
                  Un dialogo guidato — non un acquisto online.
                </p>
              </div>
              <div className="md:col-span-4 flex md:justify-end gap-3 flex-wrap">
                <Link to="/crea-il-tuo-gioiello" className="btn-primary">
                  Inizia il percorso
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <span className="hairline-gold flex-1 hidden md:block max-w-[220px]" />
            <p className="font-display italic text-xl text-ink/80">Preferisci farlo dal vivo?</p>
            <Link to="/contatti" className="btn-ghost text-ink">
              Prenota una visita
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
