import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { brand, categories, rings } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";

export const Route = createFileRoute("/categorie")({
  head: () => ({
    meta: [
      { title: `Collezioni — ${brand.name}` },
      {
        name: "description",
        content:
          "Tre famiglie di gioielli artigianali Cara Preziosi: anelli, orecchini, collane e bracciali. Pezzi unici fatti a mano nel laboratorio di Bari.",
      },
      { property: "og:title", content: `Collezioni — ${brand.name}` },
      { property: "og:description", content: "Anelli, orecchini, collane e bracciali artigianali." },
    ],
    links: [{ rel: "canonical", href: "/categorie" }],
  }),
  component: CategoriePage,
});

function CategoriePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-bone text-ink pt-40 md:pt-56 pb-20 md:pb-32">
        <div className="container-cara">
          <p className="eyebrow text-gold-deep mb-8">Le collezioni</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Tre famiglie,<br />
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>una sola firma</em>.
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-5 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              Anelli, orecchini, collane e bracciali. Ogni famiglia ha la sua
              voce, ma tutte parlano la stessa lingua: artigianato italiano,
              mano del maestro, materia preziosa scelta a una a una.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Marquee */}
      <section className="bg-bone overflow-hidden py-8 border-y border-ink/8">
        <Marquee speed={60}>
          {["Anelli", "Orecchini", "Collane", "Bracciali", "Pezzi unici", "Su misura"].map((w, i) => (
            <span key={i} className="font-display italic text-3xl md:text-5xl text-ink whitespace-nowrap">
              {w}<span className="not-italic text-gold-deep mx-6">·</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* CATEGORIES — alternating zigzag */}
      <section className="bg-bone text-ink">
        {categories.map((cat, i) => {
          const reverse = i % 2 === 1;
          return (
            <article
              key={cat.slug}
              className={`grid md:grid-cols-12 md:items-center min-h-[90vh] ${reverse ? "" : ""}`}
            >
              <div className={`md:col-span-7 ${reverse ? "md:order-2" : ""} relative aspect-[4/3] md:aspect-auto md:h-[90vh]`}>
                <Reveal y={0} className="absolute inset-0 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </Reveal>
              </div>
              <div className={`md:col-span-4 ${reverse ? "md:col-start-2 md:order-1" : "md:col-start-9"} p-10 md:p-16`}>
                <Reveal>
                  <p className="font-display italic text-gold-deep text-2xl mb-4">§ {cat.number}</p>
                  <h2 className="display-lg mb-6">{cat.name}</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
                    {cat.description}
                  </p>
                  <Link to="/contatti" className="underline-gold text-sm uppercase tracking-[0.28em]">
                    Richiedi in atelier
                  </Link>
                </Reveal>
              </div>
            </article>
          );
        })}
      </section>

      {/* Bespoke CTA */}
      <section className="bg-obsidian text-bone py-32 md:py-48 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <p className="eyebrow text-gold mb-6">Su misura</p>
            <h2 className="display-lg">
              Non trovi il pezzo giusto?<br />
              <em className="italic font-display text-gold" style={{ fontStyle: "italic" }}>Lo creiamo per te.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-4">
            <p className="text-bone/70 leading-relaxed mb-8">
              Ogni gioiello dell'atelier può essere ripensato, ridisegnato,
              fatto da capo. Raccontaci la tua idea.
            </p>
            <Link to="/contatti" className="btn-ghost text-bone">
              Inizia il progetto
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Ring teaser */}
      <section className="bg-bone-deep text-ink py-24 noise">
        <div className="container-cara">
          <p className="eyebrow text-gold-deep mb-6 text-center">Anelli iconici</p>
          <h3 className="display-md text-center mb-12">Alcuni dei nostri pezzi</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {rings.slice(0, 4).map((r, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <Link to="/contatti" className="block group">
                  <div className="aspect-square overflow-hidden bg-bone">
                    <img src={r.image} alt={r.name} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  </div>
                  <p className="font-display text-xl mt-4">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{r.price}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
