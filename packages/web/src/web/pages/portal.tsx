import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Search,
  Wheat,
  Bookmark,
  X,
  Menu,
  Clock,
  SlidersHorizontal,
  Scale,
  BookOpen,
  ExternalLink,
  Leaf,
} from "lucide-react";
import { articles, sources, type Article, type SourceKey } from "../lib/editorial";
import DoughCalculator from "../components/dough-calculator";

const categories = ["Tutti", "Pane", "Pizza", "Lievitati", "Tecniche"];
function SourceLink({ source }: { source: SourceKey }) {
  const s = sources[source];
  return (
    <a className="source-link" href={s.url} target="_blank" rel="noopener noreferrer">
      <span>
        <strong>{s.name}</strong>
        <small>{s.title}</small>
      </span>
      <ArrowUpRight size={18} />
    </a>
  );
}

export default function Portal() {
  const [path, navigate] = useLocation();
  const [category, setCategory] = useState("Tutti");
  const [level, setLevel] = useState("Tutti i livelli");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("arte-bianca-saved") || "[]");
    } catch {
      return [];
    }
  });
  const [onlySaved, setOnlySaved] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenu(false);
  }, [path]);
  useEffect(() => {
    localStorage.setItem("arte-bianca-saved", JSON.stringify(saved));
  }, [saved]);
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);
  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenu(false);
      }
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const toggleSave = (id: string) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const browse = (cat = "Tutti", newLevel = "Tutti i livelli", bookmarks = false) => {
    setCategory(cat);
    setLevel(newLevel);
    setOnlySaved(bookmarks);
    setQuery("");
    if (path !== "/") navigate("/");
    setMobileMenu(false);
    requestAnimationFrame(() =>
      document.getElementById("esplora")?.scrollIntoView({ behavior: "smooth" }),
    );
  };
  const filtered = articles.filter(
    (a) =>
      (category === "Tutti" || a.category === category) &&
      (level === "Tutti i livelli" || a.level === level) &&
      (!onlySaved || saved.includes(a.id)) &&
      `${a.title} ${a.description} ${a.category} ${a.sections.map((s) => s.text).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const article = path.startsWith("/articoli/")
    ? articles.find((a) => a.id === path.split("/")[2])
    : undefined;
  const openArticle = (id: string) => {
    setSearchOpen(false);
    navigate("/articoli/" + id);
  };
  function card(a: Article) {
    return (
      <article className="editorial-card" key={a.id}>
        <div className="card-image">
          <Link href={"/articoli/" + a.id}>
            <img
              src={"/images/" + a.image + ".webp"}
              alt={
                a.category === "Pizza"
                  ? "Pizza artigianale"
                  : a.category === "Lievitati"
                    ? "Croissant sfogliati"
                    : a.image === "crumb"
                      ? "Mollica di pane a lievitazione naturale"
                      : "Pane e lavorazione di un impasto"
              }
              loading="lazy"
            />
          </Link>
          <span className="image-tag">{a.kind}</span>
          <button
            className={"save-button " + (saved.includes(a.id) ? "is-saved" : "")}
            onClick={() => toggleSave(a.id)}
            aria-label={
              saved.includes(a.id) ? "Rimuovi dai salvati: " + a.title : "Salva: " + a.title
            }
          >
            <Bookmark size={17} fill={saved.includes(a.id) ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="card-meta">
          <span>
            {a.category} <b>·</b> {a.level}
          </span>
          <span>
            <Clock size={12} />
            {a.minutes} min
          </span>
        </div>
        <Link className="card-title" href={"/articoli/" + a.id}>
          {a.title}
        </Link>
        <p>{a.description}</p>
        <div className="card-source">
          Fonti:{" "}
          {a.source
            .map((s) => sources[s].name)
            .filter((v, i, a) => a.indexOf(v) === i)
            .join(", ")}
          <Link href={"/articoli/" + a.id} aria-label={"Leggi " + a.title}>
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </article>
    );
  }
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="brand">
            <Wheat strokeWidth={1.4} />
            <span>
              arte bianca<span className="brand-dot">.</span>
              <small>IL SAPERE. LE MANI. IL PANE.</small>
            </span>
          </Link>
          <nav
            className={mobileMenu ? "navigation open" : "navigation"}
            aria-label="Navigazione principale"
          >
            <button onClick={() => browse("Pane")}>Pane</button>
            <button onClick={() => browse("Pizza")}>Pizza</button>
            <button onClick={() => browse("Lievitati")}>Lievitati</button>
            <button onClick={() => browse("Tecniche")}>Tecniche</button>
            <Link href="/calcolatore">Calcolatore impasti</Link>
            <Link href="/fonti">Fonti e metodo</Link>
          </nav>
          <div className="header-actions">
            <button aria-label="Cerca nel sito" onClick={() => setSearchOpen(true)}>
              <Search size={20} />
            </button>
            <button
              className="saved-nav"
              aria-label={`Articoli salvati (${saved.length})`}
              onClick={() => browse("Tutti", "Tutti i livelli", true)}
            >
              <Bookmark size={20} />
              {saved.length > 0 && <i>{saved.length}</i>}
            </button>
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Apri menu"
            >
              {mobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main>
        {path === "/calcolatore" ? (
          <DoughCalculator />
        ) : path === "/" ? (
          <>
            <section className="hero wrap">
              <div className="hero-copy">
                <h1>
                  Grandi impasti.
                  <br />
                  Piccoli gesti.
                  <br />
                  <em>Buone idee.</em>
                </h1>
                <p>
                  Il mondo dell’arte bianca, dalla prima pagnotta
                  <br className="desktop-break" /> al laboratorio. Guide, ricette e tecniche per chi
                  <br className="desktop-break" /> ama mettere le mani in pasta.
                </p>
                <div className="hero-buttons">
                  <button className="button primary" onClick={() => browse()}>
                    Entra nel mondo degli impasti <ArrowUpRight size={18} />
                  </button>
                  <button className="text-button" onClick={() => browse("Tutti", "Professionisti")}>
                    Sei un professionista? <ArrowRight size={17} />
                  </button>
                </div>
                <div className="hero-note">
                  <div className="note-symbol">
                    <BookOpen size={19} />
                  </div>
                  <span>
                    La passione incontra la conoscenza.
                    <small>Contenuti originali. Fonti autorevoli. Sempre citate.</small>
                  </span>
                </div>
              </div>
              <div className="hero-visual">
                <img
                  className="hero-photo"
                  src="/images/hero.webp"
                  alt="Pagnotte artigianali dalla crosta dorata e infarinata"
                />
                <div className="hero-image-caption">
                  <span>FARINA, ACQUA, TEMPO.</span>
                  <span>IL RESTO SI IMPARA.</span>
                </div>
                <div className="hero-label">
                  <Wheat size={24} strokeWidth={1.3} />
                  <span>
                    La bellezza
                    <br />
                    delle cose semplici.
                  </span>
                </div>
                <div className="round-stamp">
                  FATTO DI PASSIONE<span>✳</span> E CONOSCENZA
                </div>
              </div>
            </section>
            <section className="category-strip">
              <div className="wrap category-row">
                <span className="category-intro">Da cosa vuoi iniziare?</span>
                {[
                  { name: "Pane", detail: "Croste, molliche e lievito madre", icon: Wheat },
                  { name: "Pizza", detail: "Dall’impasto al cornicione", icon: Leaf },
                  { name: "Lievitati", detail: "Dolci, sfoglie e pazienza", icon: BookOpen },
                  { name: "Tecniche", detail: "Il perché di ogni gesto", icon: SlidersHorizontal },
                ].map(({ name, detail, icon: Icon }) => (
                  <button key={name} onClick={() => browse(name)}>
                    <Icon size={25} strokeWidth={1.2} />
                    <span>
                      {name}
                      <small>{detail}</small>
                    </span>
                    <ArrowUpRight size={17} />
                  </button>
                ))}
              </div>
            </section>
            <section className="editorial wrap" id="esplora">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">IL QUADERNO DEGLI IMPASTI</div>
                  <h2>
                    {onlySaved ? "I tuoi articoli salvati." : "Da leggere, da mettere in pratica."}
                  </h2>
                </div>
                <span className="section-subtitle">
                  Un po’ di teoria.
                  <br />
                  Tanta voglia di provare.
                </span>
              </div>
              <div className="filter-row">
                <div className="category-filters">
                  {categories.map((c) => (
                    <button
                      key={c}
                      className={c === category ? "active" : ""}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="level-filter">
                  <SlidersHorizontal size={15} />
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    aria-label="Filtra per livello"
                  >
                    <option>Tutti i livelli</option>
                    <option>Amatori</option>
                    <option>Professionisti</option>
                  </select>
                </div>
              </div>
              {(query || onlySaved) && (
                <div className="result-bar">
                  <span>
                    {filtered.length} {filtered.length === 1 ? "contenuto" : "contenuti"}
                    {query ? " per “" + query + "”" : ""}
                    {onlySaved ? " salvati su questo browser" : ""}
                  </span>
                  <button
                    onClick={() => {
                      setOnlySaved(false);
                      setQuery("");
                      setCategory("Tutti");
                      setLevel("Tutti i livelli");
                    }}
                  >
                    Mostra tutto <X size={14} />
                  </button>
                </div>
              )}
              <div className="article-grid">{filtered.map(card)}</div>
              {filtered.length === 0 && (
                <div className="empty-state">
                  <BookOpen size={30} />
                  <h3>
                    {onlySaved ? "Il tuo quaderno comincia qui." : "Nessun articolo trovato."}
                  </h3>
                  <p>
                    {onlySaved
                      ? "Tocca il segnalibro su un articolo per ritrovarlo qui."
                      : "Prova un’altra categoria o cambia il livello."}
                  </p>
                  <button className="button primary" onClick={() => browse()}>
                    Esplora tutti i contenuti <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </section>
            <section className="lab-section">
              <div className="wrap lab-grid">
                <div>
                  <div className="eyebrow">CALCOLATORE IMPASTI</div>
                  <h2>
                    Meno conti.
                    <br />
                    <em>Più impasti.</em>
                  </h2>
                  <p>
                    Dalla cucina di casa al banco del laboratorio:
                    <br />
                    formule dirette, prefermenti e lievito madre, a portata di mano.
                  </p>
                  <Link className="button light" href="/calcolatore">
                    Apri il calcolatore <ArrowUpRight size={18} />
                  </Link>
                  <small className="lab-source">
                    Metodo: {sources.math.name} · Percentuali del panificatore
                  </small>
                </div>
                <div className="calc-preview">
                  <div className="calc-top">
                    <Scale size={23} strokeWidth={1.4} />
                    <span>LA TUA FORMULA</span>
                    <span className="small-tag">Impasto diretto</span>
                  </div>
                  <div className="formula-row">
                    <span>Farina</span>
                    <b>
                      500 <small>g</small>
                    </b>
                    <em>100%</em>
                  </div>
                  <div className="formula-row">
                    <span>Acqua</span>
                    <b>
                      350 <small>g</small>
                    </b>
                    <em>70%</em>
                  </div>
                  <div className="formula-row">
                    <span>Sale</span>
                    <b>
                      10 <small>g</small>
                    </b>
                    <em>2%</em>
                  </div>
                  <div className="formula-note">
                    <span className="tiny-dot" />
                    La farina è il tuo 100%. Tutto parte da qui.
                  </div>
                </div>
              </div>
            </section>
            <section className="method-section wrap">
              <div className="method-intro">
                <div className="eyebrow">BUONI IMPASTI. BUONE FONTI.</div>
                <h2>
                  La conoscenza
                  <br />
                  ha una <em>provenienza.</em>
                </h2>
                <p>
                  Selezioniamo riferimenti tecnici e fonti primarie. Li studiamo, li raccontiamo con
                  parole nostre e ti lasciamo sempre il link per approfondire.
                </p>
                <Link className="text-button" href="/fonti">
                  Scopri il nostro metodo <ArrowUpRight size={18} />
                </Link>
              </div>
              <div className="source-feature">
                <div>
                  <span className="source-number">01</span>
                  <span>
                    <strong>{sources.methods.name}</strong>
                    <small>Metodi di impasto e cultura della farina</small>
                  </span>
                  <ExternalLink size={16} />
                </div>
                <div>
                  <span className="source-number">02</span>
                  <span>
                    <strong>Associazione Verace Pizza Napoletana</strong>
                    <small>La voce della tradizione, il disciplinare ufficiale</small>
                  </span>
                  <ExternalLink size={16} />
                </div>
                <div>
                  <span className="source-number">03</span>
                  <span>
                    <strong>Serious Eats</strong>
                    <small>Tecniche e spiegazioni di cucina</small>
                  </span>
                  <ExternalLink size={16} />
                </div>
                <p>Nessuna affiliazione. Solo trasparenza editoriale.</p>
              </div>
            </section>
          </>
        ) : article ? (
          <section className="article-page wrap">
            <Link href="/" className="back-link">
              <ArrowLeft size={16} />
              Torna al quaderno
            </Link>
            <div className="article-page-head">
              <div>
                <div className="eyebrow">
                  {article.category.toUpperCase()} / {article.kind.toUpperCase()}
                </div>
                <h1>{article.title}</h1>
                <p>{article.description}</p>
                <div className="article-byline">
                  <span>Redazione Arte Bianca</span>
                  <span>
                    <Clock size={14} />
                    {article.minutes} min di lettura
                  </span>
                  <span>{article.level}</span>
                </div>
                <button className="text-button" onClick={() => toggleSave(article.id)}>
                  <Bookmark size={17} fill={saved.includes(article.id) ? "currentColor" : "none"} />
                  {saved.includes(article.id)
                    ? "Salvato nel tuo quaderno"
                    : "Salva nel tuo quaderno"}
                </button>
              </div>
              <img src={"/images/" + article.image + ".webp"} alt={article.title} />
            </div>
            <div className="article-body-layout">
              <div className="article-body">
                <div className="editorial-disclosure">
                  <BookOpen size={18} />
                  <span>
                    {article.authorNote
                      ? "Appunti dell’autore del sito, riorganizzati con integrazioni tecniche a cura di Arte Bianca."
                      : article.recipe
                        ? "Proposta originale non testata."
                        : "Sintesi originale a cura di Arte Bianca."}{" "}
                    Le fonti sono riportate a fianco e in fondo all’articolo.
                  </span>
                </div>
                {article.authorNote && (
                  <section className="author-note">
                    <div className="eyebrow">APPUNTI DELL’AUTORE DEL SITO</div>
                    <blockquote>«{article.authorNote}»</blockquote>
                    <p>
                      Nota personale dell’autore, con ortografia sistemata. Le spiegazioni che
                      seguono sono integrazioni tecniche basate sulle fonti citate, non una
                      trascrizione dei suoi appunti.
                    </p>
                  </section>
                )}
                {article.sections.map((s) => (
                  <section key={s.heading}>
                    <h2>{s.heading}</h2>
                    <p>{s.text}</p>
                  </section>
                ))}
                {article.recipe && (
                  <section className="recipe">
                    <div className="eyebrow">LA FORMULA</div>
                    <h2>Ingredienti e procedimento</h2>
                    <ul>
                      {article.recipe.ingredients.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                    <ol>
                      {article.recipe.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                    <Link className="text-button" href="/calcolatore">
                      Ricalcola le quantità <Scale size={17} />
                    </Link>
                  </section>
                )}
                <section className="article-sources">
                  <h2>Fonti e approfondimenti</h2>
                  {article.source.map((s) => (
                    <SourceLink key={s} source={s} />
                  ))}
                  <p className="consulted">
                    Fonti consultate il 6 novembre 2026. I contenuti dei siti originali possono
                    cambiare. Fotografia illustrativa da Unsplash.
                  </p>
                </section>
              </div>
              <aside className="article-aside">
                <div className="eyebrow">DA DOVE PARTIAMO</div>
                {article.source.map((s) => (
                  <SourceLink key={s} source={s} />
                ))}
                <p>
                  Le parole sono nostre.
                  <br />I riferimenti sono sempre visibili.
                </p>
                <Link href="/fonti" className="text-button">
                  Il metodo editoriale <ArrowUpRight size={15} />
                </Link>
              </aside>
            </div>
            <div className="related">
              <div className="eyebrow">IL PROSSIMO PASSO</div>
              <h2>La curiosità continua.</h2>
              <div className="article-grid">
                {articles
                  .filter((a) => a.id !== article.id)
                  .slice(0, 3)
                  .map(card)}
              </div>
            </div>
          </section>
        ) : path === "/fonti" ? (
          <section className="sources-page wrap">
            <Link href="/" className="back-link">
              <ArrowLeft size={16} />
              Torna alla home
            </Link>
            <div className="eyebrow">TRASPARENZA EDITORIALE</div>
            <h1>
              Buone fonti.
              <br />
              <em>Con parole nostre.</em>
            </h1>
            <p className="sources-lead">
              Un portale per imparare, non una raccolta di testi copiati. Ecco i riferimenti su cui
              si basano i nostri contenuti.
            </p>
            <div className="method-rules">
              <div>
                <span>01 / SELEZIONARE</span>
                <h3>La competenza prima di tutto.</h3>
                <p>
                  Privilegiamo fonti primarie, associazioni di settore e riferimenti tecnici con
                  procedure descritte chiaramente. “Migliore” significa pertinente al tema, non un
                  giudizio assoluto.
                </p>
              </div>
              <div>
                <span>02 / RIELABORARE</span>
                <h3>Scrivere, non riprodurre.</h3>
                <p>
                  Le guide sono sintesi originali in italiano. Non ripubblichiamo interi articoli o
                  ricette altrui; colleghiamo i procedimenti completi agli originali.
                </p>
              </div>
              <div>
                <span>03 / DISTINGUERE</span>
                <h3>Pratica e teoria, senza equivoci.</h3>
                <p>
                  Le proposte originali sono etichettate e non presentate come testate. Tempi e
                  temperature dipendono dalle condizioni. Non siamo affiliati ai siti citati.
                </p>
              </div>
            </div>
            <h2>La biblioteca di riferimento.</h2>
            <div className="source-library">
              {Object.entries(sources).map(([key, s]) => (
                <div key={key}>
                  <SourceLink source={key as SourceKey} />
                  <p>{s.note}</p>
                  <small>Consultato il 6 novembre 2026</small>
                </div>
              ))}
            </div>
            <div className="photo-credit">
              <h3>Fotografie</h3>
              <p>
                Immagini illustrative selezionate da{" "}
                <a
                  href="https://unsplash.com/s/photos/artisan-bread"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unsplash
                </a>
                : pane artigianale, lavorazione degli impasti, pizza e croissant. Non sono prove
                pratiche delle nostre formule.
              </p>
            </div>
          </section>
        ) : (
          <section className="empty-state wrap">
            <h1>Questa pagina non è nel quaderno.</h1>
            <Link className="button primary" href="/">
              Torna alla home <ArrowRight size={17} />
            </Link>
          </section>
        )}
      </main>
      <footer>
        <div className="wrap footer-top">
          <Link href="/" className="brand">
            <Wheat strokeWidth={1.2} />
            <span>
              arte bianca.<small>IL SAPERE. LE MANI. IL PANE.</small>
            </span>
          </Link>
          <p>
            Per chi inizia. Per chi non smette
            <br />
            mai di imparare.
          </p>
          <Link href="/fonti">
            Fonti e metodo <ArrowUpRight size={16} />
          </Link>
          <Link href="/calcolatore">
            Calcolatore impasti <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="wrap footer-bottom">
          <span>© 2026 Arte Bianca · Un quaderno indipendente.</span>
          <span>Fatto con cura, da condividere.</span>
        </div>
      </footer>
      {searchOpen && (
        <dialog
          className="modal-backdrop"
          ref={(node) => {
            if (node && !node.open) node.showModal();
          }}
          onCancel={() => setSearchOpen(false)}
          aria-label="Cerca articoli"
        >
          <section className="search-modal">
            <div className="modal-title">
              <h2>Una buona idea comincia qui.</h2>
              <button aria-label="Chiudi ricerca" onClick={() => setSearchOpen(false)}>
                <X />
              </button>
            </div>
            <div className="search-field">
              <Search size={22} />
              <input
                ref={searchRef}
                aria-label="Cerca nel quaderno"
                placeholder="Cerca pane, idratazione, lievito madre…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <p className="search-count">
              {query ? "Risultati della ricerca" : "Dal nostro quaderno"} ·{" "}
              {
                articles.filter((a) =>
                  (a.title + " " + a.description + " " + a.sections.map((s) => s.text).join(" "))
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                ).length
              }{" "}
              contenuti
            </p>
            <div className="search-results">
              {articles
                .filter((a) =>
                  (a.title + " " + a.description + " " + a.sections.map((s) => s.text).join(" "))
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                )
                .map((a) => (
                  <button key={a.id} onClick={() => openArticle(a.id)}>
                    <img src={"/images/" + a.image + ".webp"} alt="" />
                    <span>
                      <small>
                        {a.category} · {a.level}
                      </small>
                      <strong>{a.title}</strong>
                    </span>
                    <ArrowUpRight size={20} />
                  </button>
                ))}
            </div>
          </section>
        </dialog>
      )}
    </>
  );
}
