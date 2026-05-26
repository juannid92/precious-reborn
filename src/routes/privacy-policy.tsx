import { createFileRoute, Link } from "@tanstack/react-router";
import { brand, contacts } from "@/content/site";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${brand.name}` },
      {
        name: "description",
        content:
          "Informativa sul trattamento dei dati personali da parte di " +
          brand.name +
          ".",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <section className="bg-bone text-ink pt-40 md:pt-56 pb-24">
      <div className="container-cara mx-auto max-w-3xl">
        <p className="eyebrow text-gold mb-4">Informativa</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink">Privacy Policy</h1>
        <p className="mt-6 text-sm text-ink/60">
          Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
        </p>

        <div className="prose prose-neutral mt-10 max-w-none text-ink/80 leading-relaxed">
          <h2 className="font-display text-2xl text-ink mt-10">Titolare del trattamento</h2>
          <p>
            Titolare del trattamento è <strong>{brand.name}</strong>, con sede
            in {contacts.address}, {contacts.city}. Per esercitare i tuoi
            diritti puoi scrivere a{" "}
            <a href={contacts.emailHref} className="underline-gold">
              {contacts.email}
            </a>
            .
          </p>

          <h2 className="font-display text-2xl text-ink mt-10">Dati trattati</h2>
          <ul>
            <li>
              <strong>Dati di navigazione</strong>: log tecnici essenziali al
              funzionamento del sito.
            </li>
            <li>
              <strong>Dati statistici aggregati</strong> tramite Google
              Analytics, solo previo consenso espresso tramite banner cookie.
            </li>
            <li>
              <strong>Dati di contatto</strong> che l'utente fornisce
              volontariamente tramite email, telefono o moduli di contatto.
            </li>
          </ul>

          <h2 className="font-display text-2xl text-ink mt-10">Finalità e basi giuridiche</h2>
          <ul>
            <li>Erogazione del sito e dei servizi richiesti (legittimo interesse e contratto).</li>
            <li>Misurazione statistica aggregata via Google Analytics (consenso).</li>
            <li>Risposta a richieste dell'utente (misure precontrattuali / consenso).</li>
          </ul>

          <h2 className="font-display text-2xl text-ink mt-10">Diritti dell'interessato</h2>
          <p>
            L'utente può esercitare in ogni momento i diritti previsti dagli
            artt. 15-22 GDPR (accesso, rettifica, cancellazione, limitazione,
            portabilità, opposizione) scrivendo ai contatti sopra indicati.
            Hai inoltre diritto di proporre reclamo al Garante per la
            protezione dei dati personali.
          </p>

          <h2 className="font-display text-2xl text-ink mt-10">Cookie</h2>
          <p>
            Per i dettagli sui cookie utilizzati e sulla gestione del consenso
            consulta la{" "}
            <Link to="/cookie-policy" className="underline-gold">
              Cookie Policy
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
