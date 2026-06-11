/**
 * Cara Preziosi — sorgente unica di tutti i contenuti del sito.
 * Modificando questo file si aggiornano testi, contatti e collezioni
 * senza toccare i componenti.
 */

import homeHero from "@/assets/cara/home-hero.jpg";
import homeSecondary from "@/assets/cara/home-secondary.jpg";
import anelliHero from "@/assets/cara/anelli-hero.jpg";
import storiaHero from "@/assets/cara/storia-hero.jpg";
import storiaLaboratorio from "@/assets/cara/storia-laboratorio.jpg";
import storiaMani from "@/assets/cara/storia-mani.jpg";
import storiaVetrina from "@/assets/cara/storia-vetrina.jpg";
import catAnelli from "@/assets/cara/cat-anelli.jpg";
import catOrecchini from "@/assets/cara/cat-orecchini.png";
import catCollane from "@/assets/cara/cat-collane.jpg";
import ringCharlotte from "@/assets/cara/ring-charlotte.jpg";
import ringCharlotteCuore from "@/assets/cara/ring-charlotte-cuore.jpg";
import ringSchiuma from "@/assets/cara/ring-schiuma.jpg";
import ringBouquet from "@/assets/cara/ring-bouquet.jpg";
import ringBorbone from "@/assets/cara/ring-borbone.jpg";
import ringIlaria from "@/assets/cara/ring-ilaria.jpg";
import ringAurora from "@/assets/cara/ring-aurora.jpg";
import ringLuce from "@/assets/cara/ring-luce.jpg";
import servizioCreazione from "@/assets/cara/servizio-creazione.jpg";
import servizioLucidatura from "@/assets/cara/servizio-lucidatura.jpg";
import servizioRestauro from "@/assets/cara/servizio-restauro.jpg";
import microfusioneAsset from "@/assets/microfusione.jpeg.asset.json";
import incastonaturaAsset from "@/assets/incastonatura.jpeg.asset.json";
import consegnaAsset from "@/assets/consegna.jpeg.asset.json";
import disegnoCadAsset from "@/assets/disegno-cad.jpeg.asset.json";
import ispirazioneAsset from "@/assets/ispirazione.png.asset.json";

export const brand = {
  name: "Cara Preziosi",
  tagline: "L'eccellenza dell'artigianato orafo made in Italy",
  shortDescription:
    "Atelier orafo artigianale a Bari, Via Antonio Beatillo 14. Il maestro Nicola Caradonna crea, restaura e custodisce gioielli unici fatti a mano.",
};

export const contacts = {
  address: "Via Antonio Beatillo 14",
  city: "70121 Bari (BA), Italia",
  hours: "08:30 – 19:00",
  phone: "+39 393 953 6607",
  phoneHref: "tel:+393939536607",
  email: "info@carapreziosi.it",
  emailHref: "mailto:info@carapreziosi.it",
  whatsappHref: "https://wa.me/393939536607",
  facebookHref: "https://www.facebook.com/carapreziosi",
  instagramHref: "https://www.instagram.com/carapreziosi",
  mapEmbedSrc:
    "https://www.google.com/maps?q=Via+Antonio+Beatillo+14,+70121+Bari+BA&output=embed",
};

export const navigation = [
  { to: "/", label: "Home" },
  { to: "/categorie", label: "Collezioni" },
  { to: "/servizi", label: "Servizi" },
  { to: "/crea-il-tuo-gioiello", label: "Crea il tuo gioiello" },
  { to: "/storia", label: "Il Laboratorio" },
  { to: "/contatti", label: "Contatti" },
] as const;

export const home = {
  heroImage: homeHero,
  heroEyebrow: "Cara Preziosi · Bari",
  heroTitle: "L'arte orafa\ndelle collezioni\nCara Preziosi",
  heroLead:
    "Atelier orafo artigianale a Bari. Gioielli fatti a mano su misura nel laboratorio di Nicola Caradonna, dove ogni pezzo custodisce una storia e la migliore tradizione orafa italiana.",
  heroCta: { label: "Scopri le collezioni", to: "/categorie" },
  heroCtaSecondary: { label: "Richiedi un preventivo", to: "/contatti" },

  intro: {
    eyebrow: "Le collezioni",
    title: "Tre famiglie di gioielli, una sola firma",
    body: "Ogni gioiello è il risultato di una ricerca attenta dei migliori materiali, combinata con la maestria artigianale di esperti orafi.",
  },

  servicesPreview: {
    eyebrow: "I nostri servizi",
    title: "Creazione su misura e restauro",
    body: "Nel nostro atelier orafo di Bari progettiamo pezzi unici su misura, restauriamo gioielli di famiglia ed eseguiamo la manutenzione professionale dei tuoi preziosi.",
    image: homeSecondary,
    cta: { label: "Scopri i servizi", to: "/servizi" },
  },

  manifesto: {
    eyebrow: "Made in Italy",
    title:
      "Indossare un gioiello fatto a mano significa scegliere un pezzo unico, simbolo di tradizione, passione e autenticità artigianale.",
    body: "Oggi l'autentico artigianato orafo è sempre più raro, e solo pochi maestri continuano a custodire e tramandare questo mestiere con la stessa passione di un tempo. Noi di Cara Preziosi siamo orgogliosi di far parte di questa élite, preservando un'arte che combina creatività, esperienza e attenzione ai dettagli.",
    cta: { label: "Scopri la nostra storia", to: "/storia" },
  },

  closing: {
    title: "Contattaci per richiedere\nun gioiello personalizzato",
    body: "Le nostre creazioni includono un certificato internazionale che ne attesta le caratteristiche.",
    cta: { label: "Richiedi un preventivo", to: "/contatti" },
  },
};

