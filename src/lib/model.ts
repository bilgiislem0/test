import { ceilTL, formatDuration, formatNum, formatTL, formatTLInt } from "./money";

export type IncludeKey =
  | "material"
  | "waste"
  | "support"
  | "electricity"
  | "printer"
  | "nozzle"
  | "pei"
  | "fail"
  | "labor"
  | "design"
  | "packaging"
  | "shipping"
  | "commission"
  | "tax";

export type IncludeMap = Record<IncludeKey, boolean>;

export type Extra = {
  id: string;
  name: string;
  amount: number;
  per: "piece" | "order";
};

export type Job = {
  name: string;
  filamentId: string;
  filamentPrice: number;
  grams: number;
  hours: number;
  minutes: number;
  qty: number;
  perPlate: number;
  supportGrams: number;
  supportPrice: number;
  prepMin: number;
  postMin: number;
  design: number;
  packaging: number;
  packagingPer: "order" | "piece";
  shipping: number;
  extras: Extra[];
  customPrice: number;
};

export type Workshop = {
  printerId: string;
  watt: number;
  elecRate: number;
  printerCost: number;
  printerLife: number;
  nozzleCost: number;
  nozzleLife: number;
  peiCost: number;
  peiLife: number;
  failRate: number;
  wasteRate: number;
  laborRate: number;
  commissionRate: number;
  taxRate: number;
  multiMin: number;
  multiRec: number;
  multiMax: number;
  include: IncludeMap;
};

export type Profile = { id: string; name: string; workshop: Workshop };
export type Note = { id: string; at: string; name: string; price: string; job: Job };
export type Persisted = { v: 1; workshop: Workshop; job: Job; profiles: Profile[]; notes: Note[] };

export type Burn = {
  printerPerHour: number;
  nozzlePerHour: number;
  elecPerHour: number;
  realPerHour: number;
  pricedPerHour: number;
  peiPerPlate: number;
  laborPerHour: number;
};

export type Line = {
  key: string;
  label: string;
  detail: string;
  amount: number;
  included: boolean;
  group: "prod" | "work";
};

export type LadderRow = { qty: number; cycles: number; unit: number; total: number };
export type Insight = { id: string; tone: "info" | "warn" | "good"; text: string };

export type Analysis = {
  ready: boolean;
  missing: string | null;
  problem: string | null;
  burn: Burn;
  pieceHours: number;
  totalHours: number;
  plateCycles: number;
  totalGrams: number;
  kwh: number;
  lines: Line[];
  production: number;
  direct: number;
  unitDirect: number;
  filamentOnly: number;
  linearDirect: number;
  linearPriceRec: number | null;
  failExpected: number;
  failLinear: number;
  feeFraction: number;
  prices: { min: number; rec: number; max: number } | null;
  commissionOnRec: number;
  taxOnRec: number;
  receivedOnRec: number;
  profitOnRec: number;
  marginOnRec: number;
  netMultiplier: number;
  unitRec: number;
  dominantKey: string | null;
  excludedLabels: string[];
  insights: Insight[];
  ladder: LadderRow[];
};

export type CustomJudge = {
  tone: "bad" | "warn" | "good";
  text: string;
  profit: number;
  margin: number;
  multiplier: number;
  received: number;
  perGram: number;
};

export const FILAMENTS: { id: string; label: string; price: number }[] = [
  { id: "pla", label: "PLA", price: 753 },
  { id: "pla_plus", label: "PLA+", price: 850 },
  { id: "petg", label: "PETG", price: 850 },
  { id: "abs", label: "ABS", price: 800 },
  { id: "asa", label: "ASA", price: 950 },
  { id: "tpu", label: "TPU", price: 1100 },
  { id: "custom", label: "Özel", price: 0 },
];

export const PRINTERS: { id: string; label: string; watt: number; cost: number; life: number }[] = [
  { id: "kayitli", label: "Dosyandaki tezgah", watt: 120, cost: 25000, life: 3000 },
  { id: "a1", label: "Bambu Lab A1", watt: 120, cost: 25000, life: 5000 },
  { id: "a1mini", label: "Bambu Lab A1 Mini", watt: 90, cost: 16000, life: 5000 },
  { id: "p1s", label: "Bambu Lab P1S", watt: 180, cost: 45000, life: 6000 },
  { id: "x1c", label: "Bambu Lab X1C", watt: 200, cost: 70000, life: 6000 },
  { id: "ender", label: "Creality Ender serisi", watt: 150, cost: 9000, life: 2500 },
  { id: "ozel", label: "El ile", watt: 120, cost: 25000, life: 3000 },
];

