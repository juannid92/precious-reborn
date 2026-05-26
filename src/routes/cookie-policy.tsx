import { createFileRoute, Link } from "@tanstack/react-router";
import { brand } from "@/content/site";
import { CookiePreferencesLink } from "@/components/cookie/CookiePreferencesLink";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: `Cookie Policy — ${brand.name}` },
      {
        name: "description",
        content:
          "Informativa estesa sui cookie utilizzati dal sito di " +
          brand.name +
          ": cookie tecnici e cookie statistici (Google Analytics).",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <section className="bg-bone text-ink pt-40 md:pt-56 pb-24">
      <div className="container-cara mx-auto max-w-3xl">
        <p className="eyebrow text-gold mb-4">Informativa</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink">Cookie Policy</h1>
        <p className="mt-6 text-sm text-ink/60">
          Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
        </p>

        <div className="prose prose-neutral mt-10 max-w-none text-ink/80 leading-relaxed">
          <h2 className="font-display text-2xl text-ink mt-10">Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file di testo che i siti visitati inviano al
            terminale dell'utente, dove vengono memorizzati per essere
            ritrasmessi agli stessi siti alla visita successiva. Sono utilizzati
            per eseguire autenticazioni informatiche, monitoraggio di sessioni e
            memorizzazione di informazioni sugli utenti.
          </p>

          <h2 className="font-display text-2xl text-ink mt-10">
            Categorie di cookie utilizzate
          </h2>

          <h3 className="font-medium text-ink mt-6">1. Cookie tecnici necessari</h3>
          <p>
            Sono indispensabili al corretto funzionamento del sito e alla
            memorizzazione delle scelte effettuate dall'utente (ad esempio le
            preferenze sui cookie). Non richiedono il consenso preventivo e
            sono sempre attivi.
          </p>

          <h3 className="font-medium text-ink mt-6">2. Cookie statistici / Analytics</h3>
          <p>
            Utilizziamo <strong>Google Analytics</strong> (fornitore: Google)
            per raccogliere in forma aggregata statistiche sull'uso del sito.
            Questi cookie sono attivati <strong>solo previo consenso</strong>{" "}
            esplicito dell'utente attraverso il banner. In assenza di consenso
            non vengono caricati.
          </p>
          <ul>
            <li>Finalità: misurazione statistica del traffico e dell'utilizzo del sito.</li>
            <li>Base giuridica: consenso dell'interessato (art. 6 par. 1 lett. a GDPR).</li>
            <li>Trasferimento dati: i dati possono essere trasferiti verso paesi extra-UE.</li>
            <li>Conservazione: secondo la configurazione di Google Analytics adottata.</li>
          </ul>

          <h2 className="font-display text-2xl text-ink mt-10">
            Gestione del consenso
          </h2>
          <p>
            Al primo accesso al sito viene mostrato un banner che consente di
            accettare, rifiutare o personalizzare le categorie di cookie non
            tecnici. L'utente può modificare la propria scelta in qualunque
            momento tramite il link{" "}
            <CookiePreferencesLink
              className="underline-gold text-ink hover:text-gold transition-colors"
              label="Rivedi preferenze cookie"
            />{" "}
            disponibile in fondo a ogni pagina.
          </p>

          <h2 className="font-display text-2xl text-ink mt-10">
            Riferimenti e contatti
          </h2>
          <p>
            Per ulteriori informazioni sul trattamento dei dati personali
            consulta la nostra{" "}
            <Link to="/privacy-policy" className="underline-gold">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="mt-12 text-xs italic text-ink/50">
            Verificare sempre configurazione Analytics, anonimizzazione, tempi
            di conservazione, policy e assetto reale del progetto con un
            consulente privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
