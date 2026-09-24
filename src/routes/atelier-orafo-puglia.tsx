import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { contacts } from "@/content/site";
import storiaHero from "@/assets/cara/storia-hero.jpg";
import storiaMani from "@/assets/cara/storia-mani.jpg";

const TITLE = "Atelier orafo in Puglia — Cara Preziosi a Bari";
const DESCRIPTION =
  "Atelier orafo in Puglia: Cara Preziosi è la bottega di Nicola Caradonna a Bari. Gioielli fusi e incastonati a mano, su appuntamento in Via Antonio Beatillo 14.";
const URL = "https://www.carapreziosi.it/atelier-orafo-puglia";
const IMAGE = `https://www.carapreziosi.it${storiaHero}`;

export const Route = createFileRoute("/atelier-orafo-puglia")({
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
            { "@type": "ListItem", position: 2, name: "Atelier orafo Puglia", item: URL },
          ],
        }),
      },
    ],
  }),
  component: AtelierOrafoPugliaPage,
});

function AtelierOrafoPugliaPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-bone text-ink pt-40 md:pt-56 pb-20 md:pb-28">
        <div className="container-cara">
          <PageBreadcrumb current="Atelier orafo Puglia" className="mb-8" />
          <p className="eyebrow text-gold-deep mb-8">Atelier orafo · Puglia</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Atelier orafo in{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>Puglia</em>: Cara Preziosi a Bari
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              Un atelier orafo non è solo un negozio: è il banco di lavoro dove un maestro disegna, fonde e rifinisce ogni gioiello con le proprie mani. In Puglia questa figura è oggi una scelta consapevole, lontana dalle vetrine seriali. Cara Preziosi, in {contacts.address} a Bari, è il punto di riferimento per chi cerca questo tipo di lavorazione orafa sul territorio regionale.
            </p>
          </Reveal>
        </div>
      </section>

      {/* INTRO REGIONALE */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              La Puglia ha una memoria orafa profonda, fatta di botteghe storiche, mestieri tramandati di generazione in generazione e clienti che riconoscono ancora il valore della lavorazione a mano. Bari, in particolare, è da sempre crocevia di scambi, materiali e competenze: è qui che molte famiglie del territorio scelgono di affidare i gioielli destinati a durare oltre una vita — fedi, solitari, pendenti dedicati, pezzi ereditati da restaurare con rispetto.
            </p>
            <p>
              In questo paesaggio, Cara Preziosi rappresenta una proposta precisa: un atelier orafo dove l'intero ciclo creativo resta interno al laboratorio, dalla prima conversazione fino alla consegna del gioiello finito. Chi arriva dalla Bat, dal Salento, dal foggiano o dalla Murgia trova lo stesso interlocutore in ogni fase: una continuità rara, che permette di seguire ogni dettaglio senza passaggi di mano.
            </p>
          </div>
        </div>
      </section>

      {/* TRADIZIONE */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Tradizione</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Una bottega radicata nel <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>territorio</em>
            </Reveal>
          </div>
          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <img
                src={storiaHero}
                alt="Atelier orafo Cara Preziosi a Bari, riferimento per la Puglia"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
              <p>
                Il maestro orafo Nicola Caradonna porta avanti da oltre quarant'anni un mestiere che richiede mano ferma, pazienza e ascolto. La sua formazione nasce e cresce a Bari, in un dialogo costante con altre botteghe orafe e con i clienti che, anno dopo anno, hanno reso il laboratorio un punto fisso per le occasioni importanti delle loro famiglie.
              </p>
              <p>
                Per la sintesi completa di questo percorso, dai primi anni al laboratorio attuale, puoi consultare la pagina dedicata alla{" "}
                <Link to="/storia" className="text-gold-deep underline-offset-4 hover:underline">
                  storia dell'atelier
                </Link>
                : un racconto sobrio, costruito sul lavoro reale e non sulla retorica del “fatto a mano”.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COSA OFFRE L'ATELIER */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ L'atelier</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Tre modi di affidarsi a un atelier orafo
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Progettare un gioiello</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chi desidera un pezzo unico — un anello di fidanzamento, una collana per un'occasione speciale, una parure coordinata — trova un percorso riservato, costruito in più incontri. Il dettaglio è raccontato nella pagina dei{" "}
                <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                  gioielli su misura a Bari
                </Link>
                .
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Restaurare un ricordo</h3>
              <p className="text-muted-foreground leading-relaxed">
                I gioielli ereditati raccontano storie che meritano di continuare. L'atelier interviene su pezzi antichi e di famiglia con riparazioni mirate, sostituzione di castoni e ricostruzioni che rispettano l'identità originaria del gioiello.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Curare nel tempo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pulizia, lucidatura, rodiatura, modifica della misura: la manutenzione è la parte meno visibile del lavoro, eppure quella che permette ai gioielli di restare luminosi negli anni. Una panoramica completa si trova nella pagina dei{" "}
                <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                  servizi dell'atelier
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DA TUTTA LA PUGLIA */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-gold-deep">§ Dalla Puglia</p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md">
              Un riferimento per tutta la regione
            </Reveal>
            <p>
              Molti dei clienti che varcano la soglia dell'atelier non vivono a Bari città: arrivano dalla provincia, dalle aree interne della Puglia e dalle località costiere. La formula dell'appuntamento è pensata anche per loro: il primo contatto avviene per telefono, email o WhatsApp, così da concordare l'orario migliore, anticipare materiali da preparare e, quando utile, condividere fotografie del gioiello di partenza prima dell'incontro.
            </p>
            <p>
              Quando il progetto è particolarmente delicato — un anello di fidanzamento, una rivisitazione di un pezzo storico di famiglia — molte decisioni possono essere prese in atelier, con il maestro orafo al banco. Questo riduce gli spostamenti e permette di concentrare in poche visite mirate l'intero percorso, dal primo schizzo alla consegna finale del gioiello.
            </p>
            <p>
              Se cerchi più nel dettaglio la prospettiva cittadina, puoi visitare la pagina dedicata al{" "}
              <Link to="/gioielliere-bari" className="text-gold-deep underline-offset-4 hover:underline">
                gioielliere a Bari
              </Link>
              : completa quanto raccontato qui sul piano regionale.
            </p>
          </div>
        </div>
      </section>

      {/* QUARTA SEZIONE - DETTAGLIO LAB */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <img
              src={storiaMani}
              alt="Mani del maestro orafo al banco di lavoro"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md mb-4">
              Lavorazione interna, dialogo diretto
            </Reveal>
            <p>
              Tutta la lavorazione avviene nello stesso laboratorio in cui si svolgono gli incontri. Significa che chi commissiona un gioiello dialoga sempre con la stessa persona, vede gli strumenti, può chiedere il motivo di una scelta tecnica e ottenere risposte misurate sul progetto reale.
            </p>
            <p>
              È una modalità di lavoro più lenta rispetto al ritmo della distribuzione di massa, ma è proprio la sua lentezza a garantire la cura. Per chi cerca un atelier orafo in Puglia con questo tipo di approccio, Cara Preziosi rappresenta un riferimento stabile, anno dopo anno.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-obsidian text-bone py-24 md:py-32 noise">
        <div className="container-cara text-center max-w-3xl mx-auto">
          <Reveal delay={0.1}>
            <p className="eyebrow text-gold mb-8">Visita l'atelier</p>
            <h2 className="display-lg mb-8">
              Vieni a conoscere l'atelier
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per organizzare la tua visita: il primo incontro è gratuito e senza impegno, e serve soprattutto a capire se l'approccio dell'atelier è quello giusto per il tuo progetto. Saremo felici di accoglierti in {contacts.address}, a Bari.
            </p>
            <Link to="/contatti" search={{ richiesta: "", pietra: "" }} className="btn-primary group">
              Prenota un appuntamento
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
