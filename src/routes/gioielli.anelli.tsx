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
import ringSchiuma from "@/assets/cara/ring-schiuma.jpg";
import ringCharlotte from "@/assets/cara/ring-charlotte.jpg";

const TITLE = "Anelli artigianali a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Anelli artigianali pensati e realizzati a mano nell'atelier orafo Cara Preziosi a Bari: anelli di stile personale, di impegno, da regalo e da indossare ogni giorno, su appuntamento in Via Antonio Beatillo 14.";
const URL = "https://www.carapreziosi.it/gioielli/anelli";
const IMAGE = `https://www.carapreziosi.it${ringSchiuma}`;
const IMAGE_ALT = `https://www.carapreziosi.it${ringCharlotte}`;

export const Route = createFileRoute("/gioielli/anelli")({
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
      { name: "twitter:image", content: IMAGE_ALT },
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
            { "@type": "ListItem", position: 3, name: "Anelli", item: URL },
          ],
        }),
      },
    ],
  }),
  component: AnelliPage,
});

function AnelliPage() {
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
                <BreadcrumbPage className="text-ink/80">Anelli</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow text-gold-deep mb-8">Gioielli · Anelli</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Anelli{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>artigianali</em> a Bari
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              L'anello è forse il gioiello più personale che esista: si porta in vista, si guarda spesso, accompagna i gesti di ogni giorno. Nell'atelier di Cara Preziosi, in {contacts.address}, gli anelli nascono dal lavoro del maestro orafo e dal dialogo con chi li indosserà.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TIPOLOGIA */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              All'interno della famiglia degli anelli convivono significati molto diversi tra loro. C'è l'anello pensato per definire uno stile personale, indossato ogni giorno come parte del proprio modo di vestire. C'è l'anello che segna un impegno o un legame, scelto per una persona precisa e per una promessa specifica. C'è l'anello regalato, che porta con sé un ricordo. E c'è l'anello di rappresentanza, pensato per le occasioni in cui la mano diventa parte del racconto.
            </p>
            <p>
              In atelier non trattiamo questi mondi come categorie da catalogo, ma come punti di partenza per capire cosa serve davvero. Spesso un singolo incontro chiarisce più di mille immagini: quanto si vuole far vedere l'anello, quanto si vuole sentirlo addosso, in quale contesto verrà indossato.
            </p>
          </div>
        </div>
      </section>

      {/* INTENZIONI */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Intenzioni</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Diversi modi di portare un <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>anello</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Stile personale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Anelli pensati per essere parte della propria silhouette quotidiana: fascette sottili, pezzi più decisi, combinazioni libere. La discussione parte dalla mano e dal modo in cui la persona usa già altri gioielli.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Impegno e legami</h3>
              <p className="text-muted-foreground leading-relaxed">
                Anelli che raccontano un sì, un patto, una scelta condivisa. Qui il lavoro è più riservato: si entra nel dettaglio della relazione, dei tempi della consegna e di come l'anello accompagnerà la coppia negli anni.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="font-display text-2xl mb-4">Eleganza quotidiana</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pezzi pensati per essere indossati ogni giorno senza pesare: linee pulite, finiture comode, attenzione al modo in cui l'anello convive con il movimento delle mani e con gli altri gioielli che la persona porta già.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Regalo e ricordo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Anelli regalati o commissionati per ricordare un momento: una nascita, un traguardo, una persona. La progettazione tiene conto di chi riceverà l'anello, della misura e del significato che si vuole conservare nel tempo.
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

      {/* DISEGNO E PERSONALIZZAZIONE */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <img
              src={ringSchiuma}
              alt="Anello artigianale realizzato nell'atelier Cara Preziosi a Bari"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md mb-4">
              Disegnare un anello con il maestro orafo
            </Reveal>
            <p>
              Quando un anello esistente non racconta quello che si ha in mente, si parte dal disegno. In atelier questo percorso non è una corsa: si parte da un riferimento, da una sensazione, talvolta da un gioiello di famiglia. Si discute la proporzione, il tipo di anello, l'eventuale presenza di pietre.
            </p>
            <p>
              Per chi cerca un percorso completamente dedicato a un anello — proporzione, finitura, scelte costruttive — la pagina dedicata a{" "}
              <Link to="/crea-anello-personalizzato-bari" className="text-gold-deep underline-offset-4 hover:underline">
                creare un anello personalizzato a Bari
              </Link>
              {" "}racconta il metodo nel dettaglio.
            </p>
          </div>
        </div>
      </section>

      {/* RESTYLING */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed order-2 md:order-1">
            <Reveal as="h2" className="display-md mb-4">
              Modifiche, restyling e cura di un anello già esistente
            </Reveal>
            <p>
              Molti progetti partono da un anello che già si possiede: una misura da rifare, una montatura da riprendere, una pietra da reincastonare in un disegno nuovo. Per chi vuole partire da un pezzo esistente, in atelier si valutano interventi di pulizia, restringimento o restyling, scegliendo cosa conservare e cosa trasformare.
            </p>
            <p>
              Lo stesso approccio vale per gli altri gioielli su misura: ne parliamo in modo più ampio nella pagina dei{" "}
              <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                gioielli su misura a Bari
              </Link>
              .
            </p>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <img
              src={ringCharlotte}
              alt="Dettaglio di un anello riprogettato in atelier"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* CONTESTO BARI */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-gold-deep">§ A Bari</p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md">
              Provare un anello con calma, in atelier
            </Reveal>
            <p>
              Scegliere un anello non è un gesto da vetrina: si tratta di vederlo alla mano, capire come si comporta nei movimenti più normali, ragionare sulla finitura e sulla misura. Per questo gli incontri in atelier avvengono su appuntamento, in {contacts.address}, con tempi pensati per non avere fretta.
            </p>
            <p>
              Il primo incontro è gratuito e serve a capire se l'approccio dell'atelier corrisponde a quello che si cerca: nessuna pressione commerciale, nessuna proposta forzata. Si parte dall'ascolto e da lì si decide insieme se procedere.
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
              Parliamo dell'anello che hai in mente
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per raccontarci l'anello che vorresti: stile, misura, occasione. Organizziamo un primo incontro in atelier per valutare insieme la strada più adatta, sia che si tratti di un pezzo nuovo, sia che si parta da un anello che già porti con te.
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
