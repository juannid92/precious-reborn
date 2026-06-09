import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { contacts } from "@/content/site";
import ringLuce from "@/assets/cara/ring-luce.jpg";
import ringSchiuma from "@/assets/cara/ring-schiuma.jpg";

const TITLE = "Gioielli in oro bianco a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Gioielli in oro bianco disegnati e lavorati a mano nell'atelier orafo Cara Preziosi a Bari: anelli, orecchini, collane e bracciali su misura, personalizzazione e restyling su appuntamento in Via Antonio Beatillo 14.";
const URL = "https://www.carapreziosi.it/gioielli/oro-bianco";
const IMAGE = `https://www.carapreziosi.it${ringLuce}`;

export const Route = createFileRoute("/gioielli/oro-bianco")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:image", content: IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carapreziosi.it/" },
            { "@type": "ListItem", position: 2, name: "Gioielli", item: "https://www.carapreziosi.it/categorie" },
            { "@type": "ListItem", position: 3, name: "Oro bianco", item: URL },
          ],
        }),
      },
    ],
  }),
  component: OroBiancoPage,
});

function OroBiancoPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-bone text-ink pt-40 md:pt-56 pb-20 md:pb-28">
        <div className="container-cara">
          <Breadcrumb className="mb-8">
            <BreadcrumbList className="text-[11px] uppercase tracking-[0.28em] text-ink/55">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="transition-colors hover:text-gold-deep">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/categorie" className="transition-colors hover:text-gold-deep">Gioielli</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-ink/80">Oro bianco</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow text-gold-deep mb-8">Gioielli · Oro bianco</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Gioielli in{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>oro bianco</em> a Bari
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              L'oro bianco ha un carattere più discreto, contemporaneo, quasi grafico. Nell'atelier di Cara Preziosi, in {contacts.address}, ogni gioiello in oro bianco è disegnato attorno alla persona che lo indosserà e rifinito a mano al banco, con la cura che richiede una superficie così pulita.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PERCHÉ ORO BIANCO */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              Scegliere l'oro bianco significa, spesso, cercare un gioiello che non gridi. È un metallo che si presta a linee asciutte, a montature minimaliste, a pezzi destinati a essere indossati ogni giorno senza imporsi sul resto. Molte persone lo preferiscono quando vogliono un anello, un pendente o un paio di orecchini che dialoghino con un guardaroba contemporaneo.
            </p>
            <p>
              In un anello con diamante o con una pietra trasparente, l'oro bianco lavora in modo particolare: lascia che sia la pietra a fare la prima impressione, mentre la montatura resta sullo sfondo. È una delle ragioni per cui ricorre tanto spesso nei progetti di fidanzamento e nei gioielli pensati per occasioni importanti.
            </p>
          </div>
        </div>
      </section>

      {/* TIPOLOGIE */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Tipologie</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Quali gioielli in oro bianco si possono <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>progettare</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Anelli</h3>
              <p className="text-muted-foreground leading-relaxed">
                Solitari, trilogy, fedi sottili, anelli quotidiani: l'oro bianco è una scelta frequente quando si vuole valorizzare una pietra centrale o ottenere una linea pulita al dito. In atelier si studiano la sezione del gambo, la forma del castone, la proporzione tra anello e mano.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Orecchini</h3>
              <p className="text-muted-foreground leading-relaxed">
                Punti luce, cerchi essenziali, pendenti misurati: gli orecchini in oro bianco accompagnano il viso senza appesantirlo. Si lavora sulla leggerezza, sul tipo di chiusura e sulla portabilità per un uso quotidiano o occasionale.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="font-display text-2xl mb-4">Collane e pendenti</h3>
              <p className="text-muted-foreground leading-relaxed">
                Catene fini, ciondoli geometrici, medaglioni dedicati: la collana in oro bianco è spesso scelta per la sua capacità di restare discreta sotto la maglia e di emergere con eleganza quando viene mostrata. La lunghezza e il peso del pendente vengono valutati insieme.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Bracciali</h3>
              <p className="text-muted-foreground leading-relaxed">
                Maglie sottili, rigidi essenziali, bracciali pensati per affiancare un orologio: l'oro bianco si presta a pezzi che vivono al polso senza interferire con i gesti del giorno. In atelier si studia soprattutto la chiusura, perché un bracciale deve essere indossato con facilità.
              </p>
            </Reveal>
          </div>
          <div className="mt-12">
            <Link to="/categorie" className="inline-flex items-center gap-2 text-gold-deep underline-offset-4 hover:underline">
              Esplora tutte le categorie di gioielli
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SU MISURA */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <img
              src={ringLuce}
              alt="Anello in oro bianco lavorato a mano nell'atelier Cara Preziosi a Bari"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md mb-4">
              Oro bianco e lavoro d'atelier
            </Reveal>
            <p>
              L'oro bianco richiede una rifinitura particolarmente attenta: le superfici lisce mostrano ogni dettaglio, le linee devono restare nette, le proporzioni vanno calibrate con precisione. Per questo è un metallo che dà il meglio quando viene lavorato in un atelier, dove ogni passaggio è seguito direttamente dal maestro orafo al banco.
            </p>
            <p>
              Il percorso di creazione, dalla prima conversazione fino alla consegna del gioiello finito, è descritto nella pagina dei{" "}
              <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                gioielli su misura a Bari
              </Link>
              : un metodo basato su pochi incontri mirati e su scelte condivise passo dopo passo.
            </p>
          </div>
        </div>
      </section>

      {/* RESTYLING */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed order-2 md:order-1">
            <Reveal as="h2" className="display-md mb-4">
              Rinnovare un gioiello in oro bianco
            </Reveal>
            <p>
              Capita spesso che un gioiello in oro bianco abbia perso luminosità con il tempo, o che il disegno non rispecchi più la persona che lo indossa. Anche in questi casi, il punto di partenza non è buttare via il pezzo, ma capire cosa può essere recuperato: una pietra da reincastonare, una linea da semplificare, un gioiello intero da rifondere e ridisegnare.
            </p>
            <p>
              Gli interventi possibili — manutenzione, lucidatura, modifiche, restyling — sono raccontati nella pagina dei{" "}
              <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                servizi dell'atelier
              </Link>
              . Per ogni progetto si valuta insieme cosa ha senso conservare e cosa trasformare, senza forzare la mano.
            </p>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <img
              src={ringSchiuma}
              alt="Dettaglio di un anello in oro bianco con superficie rifinita a mano"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* BARI / ATELIER */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-gold-deep">§ A Bari</p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md">
              Un percorso riservato, non una vetrina
            </Reveal>
            <p>
              Chi cerca gioielli in oro bianco a Bari trova in Cara Preziosi una proposta diversa rispetto alle vetrine commerciali: non un assortimento da scegliere, ma un percorso costruito insieme. Si entra in atelier su appuntamento, si racconta l'occasione o l'idea, si guardano schizzi e materiali, si concorda un calendario di incontri.
            </p>
            <p>
              Questa modalità riservata permette di concentrare l'attenzione sul singolo progetto, senza la fretta del banco vendita. È il modo in cui l'atelier lavora da sempre, in {contacts.address}, accogliendo clienti dalla città e da tutta la Puglia.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-obsidian text-bone py-24 md:py-32 noise">
        <div className="container-cara text-center max-w-3xl mx-auto">
          <Reveal delay={0.1}>
            <p className="eyebrow text-gold mb-8">Prenota un appuntamento</p>
            <h2 className="display-lg mb-8">
              Parliamo del tuo gioiello in oro bianco
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per fissare una visita in atelier: il primo incontro è gratuito e serve a capire insieme se l'oro bianco è il materiale giusto per il tuo progetto, e con quale percorso realizzarlo.
            </p>
            <Link to="/contatti" className="btn-primary group">
              Scrivici per un appuntamento
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
