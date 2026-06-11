import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { contacts } from "@/content/site";
import ringCharlotte from "@/assets/cara/ring-charlotte.jpg";

const TITLE = "Crea un anello personalizzato a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Crea un anello personalizzato a Bari con l'atelier Cara Preziosi: schizzo, scelta della pietra e lavorazione a mano in Via Antonio Beatillo 14, su appuntamento.";
const URL = "https://www.carapreziosi.it/crea-anello-personalizzato-bari";
const IMAGE = `https://www.carapreziosi.it${ringCharlotte}`;

export const Route = createFileRoute("/crea-anello-personalizzato-bari")({
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
            { "@type": "ListItem", position: 2, name: "Crea anello personalizzato Bari", item: URL },
          ],
        }),
      },
    ],
  }),
  component: CreaAnelloPersonalizzatoBariPage,
});

function CreaAnelloPersonalizzatoBariPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-bone text-ink pt-40 md:pt-56 pb-20 md:pb-28">
        <div className="container-cara">
          <PageBreadcrumb current="Crea anello personalizzato Bari" className="mb-8" />
          <p className="eyebrow text-gold-deep mb-8">Anelli su misura · Bari</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Crea un anello personalizzato a{" "}
            <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>Bari</em>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              In Via Antonio Beatillo 14, a pochi passi dal centro di Bari, il maestro orafo Nicola Caradonna disegna e realizza a mano anelli unici: solitari di fidanzamento, fedi nuziali, anelli di ricorrenza o pezzi pensati come regalo importante. Un percorso riservato, su appuntamento, costruito intorno a una sola idea per volta.
            </p>
          </Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              Un anello è il gioiello più personale che si possa indossare. Si guarda decine di volte al giorno, accompagna le mani in ogni gesto, racconta — senza bisogno di parole — una promessa, un legame, una data che vuoi ricordare. Per questo, nel nostro atelier di Bari, non vendiamo anelli da vetrina come fossero tutti uguali: ne progettiamo uno per volta, insieme alla persona che lo porterà o a chi lo regalerà.
            </p>
            <p>
              Creare un anello personalizzato a Bari significa entrare in laboratorio, sedersi davanti al banco, raccontare l'occasione e lasciarsi guidare nelle scelte concrete: forma della fascia, tipo di metallo, pietra centrale, dettagli laterali, incisioni interne. Tutto viene deciso a voce e poi messo nero su bianco in un disegno preciso, prima di iniziare la lavorazione.
            </p>
          </div>
        </div>
      </section>

      {/* OCCASIONI */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Occasioni</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Per quali momenti nasce un anello <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>su misura</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Fidanzamento</h3>
              <p className="text-muted-foreground leading-relaxed">
                Il solitario disegnato per una sola persona. Studiamo insieme la pietra centrale, l'altezza della castonatura, il profilo della fascia: l'anello deve essere bello a colpo d'occhio e comodo da portare ogni giorno, anche dopo anni.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Fede nuziale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Fedi coordinate o pensate distintamente per ciascuno: oro giallo, bianco, rosa, finitura lucida o satinata, incisioni interne con la data o le iniziali. Ogni dettaglio viene approvato prima che il metallo prenda forma.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Ricorrenza o regalo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Un anniversario, una nascita, un traguardo importante: l'anello su misura diventa il modo di fissare nel tempo un momento che merita più di un oggetto qualsiasi. Anche il rifacimento di un gioiello di famiglia rientra in questa scelta.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* IL PERCORSO PER UN ANELLO */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Il percorso</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Dall'idea all'anello finito, passo dopo passo
            </Reveal>
          </div>
          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <img
                src={ringCharlotte}
                alt="Anello solitario Cara Preziosi realizzato a mano nell'atelier di Bari"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
              <p>
                Il primo incontro è dedicato all'idea: forma, ispirazione, eventuale anello di riferimento, fotografie, ricordi. Da qui nasce uno schizzo iniziale e, se serve, un rendering più dettagliato per visualizzare proporzioni e volumi prima di iniziare.
              </p>
              <p>
                Si passa quindi alla scelta della pietra — diamante o pietra di colore — valutando taglio, dimensione e disponibilità reale presso i laboratori di fiducia, senza promesse che non possiamo onorare. Si rileva la misura del dito con strumenti precisi, e ogni dettaglio viene messo per iscritto nel preventivo.
              </p>
              <p>
                La lavorazione vera e propria — modellazione, microfusione, incastonatura, lucidatura finale — resta interna al laboratorio. È così che possiamo garantire la coerenza tra il disegno approvato e l'anello che riceverai. Per una panoramica completa delle fasi creative puoi consultare il{" "}
                <Link to="/crea-il-tuo-gioiello" className="text-gold-deep underline-offset-4 hover:underline">
                  configuratore guidato del gioiello su misura
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COME SCEGLIERE */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-gold-deep">§ Come scegliere</p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg text-ink/85 leading-relaxed">
            <Reveal as="h2" className="display-md">
              Alcune scelte concrete prima dell'appuntamento
            </Reveal>
            <p>
              Non è necessario arrivare in atelier con le idee già definite: gran parte del lavoro è proprio aiutarti a metterle a fuoco. È però utile riflettere su due o tre aspetti pratici. Pensa a come la persona che indosserà l'anello usa le mani durante la giornata: lavoro manuale, sport, contatto frequente con acqua o detergenti influenzano la scelta dell'altezza della castonatura e del tipo di griffe.
            </p>
            <p>
              Considera anche lo stile degli altri gioielli che si indossano abitualmente. Un anello pensato per stare accanto a una fede esistente, o sopra un altro anello di famiglia, richiede una progettazione coordinata. Se non hai una preferenza chiara sul metallo, possiamo confrontare dal vivo oro giallo, bianco e rosa: la differenza visiva sulla pelle è più decisiva di quanto sembri nelle fotografie.
            </p>
            <p>
              Infine, sul budget: parlarne apertamente all'inizio ci permette di costruire un progetto sostenibile, lavorando sulla pietra e sulle finiture per restare nell'ordine di valore desiderato senza rinunciare alla qualità della lavorazione. Per esplorare lo stile delle nostre creazioni puoi visitare la sezione{" "}
              <Link to="/categorie" className="text-gold-deep underline-offset-4 hover:underline">
                collezioni di anelli, orecchini, collane e bracciali
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* PERCHÉ BARI */}
      <section className="bg-obsidian text-bone py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-gold">§ Atelier · Bari</p>
          </div>
          <div className="md:col-span-8 space-y-6">
            <Reveal as="h2" className="display-md">
              Un anello pensato e fatto a <em className="italic font-display text-gold" style={{ fontStyle: "italic" }}>Bari</em>
            </Reveal>
            <p className="text-bone/75 text-lg leading-relaxed">
              L'atelier si trova in {contacts.address}, in centro a Bari, raggiungibile facilmente da chi arriva dalla città e dalla provincia. La scelta dell'appuntamento è una forma di rispetto reciproco: ti dedichiamo tempo esclusivo, mostriamo materiali e campionature, costruiamo il progetto del tuo anello senza interruzioni.
            </p>
            <p className="text-bone/75 text-lg leading-relaxed">
              Se cerchi una panoramica più ampia delle creazioni su misura — non solo anelli — puoi leggere la pagina dedicata ai{" "}
              <Link to="/gioielli-su-misura-bari" className="text-gold underline-offset-4 hover:underline">
                gioielli su misura a Bari
              </Link>
              . È il modo migliore per capire l'approccio dell'atelier prima di fissare il primo incontro.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara text-center max-w-3xl mx-auto">
          <Reveal delay={0.1}>
            <p className="eyebrow text-gold-deep mb-8">L'appuntamento</p>
            <h2 className="display-lg mb-8">
              Prenota una visita per il tuo anello
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per fissare un primo incontro riservato. In atelier ascolteremo la tua idea e inizieremo, insieme, a disegnare l'anello che hai in mente.
            </p>
            <Link to="/contatti" className="btn-primary group">
              Prenota un appuntamento
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
