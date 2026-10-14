import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/fields";
import { CostForm } from "@/components/cost-form";
import { MethodNote, QuotePanel } from "@/components/quote-panel";
import { formatTL } from "@/lib/money";
import {
  applyExample,
  buildQuote,
  defaults,
  loadPersisted,
  normalizePersisted,
  quote,
  savePersisted,
  uid,
  type Extra,
  type IncludeKey,
  type Job,
  type Persisted,
  type Workshop,
} from "@/lib/model";

export function Calculator() {
  const [data, setData] = useState<Persisted>(defaults);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    setData(loadPersisted());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePersisted(data);
  }, [data, hydrated]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        savePersisted(dataRef.current);
        flash("Bu tarayıcıya kaydedildi.");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  }

  function patchJob(patch: Partial<Job>) {
    setData((current) => ({ ...current, job: { ...current.job, ...patch } }));
  }

  function patchWorkshop(patch: Partial<Workshop>) {
    setData((current) => ({ ...current, workshop: { ...current.workshop, ...patch } }));
  }

  function patchInclude(key: IncludeKey, value: boolean) {
    setData((current) => ({
      ...current,
      workshop: { ...current.workshop, include: { ...current.workshop.include, [key]: value } },
    }));
  }

  const analysis = useMemo(() => quote(data.job, data.workshop), [data.job, data.workshop]);
  const quoteText = buildQuote(data.job, data.workshop, analysis);
  const burn = analysis.burn;

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="h-1.5 bg-copper" />
      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-6 pb-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-2 flex flex-col gap-1" aria-hidden>
            <span className="block h-1 w-8 rounded-full bg-copper" />
            <span className="block h-1 w-8 rounded-full bg-ink" />
            <span className="block h-1 w-5 rounded-full bg-copper" />
          </div>
          <div>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">Atölye defteri</p>
            <h1 className="font-display text-4xl leading-none sm:text-5xl">3D baskı maliyeti</h1>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Filament fiyatı işin küçük kısmı. Saatlik yanma, tabla, fire ve başarısız deneme de yazılır.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => patchJob(applyExample(data.job))}>Örnek iş</Button>
          {confirmReset ? (
            <Button
              tone="solid"
              onClick={() => {
                setData(defaults());
                setConfirmReset(false);
                flash("Dosyandaki başlangıca dönüldü.");
              }}
            >
              Eminim, sıfırla
            </Button>
          ) : (
            <Button onClick={() => setConfirmReset(true)}>
              <RotateCcw className="size-4" aria-hidden />
              Sıfırla
            </Button>
          )}
        </div>
      </header>

      {notice ? (
        <p className="mx-auto mt-3 max-w-6xl px-4 text-sm text-copper-deep" role="status">
          {notice}
        </p>
      ) : null}

      <main className="mx-auto max-w-6xl px-4 pt-4 pb-16">
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4" aria-label="Tezgahın saatlik yanması">
          <BurnCell
            label="Makine"
            value={formatTL(burn.printerPerHour)}
            note={data.workshop.include.printer ? "Saatlik, fiyata dahil" : "Saatlik, şu an hariç"}
          />
          <BurnCell
            label="Nozzle"
            value={formatTL(burn.nozzlePerHour)}
            note={data.workshop.include.nozzle ? "Saatlik, fiyata dahil" : "Saatlik, şu an hariç"}
          />
          <BurnCell
            label="Elektrik"
            value={formatTL(burn.elecPerHour)}
            note={data.workshop.include.electricity ? "Saatlik, fiyata dahil" : "Saatlik, şu an hariç"}
          />
          <BurnCell
            label="Tabla"
            value={formatTL(burn.peiPerPlate)}
            note={data.workshop.include.pei ? "Her döngü, fiyata dahil" : "Her döngü, şu an hariç"}
          />
        </section>

        <div className="sticky top-0 z-20 -mx-4 mt-4 border-b border-line bg-bg px-4 py-3 lg:hidden">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs tracking-widest text-muted uppercase">Önerilen</span>
            <span className="font-display text-4xl leading-none tabular-nums">
              {analysis.prices ? formatTL(analysis.prices.rec, 0) : "—"}
            </span>
          </div>
        </div>

        <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
          <div className="min-w-0">
            <CostForm
              job={data.job}
              workshop={data.workshop}
              profiles={data.profiles}
              onJob={patchJob}
              onWorkshop={patchWorkshop}
              onInclude={patchInclude}
              onSaveProfile={(name) => {
                setData((current) => ({
                  ...current,
                  profiles: [{ id: uid(), name, workshop: current.workshop }, ...current.profiles].slice(0, 12),
                }));
                flash("Profil kaydedildi.");
              }}
              onLoadProfile={(id) => {
                const profile = data.profiles.find((item) => item.id === id);
                if (!profile) return;
                setData((current) => ({ ...current, workshop: profile.workshop }));
                flash(`${profile.name} yüklendi.`);
              }}
              onDeleteProfile={(id) => {
                setData((current) => ({ ...current, profiles: current.profiles.filter((item) => item.id !== id) }));
              }}
              onExport={() => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "baski-maliyet-ayarlari.json";
                link.click();
                URL.revokeObjectURL(url);
                flash("Ayar dosyası indirildi.");
              }}
              onImport={(file) => {
                file
                  .text()
                  .then((text) => {
                    setData(normalizePersisted(JSON.parse(text) as unknown));
                    flash("Ayar dosyası yüklendi.");
                  })
                  .catch(() => flash("Dosya okunamadı."));
              }}
              onAddExtra={(name, amount) => {
                const extra: Extra = { id: uid(), name, amount, per: "piece" };
                setData((current) => ({ ...current, job: { ...current.job, extras: [...current.job.extras, extra].slice(0, 12) } }));
              }}
              onPatchExtra={(id, patch) => {
                setData((current) => ({
                  ...current,
                  job: {
                    ...current.job,
                    extras: current.job.extras.map((extra) => (extra.id === id ? { ...extra, ...patch } : extra)),
                  },
                }));
              }}
              onRemoveExtra={(id) => {
                setData((current) => ({
                  ...current,
                  job: { ...current.job, extras: current.job.extras.filter((extra) => extra.id !== id) },
                }));
              }}
            />
          </div>
          <div className="min-w-0 lg:sticky lg:top-4">
            <QuotePanel
              job={data.job}
              workshop={data.workshop}
              analysis={analysis}
              quoteText={quoteText}
              notes={data.notes}
              onCustom={(customPrice) => patchJob({ customPrice })}
              onQty={(qty) => patchJob({ qty })}
              onNote={() => {
                if (!analysis.prices) return;
                const note = {
                  id: uid(),
                  at: new Date().toLocaleString("tr-TR"),
                  name: data.job.name.trim() || "Adsız iş",
                  price: formatTL(analysis.prices.rec, 0),
                  job: data.job,
                };
                setData((current) => ({ ...current, notes: [note, ...current.notes].slice(0, 8) }));
                flash("İş not edildi.");
              }}
              onRestore={(id) => {
                const note = data.notes.find((item) => item.id === id);
                if (!note) return;
                setData((current) => ({ ...current, job: note.job }));
                flash("Not edilen iş geri geldi.");
              }}
              onDeleteNote={(id) => {
                setData((current) => ({ ...current, notes: current.notes.filter((item) => item.id !== id) }));
              }}
              onCopy={() => {
                if (!quoteText) return;
                navigator.clipboard
                  .writeText(quoteText)
                  .then(() => flash("Teklif panoya kopyalandı."))
                  .catch(() => flash("Kopyalanamadı. Metni seçebilirsin."));
              }}
            />
          </div>
        </div>
        <MethodNote />
        <p className="mt-6 text-center text-xs leading-relaxed text-muted">
          Tavsiye niteliğindedir. Elektrik, nozzle ve plaka rakamları senin girdiğin tezgah ayarıdır — eski dosyandaki 4,50 TL/kWh ve 120 W başlangıç olarak duruyor.
          Ayarlar bu tarayıcıda saklanır. Ctrl+S de aynı yere yazar.
        </p>
      </main>
    </div>
  );
}

function BurnCell({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 font-display text-xl leading-none tabular-nums sm:text-2xl">{value}</div>
      <div className="mt-1 text-xs text-muted">{note}</div>
    </div>
  );
}
