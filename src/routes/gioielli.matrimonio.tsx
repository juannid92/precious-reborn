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
import ringIlaria from "@/assets/cara/ring-ilaria.jpg";
import ringBorbone from "@/assets/cara/ring-borbone.jpg";

const TITLE = "Gioielli per matrimonio a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Gioielli per il matrimonio pensati e realizzati a mano nell'atelier orafo Cara Preziosi a Bari: fedi, anelli, orecchini, collane e regali per il giorno più importante, su appuntamento in Via Antonio Beatillo 14.";
const URL = "https://www.carapreziosi.it/gioielli/matrimonio";
const IMAGE = `https://www.carapreziosi.it${ringIlaria}`;

export const Route = createFileRoute("/gioielli/matrimonio")({
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
            { "@type": "ListItem", position: 3, name: "Matrimonio", item: URL },
          ],
        }),
      },
    ],
  }),
  component: MatrimonioPage,
});

function MatrimonioPage() {
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
                <BreadcrumbPage className="text-ink/80">Matrimonio</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow text-gold-deep mb-8">Gioielli · Matrimonio</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Gioielli per il{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>matrimonio</em> a Bari
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              Il matrimonio è una delle poche occasioni in cui un gioiello smette di essere un accessorio e diventa parte del racconto. Nell'atelier di Cara Preziosi, in {contacts.address}, accompagniamo gli sposi e le loro famiglie nella scelta o nella creazione dei pezzi destinati a quel giorno e a tutti quelli successivi.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PERCHÉ ATELIER */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              Un gioiello pensato per il matrimonio porta con sé un peso diverso. Non è la spesa di un'occasione, ma una scelta che sarà guardata nelle foto, indossata negli anniversari, mostrata ai figli e ai nipoti. Per questo molte coppie, quando si tratta delle fedi o di un anello di fidanzamento, preferiscono lasciare le vetrine e cercare un atelier dove ogni passaggio sia seguito con cura.
            </p>
            <p>
              L'atelier permette di prendersi il tempo necessario: incontrarsi più volte, vedere materiali, provare campioni, modificare un disegno fino a sentirlo davvero proprio. È un approccio adatto al matrimonio perché rispetta il ritmo della scelta, senza chiedere di decidere tutto sul momento.
            </p>
          </div>
        </div>
      </section>

      {/* COSA SI CREA */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Per il giorno</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              I gioielli che accompagnano un <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>matrimonio</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Fedi nuziali</h3>
              <p className="text-muted-foreground leading-relaxed">
                Le fedi sono il gioiello che resta. In atelier si studiano insieme larghezza, sezione, finitura della superficie e, quando si desidera, una piccola incisione interna. L'obiettivo è arrivare a due anelli che siano davvero coerenti con le mani e con la quotidianità di chi li indosserà.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Anello di fidanzamento</h3>
              <p className="text-muted-foreground leading-relaxed">
                L'anello che precede il matrimonio merita un percorso dedicato: scelta della pietra, disegno della montatura, prova al dito. Il processo è raccontato nella pagina su come{" "}
                <Link to="/crea-anello-personalizzato-bari" className="text-gold-deep underline-offset-4 hover:underline">
                  creare un anello personalizzato a Bari
                </Link>
                .
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="font-display text-2xl mb-4">Gioielli per la sposa</h3>
              <p className="text-muted-foreground leading-relaxed">
                Orecchini, collane e bracciali pensati per il giorno del matrimonio nascono attorno all'abito, all'acconciatura e al carattere della sposa. In atelier si valuta come dialogano con il décolleté, con il velo e con le altre presenze in foto, perché un gioiello indossato per ore deve restare comodo oltre che bello.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Regali per la famiglia</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pensieri per i testimoni, per le mamme, per chi ha accompagnato il percorso: piccoli pendenti, anelli simbolici, gioielli sobri che ricordino la giornata. È un capitolo che spesso si apre dopo aver definito le fedi e cresce in modo naturale.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PERCORSO SU MISURA */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <img
              src={ringIlaria}
              alt="Anelli realizzati per un matrimonio nell'atelier Cara Preziosi a Bari"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md mb-4">
              Un percorso costruito attorno agli sposi
            </Reveal>
            <p>
              Il primo incontro serve soprattutto ad ascoltare: la data, lo stile della cerimonia, le sensibilità reciproche, eventuali gioielli di famiglia da reinterpretare. Da lì nasce una proposta di lavoro fatta di pochi passaggi essenziali — schizzi, scelta dei materiali, prove — calibrata sulle tempistiche reali del matrimonio.
            </p>
            <p>
              Il metodo è lo stesso descritto nella pagina dei{" "}
              <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                gioielli su misura a Bari
              </Link>
              : un percorso riservato, basato sulla relazione con il maestro orafo e su scelte prese senza fretta.
            </p>
          </div>
        </div>
      </section>

      {/* PEZZI DI FAMIGLIA */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed order-2 md:order-1">
            <Reveal as="h2" className="display-md mb-4">
              Gioielli di famiglia per il giorno del matrimonio
            </Reveal>
            <p>
              Molti matrimoni intrecciano i gioielli nuovi a pezzi ereditati: una catena della nonna, un anello della mamma, una pietra ricevuta in dono. Portare in atelier questi gioielli, prima di decidere, permette spesso di scoprire che ne può nascere qualcosa di nuovo, coerente con la giornata e con chi lo indosserà.
            </p>
            <p>
              Riparazioni, modifiche, lucidature e restyling sono raccontati nella pagina dei{" "}
              <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                servizi dell'atelier
              </Link>
              . Quando ha senso si conserva, quando ha senso si trasforma: la scelta nasce sempre da una conversazione, mai da una proposta a priori.
            </p>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <img
              src={ringBorbone}
              alt="Anello di famiglia ripensato per un matrimonio"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* TEMPISTICHE */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-gold-deep">§ Tempi e contatto</p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md">
              Iniziare con il tempo giusto
            </Reveal>
            <p>
              Per un gioiello pensato per il matrimonio è bene immaginare un margine di tempo che permetta gli incontri, le valutazioni e le rifiniture senza pressione. Quanto prima si apre la conversazione, quanto più ampio è lo spazio per costruire un risultato davvero proprio.
            </p>
            <p>
              La modalità è sempre quella dell'appuntamento, in {contacts.address}, a Bari. Il primo incontro è gratuito e serve a capire insieme se l'atelier è il luogo giusto per il vostro percorso.
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
              Parliamo del vostro matrimonio
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Scriveteci o chiamateci per raccontarci la data e l'idea: organizziamo insieme un primo incontro in atelier e valutiamo i passi più adatti, nei tempi reali della vostra giornata.
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
