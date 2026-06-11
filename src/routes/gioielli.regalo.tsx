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
import ringBouquet from "@/assets/cara/ring-bouquet.jpg";
import ringLuce from "@/assets/cara/ring-luce.jpg";

const TITLE = "Gioielli da regalare a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Gioielli da regalo fatti a mano nell'atelier Cara Preziosi a Bari: anelli, collane, bracciali e orecchini scelti col maestro orafo. Su appuntamento in Bari.";
const URL = "https://www.carapreziosi.it/gioielli/regalo";
const IMAGE = `https://www.carapreziosi.it${ringBouquet}`;

export const Route = createFileRoute("/gioielli/regalo")({
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
            { "@type": "ListItem", position: 3, name: "Regalo", item: URL },
          ],
        }),
      },
    ],
  }),
  component: RegaloPage,
});

function RegaloPage() {
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
                <BreadcrumbPage className="text-ink/80">Regalo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow text-gold-deep mb-8">Gioielli · Regalo</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Gioielli da{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>regalare</em> a Bari
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              Un gioiello regalato non è mai solo un oggetto: è un modo per dire qualcosa che difficilmente trova spazio in altre forme. Nell'atelier di Cara Preziosi, in {contacts.address}, accompagniamo chi vuole scegliere o creare un gioiello pensato davvero per la persona che lo riceverà.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PERCHÉ ATELIER */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              Regalare un gioiello è un gesto che richiede una certa attenzione. Non si tratta di scegliere una taglia o un colore generico: si tratta di trovare un dettaglio che entri nella vita di qualcuno e ci resti, indossato giorno dopo giorno o riservato alle occasioni importanti. Da una vetrina, questa attenzione non è sempre facile da costruire.
            </p>
            <p>
              In atelier, invece, il punto di partenza non è il prodotto, ma la persona a cui il gioiello è destinato: come si veste, cosa porta già, che mani ha, in quali momenti userebbe quel pezzo. Da questa conversazione nasce una scelta più precisa, sia che si tratti di interpretare un gioiello esistente, sia che si decida di crearne uno nuovo.
            </p>
          </div>
        </div>
      </section>

      {/* TIPI DI REGALO */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Idee</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              I gioielli che funzionano come <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>regalo</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Collane e pendenti</h3>
              <p className="text-muted-foreground leading-relaxed">
                Una catena leggera, un pendente con una piccola incisione, una medaglia scelta per una persona precisa: la collana è spesso il primo gioiello importante che si regala. Sta vicino alla pelle e diventa rapidamente un'abitudine.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Bracciali</h3>
              <p className="text-muted-foreground leading-relaxed">
                Un rigido essenziale, un bracciale morbido pensato per l'uso quotidiano, un pezzo più scenico per le occasioni: il polso è un buon punto di partenza per chi non indossa anelli o collane in modo abituale.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="font-display text-2xl mb-4">Orecchini</h3>
              <p className="text-muted-foreground leading-relaxed">
                Punti luce, cerchi misurati, pendenti dal disegno semplice: gli orecchini sono un regalo discreto, adatto sia a chi cerca un primo gioiello importante sia a chi ne possiede già molti e desidera qualcosa di nuovo da indossare ogni giorno.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Anelli simbolici</h3>
              <p className="text-muted-foreground leading-relaxed">
                Anelli sottili, fascette dedicate, pezzi pensati per una mano precisa: regalare un anello richiede attenzione alla misura e alla quotidianità di chi lo riceve. In atelier si valuta come arrivare al risultato senza rovinare la sorpresa.
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

      {/* SCEGLIERE INSIEME */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <img
              src={ringBouquet}
              alt="Gioiello pensato come regalo realizzato nell'atelier Cara Preziosi a Bari"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md mb-4">
              Scegliere il gioiello con qualcuno che ascolta
            </Reveal>
            <p>
              Il primo incontro in atelier è dedicato all'ascolto: chi è la persona a cui pensiamo, che ruolo ha nel nostro presente, in quale occasione le verrà consegnato il gioiello. Sono domande semplici, ma fanno una differenza concreta nella proposta finale.
            </p>
            <p>
              Da lì si valutano materiali, forme, dimensioni e finitura. Quando si vuole disegnare un pezzo nuovo, il percorso è quello descritto nella pagina dei{" "}
              <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                gioielli su misura a Bari
              </Link>
              : pochi incontri mirati, scelte condivise, un risultato disegnato attorno a chi lo riceverà.
            </p>
          </div>
        </div>
      </section>

      {/* RIDISEGNARE UN PEZZO */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed order-2 md:order-1">
            <Reveal as="h2" className="display-md mb-4">
              Regalare un gioiello partendo da uno già esistente
            </Reveal>
            <p>
              A volte il regalo più sentito nasce dal trasformare un gioiello che la persona già possiede o che è rimasto in famiglia. Una catena spezzata da rimettere in vita, un anello da reinterpretare, una pietra da incastonare in una montatura nuova. È un modo intimo di regalare: non si aggiunge un oggetto, si riscopre qualcosa che esiste già.
            </p>
            <p>
              Gli interventi possibili — pulizia, lucidatura, modifiche, restyling — sono raccontati nella pagina dei{" "}
              <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                servizi dell'atelier
              </Link>
              . Per ogni progetto si valuta insieme cosa conservare e cosa trasformare, senza forzare la mano.
            </p>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <img
              src={ringLuce}
              alt="Dettaglio di un gioiello reinterpretato come regalo"
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
              Un percorso riservato, non una vetrina
            </Reveal>
            <p>
              Chi cerca un gioiello da regalare a Bari trova in Cara Preziosi una proposta diversa rispetto al circuito delle vetrine commerciali: non un'idea da prendere in fretta, ma uno spazio in cui raccontare il regalo e costruirlo insieme al maestro orafo, con i tempi che la persona destinataria merita.
            </p>
            <p>
              Si entra in atelier su appuntamento, in {contacts.address}. Il primo incontro è gratuito e serve soprattutto a capire se l'approccio dell'atelier è quello giusto per il gesto che si ha in mente.
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
              Parliamo del regalo che hai in mente
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per raccontarci la persona a cui pensi e l'occasione: organizziamo insieme un primo incontro in atelier e valutiamo il gioiello più adatto, con il tempo necessario perché sia davvero suo.
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
