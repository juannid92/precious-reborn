import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { brand, rings } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import anelliHero from "@/assets/cara/anelli-hero.jpg";

export const Route = createFileRoute("/anelli")({
  head: () => ({
    meta: [
      { title: `Anelli — ${brand.name} · Solitari, fedi, anelli su misura` },
      {
        name: "description",
        content:
          "Anelli artigianali Cara Preziosi: Charlotte, Bouquet, Borbone, Ilaria. Solitari, anelli di fidanzamento, pezzi unici disegnati su misura nel laboratorio di Bari.",
      },
      { property: "og:title", content: `Anelli — ${brand.name}` },
      { property: "og:description", content: "Solitari, fedi, anelli su misura. Fatti a mano a Bari." },
      { property: "og:image", content: anelliHero },
    ],
    links: [{ rel: "canonical", href: "/anelli" }],
  }),
  component: AnelliPage,
});

function AnelliPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-obsidian text-bone pt-40 md:pt-56 pb-20 md:pb-32 overflow-hidden noise">
        <img
          src={anelliHero}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/70 to-obsidian" />
        <div className="relative container-cara">
          <p className="eyebrow text-gold mb-8">Collezione · Anelli</p>
          <Reveal as="h1" className="display-xl">
            <em className="italic font-display text-gold" style={{ fontStyle: "italic" }}>Otto</em> creazioni.<br />
            Otto modi di dire sì.
          </Reveal>
          <Reveal delay={0.15} className="mt-12 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-5 md:col-start-3 text-lg text-bone/75 leading-relaxed">
              Dal solitario Charlotte all'anello Bouquet con zaffiri colorati,
              ogni pezzo nasce nello stesso laboratorio. Pietre selezionate, oro
              fuso a cera persa, incastonatura a mano.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Names marquee */}
      <section className="bg-bone text-ink py-12 border-y border-ink/8 overflow-hidden">
        <Marquee speed={45}>
          {rings.map((r, i) => (
            <span key={i} className="font-display italic text-3xl md:text-5xl whitespace-nowrap">
              {r.name}<span className="not-italic text-gold-deep mx-6">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* GRID — asymmetric magazine */}
      <section className="bg-bone text-ink py-20 md:py-32">
        <div className="container-cara">
          <div className="grid gap-8 md:gap-10 md:grid-cols-12">
            {rings.map((r, i) => {
              // pattern: big — small — small — wide — small — big — small — wide
              const layouts = [
                "md:col-span-7 md:row-span-2",
                "md:col-span-5",
                "md:col-span-5",
                "md:col-span-6",
                "md:col-span-6",
                "md:col-span-4",
                "md:col-span-4",
                "md:col-span-4",
              ];
              const ratios = [
                "aspect-[4/5]",
                "aspect-[4/5]",
                "aspect-[4/5]",
                "aspect-[4/3]",
                "aspect-[4/3]",
                "aspect-square",
                "aspect-square",
                "aspect-square",
              ];
              return (
                <Reveal key={i} delay={(i % 3) * 0.06} className={layouts[i] ?? "md:col-span-4"}>
                  <RingCard ring={r} ratio={ratios[i] ?? "aspect-[4/5]"} index={i + 1} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* BESPOKE */}
      <section className="bg-obsidian text-bone py-32 md:py-48 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7">
            <p className="eyebrow text-gold mb-6">Su misura</p>
            <h2 className="display-lg">
              Il tuo anello<br />
              <em className="italic font-display text-gold" style={{ fontStyle: "italic" }}>non esiste ancora</em>.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-4 md:col-start-9">
            <p className="text-bone/70 leading-relaxed mb-8 text-lg">
              Portaci un'idea, una foto, un ricordo. Dal primo disegno alla
              consegna finale: tutto avviene nel nostro atelier.
            </p>
            <Link to="/contatti" className="btn-ghost text-bone group">
              Prenota un appuntamento
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function RingCard({ ring, ratio, index }: { ring: (typeof rings)[number]; ratio: string; index: number }) {
  return (
    <Link to="/contatti" className="group block">
      <div className={`relative ${ratio} overflow-hidden bg-bone-deep`}>
        <img
          src={ring.image}
          alt={ring.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-colors duration-500" />
        <div className="absolute top-4 left-4 text-xs tracking-[0.3em] uppercase text-bone/0 group-hover:text-bone transition-colors duration-500">
          № {String(index).padStart(2, "0")}
        </div>
        <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <span className="inline-flex items-center gap-2 bg-bone text-ink px-4 py-2 text-[10px] uppercase tracking-[0.28em]">
            Richiedi info <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl md:text-3xl leading-tight">{ring.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">{ring.description}</p>
        </div>
        <p className="font-display italic text-gold-deep text-lg whitespace-nowrap shrink-0">{ring.price}</p>
      </div>
    </Link>
  );
}
