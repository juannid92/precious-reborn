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
import ringAurora from "@/assets/cara/ring-aurora.jpg";
import ringCharlotteCuore from "@/assets/cara/ring-charlotte-cuore.jpg";

const TITLE = "Gioielli per anniversario a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Gioielli per l'anniversario fatti a mano da Cara Preziosi a Bari: anelli, collane, bracciali e regali con significato. Su appuntamento, Via Beatillo 14.";
const URL = "https://www.carapreziosi.it/gioielli/anniversario";
const IMAGE = `https://www.carapreziosi.it${ringAurora}`;

export const Route = createFileRoute("/gioielli/anniversario")({
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
            { "@type": "ListItem", position: 3, name: "Anniversario", item: URL },
          ],
        }),
      },
    ],
  }),
  component: AnniversarioPage,
});

function AnniversarioPage() {
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
                <BreadcrumbPage className="text-ink/80">Anniversario</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow text-gold-deep mb-8">Gioielli · Anniversario</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Gioielli per un{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>anniversario</em> a Bari
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              Un anniversario non chiede un oggetto qualunque: chiede un gesto che ricordi gli anni vissuti insieme. Nell'atelier di Cara Preziosi, in {contacts.address}, accompagniamo chi desidera celebrare un anniversario con un gioiello pensato per la persona giusta e per quella data precisa.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PERCHÉ ATELIER */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              A differenza di un matrimonio, l'anniversario non si organizza: si riconosce. È un istante che torna ogni anno e che, ogni tanto, chiede di essere segnato in modo diverso — i dieci, i venticinque, i quaranta, oppure un anno qualunque che ha il suo peso solo per chi lo vive. Un gioiello, in questi momenti, ha la capacità di trattenere ciò che le parole non riescono a dire.
            </p>
            <p>
              L'atelier permette di non scegliere in fretta. Si racconta la storia, si guardano insieme idee e materiali, si lascia che il pezzo prenda forma sull'arco di qualche incontro. Il risultato è un gioiello che parla della relazione, non di un'occasione generica.
            </p>
          </div>
        </div>
      </section>

      {/* COSA SI CREA */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Per ricordare</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              I gioielli che segnano un <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>anniversario</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Anelli dedicati</h3>
              <p className="text-muted-foreground leading-relaxed">
                Un eternity, un anello con una pietra scelta apposta, una fascia che dialoga con la fede già indossata: l'anello è uno dei modi più ricorrenti per segnare un anniversario. Il percorso di disegno è quello descritto nella pagina su come{" "}
                <Link to="/crea-anello-personalizzato-bari" className="text-gold-deep underline-offset-4 hover:underline">
                  creare un anello personalizzato a Bari
                </Link>
                .
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Collane e pendenti</h3>
              <p className="text-muted-foreground leading-relaxed">
                Una medaglia incisa, un pendente con una data, una catena scelta per essere indossata ogni giorno: la collana è un regalo che resta vicino, sotto un maglione o appoggiata alla pelle, e diventa rapidamente parte della persona.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="font-display text-2xl mb-4">Bracciali</h3>
              <p className="text-muted-foreground leading-relaxed">
                Un rigido essenziale, un bracciale con un dettaglio dedicato, un pezzo pensato per essere indossato insieme alla fede o all'orologio: il polso è uno spazio dove un gioiello d'anniversario lavora molto bene, perché viene visto continuamente da chi lo indossa.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Orecchini</h3>
              <p className="text-muted-foreground leading-relaxed">
                Punti luce, cerchi, pendenti pensati per le occasioni: gli orecchini possono ricordare un anniversario senza la solennità di un anello, restando un dettaglio discreto da riservare alle serate importanti.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RIDISEGNARE */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <img
              src={ringCharlotteCuore}
              alt="Anello dedicato a un anniversario realizzato nell'atelier Cara Preziosi a Bari"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md mb-4">
              Ripensare un gioiello che già esiste
            </Reveal>
            <p>
              Per un anniversario, spesso, il punto di partenza non è un foglio bianco: è un gioiello già presente nella vita della coppia. Una fede da affiancare, un anello ricevuto anni prima, un pendente conservato in un cassetto. In atelier si valuta cosa può tornare a essere indossato, cosa può essere ridisegnato e cosa, eventualmente, può confluire in un pezzo nuovo.
            </p>
            <p>
              È un modo molto coerente con il senso dell'anniversario: invece di sovrapporre un oggetto nuovo, si lavora con ciò che è già parte della storia. Le possibilità sono descritte nella pagina dei{" "}
              <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                servizi dell'atelier
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* PROGETTO SU MISURA */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed order-2 md:order-1">
            <Reveal as="h2" className="display-md mb-4">
              Un gioiello pensato per quella data
            </Reveal>
            <p>
              Quando si sceglie di creare un pezzo nuovo, il percorso è quello descritto nella pagina dei{" "}
              <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                gioielli su misura a Bari
              </Link>
              : pochi incontri mirati, scelte condivise, un ritmo lento ma definito. È il modo in cui un gioiello d'anniversario può davvero appartenere alla persona a cui è dedicato.
            </p>
            <p>
              In molti casi è chi regala a venire prima da solo, per impostare l'idea, e a tornare poi insieme alla persona da sorprendere, o viceversa. L'atelier si adatta a questa dinamica, mantenendo la riservatezza che il momento richiede.
            </p>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <img
              src={ringAurora}
              alt="Dettaglio di un anello pensato come regalo per un anniversario"
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
              Un incontro riservato, non una vetrina
            </Reveal>
            <p>
              Chi cerca un gioiello per un anniversario a Bari trova in Cara Preziosi una proposta diversa rispetto al circuito delle vetrine: non un assortimento da scegliere in fretta, ma uno spazio in cui raccontare cosa si vuole davvero celebrare e costruire un percorso insieme al maestro orafo.
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
              Parliamo del vostro anniversario
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per raccontarci la data e l'idea: organizziamo insieme un primo incontro in atelier e valutiamo il percorso più adatto, nei tempi reali della ricorrenza.
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
