import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Scale,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Info,
} from "lucide-react";
import { calculateDough, initialFormula, type Formula, type Preferment } from "../lib/dough-math";
import { sources } from "../lib/editorial";

const format = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 2 });
function NumberField({
  label,
  value,
  onChange,
  suffix = "%",
  max = 200,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  max?: number;
}) {
  return (
    <label className="dough-field">
      <span>{label}</span>
      <div>
        <input
          aria-label={label}
          type="number"
          inputMode="decimal"
          min="0"
          max={max}
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>{suffix}</span>
      </div>
    </label>
  );
}
export default function DoughCalculator() {
  const [formula, setFormula] = useState<Formula>(initialFormula);
  const [copyState, setCopyState] = useState<"idle" | "done" | "failed">("idle");
  const update = (patch: Partial<Formula>) => {
    setFormula((f) => ({ ...f, ...patch }));
    setCopyState("idle");
  };
  const editPreferment = (id: string, patch: Partial<Preferment>) =>
    update({ preferments: formula.preferments.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const result = calculateDough(formula);
  const valid = result.errors.length === 0;
  const switchUnit = (unit: "g" | "kg") => {
    const q = Number(formula.quantity);
    update({
      unit,
      quantity:
        Number.isFinite(q) && formula.quantity !== ""
          ? String(unit === formula.unit ? q : unit === "kg" ? q / 1000 : q * 1000)
          : formula.quantity,
    });
  };
  const text = valid
    ? [
        "ARTE BIANCA — CALCOLATORE IMPASTI",
        `Peso totale: ${format(result.total)} g`,
        "INGREDIENTI TOTALI / GIÀ NEI PREFERMENTI / DA AGGIUNGERE",
        ...result.rows.map(
          (r) =>
            `${r.name}: ${format(r.total)} g (${format(r.percent)}%) / ${format(r.contained)} g / ${format(r.add)} g`,
        ),
        ...result.preferences.map(
          (p) =>
            `${p.name}: ${format(p.weight)} g — farina ${format(p.flour)} g, acqua ${format(p.water)} g, lievito fresco ${format(p.fresh)} g, secco ${format(p.dry)} g`,
        ),
        `In impastatrice: ${format(result.prefermentWeight)} g di prefermenti + ${format(result.finalAdd)} g di ingredienti da aggiungere = ${format(result.total)} g.`,
        "Percentuali sulla farina totale. Il calcolo non determina tempi e sicurezza della fermentazione.",
      ].join("\n")
    : "";
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("done");
    } catch {
      setCopyState("failed");
    }
  }
  return (
    <section className="dough-page">
      <div className="dough-banner">
        <div className="wrap">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} />
            Torna al quaderno
          </Link>
          <div className="eyebrow">
            <Scale size={18} /> GLI STRUMENTI DELL’ARTE BIANCA
          </div>
          <h1>
            CALCOLATORE <em>IMPASTI</em>
          </h1>
          <p>
            La tua formula, dal primo grammo al banco del laboratorio.
            <br />
            Impasti diretti, prefermenti e lievito madre: tutti i pesi, senza doppioni.
          </p>
        </div>
      </div>
      <div className="wrap dough-workspace">
        <div className="dough-controls">
          <section className="dough-panel">
            <div className="dough-step">
              <span>01</span>
              <h2>Da dove partiamo?</h2>
            </div>
            <div className="dough-modes">
              <button
                aria-pressed={formula.mode === "flour"}
                className={formula.mode === "flour" ? "active" : ""}
                onClick={() => update({ mode: "flour" })}
              >
                Quantità di farina<small>Conosci la farina disponibile</small>
              </button>
              <button
                aria-pressed={formula.mode === "weight"}
                className={formula.mode === "weight" ? "active" : ""}
                onClick={() => update({ mode: "weight" })}
              >
                Peso finale dell’impasto<small>Conosci il peso da ottenere</small>
              </button>
            </div>
            <div className="dough-quantity">
              <NumberField
                label={formula.mode === "flour" ? "Farina totale" : "Peso finale desiderato"}
                value={formula.quantity}
                onChange={(quantity) => update({ quantity })}
                suffix={formula.unit}
                max={formula.unit === "kg" ? 1000000 : 1000000000}
              />
              <label className="dough-unit">
                Unità
                <select
                  aria-label="Unità di misura"
                  value={formula.unit}
                  onChange={(e) => switchUnit(e.target.value as "g" | "kg")}
                >
                  <option value="g">Grammi (g)</option>
                  <option value="kg">Chilogrammi (kg)</option>
                </select>
              </label>
            </div>
            <p className="dough-help">
              La farina totale include quella dei prefermenti. Il peso finale è quello teorico prima
              della cottura, non il peso del prodotto cotto.
            </p>
          </section>
          <section className="dough-panel">
            <div className="dough-step">
              <span>02</span>
              <h2>La formula totale</h2>
            </div>
            <p className="dough-help">
              Tutte le percentuali sono sulla farina totale (100%), inclusa quella già nei
              prefermenti.
            </p>
            <div className="dough-fields">
              <NumberField
                label="Acqua / idratazione totale"
                value={formula.hydration}
                onChange={(hydration) => update({ hydration })}
              />
              <NumberField
                label="Sale"
                value={formula.salt}
                max={10}
                onChange={(salt) => update({ salt })}
              />
              <NumberField
                label="Lievito fresco"
                value={formula.fresh}
                max={10}
                onChange={(fresh) => update({ fresh })}
              />
              <NumberField
                label="Lievito secco"
                value={formula.dry}
                max={10}
                onChange={(dry) => update({ dry })}
              />
              <NumberField
                label="Olio"
                value={formula.oil}
                max={100}
                onChange={(oil) => update({ oil })}
              />
              <NumberField
                label="Zucchero"
                value={formula.sugar}
                max={100}
                onChange={(sugar) => update({ sugar })}
              />
            </div>
            <p className="dough-help">
              Usa normalmente un solo tipo di lievito commerciale, lasciando l’altro a zero. Per un
              impasto con solo lievito madre, metti entrambi a zero. Nessuna conversione automatica
              fresco/secco.
            </p>
            {result.bothYeasts && (
              <p className="dough-warning">
                <Info size={16} />
                Hai inserito entrambi i lieviti: saranno sommati, non considerati alternativi.
              </p>
            )}
            {formula.extras.map((extra, i) => (
              <div className="dough-custom" key={extra.id}>
                <label className="dough-field">
                  <span>Nome ingrediente {i + 1}</span>
                  <input
                    aria-label={`Nome ingrediente ${i + 1}`}
                    placeholder="Es. malto, latte, semi…"
                    value={extra.name}
                    onChange={(e) =>
                      update({
                        extras: formula.extras.map((x) =>
                          x.id === extra.id ? { ...x, name: e.target.value } : x,
                        ),
                      })
                    }
                  />
                </label>
                <NumberField
                  label={`Percentuale ingrediente ${i + 1}`}
                  value={extra.percent}
                  onChange={(percent) =>
                    update({
                      extras: formula.extras.map((x) =>
                        x.id === extra.id ? { ...x, percent } : x,
                      ),
                    })
                  }
                />
                <button
                  className="dough-remove"
                  aria-label={`Rimuovi ingrediente ${i + 1}`}
                  onClick={() =>
                    update({ extras: formula.extras.filter((x) => x.id !== extra.id) })
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
            <button
              className="text-button dough-add"
              onClick={() =>
                update({
                  extras: [...formula.extras, { id: crypto.randomUUID(), name: "", percent: "0" }],
                })
              }
            >
              <Plus size={16} />
              Aggiungi ingrediente personalizzato
            </button>
            <p className="dough-help">
              Latte, uova e altri ingredienti composti contribuiscono al peso, ma la loro acqua
              interna non viene scomposta nell’idratazione.
            </p>
          </section>
          <section className="dough-panel">
            <div className="dough-step">
              <span>03</span>
              <h2>Prefermenti e lievito madre</h2>
              <span className="dough-advanced">AVANZATO</span>
            </div>
            <p className="dough-help">
              Attiva uno o più metodi. «30%» significa che 300 g di ogni 1 kg di farina totale sono
              nel prefermento. Le idratazioni iniziali sono esempi modificabili, non ricette
              universali.
            </p>
            {formula.preferments.map((p) => (
              <div key={p.id} className={`dough-preferment ${p.enabled ? "enabled" : ""}`}>
                <label className="dough-pref-toggle">
                  <input
                        aria-label={p.name}
                    type="checkbox"
                    checked={p.enabled}
                    onChange={(e) => editPreferment(p.id, { enabled: e.target.checked })}
                  />
                  <span>{p.name}</span>
                  <small>{p.enabled ? "Attivo" : "Non utilizzato"}</small>
                </label>
                {p.enabled && (
                  <div className="dough-pref-content">
                    <label className="dough-pref-mode">
                      Come vuoi indicarlo?
                      <select
                        aria-label={`${p.name}: modalità`}
                        value={p.mode}
                        onChange={(e) =>
                          editPreferment(p.id, { mode: e.target.value as Preferment["mode"] })
                        }
                      >
                        <option value="percent">Percentuale e idratazione</option>
                        <option value="known">Farina e acqua già note</option>
                      </select>
                    </label>
                    <div className="dough-fields">
                      {p.mode === "percent" ? (
                        <>
                          <NumberField
                            label={`${p.name}: farina prefermentata`}
                            value={p.percent}
                            max={100}
                            onChange={(percent) => editPreferment(p.id, { percent })}
                          />
                          <NumberField
                            label={`${p.name}: idratazione`}
                            value={p.hydration}
                            max={300}
                            onChange={(hydration) => editPreferment(p.id, { hydration })}
                          />
                        </>
                      ) : (
                        <>
                          <NumberField
                            label={`${p.name}: farina già presente`}
                            value={p.flour}
                            suffix="g"
                            max={1000000000}
                            onChange={(flour) => editPreferment(p.id, { flour })}
                          />
                          <NumberField
                            label={`${p.name}: acqua già presente`}
                            value={p.water}
                            suffix="g"
                            max={1000000000}
                            onChange={(water) => editPreferment(p.id, { water })}
                          />
                        </>
                      )}
                      <NumberField
                        label={`${p.name}: lievito fresco già presente`}
                        value={p.fresh}
                        max={10}
                        onChange={(fresh) => editPreferment(p.id, { fresh })}
                      />
                      <NumberField
                        label={`${p.name}: lievito secco già presente`}
                        value={p.dry}
                        max={10}
                        onChange={(dry) => editPreferment(p.id, { dry })}
                      />
                    </div>
                    <p className="dough-help">
                      Il lievito commerciale qui indicato è in % sulla farina di questo prefermento
                      e viene sottratto dal lievito totale. Con il solo lievito madre lascia questi
                      campi a zero.
                    </p>
                    {valid &&
                      (() => {
                        const r = result.preferences.find((x) => x.id === p.id);
                        return r ? (
                          <div className="dough-pref-summary">
                            <strong>
                              {format(r.weight)} g di {p.name.toLowerCase()}
                            </strong>
                            <span>
                              Farina {format(r.flour)} g · Acqua {format(r.water)} g
                            </span>
                            <small>
                              {format(r.percent)}% della farina totale · Idratazione{" "}
                              {format(r.hydration)}%
                            </small>
                          </div>
                        ) : null;
                      })()}
                  </div>
                )}
              </div>
            ))}
            <p className="dough-help">
              I prefermenti qui sono conteggiati come farina, acqua e lievito commerciale
              eventualmente dichiarato. La pasta di riporto (PDR), che contiene anche sale e altri
              ingredienti, non è gestita da questa sezione.
            </p>
          </section>
        </div>
        <aside className="dough-results" aria-label="Risultati del calcolo">
          <div className="dough-result-head">
            <div className="eyebrow">LA TUA SCHEDA D’IMPASTO</div>
            <h2>
              Ogni grammo,
              <br />
              <em>al posto giusto.</em>
            </h2>
          </div>
          {!valid ? (
            <div className="dough-errors" role="alert">
              <h3>Controlla la formula</h3>
              <ul>
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
              <p>I risultati torneranno visibili quando i valori saranno coerenti.</p>
            </div>
          ) : (
            <>
              <div className="dough-total">
                <span>Peso finale teorico</span>
                <strong data-testid="dough-total">
                  {format(result.total)} <small>g</small>
                </strong>
                <small>
                  {format(result.total / 1000)} kg · Farina totale {format(result.flour)} g
                </small>
              </div>
              <div className="dough-table-scroll">
                <table className="dough-table">
                  <caption>Formula totale e ingredienti da aggiungere</caption>
                  <thead>
                    <tr>
                      <th>Ingrediente</th>
                      <th>%</th>
                      <th>Totale g</th>
                      <th>
                        Già nel
                        <br />
                        prefermento g
                      </th>
                      <th>
                        Da
                        <br />
                        aggiungere g
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r) => (
                      <tr key={r.id} data-ingredient={r.id}>
                        <th scope="row">{r.name}</th>
                        <td>{format(r.percent)}</td>
                        <td>{format(r.total)}</td>
                        <td>{format(r.contained)}</td>
                        <td>
                          <strong>{format(r.add)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {result.preferences.length > 0 && (
                <div className="dough-final-mix">
                  <h3>In impastatrice</h3>
                  {result.preferences.map((p) => (
                    <div key={p.id}>
                      <span>{p.name} già pronto</span>
                      <strong>{format(p.weight)} g</strong>
                    </div>
                  ))}
                  <div>
                    <span>Ingredienti da aggiungere</span>
                    <strong>{format(result.finalAdd)} g</strong>
                  </div>
                  <p>
                    Prefermenti + ingredienti da aggiungere = {format(result.total)} g. La colonna
                    «Totale» è un riepilogo, non una seconda pesata.
                  </p>
                </div>
              )}
              <button className="button primary dough-copy" onClick={copy}>
                {copyState === "done" ? <Check size={17} /> : <Copy size={17} />}{" "}
                {copyState === "done" ? "Formula copiata" : "Copia la scheda"}
              </button>
              {copyState === "failed" && (
                <label className="dough-copy-fallback">
                  Copia automatica non disponibile. Seleziona e copia la scheda:
                  <textarea aria-label="Scheda da copiare manualmente" readOnly value={text} onFocus={(e) => e.target.select()} />
                </label>
              )}
            </>
          )}
          <button
            className="text-button dough-reset"
            onClick={() => {
              setFormula(initialFormula());
              setCopyState("idle");
            }}
          >
            <RotateCcw size={15} />
            Ripristina l’esempio iniziale
          </button>
          <div className="dough-method">
            <Info size={18} />
            <p>
              I pesi sono calcolati senza arrotondamenti intermedi e visualizzati fino a 2 decimali.
              Tempi, temperatura, maturazione e dose di lievito restano scelte della tua
              lavorazione. Non è una ricetta collaudata.
            </p>
          </div>
          <div className="dough-source-links">
            <a href={sources.math.url} target="_blank" rel="noopener noreferrer">
              Percentuali · {sources.math.name}
              <ArrowUpRight size={13} />
            </a>
            <a href={sources.methods.url} target="_blank" rel="noopener noreferrer">
              Metodi · {sources.methods.name}
              <ArrowUpRight size={13} />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
