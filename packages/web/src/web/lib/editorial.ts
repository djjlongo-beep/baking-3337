export const sources = {
  math: {
    name: "Molino Caputo",
    title: "The Baker’s Percentage",
    url: "https://caputoflour.com/blogs/learn/the-baker-s-percentage",
    note: "Riferimento professionale per formule, idratazione e ridimensionamento degli impasti.",
  },
  starter: {
    name: "The Clever Carrot",
    title: "Feeding Sourdough Starter: My Best Tips & Tricks",
    url: "https://www.theclevercarrot.com/2021/01/feeding-sourdough-starter-my-best-tips-tricks/",
    note: "Guida al rapporto di rinfresco 1:1:1 e alla gestione del lievito madre liquido.",
  },
  pizza: {
    name: "AVPN",
    title: "International Regulation — Vera Pizza Napoletana",
    url: "https://www.pizzanapoletana.org/en/ricetta_pizza_napoletana",
    note: "Fonte primaria dell’Associazione Verace Pizza Napoletana. Per la versione integrale si rimanda al disciplinare collegato nella pagina ufficiale.",
  },
  preferment: {
    name: "BAKERpedia",
    title: "Preferment",
    url: "https://bakerpedia.com/processes/preferment/",
    note: "Definizioni e uso di biga, poolish, pâte fermentée e levain.",
  },
  methods: {
    name: "Molino Moras",
    title: "Impasti diretti e indiretti: differenze e utilizzi",
    url: "https://www.molinomoras.it/blogs/consigli-e-benessere/metodo-impasti-diretti-indiretti",
    note: "Distinzione tra metodo diretto, indiretto e semidiretto con pasta di riporto. Riferimento aggiunto per approfondire gli appunti dell’autore del sito.",
  },
  temperature: {
    name: "The Perfect Loaf",
    title: "The Importance of Dough Temperature in Baking",
    url: "https://www.theperfectloaf.com/the-importance-of-dough-temperature-in-baking/",
    note: "Controllo della temperatura finale e calcolo della temperatura dell’acqua.",
  },
  autolyse: {
    name: "The Perfect Loaf",
    title: "The Ultimate Guide to Autolyse Bread Dough",
    url: "https://www.theperfectloaf.com/guides/how-to-autolyse/",
    note: "Approfondimento sul riposo di farina e acqua prima dell’impastamento.",
  },
  fermentation: {
    name: "Serious Eats",
    title: "Breadmaking 101: All About Proofing and Fermentation",
    url: "https://www.seriouseats.com/how-to-make-and-proof-bread-dough",
    note: "Guida didattica alla fermentazione in massa e alla lievitazione finale.",
  },
  croissant: {
    name: "Weekend Bakery",
    title: "Classic French croissant recipe",
    url: "https://www.weekendbakery.com/posts/classic-french-croissant-recipe/",
    note: "Ricetta di riferimento e procedimento per un impasto lievitato sfogliato.",
  },
};
export type SourceKey = keyof typeof sources;
export type Article = {
  id: string;
  title: string;
  category: string;
  level: string;
  kind: string;
  minutes: number;
  image: string;
  description: string;
  source: SourceKey[];
  sections: { heading: string; text: string }[];
  authorNote?: string;
  recipe?: { ingredients: string[]; steps: string[] };
};
export const articles: Article[] = [
  {
    id: "lievito-madre",
    title: "Lievito madre: una piccola coltura, un grande inizio.",
    category: "Pane",
    level: "Amatori",
    kind: "Guida",
    minutes: 7,
    image: "starter",
    description:
      "Rinfreschi, conservazione e segnali da osservare. Il punto di partenza per conoscere il tuo lievito.",
    source: ["starter"],
    sections: [
      {
        heading: "Partiamo dal lievito liquido",
        text: "Questa guida riguarda uno starter al 100% di idratazione: contiene lo stesso peso di acqua e farina. Non è il lievito madre solido usato in molte lavorazioni italiane. Il rinfresco descritto è una possibilità di gestione, non una regola universale.",
      },
      {
        heading: "Il rinfresco 1:1:1",
        text: "Per mantenere una coltura già attiva, un rinfresco 1:1:1 impiega lo stesso peso di starter, farina e acqua. Per esempio: 50 g di starter, 50 g di farina e 50 g di acqua. Questo è un esempio di calcolo, non una dose obbligatoria. Segna il livello nel contenitore: l’aumento di volume e le bolle ti aiutano a leggere l’attività della coltura.",
      },
      {
        heading: "La frequenza segue la tua cucina",
        text: "La frequenza dipende da temperatura, rapporto di rinfresco e uso. La guida collegata suggerisce di alimentare la coltura una o due volte al giorno se mantenuta a temperatura ambiente, oppure circa una volta a settimana in frigorifero. Una cucina più calda accelera l’attività: osserva la coltura, non soltanto l’orologio. Prima di panificare con uno starter conservato al freddo, rinfrescalo a temperatura ambiente finché torna attivo.",
      },
      {
        heading: "Quando usarlo",
        text: "Uno starter pronto è attivo, presenta bolle e cresce sensibilmente dopo il rinfresco. La guida collegata indica un raddoppio orientativamente in 2–12 ore: è un intervallo, non una scadenza fissa. Farina, temperatura e salute della coltura cambiano i tempi. Queste indicazioni riguardano il mantenimento di uno starter esistente, non la sua creazione da zero.",
      },
      {
        heading: "Una nota di sicurezza",
        text: "Non assaggiare farina o impasti crudi. In presenza di muffe o colorazioni anomale, non cercare di recuperare la coltura: scartala e pulisci il contenitore. Le fotografie sono illustrative, non documentano i risultati del metodo.",
      },
    ],
  },
  {
    id: "pizza-napoletana",
    title: "Pizza napoletana: il metodo dietro il cornicione.",
    category: "Pizza",
    level: "Professionisti",
    kind: "Approfondimento",
    minutes: 6,
    image: "pizza",
    description:
      "Ingredienti, stesura e cottura: leggere la tradizione attraverso il disciplinare AVPN.",
    source: ["pizza"],
    sections: [
      {
        heading: "Una fonte, non un’opinione",
        text: "L’Associazione Verace Pizza Napoletana definisce un metodo e caratteristiche riconoscibili. Questa è una sintesi della pagina ufficiale, non una certificazione AVPN né una riproduzione integrale del disciplinare. Per requisiti professionali e aggiornamenti consulta sempre il documento ufficiale.",
      },
      {
        heading: "Leggere le dosi",
        text: "La pagina AVPN riporta, per 1 litro d’acqua, 1.600–1.800 g di farina e 40–60 g di sale. La quantità di lievito varia in funzione delle condizioni di lavorazione. Il rapporto acqua/farina corrisponde a circa il 56–63% di idratazione: l’assorbimento della farina è un elemento decisivo.",
      },
      {
        heading: "Staglio e stesura",
        text: "Nella pagina di riferimento i panetti pesano 200–280 g, per dischi di 22–35 cm. La stesura manuale procede dal centro verso l’esterno, lasciando il bordo più spesso. Il cornicione non nasce da una quantità di lievito “magica”, ma dal coordinamento di impasto, fermentazione, manipolazione e calore.",
      },
      {
        heading: "Il forno cambia il risultato",
        text: "La pagina ufficiale descrive una cottura a 430–480 °C di 60–90 secondi. Sono condizioni da forno professionale specifico: non trasferirle automaticamente a un forno domestico. Una pizza casalinga può essere ottima senza dichiararsi conforme al disciplinare.",
      },
    ],
  },
  {
    id: "croissant",
    title: "Croissant: la precisione diventa leggerezza.",
    category: "Lievitati",
    level: "Professionisti",
    kind: "Tecnica",
    minutes: 8,
    image: "croissant",
    description:
      "Impasto e burro, riposi e pieghe. I principi della sfogliatura, senza scorciatoie.",
    source: ["croissant"],
    sections: [
      {
        heading: "Lievitazione e sfogliatura sono due cose diverse",
        text: "Un croissant è un impasto lievitato sfogliato. Le pieghe creano strati alternati di impasto e burro; il lievito lavora nell’impasto. La struttura finale dipende da entrambe le lavorazioni, non solo dal numero di pieghe.",
      },
      {
        heading: "Una consistenza compatibile",
        text: "Il burro deve potersi stendere senza spezzarsi e senza fondere nell’impasto. Se è troppo duro, rompe la continuità degli strati; se è troppo morbido, si distribuisce in modo irregolare. Procedi con calma e torna al freddo quando la lavorazione lo richiede.",
      },
      {
        heading: "Il riposo è parte del lavoro",
        text: "I passaggi di riposo aiutano a raffreddare la materia grassa e a rilassare l’impasto. Non forzare una pasta che si ritira continuamente. Per dosi, dimensioni delle stesure, sequenza delle pieghe e cottura, segui la ricetta completa di Weekend Bakery collegata qui sotto.",
      },
      {
        heading: "Per il laboratorio",
        text: "Registra farina, burro, temperatura dell’ambiente e durata dei riposi. Confronta le prove cambiando una sola variabile alla volta. Questo articolo illustra i principi e non sostituisce una ricetta completa o una procedura validata di produzione.",
      },
    ],
  },
  {
    id: "idratazione",
    title: "L’idratazione, spiegata senza complicazioni.",
    category: "Tecniche",
    level: "Amatori",
    kind: "Fondamentali",
    minutes: 5,
    image: "crumb",
    description: "Perché 70% non significa 70 g. Impara il linguaggio comune di ogni impasto.",
    source: ["math"],
    sections: [
      {
        heading: "La farina è sempre 100%",
        text: "Nelle percentuali del panificatore ogni ingrediente è rapportato al peso totale della farina. Con 500 g di farina e 350 g d’acqua, l’idratazione è 350 ÷ 500 × 100 = 70%. Il sale al 2% pesa 10 g, non il 2% del peso dell’impasto.",
      },
      {
        heading: "Più acqua non equivale a pane migliore",
        text: "L’idratazione è una caratteristica della formula, non una classifica di qualità. La quantità d’acqua va letta insieme al tipo di farina, al prodotto desiderato e alla tecnica di lavorazione. A parità di percentuale, farine diverse possono dare consistenze molto diverse.",
      },
      {
        heading: "Attenzione ai prefermenti",
        text: "Se usi un poolish o uno starter, includi nel conto anche la farina e l’acqua già presenti al loro interno. Per esempio, 100 g di starter al 100% di idratazione contengono 50 g di farina e 50 g d’acqua. Ignorarli altera il rapporto reale.",
      },
      {
        heading: "Un linguaggio scalabile",
        text: "Le percentuali consentono di mantenere invariati i rapporti quando cambi quantità. Il Calcolatore impasti del sito lavora sia sulla farina totale sia sul peso finale desiderato e sottrae la farina e l’acqua già presenti in biga, poolish e lievito madre. Latte, uova e altri ingredienti composti concorrono al peso ma non vengono scomposti nella loro acqua interna.",
      },
    ],
  },
  {
    id: "biga-poolish",
    title: "Impasti diretti e indiretti: biga, poolish e PDR.",
    category: "Tecniche",
    level: "Professionisti",
    kind: "Approfondimento",
    minutes: 9,
    image: "fold",
    description:
      "Dagli appunti dell’autore del sito: metodi d’impasto, prefermenti e pasta di riporto, con integrazioni tecniche e fonti citate.",
    authorNote:
      "Aggiungere i due tipi di impasto, diretto e indiretto, e la PDR, ovvero la pasta di riporto.",
    source: ["methods", "preferment", "math"],
    sections: [
      {
        heading: "Impasto diretto",
        text: "Nel metodo diretto gli ingredienti vengono lavorati in un’unica fase di impastamento, senza preparare prima una biga o un poolish. Seguono poi fermentazione, formatura e lievitazione finale secondo il prodotto. Diretto non significa necessariamente veloce: anche un impasto diretto può avere una gestione lunga. Un riposo in frigorifero, da solo, non lo trasforma in un impasto indiretto.",
      },
      {
        heading: "Impasto indiretto",
        text: "Nel metodo indiretto si prepara prima un preimpasto, per esempio una biga o un poolish, con una parte della farina, dell’acqua e del lievito. Dopo la sua fermentazione, lo si incorpora nell’impasto finale con gli ingredienti rimanenti. La distinzione riguarda quindi le fasi di preparazione, non soltanto le ore di lievitazione. Il metodo va scelto in funzione del prodotto e dell’organizzazione del lavoro, non come garanzia automatica di qualità superiore.",
      },
      {
        heading: "Che cos’è un prefermento",
        text: "È una porzione di impasto preparata prima dell’impasto finale, a cui si lascia tempo per fermentare. Può essere densa o fluida e può contenere lievito commerciale oppure una coltura naturale. “Prefermento” è quindi una famiglia, non una formula unica.",
      },
      {
        heading: "Il poolish",
        text: "Il poolish contiene pari pesi di acqua e farina: la sua idratazione è del 100%. Si aggiunge una piccola quantità di lievito, variabile secondo tempo e temperatura; nella formulazione classica non contiene sale. Bolle sulla superficie e sviluppo del volume aiutano a valutarne la maturazione.",
      },
      {
        heading: "La biga e il contesto",
        text: "Nella guida italiana di Molino Moras la biga è presentata come un preimpasto asciutto, composto da farina, acqua e lievito di birra, con un esempio al 45% di idratazione. Non basta però il nome per confrontare due lavorazioni: controlla sempre formula, farina, temperatura, quantità di lievito e durata della fermentazione.",
      },
      {
        heading: "PDR: la pasta di riporto",
        text: "PDR è l’abbreviazione di pasta di riporto: una porzione di impasto di una lavorazione precedente, conservata in condizioni controllate e aggiunta a un nuovo impasto. Diversamente da biga e poolish senza sale, contiene già gli ingredienti dell’impasto da cui proviene, compreso il sale. Non è sinonimo di lievito madre: non va considerata una coltura da mantenere indefinitamente con rinfreschi.",
      },
      {
        heading: "Con la PDR si parla anche di semidiretto",
        text: "Nella classificazione presentata da Molino Moras, il metodo con pasta di riporto viene chiamato semidiretto: si impastano gli ingredienti in una fase, aggiungendo però una pasta già fermentata. Questa precisazione completa la distinzione tra diretto e indiretto suggerita dagli appunti dell’autore. Quantità, durata e temperatura di conservazione della PDR vanno definite per la propria formula e procedura: non si riutilizzano impasti alterati né avanzi di provenienza o conservazione incerta.",
      },
      {
        heading: "Il conto complessivo",
        text: "Scrivi sia la formula del prefermento sia quella totale. La farina e l’acqua del prefermento rientrano nei rispettivi totali: il Calcolatore impasti del sito le sottrae dalle quantità da aggiungere per biga, poolish e lievito madre. Con la PDR bisogna considerare anche il sale e gli altri ingredienti già presenti: la pasta di riporto non è gestita automaticamente dal calcolatore. L’obiettivo è una fermentazione coerente con il prodotto e con l’organizzazione del lavoro: non allungare i tempi senza controllare le condizioni.",
      },
    ],
  },
  {
    id: "temperatura",
    title: "La temperatura è un ingrediente.",
    category: "Tecniche",
    level: "Professionisti",
    kind: "Laboratorio",
    minutes: 6,
    image: "hands",
    description: "Dal termometro all’acqua d’impasto: rendere la fermentazione più prevedibile.",
    source: ["temperature"],
    sections: [
      {
        heading: "Misura l’impasto, non solo la stanza",
        text: "La guida di The Perfect Loaf indica circa 24–25 °C a fine impastamento per molti dei suoi pani a lievito naturale prevalentemente di farina bianca. È un orientamento, non un valore valido per ogni pane: farine integrali, segale e gestione al freddo possono richiedere obiettivi diversi.",
      },
      {
        heading: "L’acqua è la variabile regolabile",
        text: "Per un impasto diretto, il metodo a tre fattori stima: temperatura acqua = 3 × temperatura finale desiderata − temperatura farina − temperatura ambiente − fattore di attrito. Il fattore di attrito deve essere ricavato da prove sulla propria impastatrice e sul proprio ciclo.",
      },
      {
        heading: "Un esempio in gradi Celsius",
        text: "Con obiettivo 25 °C, farina a 22 °C, ambiente a 24 °C e fattore di attrito sperimentale di 6 °C, il conto dà acqua a 23 °C. Il fattore di attrito non è una costante universale: varia con macchina, velocità, durata e carico.",
      },
      {
        heading: "Dal calcolo alla verifica",
        text: "Misura la temperatura reale appena termina l’impastamento e annotala. Quando c’è un prefermento, il metodo della fonte usa quattro fattori e include la sua temperatura. La formula è una stima operativa, da controllare con misure ripetute.",
      },
    ],
  },
  {
    id: "autolisi",
    title: "Autolisi: fare spazio al tempo.",
    category: "Pane",
    level: "Amatori",
    kind: "Tecnica",
    minutes: 4,
    image: "hands",
    description:
      "Un riposo di farina e acqua prima di impastare. Quando può essere utile e cosa osservare.",
    source: ["autolyse"],
    sections: [
      {
        heading: "Un gesto semplice",
        text: "L’autolisi, nella sua forma classica, comincia mescolando delicatamente farina e acqua. Si lascia riposare la massa prima di inserire gli altri ingredienti e completare l’impasto. La guida di The Perfect Loaf suggerisce di iniziare con prove prudenti di 15–30 minuti, adattando poi il riposo alla farina e alla ricetta. Non esiste una durata obbligatoria per tutti gli impasti.",
      },
      {
        heading: "Non una soluzione per tutto",
        text: "Il riposo lascia alla farina il tempo di idratarsi e può rendere più agevole la lavorazione. Non sostituisce la fermentazione e non è indispensabile in ogni ricetta. Il risultato dipende anche da farina, durata e condizioni ambientali.",
      },
      {
        heading: "Come fare un confronto utile",
        text: "Prova la stessa formula con e senza riposo iniziale, mantenendo costanti le altre condizioni. Annota la facilità di impastamento e la consistenza finale. Per l’uso con impasti a lievito naturale, segui le distinzioni e le varianti illustrate dalla fonte collegata.",
      },
    ],
  },
  {
    id: "primo-pane",
    title: "Il tuo primo pane, un passo alla volta.",
    category: "Pane",
    level: "Amatori",
    kind: "Ricetta",
    minutes: 9,
    image: "bread",
    description:
      "Una formula essenziale al 65% di idratazione. Farina, acqua, sale, lievito e attenzione.",
    source: ["math", "fermentation"],
    sections: [
      {
        heading: "Una formula per imparare",
        text: "Questa è una proposta originale di Arte Bianca, non una ricetta riprodotta dalle fonti e non testata in laboratorio. I riferimenti spiegano percentuali e fermentazione. Le quantità sono un punto di partenza; tempi e cottura sono indicativi e vanno adattati a farina, temperatura e forno.",
      },
      {
        heading: "Leggi l’impasto",
        text: "Aspetta una crescita evidente e una massa più ariosa prima della formatura. Dopo aver formato la pagnotta, osserva nuovamente lo sviluppo: se l’impasto è molto teso e torna indietro immediatamente alla pressione, può aver bisogno di altro tempo. Nessun singolo segnale basta in ogni situazione.",
      },
    ],
    recipe: {
      ingredients: [
        "500 g di farina di frumento per pane (100%)",
        "325 g di acqua (65%)",
        "10 g di sale (2%)",
        "3 g di lievito di birra secco istantaneo (0,6%)",
      ],
      steps: [
        "Mescola farina, acqua e lievito, poi incorpora il sale. Lavora fino a ottenere un impasto omogeneo.",
        "Copri in un contenitore adatto e lascia fermentare a circa 22–24 °C. Prevedi orientativamente 2–3 ore, ma valuta soprattutto crescita e consistenza.",
        "Forma una pagnotta e lasciala lievitare coperta. Un intervallo indicativo è 45–90 minuti; la temperatura può modificarlo sensibilmente.",
        "Preriscalda il forno statico a 230 °C. Incidi la superficie con un utensile adatto e inforna su una teglia. Dopo circa 15 minuti, riduci a 210 °C e prosegui circa 25–30 minuti, controllando colore e cottura.",
        "Lascia raffreddare completamente su una griglia prima del taglio. Non consumare l’impasto crudo. Allergenico: contiene glutine.",
      ],
    },
  },
];
