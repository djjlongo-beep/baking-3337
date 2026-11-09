export type Ingredient = { id: string; name: string; percent: string };
export type Preferment = {
  id: string;
  name: string;
  enabled: boolean;
  mode: "percent" | "known";
  percent: string;
  hydration: string;
  flour: string;
  water: string;
  fresh: string;
  dry: string;
};
export type Formula = {
  mode: "flour" | "weight";
  quantity: string;
  unit: "g" | "kg";
  hydration: string;
  salt: string;
  fresh: string;
  dry: string;
  oil: string;
  sugar: string;
  extras: Ingredient[];
  preferments: Preferment[];
};
export const initialFormula = (): Formula => ({
  mode: "flour",
  quantity: "1000",
  unit: "g",
  hydration: "70",
  salt: "2",
  fresh: "0",
  dry: "0.3",
  oil: "0",
  sugar: "0",
  extras: [],
  preferments: [
    { id: "biga", name: "Biga", hydration: "45" },
    { id: "poolish", name: "Poolish", hydration: "100" },
    { id: "solid", name: "Lievito madre solido", hydration: "50" },
    { id: "liquid", name: "Lievito madre liquido", hydration: "100" },
  ].map((p) => ({
    ...p,
    enabled: false,
    mode: "percent",
    percent: "30",
    flour: "300",
    water: String((300 * Number(p.hydration)) / 100),
    fresh: "0",
    dry: "0",
  })),
});
export function calculateDough(input: Formula) {
  const errors: string[] = [];
  const number = (raw: string, label: string, max: number) => {
    const value = Number(raw.replace(",", "."));
    if (!raw.trim() || !Number.isFinite(value) || value < 0 || value > max) {
      errors.push(`${label}: inserisci un valore tra 0 e ${max}.`);
      return 0;
    }
    return value;
  };
  const quantity =
    number(input.quantity, "Quantità", input.unit === "kg" ? 1000000 : 1000000000) *
    (input.unit === "kg" ? 1000 : 1);
  if (quantity <= 0) errors.push("La quantità deve essere maggiore di zero.");
  const specs = [
    { id: "water", name: "Acqua", raw: input.hydration, max: 200 },
    { id: "salt", name: "Sale", raw: input.salt, max: 10 },
    { id: "fresh", name: "Lievito fresco", raw: input.fresh, max: 10 },
    { id: "dry", name: "Lievito secco", raw: input.dry, max: 10 },
    { id: "oil", name: "Olio", raw: input.oil, max: 100 },
    { id: "sugar", name: "Zucchero", raw: input.sugar, max: 100 },
    ...input.extras.map((e) => ({
      id: e.id,
      name: e.name.trim() || "Ingrediente personalizzato",
      raw: e.percent,
      max: 200,
    })),
  ];
  if (input.extras.some((e) => !e.name.trim()))
    errors.push("Dai un nome a ogni ingrediente personalizzato.");
  const percentages = specs.map((s) => ({ ...s, percent: number(s.raw, s.name, s.max) }));
  const factor = 1 + percentages.reduce((sum, r) => sum + r.percent, 0) / 100;
  const flour = input.mode === "flour" ? quantity : quantity / factor;
  const preferences = input.preferments
    .filter((p) => p.enabled)
    .map((p) => {
      let pf = 0,
        pw = 0;
      if (p.mode === "percent") {
        pf = (flour * number(p.percent, `${p.name}: farina prefermentata (%)`, 100)) / 100;
        pw = (pf * number(p.hydration, `${p.name}: idratazione (%)`, 300)) / 100;
      } else {
        pf = number(p.flour, `${p.name}: farina (g)`, 1000000000);
        pw = number(p.water, `${p.name}: acqua (g)`, 1000000000);
        if (pf <= 0) errors.push(`${p.name}: la farina già presente deve essere maggiore di zero.`);
      }
      const fresh = (pf * number(p.fresh, `${p.name}: lievito fresco (%)`, 10)) / 100;
      const dry = (pf * number(p.dry, `${p.name}: lievito secco (%)`, 10)) / 100;
      return {
        id: p.id,
        name: p.name,
        flour: pf,
        water: pw,
        fresh,
        dry,
        weight: pf + pw + fresh + dry,
        percent: flour ? (pf / flour) * 100 : 0,
        hydration: pf ? (pw / pf) * 100 : 0,
      };
    });
  const contained = {
    flour: preferences.reduce((s, p) => s + p.flour, 0),
    water: preferences.reduce((s, p) => s + p.water, 0),
    fresh: preferences.reduce((s, p) => s + p.fresh, 0),
    dry: preferences.reduce((s, p) => s + p.dry, 0),
  };
  const rows = [
    {
      id: "flour",
      name: "Farina",
      percent: 100,
      total: flour,
      contained: contained.flour,
      add: flour - contained.flour,
    },
    ...percentages.map((p) => {
      const total = (flour * p.percent) / 100;
      const already =
        p.id === "water"
          ? contained.water
          : p.id === "fresh"
            ? contained.fresh
            : p.id === "dry"
              ? contained.dry
              : 0;
      return {
        id: p.id,
        name: p.name,
        percent: p.percent,
        total,
        contained: already,
        add: total - already,
      };
    }),
  ];
  for (const row of rows) {
    if (row.add < -0.000001)
      errors.push(
        `${row.name}: i prefermenti ne contengono più del totale previsto. Riduci il prefermento o aumenta la percentuale totale.`,
      );
    if (Math.abs(row.add) < 0.000001) row.add = 0;
  }
  const total = rows.reduce((s, r) => s + r.total, 0);
  return {
    errors,
    flour,
    total,
    rows,
    preferences,
    prefermentWeight: preferences.reduce((s, p) => s + p.weight, 0),
    finalAdd: rows.reduce((s, r) => s + r.add, 0),
    bothYeasts: Number(input.fresh) > 0 && Number(input.dry) > 0,
  };
}