const INCLUDE_KEYS: IncludeKey[] = [
  "material",
  "waste",
  "support",
  "electricity",
  "printer",
  "nozzle",
  "pei",
  "fail",
  "labor",
  "design",
  "packaging",
  "shipping",
  "commission",
  "tax",
];

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function defaultInclude(): IncludeMap {
  return {
    material: true,
    waste: true,
    support: true,
    electricity: true,
    printer: true,
    nozzle: true,
    pei: true,
    fail: true,
    labor: false,
    design: false,
    packaging: false,
    shipping: false,
    commission: false,
    tax: false,
  };
}

export function defaultWorkshop(): Workshop {
  return {
    printerId: "kayitli",
    watt: 120,
    elecRate: 4.5,
    printerCost: 25000,
    printerLife: 3000,
    nozzleCost: 1500,
    nozzleLife: 500,
    peiCost: 3500,
    peiLife: 300,
    failRate: 10,
    wasteRate: 15,
    laborRate: 200,
    commissionRate: 0,
    taxRate: 0,
    multiMin: 2.5,
    multiRec: 3.5,
    multiMax: 5,
    include: defaultInclude(),
  };
}

export function defaultJob(): Job {
  return {
    name: "",
    filamentId: "pla",
    filamentPrice: 753,
    grams: 0,
    hours: 0,
    minutes: 0,
    qty: 1,
    perPlate: 1,
    supportGrams: 0,
    supportPrice: 850,
    prepMin: 15,
    postMin: 10,
    design: 0,
    packaging: 15,
    packagingPer: "order",
    shipping: 0,
    extras: [],
    customPrice: 0,
  };
}

export function defaults(): Persisted {
  return { v: 1, workshop: defaultWorkshop(), job: defaultJob(), profiles: [], notes: [] };
}

export function applyExample(job: Job): Job {
  return {
    ...job,
    name: job.name.trim() ? job.name : "Küçük parça",
    grams: 3,
    hours: 0,
    minutes: 30,
    qty: 1,
    perPlate: 4,
  };
}

function num(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function normalizeExtras(v: unknown): Extra[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, 12).map((item, i) => {
    const it = (item ?? {}) as Partial<Extra>;
    return {
      id: typeof it.id === "string" && it.id ? it.id : `e${i}`,
      name: typeof it.name === "string" && it.name.trim() ? it.name.slice(0, 40) : "Ek kalem",
      amount: Math.max(0, num(it.amount, 0)),
      per: it.per === "piece" ? "piece" : "order",
    };
  });
}

export function normalizeWorkshop(raw: unknown): Workshop {
  const base = defaultWorkshop();
  const r = (raw ?? {}) as Partial<Workshop>;
  const include = { ...base.include };
  if (r.include && typeof r.include === "object") {
    for (const key of INCLUDE_KEYS) {
      const value = (r.include as Partial<IncludeMap>)[key];
      if (typeof value === "boolean") include[key] = value;
    }
  }
  return {
    printerId: typeof r.printerId === "string" ? r.printerId : base.printerId,
    watt: num(r.watt, base.watt),
    elecRate: num(r.elecRate, base.elecRate),
    printerCost: num(r.printerCost, base.printerCost),
    printerLife: num(r.printerLife, base.printerLife),
    nozzleCost: num(r.nozzleCost, base.nozzleCost),
    nozzleLife: num(r.nozzleLife, base.nozzleLife),
    peiCost: num(r.peiCost, base.peiCost),
    peiLife: num(r.peiLife, base.peiLife),
    failRate: num(r.failRate, base.failRate),
    wasteRate: num(r.wasteRate, base.wasteRate),
    laborRate: num(r.laborRate, base.laborRate),
    commissionRate: num(r.commissionRate, base.commissionRate),
    taxRate: num(r.taxRate, base.taxRate),
    multiMin: num(r.multiMin, base.multiMin),
    multiRec: num(r.multiRec, base.multiRec),
    multiMax: num(r.multiMax, base.multiMax),
    include,
  };
}

