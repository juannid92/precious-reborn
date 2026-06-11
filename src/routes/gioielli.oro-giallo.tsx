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
import ringCharlotte from "@/assets/cara/ring-charlotte.jpg";
import ringAurora from "@/assets/cara/ring-aurora.jpg";

const TITLE = "Gioielli in oro giallo a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Gioielli in oro giallo fatti a mano nell'atelier Cara Preziosi a Bari: anelli, collane, bracciali e orecchini su misura. Su appuntamento, Via Beatillo 14.";
const URL = "https://www.carapreziosi.it/gioielli/oro-giallo";
const IMAGE = `https://www.carapreziosi.it${ringCharlotte}`;

export const Route = createFileRoute("/gioielli/oro-giallo")({
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
            { "@type": "ListItem", position: 3, name: "Oro giallo", item: URL },
          ],
        }),
      },
    ],
  }),
  component: OroGialloPage,
});

function OroGialloPage() {
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
                <BreadcrumbPage className="text-ink/80">Oro giallo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow text-gold-deep mb-8">Gioielli · Oro giallo</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Gioielli in{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>oro giallo</em> a Bari
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              L'oro giallo è il metallo che da sempre racconta la festa, la promessa, la memoria. Nell'atelier di Cara Preziosi, in {contacts.address}, ogni gioiello in oro giallo nasce come pezzo unico, pensato attorno alla persona che lo indosserà e lavorato a mano al banco.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PERCHÉ ORO GIALLO */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              Scegliere l'oro giallo non è mai una scelta neutra. È il colore che richiama la luce calda del Sud, le fedi delle nonne, i regali fatti per ricordare una data. Sulla pelle ha una presenza diversa rispetto agli altri metalli: avvolge, riscalda, valorizza i toni naturali della carnagione mediterranea senza imporsi.
            </p>
            <p>
              Per questo molte persone, quando immaginano un anello importante o un pendente da tramandare, tornano spontaneamente all'oro giallo. È un linguaggio condiviso fra generazioni: un dettaglio che lega un gioiello contemporaneo a una storia di famiglia, senza bisogno di troppe parole.
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
              Quali gioielli in oro giallo si possono <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>creare</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Anelli</h3>
              <p className="text-muted-foreground leading-relaxed">
                Fedi, solitari, anelli di fidanzamento e pezzi quotidiani: l'anello è la richiesta più frequente in atelier. L'oro giallo si presta sia a linee sobrie, da indossare ogni giorno, sia a montature più articolate pensate per accogliere una pietra centrale.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Collane e pendenti</h3>
              <p className="text-muted-foreground leading-relaxed">
                Catene, medaglie dedicate, ciondoli pensati per una data o un nome: la collana in oro giallo è spesso il primo gioiello importante che si regala o che si riceve. Si lavora intorno al gesto: lunghezza, peso, dimensione del pendente.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="font-display text-2xl mb-4">Bracciali</h3>
              <p className="text-muted-foreground leading-relaxed">
                Dal rigido al morbido, dalle maglie tradizionali alle interpretazioni più contemporanee, il bracciale in oro giallo è un gioiello che accompagna il polso senza interferire con il quotidiano. Si studia la chiusura, la portabilità, la finitura della superficie.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Orecchini</h3>
              <p className="text-muted-foreground leading-relaxed">
                Punti luce, cerchi, pendenti misurati: gli orecchini in oro giallo dialogano con il viso e con i capelli. In atelier si valutano insieme proporzioni e peso, perché un orecchino bello da vedere deve essere prima di tutto comodo da portare.
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
              src={ringCharlotte}
              alt="Anello in oro giallo lavorato a mano nell'atelier Cara Preziosi a Bari"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md mb-4">
              Oro giallo e lavoro su misura
            </Reveal>
            <p>
              L'oro giallo è particolarmente adatto al lavoro d'atelier: si modella bene, dialoga con un'ampia gamma di pietre — dai diamanti alle gemme colorate, dalle pietre di famiglia ai cammei — e mantiene nel tempo un carattere riconoscibile. Per questo è una scelta naturale quando si avvia un percorso di creazione su misura.
            </p>
            <p>
              Il percorso completo, dalla prima conversazione fino alla consegna del pezzo finito, è raccontato nella pagina dei{" "}
              <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                gioielli su misura a Bari
              </Link>
              : un metodo lento, fatto di pochi incontri mirati e di scelte prese insieme al maestro orafo.
            </p>
          </div>
        </div>
      </section>

      {/* RESTYLING */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed order-2 md:order-1">
            <Reveal as="h2" className="display-md mb-4">
              Restyling di gioielli già in oro giallo
            </Reveal>
            <p>
              Molti dei progetti che nascono in atelier partono da un gioiello già esistente: una catena spezzata, un anello che non si usa più, un pendente che non rispecchia più chi lo possiede. L'oro giallo di famiglia è un buon punto di partenza, perché porta con sé una memoria e una sua identità materica.
            </p>
            <p>
              Insieme si valuta cosa conservare, cosa trasformare e cosa ridisegnare. Il risultato è un gioiello nuovo, contemporaneo, ma che mantiene un legame chiaro con il pezzo da cui è nato. Le possibilità di intervento sono descritte nella pagina dei{" "}
              <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                servizi dell'atelier
              </Link>
              .
            </p>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <img
              src={ringAurora}
              alt="Dettaglio di un anello in oro giallo con incastonatura artigianale"
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
              Un atelier, non una vetrina
            </Reveal>
            <p>
              Chi cerca gioielli in oro giallo a Bari trova in Cara Preziosi una proposta diversa rispetto al circuito delle vetrine commerciali: non un assortimento da scegliere, ma un percorso da costruire. Si entra in atelier su appuntamento, si racconta l'occasione o l'idea, si guardano insieme schizzi e materiali, si concorda un calendario di incontri.
            </p>
            <p>
              Questa modalità riservata permette di concentrare l'attenzione sul singolo progetto, senza la fretta di un banco vendita. È il modo in cui l'atelier lavora da sempre, in {contacts.address}, accogliendo clienti dalla città e da tutta la Puglia.
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
              Parliamo del tuo gioiello in oro giallo
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per fissare una visita in atelier: il primo incontro è gratuito e serve a capire insieme se l'oro giallo è il materiale giusto per il tuo progetto, e con quale percorso realizzarlo.
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
