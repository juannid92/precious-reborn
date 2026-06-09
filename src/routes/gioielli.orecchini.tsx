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
import catOrecchini from "@/assets/cara/cat-orecchini.png";
import storiaMani from "@/assets/cara/storia-mani.jpg";

const TITLE = "Orecchini artigianali a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Orecchini artigianali pensati e realizzati a mano nell'atelier orafo Cara Preziosi a Bari: pezzi quotidiani, da cerimonia, da regalo e su misura, su appuntamento in Via Antonio Beatillo 14.";
const URL = "https://www.carapreziosi.it/gioielli/orecchini";
const IMAGE = `https://www.carapreziosi.it${catOrecchini}`;
const IMAGE_ALT = `https://www.carapreziosi.it${storiaMani}`;

export const Route = createFileRoute("/gioielli/orecchini")({
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
            { "@type": "ListItem", position: 3, name: "Orecchini", item: URL },
          ],
        }),
      },
    ],
  }),
  component: OrecchiniPage,
});

function OrecchiniPage() {
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
                <BreadcrumbPage className="text-ink/80">Orecchini</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow text-gold-deep mb-8">Gioielli · Orecchini</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Orecchini{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>artigianali</em> a Bari
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              Gli orecchini sono i gioielli più vicini al volto: incorniciano lo sguardo, accompagnano i movimenti, dialogano con la pettinatura e con l'abito. Nell'atelier di Cara Preziosi, in {contacts.address}, vengono pensati e realizzati a mano dal maestro orafo, scegliendo proporzioni e finiture insieme a chi li indosserà.
            </p>
          </Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              Un paio di orecchini non si sceglie soltanto per la forma. Conta come si comporta una volta indossato: il peso percepito durante la giornata, il modo in cui cattura la luce, l'equilibrio rispetto al taglio del viso e alla lunghezza del collo. Sono dettagli che in vetrina passano inosservati e che invece, in atelier, diventano parte della conversazione iniziale.
            </p>
            <p>
              Per questo il nostro lavoro non parte mai dal pezzo, ma dalla persona: cosa indossa di solito, quanto vuole farsi notare, quali gioielli porta già accanto al viso. Da lì si arriva alla proposta giusta, sia che si tratti di un orecchino quotidiano sia che si pensi a un pezzo più importante.
            </p>
          </div>
        </div>
      </section>

      {/* USI */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Usi</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Diversi modi di portare un paio di <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>orecchini</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Tutti i giorni</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pezzi leggeri pensati per essere indossati senza pensarci: punti luce essenziali, piccoli cerchi, lobi minimi. La discussione parte da come la persona usa già altri gioielli quotidiani.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Cerimonie</h3>
              <p className="text-muted-foreground leading-relaxed">
                Per matrimoni, battesimi o serate importanti si lavora sulla presenza: un orecchino che accompagni l'abito senza coprire il volto, scelto in relazione all'acconciatura e al resto della parure.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="font-display text-2xl mb-4">Regalo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gli orecchini sono spesso un regalo discreto: adatti a chi non ama anelli o collane e a chi cerca un pezzo che entri rapidamente nella propria routine, senza imporsi.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Occasioni speciali</h3>
              <p className="text-muted-foreground leading-relaxed">
                Per un compleanno, un anniversario o un traguardo si possono progettare orecchini più scenici, pensati come pezzo unico: una piccola cerimonia personale che resta poi nel tempo.
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

      {/* EQUILIBRIO */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <img
              src={catOrecchini}
              alt="Orecchini artigianali realizzati nell'atelier Cara Preziosi a Bari"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md mb-4">
              Equilibrio, proporzioni e stile personale
            </Reveal>
            <p>
              Un buon paio di orecchini è sempre questione di equilibrio: tra il volto e il pezzo, tra il pezzo e il resto dei gioielli, tra ciò che la persona vuole comunicare e ciò che le risulta naturale indossare. In atelier ragioniamo su questi rapporti prima ancora che sulla forma definitiva.
            </p>
            <p>
              Quando si vuole un orecchino completamente personalizzato — dimensione, finitura, eventuale presenza di pietre — il percorso è quello descritto nella pagina dei{" "}
              <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                gioielli su misura a Bari
              </Link>
              : incontri mirati, scelte condivise, un risultato pensato per chi lo porterà.
            </p>
          </div>
        </div>
      </section>

      {/* RESTYLING */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed order-2 md:order-1">
            <Reveal as="h2" className="display-md mb-4">
              Restyling e cura degli orecchini che già porti
            </Reveal>
            <p>
              Spesso un nuovo orecchino nasce da uno vecchio: un paio ereditato, una montatura che non si usa più, una pietra rimasta in un cassetto. Si valutano interventi di pulizia, modifica o ridisegno, scegliendo cosa conservare del pezzo originale e cosa trasformare per riportarlo all'uso.
            </p>
            <p>
              Gli interventi disponibili sono raccontati nella pagina dei{" "}
              <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                servizi dell'atelier
              </Link>
              . Per ogni progetto si decide insieme la strada più adatta, senza forzare la mano.
            </p>
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <img
              src={storiaMani}
              alt="Dettaglio del lavoro a mano nell'atelier Cara Preziosi"
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
              Provarli con calma, davanti a uno specchio
            </Reveal>
            <p>
              Scegliere un orecchino senza provarlo è quasi sempre una scommessa: cambia tutto in base alla forma del volto, al colore dei capelli, all'altezza del collo. Per questo gli incontri in atelier sono su appuntamento, in {contacts.address}, con il tempo per provare, confrontare e capire.
            </p>
            <p>
              Il primo incontro è gratuito e serve a capire se l'approccio dell'atelier è quello giusto per chi è in cerca di un orecchino: nessuna pressione, nessuna proposta forzata, solo ascolto e una valutazione concreta.
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
              Parliamo degli orecchini che hai in mente
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per raccontarci che orecchini stai cercando: per ogni giorno, per una cerimonia, come regalo o come reinterpretazione di un pezzo che già porti con te. Organizziamo un primo incontro in atelier per valutarli insieme.
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
