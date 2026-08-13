import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { contacts } from "@/content/site";
import storiaLaboratorio from "@/assets/cara/storia-laboratorio.jpg";

const TITLE = "Gioielli su misura a Bari — Atelier Cara Preziosi";
const DESCRIPTION =
  "Gioielli su misura a Bari: l'atelier orafo Cara Preziosi progetta e realizza a mano anelli, fedi e creazioni uniche su appuntamento in Via Antonio Beatillo 14.";
const URL = "https://www.carapreziosi.it/gioielli-su-misura-bari";

export const Route = createFileRoute("/gioielli-su-misura-bari")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:image", content: `https://www.carapreziosi.it${storiaLaboratorio}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `https://www.carapreziosi.it${storiaLaboratorio}` },
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
            { "@type": "ListItem", position: 2, name: "Gioielli su misura Bari", item: URL },
          ],
        }),
      },
    ],
  }),
  component: GioielliSuMisuraBariPage,
});

function GioielliSuMisuraBariPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-bone text-ink pt-40 md:pt-56 pb-20 md:pb-28">
        <div className="container-cara">
          <PageBreadcrumb current="Gioielli su misura Bari" className="mb-8" />
          <p className="eyebrow text-gold-deep mb-8">Atelier orafo · Bari</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Gioielli su misura<br />
            a <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>Bari</em>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              Nel cuore di Bari, in Via Antonio Beatillo 14, l'atelier Cara Preziosi accoglie chi cerca un gioiello pensato per una sola persona. Su appuntamento, disegniamo e lavoriamo a mano anelli di fidanzamento, fedi nuziali, pendenti e pezzi commemorativi: un percorso lento, riservato, costruito intorno alla tua storia.
            </p>
          </Reveal>
        </div>
      </section>

      {/* INTRO BODY */}
      <section className="bg-bone text-ink pb-24 md:pb-32">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg text-ink/85 leading-relaxed">
            <p>
              Scegliere un gioiello su misura a Bari significa rinunciare alla vetrina e attraversare la porta di un laboratorio vero. Il maestro orafo Nicola Caradonna ti ascolta, prende appunti, schizza la prima idea davanti a te. Da quel momento il pezzo non appartiene a un catalogo: appartiene a te, alla persona a cui lo destini, al ricordo che vuoi fissare nel metallo.
            </p>
            <p>
              L'atelier lavora esclusivamente su appuntamento. Questa scelta tutela il tempo del cliente e quello della creazione: ogni incontro dura il necessario, senza fretta, in uno spazio in cui la pietra può essere osservata sotto la giusta luce e il disegno può essere discusso a voce. È il modo in cui da oltre quarant'anni Cara Preziosi accompagna famiglie baresi e pugliesi nelle occasioni che contano — fidanzamenti, matrimoni, anniversari, nascite, lasciti tramandati di generazione in generazione.
            </p>
          </div>
        </div>
      </section>

      {/* MATERIALI E LAVORAZIONI */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ Materiali</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Metalli, pietre, finiture: ogni scelta è <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>tua</em>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-3 md:col-start-4">
            <Reveal>
              <h3 className="font-display text-2xl mb-4">Oro nelle sue sfumature</h3>
              <p className="text-muted-foreground leading-relaxed">
                Oro giallo, bianco o rosa, lavorato nei titoli previsti dalla tradizione italiana. Per le superfici scegli insieme a noi la finitura — lucida, satinata, martellata — in base al carattere che vuoi dare al pezzo.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl mb-4">Pietre selezionate</h3>
              <p className="text-muted-foreground leading-relaxed">
                Diamanti certificati, smeraldi, zaffiri e pietre di colore vengono valutati insieme: forma, taglio, dimensione e disponibilità reale dei laboratori di fiducia. Nessuna promessa che non possiamo onorare.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="font-display text-2xl mb-4">Dettagli personalizzati</h3>
              <p className="text-muted-foreground leading-relaxed">
                Incisioni a mano interne o esterne, date, iniziali, simboli e piccoli dettagli nascosti: il valore di un gioiello su misura sta anche nei segni che soltanto chi lo indossa conoscerà.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* IL PERCORSO IN ATELIER */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-gold-deep">§ In atelier</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-8">
              Un incontro, un disegno, un gioiello che resta
            </Reveal>
          </div>
          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <img
                src={storiaLaboratorio}
                alt="Banco di lavoro dell'atelier Cara Preziosi a Bari"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="md:col-span-6 space-y-5 text-lg text-ink/85 leading-relaxed">
              <p>
                Il primo appuntamento è di ascolto: capiamo chi indosserà il gioiello, in quale occasione, con quale tono. Si parla di colori, di mani, di abitudini quotidiane — perché un anello che si porta tutti i giorni non si progetta come un pezzo da serata.
              </p>
              <p>
                Dal disegno passiamo al preventivo dettagliato e, una volta condiviso, alla lavorazione. Le fasi successive — modellazione, microfusione, incastonatura, rifinitura — restano interne al laboratorio. Non esternalizziamo le mani che danno forma al tuo pezzo: è questa la promessa dell'artigianato che continuiamo a tutelare.
              </p>
              <p className="pt-2">
                Vuoi vedere in dettaglio le fasi creative? Esplora il nostro{" "}
                <Link to="/crea-il-tuo-gioiello" className="text-gold-deep underline-offset-4 hover:underline">
                  configuratore guidato del gioiello su misura
                </Link>{" "}
                oppure scopri tutti i{" "}
                <Link to="/servizi" className="text-gold-deep underline-offset-4 hover:underline">
                  servizi dell'atelier
                </Link>
                , dalla creazione al restauro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PERCHÉ BARI */}
      <section className="bg-obsidian text-bone py-24 md:py-32 noise">
        <div className="container-cara grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-gold">§ Radici</p>
          </div>
          <div className="md:col-span-8 space-y-6">
            <Reveal as="h2" className="display-md">
              Un atelier orafo nel cuore di <em className="italic font-display text-gold" style={{ fontStyle: "italic" }}>Bari</em>
            </Reveal>
            <p className="text-bone/75 text-lg leading-relaxed">
              Cara Preziosi si trova in {contacts.address}, a pochi passi dal centro storico di Bari. Per chi arriva dalla provincia o dal resto della Puglia, l'appuntamento è il modo più rispettoso di organizzare l'incontro: dedichiamo tempo esclusivo, mostriamo materiali e campionature, costruiamo il progetto senza interruzioni.
            </p>
            <p className="text-bone/75 text-lg leading-relaxed">
              La nostra storia di laboratorio, il modo in cui Nicola Caradonna ha scelto di tenere viva la tradizione orafa pugliese, è raccontata nella{" "}
              <Link to="/storia" className="text-gold underline-offset-4 hover:underline">
                pagina dedicata al laboratorio
              </Link>
              . È lì che capirai perché un gioiello fatto a Bari, in questo atelier, non somiglia a nessun altro.
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
              Prenota una visita in atelier
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Scrivici o chiamaci per fissare un primo incontro riservato. Ti accoglieremo nel laboratorio di Via Antonio Beatillo 14 e inizieremo, insieme, a immaginare il tuo gioiello su misura.
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
