import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { contacts } from "@/content/site";
import storiaLaboratorio from "@/assets/cara/storia-laboratorio.jpg";

const TITLE = "Gioielliere a Bari — Atelier orafo Cara Preziosi";
const DESCRIPTION =
  "Cara Preziosi è l'atelier orafo di Nicola Caradonna a Bari, Via Beatillo 14. Creazioni su misura, restauro e manutenzione su appuntamento.";
const URL = "https://www.carapreziosi.it/gioielliere-bari";
const IMAGE = `https://www.carapreziosi.it${storiaLaboratorio}`;

export const Route = createFileRoute("/gioielliere-bari")({
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
            { "@type": "ListItem", position: 2, name: "Gioielliere Bari", item: URL },
          ],
        }),
      },
    ],
  }),
  component: GioielliereBariPage,
});

function GioielliereBariPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-bone text-ink pt-40 md:pt-56 pb-20 md:pb-28">
        <div className="container-cara">
          <PageBreadcrumb current="Gioielliere Bari" className="mb-8" />
          <p className="eyebrow text-gold-deep mb-8">Atelier orafo · Bari</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Gioielliere a Bari: l'atelier orafo{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>Cara Preziosi</em>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              In {contacts.address}, nel cuore di Bari, il maestro orafo Nicola Caradonna riceve su appuntamento chi cerca un maestro orafo vero: non una catena, non una vetrina seriale, ma una bottega dove ogni pezzo viene pensato, lavorato e custodito a mano. Una tradizione che da oltre quarant'anni accompagna le famiglie del territorio nei momenti più importanti.
            </p>
          </Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              Cercare un gioielliere a Bari significa, oggi, scegliere tra due mondi molto diversi. Da un lato le grandi insegne, con cataloghi standardizzati e gioielli prodotti in serie all'estero; dall'altro le poche botteghe orafe rimaste, dove il banco del maestro orafo è ancora il vero centro del lavoro. Cara Preziosi appartiene a questa seconda famiglia: un atelier in cui creazione, restauro e manutenzione passano dalle stesse mani esperte, in laboratorio, senza intermediari.
            </p>
            <p>
              Per chi vive a Bari e in provincia, avere a disposizione un maestro orafo vicino casa significa poter affidare con tranquillità anche il pezzo più importante: l'anello di fidanzamento da progettare, la collana ereditata da rimettere a nuovo, le fedi da personalizzare con un'incisione. Tutto questo viene curato qui, in Via Antonio Beatillo, con la possibilità di parlare di persona con chi mette davvero le mani sul gioiello.
            </p>
          </div>
        </div>
      </section>

      {/* COSA TROVI */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ I servizi</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Cosa fa un <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>maestro orafo</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Creazione su misura</h3>
              <p className="text-muted-foreground leading-relaxed">
                Anelli di fidanzamento, fedi nuziali, pendenti dedicati: ogni gioiello viene disegnato partendo da una storia precisa. Lo schizzo, la scelta del metallo e della pietra, la lavorazione finale restano interni al laboratorio. Un percorso che puoi approfondire nella pagina dei{" "}
                <Link to="/gioielli-su-misura-bari" className="text-gold-deep underline-offset-4 hover:underline">
                  gioielli su misura a Bari
                </Link>
                .
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Restauro</h3>
              <p className="text-muted-foreground leading-relaxed">
                I gioielli di famiglia meritano cura: sostituzione di castoni, ricostruzione di parti mancanti, intervento su collane antiche e pezzi d'epoca. Si lavora a mano, con interventi reversibili dove possibile, per restituire il gioiello senza tradirne la storia.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Lucidatura e messa a misura</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pulizia professionale, lucidatura, rodiatura dell'oro bianco, modifica della misura degli anelli: la manutenzione regolare allunga la vita dei gioielli e ne preserva la luce originaria. Tutti i dettagli sono descritti nella pagina{" "}
                <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                  servizi dell'atelier
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DIFFERENZA */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ La differenza</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Atelier orafo e catena: due approcci diversi
            </Reveal>
          </div>
          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <img
                src={storiaLaboratorio}
                alt="Banco del maestro orafo Nicola Caradonna nell'atelier Cara Preziosi a Bari"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
              <p>
                In una catena di gioielleria si sceglie tra modelli già pronti, prodotti in serie e replicati in centinaia di esemplari identici. È una formula efficiente, ma lascia poco margine al gesto personale: il gioiello che ti è piaciuto in vetrina è esattamente quello che indosserà qualcun altro.
              </p>
              <p>
                In un atelier orafo come Cara Preziosi, invece, ciò che acquisti è prima di tutto il lavoro: il tempo di chi disegna, fonde, incastona e rifinisce ogni pezzo. La materia prima — oro, diamanti, pietre di colore — viene scelta insieme, con trasparenza sulle caratteristiche e sulle scelte tecniche. Il risultato è un gioiello che porta una firma riconoscibile e una sola storia: la tua.
              </p>
              <p>
                Per capire come questa idea di mestiere si è formata nel tempo, ti invitiamo a leggere{" "}
                <Link to="/storia" className="text-gold-deep underline-offset-4 hover:underline">
                  la storia del laboratorio
                </Link>
                : quarant'anni di banco orafo, attrezzi tramandati e mani che continuano a fare le cose nello stesso modo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DOVE SIAMO */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-gold-deep">§ Dove siamo</p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md">
              Il nostro indirizzo a Bari
            </Reveal>
            <p>
              L'atelier si trova in <strong>{contacts.address}, {contacts.city}</strong>, raggiungibile facilmente da chi arriva dal centro e dalla provincia. Riceviamo dal lunedì al sabato negli orari {contacts.hours}, sempre su appuntamento: una scelta che ci permette di dedicare tempo esclusivo a ogni progetto, mostrare materiali e campionature senza fretta e mantenere la riservatezza che alcuni gioielli — un anello di fidanzamento, un regalo importante — richiedono.
            </p>
            <p>
              Per fissare la prima visita basta scrivere o chiamare. Risponderemo personalmente, ti chiederemo solo qualche informazione utile e troveremo l'orario più comodo. Tutti i recapiti sono raccolti nella pagina{" "}
              <Link to="/contatti" search={{ richiesta: "", pietra: "" }} className="text-gold-deep underline-offset-4 hover:underline">
                contatti
              </Link>
              , insieme alla mappa per arrivare in atelier.
            </p>
            <p>
              Se invece vuoi farti un'idea preliminare dello stile delle nostre creazioni, puoi sfogliare la sezione{" "}
              <Link to="/categorie" className="text-gold-deep underline-offset-4 hover:underline">
                collezioni
              </Link>
              : anelli, orecchini, collane e bracciali, tutti realizzati internamente al laboratorio.
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
              Un gioielliere a Bari, a tua disposizione
            </h2>
            <p className="text-bone/75 text-lg mb-10 leading-relaxed">
              Che si tratti di un gioiello da creare, di un pezzo di famiglia da restaurare o solo di un consiglio sincero, in atelier troverai tempo, ascolto e mani esperte. Prenota una visita: il primo incontro è il modo migliore per conoscerci.
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