export function normalizeJob(raw: unknown): Job {
  const base = defaultJob();
  const r = (raw ?? {}) as Partial<Job>;
  return {
    name: typeof r.name === "string" ? r.name.slice(0, 80) : base.name,
    filamentId: typeof r.filamentId === "string" ? r.filamentId : base.filamentId,
    filamentPrice: num(r.filamentPrice, base.filamentPrice),
    grams: num(r.grams, base.grams),
    hours: num(r.hours, base.hours),
    minutes: num(r.minutes, base.minutes),
    qty: num(r.qty, base.qty),
    perPlate: num(r.perPlate, base.perPlate),
    supportGrams: num(r.supportGrams, base.supportGrams),
    supportPrice: num(r.supportPrice, base.supportPrice),
    prepMin: num(r.prepMin, base.prepMin),
    postMin: num(r.postMin, base.postMin),
    design: num(r.design, base.design),
    packaging: num(r.packaging, base.packaging),
    packagingPer: r.packagingPer === "piece" ? "piece" : "order",
    shipping: num(r.shipping, base.shipping),
    extras: normalizeExtras(r.extras),
    customPrice: num(r.customPrice, base.customPrice),
  };
}

export function normalizePersisted(raw: unknown): Persisted {
  const base = defaults();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<Persisted>;
  const profiles: Profile[] = [];
  if (Array.isArray(r.profiles)) {
    for (const item of r.profiles.slice(0, 12)) {
      if (!item || typeof item !== "object") continue;
      const it = item as Partial<Profile>;
      profiles.push({
        id: typeof it.id === "string" ? it.id : uid(),
        name: typeof it.name === "string" && it.name.trim() ? it.name.slice(0, 40) : "Profil",
        workshop: normalizeWorkshop(it.workshop),
      });
    }
  }
  const notes: Note[] = [];
  if (Array.isArray(r.notes)) {
    for (const item of r.notes.slice(0, 8)) {
      if (!item || typeof item !== "object") continue;
      const it = item as Partial<Note>;
      notes.push({
        id: typeof it.id === "string" ? it.id : uid(),
        at: typeof it.at === "string" ? it.at.slice(0, 40) : "",
        name: typeof it.name === "string" ? it.name.slice(0, 80) : "İş",
        price: typeof it.price === "string" ? it.price.slice(0, 40) : "",
        job: normalizeJob(it.job),
      });
    }
  }
  return {
    v: 1,
    workshop: normalizeWorkshop(r.workshop),
    job: normalizeJob(r.job),
    profiles,
    notes,
  };
}

const STORAGE_KEY = "baski-maliyet-v1";

export function loadPersisted(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    return normalizePersisted(JSON.parse(raw) as unknown);
  } catch {
    return defaults();
  }
}

export function savePersisted(data: Persisted): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* private mode / full storage — the session still works */
  }
}

export function burnRate(w: Workshop): Burn {
  const printerPerHour = w.printerLife > 0 ? Math.max(0, w.printerCost) / w.printerLife : 0;
  const nozzlePerHour = w.nozzleLife > 0 ? Math.max(0, w.nozzleCost) / w.nozzleLife : 0;
  const elecPerHour = (Math.max(0, w.watt) / 1000) * Math.max(0, w.elecRate);
  const peiPerPlate = w.peiLife > 0 ? Math.max(0, w.peiCost) / w.peiLife : 0;
  const realPerHour = printerPerHour + nozzlePerHour + elecPerHour;
  const pricedPerHour =
    (w.include.printer ? printerPerHour : 0) +
    (w.include.nozzle ? nozzlePerHour : 0) +
    (w.include.electricity ? elecPerHour : 0);
  return {
    printerPerHour,
    nozzlePerHour,
    elecPerHour,
    realPerHour,
    pricedPerHour,
    peiPerPlate,
    laborPerHour: Math.max(0, w.laborRate),
  };
}

export function laborAmount(job: Job, rate: number): number {
  const qty = Math.max(1, Math.round(job.qty || 1));
  const prep = (Math.max(0, job.prepMin) / 60) * Math.max(0, rate);
  const post = (Math.max(0, job.postMin) / 60) * Math.max(0, rate) * qty;
  return prep + post;
}

export function keptFraction(w: Workshop): number {
  const commission = w.include.commission ? Math.max(0, w.commissionRate) / 100 : 0;
  const taxPct = w.include.tax ? Math.max(0, w.taxRate) : 0;
  const tax = taxPct > 0 ? taxPct / (100 + taxPct) : 0;
  return 1 - commission - tax;
}