export type Category = {
  slug: "anelli" | "orecchini" | "collane-bracciali";
  name: string;
  shortName: string;
  to: string;
  image: string;
  description: string;
  number: string;
};

export const categories: Category[] = [
  {
    slug: "anelli",
    name: "Anelli",
    shortName: "Anelli",
    to: "/categorie#anelli",
    image: catAnelli,
    description:
      "Dal solitario all'anello di fidanzamento, ogni modello racconta un istante prezioso.",
    number: "01",
  },
  {
    slug: "orecchini",
    name: "Orecchini",
    shortName: "Orecchini",
    to: "/categorie#orecchini",
    image: catOrecchini,
    description:
      "Punti luce e pendenti realizzati con pietre selezionate e lavorazioni a mano.",
    number: "02",
  },
  {
    slug: "collane-bracciali",
    name: "Collane e Bracciali",
    shortName: "Collane & Bracciali",
    to: "/categorie#collane",
    image: catCollane,
    description:
      "Catene, pendenti e bracciali pensati per accompagnare ogni giornata con eleganza.",
    number: "03",
  },
];

export type RingModel = {
  name: string;
  description: string;
  image: string;
  price: string;
};

/**
 * Catalogo anelli — ricostruito fedelmente dal sito originale Cara Preziosi.
 * Otto modelli con prezzo indicativo (come da vetrina WooCommerce esportata).
 */
export const rings: RingModel[] = [
  {
    name: "Charlotte",
    description: "Solitario iconico della maison, lavorato a griffe con diamante taglio brillante.",
    image: ringCharlotte,
    price: "7.550,00 €",
  },
  {
    name: "Charlotte forma cuore con smeraldo",
    description: "Variante con smeraldo a forma di cuore, montatura in oro bianco 18kt.",
    image: ringCharlotteCuore,
    price: "5.650,00 €",
  },
  {
    name: "Schiuma di mare",
    description: "Disegno organico ispirato all'onda, pavé di diamanti su oro rosa.",
    image: ringSchiuma,
    price: "8.428,00 €",
  },
  {
    name: "Bouquet",
    description: "Composizione floreale con zaffiri colorati e dettagli in oro giallo.",
    image: ringBouquet,
    price: "3.690,00 €",
  },
  {
    name: "Charlotte",
    description: "Variante con diamante centrale di maggiore caratura, montatura in oro bianco.",
    image: ringAurora,
    price: "7.800,00 €",
  },
  {
    name: "Charlotte",
    description: "Versione essenziale del solitario Charlotte, perfetta come anello di promessa.",
    image: ringLuce,
    price: "3.660,00 €",
  },
  {
    name: "Borbone",
    description: "Anello di ispirazione storica, fascia traforata con incisioni a mano.",
    image: ringBorbone,
    price: "2.100,00 €",
  },
  {
    name: "Anello Ilaria",
    description: "Linea contemporanea, fascia rettangolare con diamante incassato.",
    image: ringIlaria,
    price: "2.800,00 €",
  },
];

export const services = {
  hero: {
    image: anelliHero,
    eyebrow: "Servizi del laboratorio",
    title: "Creiamo, restauriamo,\ncustodiamo i tuoi gioielli",
    lead: "Dal pezzo unico su misura alla manutenzione di un gioiello di famiglia: ogni intervento è seguito a mano nel nostro atelier orafo di Bari, in Via Antonio Beatillo 14.",
  },
  items: [
    {
      title: "Creazione su misura",
      body: "Realizziamo gioielli personalizzati, progettati su misura per rispecchiare il vostro stile e le vostre emozioni. Dall'anello di fidanzamento al gioiello per un'occasione speciale, trasformiamo le vostre idee in realtà attraverso un processo artigianale curato nei minimi dettagli.",
      image: servizioCreazione,
    },
    {
      title: "Lucidatura e messa a misura",
      body: "I vostri gioielli meritano di brillare sempre. Con trattamenti di pulizia e lucidatura eliminiamo ossidazioni e impurità, restituendo loro luminosità. Offriamo inoltre la modifica della misura degli anelli per garantire il massimo comfort senza compromettere l'estetica.",
      image: servizioLucidatura,
    },
    {
      title: "Restauro di gioielli",
      body: "Nel nostro laboratorio ci prendiamo cura dei vostri tesori con interventi di riparazione e restauro eseguiti con la massima precisione, restituendo nuova vita a pezzi di famiglia e creazioni antiche.",
      image: servizioRestauro,
    },
  ],
};

