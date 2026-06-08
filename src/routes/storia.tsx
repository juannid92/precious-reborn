import { createFileRoute, Link } from "@tanstack/react-router";
import { brand, storia, atelierManifesto } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/storia")({
  head: () => ({
    meta: [
      { title: "Il Laboratorio — Nicola Caradonna, Maestro Orafo a Bari · Cara Preziosi" },
      {
        name: "description",
        content:
          "Scopri la storia del laboratorio Cara Preziosi e del maestro orafo Nicola Caradonna, da oltre 40 anni punto di riferimento per la gioielleria artigianale a Bari.",
      },
      { property: "og:title", content: "Il Laboratorio — Nicola Caradonna, Maestro Orafo a Bari · Cara Preziosi" },
      {
        property: "og:description",
        content:
          "Scopri la storia del laboratorio Cara Preziosi e del maestro orafo Nicola Caradonna, da oltre 40 anni punto di riferimento per la gioielleria artigianale a Bari.",
      },
      { property: "og:url", content: "https://www.carapreziosi.it/storia" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0229c937-7c28-4ea0-8257-25c6ab4e4415/id-preview-990a0072--8f416fe5-a54e-4f07-a4e6-84f14f7f4dd2.lovable.app-1779116023030.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Il Laboratorio — Nicola Caradonna, Maestro Orafo a Bari · Cara Preziosi" },
      {
        name: "twitter:description",
        content:
          "Scopri la storia del laboratorio Cara Preziosi e del maestro orafo Nicola Caradonna, da oltre 40 anni punto di riferimento per la gioielleria artigianale a Bari.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.carapreziosi.it/storia" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carapreziosi.it/" },
            { "@type": "ListItem", position: 2, name: "Il Laboratorio", item: "https://www.carapreziosi.it/storia" },
          ],
        }),
      },
    ],
  }),
  component: StoriaPage,
});

function StoriaPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[600px] bg-obsidian text-bone overflow-hidden noise">
        <img
          src={storia.hero.image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/30 via-obsidian/40 to-obsidian/90" />
        <div className="relative container-cara h-full flex flex-col justify-end pb-20 md:pb-32">
          <p className="eyebrow text-gold mb-8">{storia.hero.eyebrow}</p>
          <Reveal as="h1" className="display-xl">
            L'elegante tradizione<br />
            di <em className="italic font-display text-gold" style={{ fontStyle: "italic" }}>Cara Preziosi</em>.
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-2xl text-lg text-bone/75 leading-relaxed">{storia.hero.lead}</p>
          </Reveal>
        </div>
      </section>

      {/* MANIFESTO QUOTE */}
      <section className="bg-bone text-ink py-32 md:py-56">
        <div className="container-narrow">
          <Reveal>
            <p className="eyebrow text-gold-deep mb-10">{atelierManifesto.eyebrow}</p>
          </Reveal>
          <Reveal>
            <p className="display-lg whitespace-pre-line">
              <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>"{atelierManifesto.bigQuote}"</em>
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 font-display italic text-gold-deep text-xl">{atelierManifesto.signature}</p>
          </Reveal>
        </div>
      </section>

      {/* INTRO + LAB IMAGE */}
      <section className="bg-bone-deep text-ink noise">
        <div className="grid md:grid-cols-12 md:items-stretch">
          <div className="md:col-span-6 relative aspect-[4/3] md:aspect-auto md:h-[80vh] overflow-hidden">
            <img src={storia.intro.image} alt="Laboratorio Cara Preziosi" className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
          <div className="md:col-span-5 md:col-start-8 flex flex-col justify-center p-10 md:p-16 lg:p-20">
            <Reveal>
              <p className="eyebrow text-gold-deep mb-6">L'atelier</p>
              <h2 className="display-md mb-8">{storia.intro.title}</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{storia.intro.body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="bg-obsidian text-bone py-32 md:py-48 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-20">
            <div className="md:col-span-2">
              <p className="eyebrow text-gold">{storia.processo.eyebrow}</p>
            </div>
            <Reveal as="h2" className="display-lg md:col-span-9">
              {storia.processo.title.split(" ").map((w, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? (
                    <em className="italic font-display text-gold" style={{ fontStyle: "italic" }}>{w}</em>
                  ) : (
                    w
                  )}{" "}
                </span>
              ))}
            </Reveal>
          </div>
          <div className="grid gap-1 md:grid-cols-3">
            {storia.processo.steps.map((s) => (
              <Reveal key={s.number}>
                <div className="border-l border-bone/20 pl-8 py-6 md:py-10 h-full">
                  <p className="font-display italic text-gold text-3xl mb-6">— {s.number}</p>
                  <h3 className="display-md text-bone mb-5">{s.title}</h3>
                  <p className="text-bone/70 text-base leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INNOVAZIONE */}
      <section className="bg-bone text-ink noise">
        <div className="grid md:grid-cols-12 md:items-stretch">
          <div className="md:col-span-5 flex flex-col justify-center p-10 md:p-16 lg:p-20">
            <Reveal>
              <p className="eyebrow text-gold-deep mb-6">Tradizione + Futuro</p>
              <h2 className="display-md mb-8 whitespace-pre-line">{storia.innovazione.title}</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{storia.innovazione.body}</p>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6 relative aspect-[4/3] md:aspect-auto md:h-[80vh] overflow-hidden">
            <img src={storia.innovazione.image} alt="Mani del maestro orafo" className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-obsidian text-bone py-32 md:py-48 noise">
        <div className="container-cara text-center max-w-4xl mx-auto">
          <Reveal>
            <h2 className="display-lg mb-10">
              Vieni a <em className="italic font-display text-gold" style={{ fontStyle: "italic" }}>trovarci</em>.
            </h2>
            <p className="text-bone/70 text-lg leading-relaxed max-w-xl mx-auto mb-10">
              L'atelier è in Via Beatillo 14, a Bari. Bevi un caffè con noi.
            </p>
            <Link to="/contatti" className="btn-ghost text-bone">
              Prenota una visita
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