function emptyAnalysis(burn: Burn, fraction: number): Analysis {
  return {
    ready: false,
    missing: null,
    problem: null,
    burn,
    pieceHours: 0,
    totalHours: 0,
    plateCycles: 0,
    totalGrams: 0,
    kwh: 0,
    lines: [],
    production: 0,
    direct: 0,
    unitDirect: 0,
    filamentOnly: 0,
    linearDirect: 0,
    linearPriceRec: null,
    failExpected: 0,
    failLinear: 0,
    feeFraction: fraction,
    prices: null,
    commissionOnRec: 0,
    taxOnRec: 0,
    receivedOnRec: 0,
    profitOnRec: 0,
    marginOnRec: 0,
    netMultiplier: 0,
    unitRec: 0,
    dominantKey: null,
    excludedLabels: [],
    insights: [],
    ladder: [],
  };
}

function ladderQuantities(perPlate: number, current: number): number[] {
  const plate = Math.max(1, Math.round(perPlate || 1));
  const raw = [1, 2, 5, 10, plate, plate * 2, Math.max(1, Math.round(current || 1))];
  return [...new Set(raw.map((n) => Math.max(1, Math.round(n))).filter((n) => n <= 80))].sort((a, b) => a - b).slice(0, 6);
}

function compute(job: Job, workshop: Workshop): Analysis {
  const burn = burnRate(workshop);
  const fraction = keptFraction(workshop);
  const base = emptyAnalysis(burn, fraction);

  const qty = Math.max(1, Math.round(Number.isFinite(job.qty) ? job.qty : 1));
  const perPlate = Math.max(1, Math.round(Number.isFinite(job.perPlate) ? job.perPlate : 1));
  const pieceHours = Math.max(0, job.hours) + Math.max(0, job.minutes) / 60;
  const totalHours = pieceHours * qty;
  const grams = Math.max(0, job.grams);
  const totalGrams = grams * qty;
  const plateCycles = Math.ceil(qty / perPlate);

  const ready = grams > 0 && pieceHours > 0;
  let missing: string | null = null;
  if (!ready) {
    if (grams <= 0 && pieceHours <= 0) missing = "Dilimleyiciden gramı ve baskı süresini yaz.";
    else if (grams <= 0) missing = "Filament gramı eksik.";
    else missing = "Baskı süresi eksik. En az bir dakika yaz.";
  }

  let problem: string | null = null;
  if (workshop.failRate >= 100) {
    problem = "Başarısızlık %100 ise iyi parça çıkmaz. Oranı 80'in altında tut.";
  } else if (fraction <= 0) {
    problem = "Komisyon ve vergi birlikte tahsilatı yutuyor. Oranları düşür.";
  } else if (workshop.multiRec <= 0 || workshop.multiMin <= 0 || workshop.multiMax <= 0) {
    problem = "Satış çarpanları sıfırdan büyük olmalı.";
  }

  const materialCost = (totalGrams / 1000) * Math.max(0, job.filamentPrice);
  const supportGrams = Math.max(0, job.supportGrams) * qty;
  const supportCost = (supportGrams / 1000) * Math.max(0, job.supportPrice);
  const wasteCost = (materialCost + supportCost) * (Math.max(0, workshop.wasteRate) / 100);
  const kwh = totalHours * (Math.max(0, workshop.watt) / 1000);
  const elecCost = kwh * Math.max(0, workshop.elecRate);
  const printerCost = burn.printerPerHour * totalHours;
  const nozzleCost = burn.nozzlePerHour * totalHours;
  const peiCost = burn.peiPerPlate * plateCycles;
  const labor = laborAmount(job, workshop.laborRate);
  const design = Math.max(0, job.design);
  const packaging = Math.max(0, job.packaging) * (job.packagingPer === "piece" ? qty : 1);
  const shipping = Math.max(0, job.shipping);

  const filamentName = FILAMENTS.find((f) => f.id === job.filamentId)?.label ?? "Filament";

  const prod: Line[] = [
    {
      key: "material",
      label: "Hammadde",
      detail: `${formatNum(totalGrams, 2)} g ${filamentName} · ${formatTL(job.filamentPrice)}/kg`,
      amount: materialCost,
      included: workshop.include.material,
      group: "prod",
    },
    {
      key: "waste",
      label: "Fire payı",
      detail: `Hammadde ve desteğin %${formatNum(workshop.wasteRate, 0)} kadarı. Dilimleyici gramına ek.`,
      amount: wasteCost,
      included: workshop.include.waste,
      group: "prod",
    },
  ];

  if (supportGrams > 0) {
    prod.push({
      key: "support",
      label: "Destek filament",
      detail: `${formatNum(supportGrams, 2)} g · ${formatTL(job.supportPrice)}/kg. Aynı malzemenin desteğini ana grama yazma.`,
      amount: supportCost,
      included: workshop.include.support,
      group: "prod",
    });
  }

  prod.push(
    {
      key: "electricity",
      label: "Elektrik",
      detail: `${formatNum(kwh, 3)} kWh · ${formatNum(workshop.watt, 0)} W ortalama · ${formatTL(workshop.elecRate)}/kWh`,
      amount: elecCost,
      included: workshop.include.electricity,
      group: "prod",
    },
    {
      key: "printer",
      label: "Makine amortismanı",
      detail: `${formatTL(burn.printerPerHour)}/sa × ${formatDuration(totalHours)}`,
      amount: printerCost,
      included: workshop.include.printer,
      group: "prod",
    },
    {
      key: "nozzle",
      label: "Nozzle",
      detail: `${formatTL(burn.nozzlePerHour)}/sa × ${formatDuration(totalHours)}`,
      amount: nozzleCost,
      included: workshop.include.nozzle,
      group: "prod",
    },
    {
      key: "pei",
      label: "PEI plaka",
      detail: `${plateCycles} tabla × ${formatTL(burn.peiPerPlate)}. Süreye değil, döngüye yazılıyor.`,
      amount: peiCost,
      included: workshop.include.pei,
      group: "prod",
    },
  );

  const pieceExtras = job.extras.filter((e) => e.per === "piece");
  const orderExtras = job.extras.filter((e) => e.per !== "piece");
  for (const extra of pieceExtras) {
    prod.push({
      key: `extra:${extra.id}`,
      label: extra.name || "Ek kalem",
      detail: `${formatTL(extra.amount)} × ${qty} adet. Başarısız denemede de gider.`,
      amount: Math.max(0, extra.amount) * qty,
      included: true,
      group: "prod",
    });
  }

  const p = Math.max(0, workshop.failRate) / 100;
  const failBase = prod.filter((line) => line.included).reduce((sum, line) => sum + line.amount, 0);
  const failLinear = p > 0 && p < 1 ? failBase * p : 0;
  const failExpected = p > 0 && p < 1 ? failBase * (p / (1 - p)) : 0;
  prod.push({
    key: "fail",
    label: "Başarısız baskı",
    detail:
      p > 0 && p < 1
        ? `%${formatNum(workshop.failRate, 0)} → iyi tabla başına ${formatNum(1 / (1 - p), 2)} deneme. Düz yüzde değil.`
        : "Kapalı ya da sıfır.",
    amount: failExpected,
    included: workshop.include.fail && p > 0 && p < 1,
    group: "prod",
  });

  const work: Line[] = [
    {
      key: "labor",
      label: "İşçilik",
      detail: `Hazırlık ${formatNum(job.prepMin, 0)} dk bir kez + son işlem ${formatNum(job.postMin, 0)} dk × ${qty}. ${formatTL(workshop.laborRate, 0)}/sa.`,
      amount: labor,
      included: workshop.include.labor,
      group: "work",
    },
    {
      key: "design",
      label: "Tasarım",
      detail: "Siparişe bir kez. Adet artınca birim fiyat düşer.",
      amount: design,
      included: workshop.include.design,
      group: "work",
    },
    {
      key: "packaging",
      label: "Paketleme",
      detail: job.packagingPer === "piece" ? "Adet başı." : "Siparişe bir kez.",
      amount: packaging,
      included: workshop.include.packaging,
      group: "work",
    },
    {
      key: "shipping",
      label: "Kargo",
      detail: "Siparişe bir kez.",
      amount: shipping,
      included: workshop.include.shipping,
      group: "work",
    },
  ];

  for (const extra of orderExtras) {
    work.push({
      key: `extra:${extra.id}`,
      label: extra.name || "Ek kalem",
      detail: "Siparişe bir kez.",
      amount: Math.max(0, extra.amount),
      included: true,
      group: "work",
    });
  }

  const lines = [...prod, ...work].filter((line) => line.amount >= 0.005);
  const production = lines.filter((line) => line.group === "prod" && line.included).reduce((sum, line) => sum + line.amount, 0);
  const direct = lines.filter((line) => line.included).reduce((sum, line) => sum + line.amount, 0);
  const linearDirect = workshop.include.fail ? direct - failExpected + failLinear : direct;

  if (ready && !problem && direct <= 0) {
    problem = "Fiyata dahil hiçbir kalem yok. En azından hammaddeyi aç.";
  }

  const canPrice = ready && !problem && direct > 0 && fraction > 0;
  const prices = canPrice
    ? {
        min: ceilTL((direct * workshop.multiMin) / fraction),
        rec: ceilTL((direct * workshop.multiRec) / fraction),
        max: ceilTL((direct * workshop.multiMax) / fraction),
      }
    : null;

  const linearPriceRec = canPrice && Math.abs(fraction - 1) < 1e-9 ? ceilTL(linearDirect * workshop.multiRec) : null;

  const rec = prices?.rec ?? 0;
  const commissionOnRec = workshop.include.commission ? rec * (Math.max(0, workshop.commissionRate) / 100) : 0;
  const taxPct = workshop.include.tax ? Math.max(0, workshop.taxRate) : 0;
  const taxOnRec = taxPct > 0 ? rec * (taxPct / (100 + taxPct)) : 0;
  const receivedOnRec = rec - commissionOnRec - taxOnRec;
  const profitOnRec = receivedOnRec - direct;
  const marginOnRec = rec > 0 ? (profitOnRec / rec) * 100 : 0;
  const netMultiplier = direct > 0 ? receivedOnRec / direct : 0;

  const included = lines.filter((line) => line.included && line.amount > 0);
  const dominant = included.reduce<Line | null>((best, line) => (!best || line.amount > best.amount ? line : best), null);

  const excludedLabels = lines.filter((line) => !line.included && line.amount >= 0.5).map((line) => line.label);

  const insights: Insight[] = [];
  const laborLine = [...prod, ...work].find((line) => line.key === "labor");
  if (laborLine && !laborLine.included && laborLine.amount >= 1) {
    insights.push({
      id: "labor",
      tone: "warn",
      text: `İşçilik kapalı. Bu işte hazırlık ve son işlem ${formatTL(laborLine.amount)} — fiyat emeğini taşımıyor.`,
    });
  }
  const peiLine = prod.find((line) => line.key === "pei");
  if (peiLine && peiLine.included && perPlate > qty && direct > 0 && peiLine.amount > direct * 0.25) {
    insights.push({
      id: "plate",
      tone: "info",
      text: `Tabla ${perPlate} parça alır, sipariş ${qty} adet. Plaka payının tamamı bu parçaya yazılıyor. Tabla dolunca bu kalem bölünür.`,
    });
  }
  if (materialCost > 0 && direct > materialCost * 1.8) {
    insights.push({
      id: "illusion",
      tone: "info",
      text: `Yalnızca filament ${formatTL(materialCost)}. Doğrudan maliyet bunun ${formatNum(direct / materialCost, 1)} katı.`,
    });
  }
  if (dominant && direct > 0 && dominant.amount / direct >= 0.4 && !(dominant.key === "pei" && insights.some((i) => i.id === "plate"))) {
    insights.push({
      id: "dominant",
      tone: "info",
      text: `En büyük kalem ${dominant.label}. Maliyetin %${formatNum((dominant.amount / direct) * 100, 0)}'i.`,
    });
  }
  if (workshop.include.fail && workshop.failRate >= 20 && workshop.failRate < 100) {
    insights.push({
      id: "fail",
      tone: "warn",
      text: `Başarısızlık %${formatNum(workshop.failRate, 0)}. İyi tabla için ortalama ${formatNum(1 / (1 - workshop.failRate / 100), 2)} deneme gerekir.`,
    });
  }

  return {
    ...base,
    ready,
    missing,
    problem,
    pieceHours,
    totalHours,
    plateCycles: ready ? plateCycles : 0,
    totalGrams,
    kwh,
    lines: ready ? lines : [],
    production: ready ? production : 0,
    direct: ready ? direct : 0,
    unitDirect: ready && qty > 0 ? direct / qty : 0,
    filamentOnly: ready ? materialCost : 0,
    linearDirect: ready ? linearDirect : 0,
    linearPriceRec,
    failExpected,
    failLinear,
    prices,
    commissionOnRec,
    taxOnRec,
    receivedOnRec: prices ? receivedOnRec : 0,
    profitOnRec: prices ? profitOnRec : 0,
    marginOnRec: prices ? marginOnRec : 0,
    netMultiplier: prices ? netMultiplier : 0,
    unitRec: prices ? rec / qty : 0,
    dominantKey: ready ? (dominant?.key ?? null) : null,
    excludedLabels: ready ? excludedLabels : [],
    insights: ready ? insights.slice(0, 3) : [],
  };
}