export const storia = {
  hero: {
    image: storiaHero,
    eyebrow: "Il laboratorio",
    title: "L'elegante tradizione\ndi Cara Preziosi",
    lead: "Cara Preziosi nasce dalla passione del maestro orafo Nicola Caradonna: una bottega artigiana che custodisce e tramanda l'arte della gioielleria italiana.",
  },
  intro: {
    title: "Custodi dell'eccellenza orafa",
    body: "Da oltre quarant'anni, nel cuore di Bari, il laboratorio Cara Preziosi custodisce le tradizioni della lavorazione dei metalli preziosi e le evolve integrando innovazione e tecnologie moderne, senza perdere l'autenticità del fatto a mano. Ogni gioiello che esce dalla bottega porta con sé questa doppia anima — radici profonde e sguardo contemporaneo.",
    image: storiaLaboratorio,
  },
  processo: {
    eyebrow: "Il processo",
    title: "L'arte dietro ogni gioiello",
    steps: [
      {
        number: "01",
        title: "Progettazione",
        body: "Il gioiello viene ideato attraverso schizzi, software CAD o modelli in cera per definire forma, dettagli e materiali.",
      },
      {
        number: "02",
        title: "Microfusione",
        body: "Il metallo prezioso viene fuso, modellato, saldato e rifinito con tecniche tradizionali come l'incisione e la lucidatura, oppure con la microfusione a cera persa.",
      },
      {
        number: "03",
        title: "Incastonatura",
        body: "Le gemme vengono incastonate, e il gioiello subisce trattamenti finali come lucidatura, rodiatura o smaltatura per esaltarne bellezza e durata.",
      },
    ],
  },
  innovazione: {
    title: "L'evoluzione della gioielleria\ntra passato e futuro",
    body: "Cara Preziosi unisce tradizione e innovazione grazie all'uso di tecnologie all'avanguardia come la stampa 3D e la modellazione digitale. Questi strumenti permettono di creare prototipi estremamente dettagliati, garantendo precisione e personalizzazione senza precedenti. La combinazione tra il sapere artigianale e le nuove tecnologie consente di realizzare gioielli unici, ottimizzando il processo creativo senza rinunciare alla qualità e all'anima del lavoro fatto a mano.",
    image: storiaMani,
  },
  vetrina: {
    image: storiaVetrina,
  },
};

/**
 * Pinned scroll wizard — il processo creativo dell'atelier.
 * Cinque atti, una narrativa.
 */
export const processSteps = [
  {
    number: "I",
    title: "L'ispirazione",
    body: "Ogni gioiello nasce da un incontro. Una storia, un'emozione, un dettaglio personale che il maestro orafo trasforma in primo schizzo a matita.",
    image: ispirazioneAsset.url,
  },
  {
    number: "II",
    title: "Il disegno",
    body: "Dallo schizzo al rendering 3D: progettazione CAD per ogni geometria, modello in cera per studiare volumi e proporzioni prima di toccare il metallo.",
    image: disegnoCadAsset.url,
  },
  {
    number: "III",
    title: "La microfusione",
    body: "Oro fuso a cera persa, colato in stampi unici. Tecnica antica eseguita con precisione moderna: la materia prende la forma del progetto.",
    image: microfusioneAsset.url,
  },
  {
    number: "IV",
    title: "L'incastonatura",
    body: "Pietre selezionate una a una. Mano ferma, lente d'ingrandimento, ore di lavoro per fissare ogni diamante esattamente dove la luce lo accenderà.",
    image: incastonaturaAsset.url,
  },
  {
    number: "V",
    title: "La consegna",
    body: "Lucidatura finale, rodiatura, certificato internazionale. Il gioiello viene consegnato in atelier, su appuntamento. Un rito, non una transazione.",
    image: consegnaAsset.url,
  },
];

export const atelierManifesto = {
  eyebrow: "Atelier Caradonna",
  bigQuote: "Un gioiello\nnon si compra,\nsi riconosce.",
  body: "Da quattro decenni il maestro Nicola Caradonna disegna, fonde e incastona ogni pezzo nelle sue mani. Niente produzione, niente serie. Solo creazioni uniche, pensate per durare oltre chi le indossa.",
  signature: "— Nicola Caradonna, maestro orafo",
};

