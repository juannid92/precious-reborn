import { createFileRoute, Link } from "@tanstack/react-router";
import { brand, contacts } from "@/content/site";
import { CookiePreferencesLink } from "@/components/cookie/CookiePreferencesLink";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: `Cookie Policy — ${brand.name}` },
      {
        name: "description",
        content: `Informativa sui cookie e sulle tecnologie di memorizzazione utilizzate da ${brand.name}.`,
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: CookiePolicyPage,
});

const heading = "font-display text-2xl text-ink mt-10";
const link = "underline-gold";

function CookiePolicyPage() {
  return (
    <section className="bg-bone text-ink pt-40 md:pt-56 pb-24">
      <div className="container-cara mx-auto max-w-3xl">
        <p className="eyebrow text-gold mb-4">Informativa cookie</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink">Cookie Policy</h1>
        <p className="mt-6 text-sm text-ink/60">Ultimo aggiornamento: 29 settembre 2026</p>

        <div className="prose prose-neutral mt-10 max-w-none text-ink/80 leading-relaxed">
          <h2 className={heading}>1. Titolare</h2>
          <p>
            Il titolare è <strong>{brand.name}</strong>, attività di Nicola Caradonna, P. IVA
            08895310723, con sede in {contacts.address}, {contacts.city}; email{" "}
            <a href={contacts.emailHref} className={link}>
              {contacts.email}
            </a>
            .
          </p>

          <h2 className={heading}>2. Cosa sono cookie e tecnologie simili</h2>
          <p>
            I cookie sono piccoli file salvati dal browser. Il sito utilizza anche il localStorage,
            una memoria locale del browser con funzione analoga. Le tecnologie strettamente
            necessarie non richiedono consenso; quelle statistiche vengono attivate soltanto dopo
            una scelta positiva.
          </p>

          <h2 className={heading}>3. Tecnologie necessarie</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Fornitore</th>
                  <th>Finalità</th>
                  <th>Durata</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>cara_cookie_consent_v2</td>
                  <td>Cara Preziosi, localStorage</td>
                  <td>Memorizza la scelta cookie e la relativa versione</td>
                  <td>180 giorni</td>
                </tr>
                <tr>
                  <td>cara.pietraScelta</td>
                  <td>Cara Preziosi, localStorage</td>
                  <td>Trasferisce tra le pagine la pietra scelta, senza dati anagrafici</td>
                  <td>Massimo 24 ore o fino alla rimozione</td>
                </tr>
                <tr>
                  <td>__cf_bm</td>
                  <td>Cloudflare</td>
                  <td>Protezione da traffico automatizzato e abusi; cookie HttpOnly</td>
                  <td>circa 30 minuti</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Queste tecnologie sono utilizzate sulla base della necessità tecnica e del legittimo
            interesse alla sicurezza. Il cookie Cloudflare può essere impostato dall'infrastruttura
            prima della scelta perché è strettamente necessario.
          </p>

          <h2 className={heading}>4. Cookie statistici opzionali</h2>
          <p>
            Google Analytics viene caricato solo dopo il consenso e serve a comprendere, in forma
            statistica, come viene utilizzato il sito. Prima del consenso il relativo script non
            viene richiesto.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Fornitore</th>
                  <th>Finalità</th>
                  <th>Durata massima indicativa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics</td>
                  <td>Distingue i visitatori per statistiche aggregate</td>
                  <td>2 anni</td>
                </tr>
                <tr>
                  <td>_ga_*</td>
                  <td>Google Analytics</td>
                  <td>Mantiene lo stato della sessione e della misurazione</td>
                  <td>2 anni</td>
                </tr>
                <tr>
                  <td>_gid / _gat*</td>
                  <td>Google Analytics, se impostati</td>
                  <td>Statistiche e limitazione delle richieste</td>
                  <td>24 ore / circa 1 minuto</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Base giuridica: consenso (art. 6.1.a GDPR e art. 122 Codice Privacy). Il rifiuto non
            limita l'accesso al sito. La revoca interrompe i caricamenti successivi e il sito tenta
            di eliminare i cookie Analytics accessibili sul proprio dominio.
          </p>

          <h2 className={heading}>5. Servizi esterni senza caricamento preventivo</h2>
          <p>
            I font Inter, Fraunces e Cormorant Garamond sono ospitati localmente: la visualizzazione
            delle pagine non contatta Google Fonts. La pagina Contatti non incorpora automaticamente
            Google Maps; la mappa si apre sul sito di Google soltanto se selezioni il relativo link.
            WhatsApp, Instagram e Facebook ricevono dati tecnici quando apri i rispettivi
            collegamenti. Le immagini del catalogo possono provenire da CDN dei fornitori come
            contenuto funzionale; le viste 360 esterne vengono invece caricate soltanto dopo un clic
            esplicito.
          </p>

          <h2 className={heading}>6. Come esprimere o revocare la scelta</h2>
          <p>
            Il banner offre le opzioni “Accetta”, “Rifiuta” e “Personalizza” senza caselle
            preselezionate. Puoi cambiare scelta in ogni momento tramite{" "}
            <CookiePreferencesLink
              className={`${link} text-ink hover:text-gold transition-colors`}
              label="Rivedi preferenze cookie"
            />
            . Dopo 180 giorni o in caso di modifica sostanziale dei servizi, il sito richiede
            nuovamente la scelta.
          </p>
          <p>
            Puoi anche eliminare cookie e dati del sito dalle impostazioni del browser. Il blocco
            delle tecnologie necessarie può compromettere il salvataggio delle preferenze.
          </p>

          <h2 className={heading}>7. Trasferimenti e maggiori informazioni</h2>
          <p>
            Google e Cloudflare possono trattare dati fuori dallo SEE applicando le garanzie
            previste dal GDPR. Per finalità, destinatari, diritti e contatti consulta la{" "}
            <Link to="/privacy-policy" className={link}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
