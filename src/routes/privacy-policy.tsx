import { createFileRoute, Link } from "@tanstack/react-router";
import { brand, contacts } from "@/content/site";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${brand.name}` },
      {
        name: "description",
        content: `Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 GDPR di ${brand.name}.`,
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPolicyPage,
});

const heading = "font-display text-2xl text-ink mt-10";
const link = "underline-gold";

function PrivacyPolicyPage() {
  return (
    <section className="bg-bone text-ink pt-40 md:pt-56 pb-24">
      <div className="container-cara mx-auto max-w-3xl">
        <p className="eyebrow text-gold mb-4">Informativa ai sensi del GDPR</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink">Privacy Policy</h1>
        <p className="mt-6 text-sm text-ink/60">Ultimo aggiornamento: 29 settembre 2026</p>

        <div className="prose prose-neutral mt-10 max-w-none text-ink/80 leading-relaxed">
          <h2 className={heading}>1. Titolare del trattamento</h2>
          <p>
            Il titolare del trattamento è <strong>{brand.name}</strong>, attività di Nicola
            Caradonna, P. IVA 08895310723, con sede in {contacts.address}, {contacts.city}. Per
            richieste relative alla privacy o per esercitare i diritti descritti di seguito puoi
            scrivere a{" "}
            <a href={contacts.emailHref} className={link}>
              {contacts.email}
            </a>
            .
          </p>

          <h2 className={heading}>2. Dati trattati e modalità di raccolta</h2>
          <ul>
            <li>
              <strong>Dati tecnici e di navigazione</strong>: indirizzo IP, data e ora, URL
              richiesto, user agent, log di sicurezza e informazioni sul dispositivo, raccolti
              automaticamente dall'infrastruttura.
            </li>
            <li>
              <strong>Dati di contatto</strong>: nome, email, telefono e contenuto del messaggio
              forniti volontariamente per richiedere informazioni, preventivi o appuntamenti.
            </li>
            <li>
              <strong>Preferenze e dati di utilizzo</strong>: scelta sui cookie e, solo con
              consenso, dati statistici raccolti tramite Google Analytics.
            </li>
            <li>
              <strong>Dati relativi alla progettazione del gioiello</strong>: preferenze, budget
              indicativo, note, immagini di ispirazione e file generati quando utilizzi gli
              strumenti di concept e anteprima 3D.
            </li>
            <li>
              <strong>Dati del catalogo pietre</strong>: filtri e identificativi degli articoli
              consultati. Le ricerche sono eseguite dal server; immagini e viste 360 possono essere
              fornite da Nivoda o dai relativi fornitori tecnici e ricevono IP e dati del browser
              soltanto quando il contenuto viene richiesto. Le viste 360 richiedono un clic
              esplicito.
            </li>
          </ul>

          <h2 className={heading}>3. Finalità e basi giuridiche</h2>
          <ul>
            <li>
              <strong>Erogazione e sicurezza del sito</strong>, prevenzione di abusi e gestione
              tecnica: legittimo interesse del titolare (art. 6.1.f GDPR).
            </li>
            <li>
              <strong>Risposta a richieste, preventivi e appuntamenti</strong>: esecuzione di misure
              precontrattuali richieste dall'interessato (art. 6.1.b GDPR).
            </li>
            <li>
              <strong>Generazione di concept e modelli 3D</strong>: erogazione della funzionalità
              richiesta dall'utente (art. 6.1.b GDPR). Le immagini sono facoltative; non caricare
              immagini di persone identificabili, documenti o dati particolari.
            </li>
            <li>
              <strong>Adempimenti amministrativi, fiscali e legali</strong>: obbligo legale (art.
              6.1.c GDPR).
            </li>
            <li>
              <strong>Statistiche Google Analytics</strong>: consenso (art. 6.1.a GDPR), revocabile
              in qualsiasi momento senza pregiudicare i trattamenti precedenti.
            </li>
          </ul>

          <h2 className={heading}>4. Conferimento dei dati</h2>
          <p>
            I dati contrassegnati come obbligatori sono necessari per rispondere alla richiesta. Il
            mancato conferimento impedisce l'invio o la gestione della richiesta. L'immagine di
            ispirazione, il telefono e l'attivazione di Analytics sono facoltativi e non limitano la
            normale consultazione del sito.
          </p>

          <h2 className={heading}>5. Destinatari e fornitori</h2>
          <p>
            I dati possono essere trattati da personale autorizzato e dai seguenti fornitori, nei
            limiti necessari:
          </p>
          <ul>
            <li>
              <strong>Cloudflare</strong>, per distribuzione, sicurezza e protezione automatizzata
              del sito;
            </li>
            <li>
              <strong>Lovable</strong>, quale piattaforma di pubblicazione e hosting applicativo;
              può fornire componenti tecnici e il badge della piattaforma.
            </li>
            <li>
              <strong>Google</strong>, per Google Analytics soltanto dopo il consenso;
            </li>
            <li>
              <strong>Meta Platforms / WhatsApp</strong>, quando scegli di aprire il collegamento
              WhatsApp con il messaggio precompilato;
            </li>
            <li>
              <strong>fal.ai</strong>, per elaborare prompt, immagini di ispirazione e generare
              immagini o modelli 3D;
            </li>
            <li>
              <strong>Supabase</strong>, per funzioni server, catalogo, stato tecnico dei job 3D e
              relativi URL;
            </li>
            <li>
              <strong>Nivoda e fornitori tecnici dei media di prodotto</strong>, per catalogo,
              immagini e viste 360 delle pietre. Le viste interattive non vengono caricate
              automaticamente.
            </li>
          </ul>
          <p>
            I fornitori agiscono, secondo il servizio, come responsabili del trattamento o autonomi
            titolari. I dati non sono diffusi, salvo pubblicazione richiesta dall'utente o obbligo
            di legge.
          </p>

          <h2 className={heading}>6. Trasferimenti fuori dallo SEE</h2>
          <p>
            Alcuni fornitori possono trattare dati in Paesi esterni allo Spazio Economico Europeo.
            In tali casi il trasferimento avviene sulla base di una decisione di adeguatezza, del
            Data Privacy Framework UE-USA ove applicabile, oppure di Clausole Contrattuali Standard
            e misure supplementari previste dagli artt. 44-49 GDPR. Informazioni e copie delle
            garanzie applicabili possono essere richieste al titolare.
          </p>

          <h2 className={heading}>7. Conservazione</h2>
          <ul>
            <li>
              log tecnici e di sicurezza: per il periodo strettamente necessario alla sicurezza e
              comunque secondo i tempi configurati dall'infrastruttura;
            </li>
            <li>
              richieste di contatto o preventivo: fino a 24 mesi dall'ultima interlocuzione, salvo
              instaurazione di un rapporto contrattuale o necessità di difesa;
            </li>
            <li>
              documentazione amministrativa e contrattuale: per il periodo previsto dalla legge,
              normalmente 10 anni;
            </li>
            <li>preferenza cookie: 180 giorni, poi il sito richiede una nuova scelta;</li>
            <li>
              dati Analytics: secondo il periodo configurato nel servizio e comunque solo finché
              permane il consenso;
            </li>
            <li>
              metadati dei job 3D: massimo 90 giorni; i contenuti elaborati dai fornitori AI seguono
              inoltre i tempi tecnici di backup e cancellazione previsti dai rispettivi servizi.
            </li>
          </ul>

          <h2 className={heading}>8. Decisioni automatizzate</h2>
          <p>
            Il sito non adotta decisioni esclusivamente automatizzate che producano effetti
            giuridici o analogamente significativi sull'utente. Le anteprime generate con
            intelligenza artificiale sono indicative e non determinano prezzi, disponibilità o
            accettazione di un ordine.
          </p>

          <h2 className={heading}>9. Diritti dell'interessato</h2>
          <p>
            Puoi esercitare i diritti previsti dagli artt. 15-22 GDPR: accesso, rettifica,
            cancellazione, limitazione, portabilità, opposizione e revoca del consenso. Scrivi a{" "}
            <a href={contacts.emailHref} className={link}>
              {contacts.email}
            </a>
            . Hai inoltre diritto di proporre reclamo al{" "}
            <a
              href="https://www.garanteprivacy.it/"
              target="_blank"
              rel="noreferrer"
              className={link}
            >
              Garante per la protezione dei dati personali
            </a>
            .
          </p>

          <h2 className={heading}>10. Cookie e servizi esterni</h2>
          <p>
            Per l'elenco aggiornato delle tecnologie utilizzate, le durate e la gestione delle
            preferenze consulta la{" "}
            <Link to="/cookie-policy" className={link}>
              Cookie Policy
            </Link>
            .
          </p>

          <h2 className={heading}>11. Aggiornamenti</h2>
          <p>
            Questa informativa può essere aggiornata per modifiche normative o tecniche. La data
            indicata in alto identifica la versione vigente.
          </p>
        </div>
      </div>
    </section>
  );
}