export function quote(job: Job, workshop: Workshop): Analysis {
  const base = compute(job, workshop);
  if (!base.prices) return base;
  const ladder = ladderQuantities(job.perPlate, job.qty).map((qty) => {
    const next = compute({ ...job, qty }, workshop);
    return {
      qty,
      cycles: next.plateCycles,
      unit: next.unitRec,
      total: next.prices?.rec ?? 0,
    };
  });
  return { ...base, ladder };
}

export function judgePrice(price: number, analysis: Analysis): CustomJudge | null {
  if (!(price > 0) || !(analysis.direct > 0) || !(analysis.feeFraction > 0)) return null;
  const received = price * analysis.feeFraction;
  const profit = received - analysis.direct;
  const multiplier = received / analysis.direct;
  const margin = (profit / price) * 100;
  const perGram = analysis.totalGrams > 0 ? profit / analysis.totalGrams : 0;
  let tone: CustomJudge["tone"] = "good";
  let text: string;
  if (profit < 0) {
    tone = "bad";
    text = `Kesintilerden sonra ${formatTL(Math.abs(profit))} zarar. Bu fiyat tezgahı döndürmez.`;
  } else if (multiplier < 2) {
    tone = "warn";
    text = "Eline geçen, maliyetin iki katının altında. Aksilik ve emek için dar.";
  } else if (multiplier < 3) {
    tone = "warn";
    text = "İdare eder. Seri, risksiz işte kalabilir; tek parça özel işte sıkışır.";
  } else if (multiplier < 5) {
    text = "Maliyet kapanıyor, kâr da duruyor. Çoğu müşteri işi için sağlıklı bant.";
  } else {
    text = "Primli fiyat. Aciliyet, zahmet ya da az bulunan malzeme varsa yerinde.";
  }
  return { tone, text, profit, margin, multiplier, received, perGram };
}

