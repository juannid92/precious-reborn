import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { brand, services } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/servizi")({
  head: () => ({
    meta: [
      { title: "Servizi — Creazione, Restauro e Manutenzione Gioielli · Cara Preziosi" },
      {
        name: "description",
        content:
          "Creazione di gioielli su misura, restauro di preziosi e manutenzione professionale. Servizi artigianali dell’atelier orafo Cara Preziosi a Bari.",
      },
      { property: "og:title", content: "Servizi — Creazione, Restauro e Manutenzione Gioielli · Cara Preziosi" },
      {
        property: "og:description",
        content:
          "Creazione di gioielli su misura, restauro di preziosi e manutenzione professionale. Servizi artigianali dell’atelier orafo Cara Preziosi a Bari.",
      },
      { property: "og:url", content: "https://www.carapreziosi.it/servizi" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:image", content: "https://www.carapreziosi.it/brand/cara-preziosi-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Servizi — Creazione, Restauro e Manutenzione Gioielli · Cara Preziosi" },
      {
        name: "twitter:description",
        content:
          "Creazione di gioielli su misura, restauro di preziosi e manutenzione professionale. Servizi artigianali dell’atelier orafo Cara Preziosi a Bari.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.carapreziosi.it/servizi" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carapreziosi.it/" },
            { "@type": "ListItem", position: 2, name: "Servizi", item: "https://www.carapreziosi.it/servizi" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: "Creazione gioielli su misura",
              serviceType: "Creazione gioielli su misura",
              description:
                "Progettazione e realizzazione artigianale di gioielli unici su misura nel laboratorio orafo Cara Preziosi a Bari.",
              provider: { "@id": "https://www.carapreziosi.it/#business" },
              areaServed: ["Bari", "Puglia", "Italia"],
              url: "https://www.carapreziosi.it/servizi",
            },
            {
              "@type": "Service",
              name: "Restauro gioielli",
              serviceType: "Restauro gioielli",
              description:
                "Restauro professionale di gioielli antichi e di famiglia, eseguito a mano nel laboratorio orafo di Bari.",
              provider: { "@id": "https://www.carapreziosi.it/#business" },
              areaServed: ["Bari", "Puglia", "Italia"],
              url: "https://www.carapreziosi.it/servizi",
            },
            {
              "@type": "Service",
              name: "Manutenzione gioielli",
              serviceType: "Manutenzione gioielli",
              description:
                "Lucidatura, rodiatura, riparazione e manutenzione professionale dei tuoi preziosi presso l'atelier Cara Preziosi.",
              provider: { "@id": "https://www.carapreziosi.it/#business" },
              areaServed: ["Bari", "Puglia", "Italia"],
              url: "https://www.carapreziosi.it/servizi",
            },
          ],
        }),
      },
    ],
  }),
  component: ServiziPage,
});

function ServiziPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-bone text-ink pt-40 md:pt-56 pb-20 md:pb-32">
        <div className="container-cara">
          <p className="eyebrow text-gold-deep mb-8">{services.hero.eyebrow}</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Creiamo, restauriamo,<br />
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>custodiamo</em>.
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-5 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              {services.hero.lead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ZIGZAG SERVICES */}
      <section className="bg-bone text-ink">
        {services.items.map((s, i) => {
          const dark = i % 2 === 1;
          const reverse = i % 2 === 1;
          return (
            <article
              key={s.title}
              className={`${dark ? "bg-obsidian text-bone noise" : "bg-bone text-ink"} relative`}
            >
              <div className={`grid md:grid-cols-12 md:items-stretch min-h-[80vh]`}>
                <div className={`md:col-span-7 ${reverse ? "md:order-2" : ""} relative aspect-[4/3] md:aspect-auto md:h-[80vh] overflow-hidden`}>
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : undefined}
                    decoding="async"
                  />
                </div>
                <div className={`md:col-span-5 ${reverse ? "md:order-1" : ""} flex flex-col justify-center p-10 md:p-16 lg:p-20`}>
                  <Reveal>
                    <p className={`font-display italic ${dark ? "text-gold" : "text-gold-deep"} text-2xl mb-6`}>— 0{i + 1}</p>
                    <h2 className="display-md mb-8">{s.title}</h2>
                    <p className={`text-lg leading-relaxed ${dark ? "text-bone/75" : "text-muted-foreground"}`}>
                      {s.body}
                    </p>
                    <div className="mt-10">
                      <Link
                        to="/contatti"
                        className={dark ? "btn-ghost text-bone" : "btn-ghost text-ink"}
                      >
                        Richiedi questo servizio
                      </Link>
                    </div>
                  </Reveal>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-bone-deep text-ink py-32 md:py-48 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-16">
            <div className="md:col-span-2">
              <p className="eyebrow text-gold-deep">§ Iter</p>
            </div>
            <Reveal as="h2" className="display-lg md:col-span-9">
              Come <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>lavoriamo</em>
            </Reveal>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { 
                n: "I", 
                t: "Incontro & Ascolto", 
                b: "Il percorso inizia con un dialogo in atelier o via WhatsApp. Raccontaci la tua idea, mostracci un'ispirazione o descrivici l'emozione che vuoi racchiudere nel gioiello." 
              },
              { 
                n: "II", 
                t: "Progettazione & Disegno", 
                b: "Dallo schizzo a mano alla modellazione CAD. Definiamo insieme proporzioni, materiali e preventivo. Ogni dettaglio viene approvato prima di accendere il cannello." 
              },
              { 
                n: "III", 
                t: "Lavorazione Artigianale", 
                b: "Il cuore del servizio. Fusione, rifinitura e incastonatura avvengono nel nostro laboratorio di Bari, seguendo i tempi necessari per un'esecuzione d'eccellenza." 
              },
              { 
                n: "IV", 
                t: "Controllo & Consegna", 
                b: "Ogni pezzo viene lucidato e verificato sotto lente. Consegnamo il gioiello finito con certificato di garanzia internazionale, pronto per la sua nuova storia." 
              },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <div className="group border-t border-ink/10 pt-8 hover:border-gold-deep/40 transition-colors duration-500 h-full">
                  <p className="font-display italic text-gold-deep text-3xl mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500">— {step.n}</p>
                  <h3 className="font-display text-2xl mb-4 leading-tight">{step.t}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">{step.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-obsidian text-bone py-32 md:py-48 noise">
        <div className="container-cara text-center max-w-3xl mx-auto">
          <Reveal delay={0.1}>
            <p className="eyebrow text-gold mb-8">L'incontro</p>
            <h2 className="display-lg mb-8">
              Raccontaci la tua idea,<br />
              <em className="italic font-display text-gold" style={{ fontStyle: "italic" }}>dalle forma</em> con noi.
            </h2>
            <p className="text-bone/60 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Dalla creazione su misura alla cura dei tuoi pezzi più preziosi, il nostro laboratorio è al tuo servizio per garantire eccellenza e durata nel tempo.
            </p>
            <Link to="/contatti" className="btn-primary bg-bone text-obsidian hover:bg-gold group">
              Prenota una visita
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
