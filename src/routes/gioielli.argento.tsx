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
import ringBouquet from "@/assets/cara/ring-bouquet.jpg";

const TITLE = "Gioielli in argento a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Gioielli in argento rifiniti a mano nell'atelier Cara Preziosi a Bari: anelli, orecchini, collane e bracciali su misura. Su appuntamento, Via Beatillo 14.";
const URL = "https://www.carapreziosi.it/gioielli/argento";
const IMAGE = `https://www.carapreziosi.it${ringSchiuma}`;

export const Route = createFileRoute("/gioielli/argento")({
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
            { "@type": "ListItem", position: 3, name: "Argento", item: URL },
          ],
        }),
      },
    ],
  }),
  component: ArgentoPage,
});

function ArgentoPage() {
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
                <BreadcrumbPage className="text-ink/80">Argento</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow text-gold-deep mb-8">Gioielli · Argento</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Gioielli in{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>argento</em> a Bari
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              L'argento ha un carattere libero, espressivo, capace di accompagnare tanto un gesto quotidiano quanto un regalo importante. Nell'atelier di Cara Preziosi, in {contacts.address}, è il metallo con cui spesso prende forma una prima idea, un pezzo da indossare ogni giorno o un dono pensato per qualcuno di vicino.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PERCHÉ ARGENTO */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              L'argento è un metallo che lascia respirare il disegno. La sua luce è più fredda e quieta rispetto a quella dell'oro, e proprio per questo si presta a forme contemporanee, a linee scultoree, a pezzi che parlano più della loro silhouette che della loro materia. È un linguaggio versatile: la stessa lega può raccontare un anello sobrio per ogni giorno o una collana importante per un'occasione precisa.
            </p>
            <p>
              È anche il metallo con cui molte persone scelgono di iniziare un percorso d'atelier: per un regalo, per una collezione personale, per esplorare un'idea prima di portarla eventualmente in oro. Questa elasticità lo rende uno dei materiali più presenti nelle conversazioni che nascono al banco.
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
              Cosa si può creare in <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>argento</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Anelli</h3>
              <p className="text-muted-foreground leading-relaxed">
                Anelli larghi, fascette sottili, pezzi scultorei pensati per essere riconoscibili anche da lontano: l'argento permette di osare proporzioni più generose, perché il suo peso e la sua luce lo rendono adatto a forme più presenti senza diventare invadenti.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Orecchini</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cerchi, pendenti lunghi, orecchini a lobo dal disegno essenziale: l'argento è particolarmente indicato per chi cerca un orecchino leggero da indossare anche per ore. Forma e chiusura vengono pensate insieme, sulla base di come si porteranno davvero.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="font-display text-2xl mb-4">Collane e pendenti</h3>
              <p className="text-muted-foreground leading-relaxed">
                Catene morbide, medaglioni dedicati, ciondoli pensati per una data o un'iniziativa personale: la collana in argento è spesso un regalo che racconta un legame senza l'enfasi di un gioiello d'oro, mantenendo però la stessa cura nei dettagli.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Bracciali</h3>
              <p className="text-muted-foreground leading-relaxed">
                Rigidi minimali, bracciali con elementi grafici, modelli più articolati per un uso più scenico: l'argento dà ai bracciali una presenza ben distinta, sia che dialoghino con altri gioielli al polso, sia che vengano indossati da soli.
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
              src={ringSchiuma}
              alt="Anello in argento lavorato a mano nell'atelier Cara Preziosi a Bari"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md mb-4">
              Argento e progettazione su misura
            </Reveal>
            <p>
              In atelier, l'argento è spesso il primo metallo con cui si dà corpo a un'idea. Permette di esplorare proporzioni, valutare ergonomia e capire come una forma vive davvero sulla mano, sul polso o sul collo, prima ancora di decidere se mantenerla così oppure portarla in oro.
            </p>
            <p>
              Il percorso completo — dalla prima conversazione fino alla consegna del gioiello — è descritto nella pagina dei{" "}
              <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                gioielli su misura a Bari
              </Link>
              . È un metodo basato su pochi incontri mirati, in cui ogni scelta è condivisa direttamente con il maestro orafo.
            </p>
          </div>
        </div>
      </section>

      {/* REGALI E RESTYLING */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed order-2 md:order-1">
            <Reveal as="h2" className="display-md mb-4">
              Regali, ricordi, ripensamenti
            </Reveal>
            <p>
              L'argento è il materiale di tanti gioielli a cui ci si affeziona: il primo anello regalato, il braccialetto di un'estate, la collana indossata in un viaggio. Quando un pezzo si rovina o non rispecchia più chi lo porta, l'atelier valuta cosa è possibile fare: una pulitura attenta, una riparazione, un piccolo cambio di disegno o un restyling più ampio.
            </p>
            <p>
              Gli interventi possibili — manutenzione, lucidatura, modifiche, ridisegno — sono raccontati nella pagina dei{" "}
              <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                servizi dell'atelier
              </Link>
              . Per ogni gioiello si valuta insieme cosa ha senso conservare e cosa trasformare.
            </p>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <img
              src={ringBouquet}
              alt="Dettaglio di un anello in argento con lavorazione orafa a mano"
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
              Un atelier, non un banco vendita
            </Reveal>
            <p>
              Chi cerca gioielli in argento a Bari trova in Cara Preziosi una proposta diversa rispetto alle vetrine commerciali: non un assortimento da scegliere, ma un percorso costruito insieme. Si entra in atelier su appuntamento, si racconta l'occasione o l'idea, si guardano schizzi e materiali, si concorda un calendario di incontri.
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
              Parliamo del tuo gioiello in argento
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per fissare una visita in atelier: il primo incontro è gratuito e serve a capire insieme se l'argento è il materiale giusto per il tuo progetto, e con quale percorso realizzarlo.
            </p>
            <Link to="/contatti" search={{ richiesta: "", pietra: "" }} className="btn-primary group">
              Scrivici per un appuntamento
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