export function buildQuote(job: Job, workshop: Workshop, analysis: Analysis): string {
  if (!analysis.prices) return "";
  const filament = FILAMENTS.find((f) => f.id === job.filamentId)?.label ?? "Filament";
  const qty = Math.max(1, Math.round(job.qty || 1));
  const lines = [
    job.name.trim() ? `3D baskı teklifi — ${job.name.trim()}` : "3D baskı teklifi",
    `${filament}, ${formatNum(analysis.totalGrams, 1)} g`,
    `Süre ${formatDuration(analysis.totalHours)} · ${qty} adet · ${analysis.plateCycles} tabla`,
    `Önerilen fiyat: ${formatTLInt(analysis.prices.rec)}`,
    qty > 1 ? `Adet başı: ${formatTLInt(analysis.unitRec)}` : "",
    `Doğrudan maliyet: ${formatTL(analysis.direct)}`,
    workshop.include.labor ? "İşçilik dahil." : "İşçilik dahil değil.",
    workshop.include.shipping && job.shipping > 0 ? "Kargo dahil." : "Kargo hariç.",
    workshop.include.commission || workshop.include.tax
      ? "Fiyat, seçili komisyon ve KDV elinde kalsın diye şişirildi."
      : "",
  ];
  return lines.filter(Boolean).join("\n");
}

export function feePreview(workshop: Workshop): { commission: number; tax: number; kept: number } {
  const price = 100;
  const commission = workshop.include.commission ? price * (Math.max(0, workshop.commissionRate) / 100) : 0;
  const taxPct = workshop.include.tax ? Math.max(0, workshop.taxRate) : 0;
  const tax = taxPct > 0 ? price * (taxPct / (100 + taxPct)) : 0;
  return { commission, tax, kept: price - commission - tax };
}
