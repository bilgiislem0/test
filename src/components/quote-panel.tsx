import { Copy, NotebookPen, Trash2 } from "lucide-react";
import { Button, NumField } from "@/components/fields";
import { judgePrice, type Analysis, type Job, type Note, type Workshop } from "@/lib/model";
import { formatMult, formatNum, formatTL, formatTLInt } from "@/lib/money";

export function QuotePanel({
  job,
  workshop,
  analysis,
  quoteText,
  notes,
  onCustom,
  onQty,
  onNote,
  onRestore,
  onDeleteNote,
  onCopy,
}: {
  job: Job;
  workshop: Workshop;
  analysis: Analysis;
  quoteText: string;
  notes: Note[];
  onCustom: (value: number) => void;
  onQty: (qty: number) => void;
  onNote: () => void;
  onRestore: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onCopy: () => void;
}) {
  const prices = analysis.prices;
  const prod = analysis.lines.filter((line) => line.group === "prod");
  const work = analysis.lines.filter((line) => line.group === "work");
  const segments = analysis.lines.filter((line) => line.included && line.amount > 0 && analysis.direct > 0);
  const judged = prices ? judgePrice(job.customPrice, analysis) : null;
  const showLegacy =
    prices &&
    analysis.linearPriceRec !== null &&
    Math.abs(analysis.linearDirect - analysis.direct) >= 0.05;
  const ladderFlat =
    analysis.ladder.length > 1 && Math.max(...analysis.ladder.map((row) => row.unit)) - Math.min(...analysis.ladder.map((row) => row.unit)) < 0.5;

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl bg-plate p-5 text-copper-ink sm:p-6">
        <div className="flex items-center justify-between gap-3 text-xs tracking-widest text-plate-muted uppercase">
          <span>Önerilen satış</span>
          <span>Hedef {formatMult(workshop.multiRec)}</span>
        </div>
        <p className="mt-3 font-display text-5xl leading-none tabular-nums sm:text-6xl" aria-live="polite">
          {prices ? formatTLInt(prices.rec) : "—"}
        </p>
        {prices ? (
          <>
            <p className="mt-3 text-sm text-plate-muted">
              {Math.round(job.qty) > 1 ? `Adet başı ${formatTL(analysis.unitRec)} · ` : ""}
              Eline geçen {formatTL(analysis.receivedOnRec)} · marj %{formatNum(analysis.marginOnRec, 1)} · {formatMult(analysis.netMultiplier)}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-plate-line pt-4">
              <div>
                <div className="text-xs text-plate-muted">Minimum</div>
                <div className="font-display text-2xl tabular-nums">{formatTLInt(prices.min)}</div>
                <div className="text-xs text-plate-muted">{formatMult(workshop.multiMin)}</div>
              </div>
              <div>
                <div className="text-xs text-plate-muted">Premium</div>
                <div className="font-display text-2xl tabular-nums">{formatTLInt(prices.max)}</div>
                <div className="text-xs text-plate-muted">{formatMult(workshop.multiMax)}</div>
              </div>
            </div>
            {analysis.excludedLabels.length > 0 ? (
              <p className="mt-4 text-xs leading-relaxed text-plate-muted">Hariç: {analysis.excludedLabels.join(", ")}</p>
            ) : null}
          </>
        ) : (
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-plate-muted">
            {analysis.problem ?? analysis.missing ?? "Gram ve süre yazılınca fiyat burada kurulur."}
          </p>
        )}
      </section>

      {analysis.problem && analysis.ready ? (
        <p className="rounded-xl bg-bad-bg px-4 py-3 text-sm text-bad">{analysis.problem}</p>
      ) : null}

      {prices ? (
        <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <h2 className="font-display text-2xl">Maliyet dökümü</h2>
          <p className="mt-1 text-sm text-muted">
            Cebinden çıkan {formatTL(analysis.direct)}
            {Math.round(job.qty) > 1 ? ` · adet başı ${formatTL(analysis.unitDirect)}` : ""}. Vergi ve komisyon bu toplama eklenmez, satışın içinden düşülür.
          </p>

          {segments.length > 0 ? (
            <div className="mt-4" aria-hidden>
              <div className="flex h-3 overflow-hidden rounded-full bg-inset">
                {segments.map((line) => (
                  <div
                    key={line.key}
                    className={`h-full ${line.key === analysis.dominantKey ? "bg-copper" : "bg-ink"}`}
                    style={{ width: `${(line.amount / analysis.direct) * 100}%` }}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">Bakır dilim en büyük kalem.</p>
            </div>
          ) : null}

          <LineList lines={prod} />
          {prod.length > 0 ? (
            <div className="flex items-center justify-between border-t border-dashed border-line py-2 text-sm">
              <span className="font-medium">Üretim</span>
              <span className="tabular-nums font-medium">{formatTL(analysis.production)}</span>
            </div>
          ) : null}
          <LineList lines={work} />
          <div className="mt-1 flex items-center justify-between border-t border-ink pt-3">
            <span className="font-semibold">Doğrudan maliyet</span>
            <span className="tabular-nums text-lg font-semibold">{formatTL(analysis.direct)}</span>
          </div>

          {(workshop.include.commission && workshop.commissionRate > 0) || (workshop.include.tax && workshop.taxRate > 0) ? (
            <div className="mt-4 rounded-xl bg-inset p-3 text-sm">
              <p className="font-medium">Önerilen fiyattan düşen</p>
              {workshop.include.commission && workshop.commissionRate > 0 ? (
                <Row label="Komisyon" value={formatTL(analysis.commissionOnRec)} />
              ) : null}
              {workshop.include.tax && workshop.taxRate > 0 ? <Row label="Vergi" value={formatTL(analysis.taxOnRec)} /> : null}
              <Row label="Eline geçen" value={formatTL(analysis.receivedOnRec)} />
              <Row label="Kâr" value={formatTL(analysis.profitOnRec)} />
            </div>
          ) : (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-muted">
                <span>Kâr marjı, satış fiyatı üzerinden</span>
                <span className="tabular-nums">%{formatNum(analysis.marginOnRec, 1)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-inset">
                <div
                  className={`h-full ${analysis.profitOnRec < 0 ? "bg-bad" : analysis.marginOnRec < 45 ? "bg-warn" : "bg-good"}`}
                  style={{ width: `${analysis.profitOnRec < 0 ? 100 : Math.max(0, Math.min(100, analysis.marginOnRec))}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>Maliyet {formatTL(analysis.direct)}</span>
                <span>Kâr {formatTL(analysis.profitOnRec)}</span>
              </div>
            </div>
          )}

          {showLegacy ? (
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Eski dosyandaki düz yüzde ile başarısızlık {formatTL(analysis.failLinear)}, maliyet {formatTL(analysis.linearDirect)}, fiyat{" "}
              {formatTLInt(analysis.linearPriceRec ?? 0)}. Beklenen deneme sayısı bunu {formatTL(analysis.failExpected)} yapıyor.
            </p>
          ) : null}
        </section>
      ) : null}

      {analysis.insights.length > 0 ? (
        <section className="flex flex-col gap-3" aria-label="Okuma">
          {analysis.insights.map((insight) => (
            <p
              key={insight.id}
              className={`border-l-2 pl-3 text-sm leading-relaxed text-ink ${
                insight.tone === "warn" ? "border-warn" : insight.tone === "good" ? "border-good" : "border-copper"
              }`}
            >
              {insight.text}
            </p>
          ))}
        </section>
      ) : null}

      {analysis.ladder.length > 0 ? (
        <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <h2 className="font-display text-2xl">Adet cetveli</h2>
          <p className="mt-1 text-sm text-muted">
            {ladderFlat
              ? "Bu ayarlarda adet arttıkça birim fiyat düşmüyor. Tabla kapasitesi, işçilik, tasarım, paket veya kargo paylaşılırsa düşer."
              : "Birim fiyat düşüyor: tabla, hazırlık veya sipariş kalemleri paylaşılıyor. Filament ve elektrik adetle doğru orantılı gider."}
          </p>
          <div className="mt-3 grid grid-cols-[4.5rem_4.5rem_1fr] gap-2 text-xs text-muted">
            <span>Adet</span>
            <span>Tabla</span>
            <span className="text-right">Önerilen</span>
          </div>
          <ul className="mt-1">
            {analysis.ladder.map((row) => {
              const current = Math.max(1, Math.round(job.qty || 1)) === row.qty;
              return (
                <li key={row.qty}>
                  <button
                    type="button"
                    onClick={() => onQty(row.qty)}
                    className={`grid h-11 w-full grid-cols-[4.5rem_4.5rem_1fr] items-center gap-2 rounded-lg px-1 text-left text-sm tabular-nums ${
                      current ? "bg-inset font-semibold" : ""
                    }`}
                  >
                    <span>{row.qty}</span>
                    <span>{row.cycles}</span>
                    <span className="text-right">
                      {formatTLInt(row.total)}
                      {row.qty > 1 ? <span className="ml-2 font-normal text-muted">{formatTL(row.unit)}/ad</span> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {prices ? (
        <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <h2 className="font-display text-2xl">Kendi fiyatın</h2>
          <div className="mt-3">
            <NumField
              emptyZero
              label="Kendi satış fiyatın"
              placeholder="Fiyat yaz"
              value={job.customPrice}
              onChange={onCustom}
            />
          </div>
          {judged ? (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Eline geçen" value={formatTL(judged.received)} />
                <Stat label="Kâr" value={formatTL(judged.profit)} tone={judged.profit >= 0 ? "good" : "bad"} />
                <Stat label="Marj" value={`%${formatNum(judged.margin, 1)}`} />
                <Stat label="Çarpan" value={formatMult(judged.multiplier)} />
                <Stat label="Gram başı kâr" value={`${formatNum(judged.perGram, 2)} TL/g`} />
              </div>
              <p
                className={`mt-3 rounded-xl px-3 py-3 text-sm ${
                  judged.tone === "bad" ? "bg-bad-bg text-bad" : judged.tone === "warn" ? "bg-warn-bg text-warn" : "bg-good-bg text-good"
                }`}
              >
                {judged.text}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Yazdığın fiyat, kesintilerden sonra eline geçene göre okunur.</p>
          )}
        </section>
      ) : null}

      {quoteText ? (
        <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl">Müşteri metni</h2>
            <div className="flex gap-2">
              <Button onClick={onNote}>
                <NotebookPen className="size-4" aria-hidden />
                Not et
              </Button>
              <Button tone="solid" onClick={onCopy}>
                <Copy className="size-4" aria-hidden />
                Kopyala
              </Button>
            </div>
          </div>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">{quoteText}</pre>
        </section>
      ) : null}

      {notes.length > 0 ? (
        <section>
          <h2 className="font-display text-xl">Not edilen işler</h2>
          <ul className="mt-2 flex flex-col gap-2">
            {notes.map((note) => (
              <li key={note.id} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
                <button type="button" className="min-w-0 flex-1 py-1 text-left" onClick={() => onRestore(note.id)}>
                  <span className="block truncate text-sm font-medium">{note.name}</span>
                  <span className="text-xs text-muted">
                    {note.at} · {note.price}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Notu sil"
                  className="grid size-11 place-items-center rounded-xl"
                  onClick={() => onDeleteNote(note.id)}
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function LineList({ lines }: { lines: Analysis["lines"] }) {
  if (lines.length === 0) return null;
  return (
    <ul>
      {lines.map((line) => (
        <li key={line.key} className="flex items-start justify-between gap-3 border-b border-line py-2.5 last:border-b-0">
          <div className="min-w-0">
            <div className={`text-sm font-medium ${line.included ? "text-ink" : "text-muted line-through"}`}>{line.label}</div>
            <div className="text-xs leading-relaxed text-muted">{line.detail}</div>
          </div>
          <div className="shrink-0 text-right">
            <div className={`text-sm font-medium tabular-nums ${line.included ? "text-ink" : "text-muted"}`}>{formatTL(line.amount)}</div>
            {line.included ? null : <div className="text-xs text-muted">hariç</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-1 flex items-center justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  const color = tone === "bad" ? "text-bad" : tone === "good" ? "text-good" : "text-ink";
  return (
    <div className="rounded-xl bg-inset px-3 py-2">
      <div className="text-xs text-muted">{label}</div>
      <div className={`text-sm font-semibold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

export function MethodNote() {
  return (
    <details className="mt-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <summary className="text-sm font-semibold">Hesap nasıl kuruluyor</summary>
      <ul className="mt-3 flex list-disc flex-col gap-2 pl-4 text-sm leading-relaxed text-muted">
        <li>Hammadde = gram × adet / 1000 × kilogram fiyatı.</li>
        <li>Fire, hammadde ve destek tutarının yüzde kadarıdır. Dilimleyici bu gramı zaten verdiyse oranı düşür, yoksa iki kez yazılır.</li>
        <li>Elektrik = baskı saati × (ortalama watt / 1000) × kWh fiyatı. Güç kaynağı etiketi değil, baskı ortalaması. Isınma o ortalamanın içinde varsayılır; çok kısa işlerde elektrik bir miktar eksik kalabilir.</li>
        <li>Makine = yazıcı fiyatı / ömür saati × baskı saati. Nozzle aynı mantık.</li>
        <li>PEI = plaka fiyatı / ömür baskı sayısı × tabla döngüsü. Döngü, adet bölü tabla kapasitesinin yukarı yuvarlağıdır. Süreye bağlı değildir.</li>
        <li>Başarısızlık, değişken üretimin düz yüzdesi değildir. Oran p ise ek maliyet = taban × p / (1 − p). %10, iyi tabla başına 1,11 deneme demektir. Eski dosya burada düz %10 ekliyordu ve yüksek oranda eksik yazıyordu. İşçilik, tasarım, paket ve kargo bu çarpana girmez.</li>
        <li>Eski dosyada kapattığın bir kalem, başarısızlık tutarının içinde kalabiliyordu. Artık yalnız dahil edilen üretim kalemleri riske girer.</li>
        <li>İşçilik = hazırlık bir kez + son işlem × adet, saatliğe bölünür.</li>
        <li>Satış fiyatı, doğrudan maliyet × çarpan / kalan orandır ve liraya yukarı yuvarlanır. Kalan oran = 1 − komisyon − KDV / (100 + KDV). Komisyon müşterinin ödediği tutardandır. KDV fiyata dahildir.</li>
        <li>Kâr marjı = kâr / satış fiyatı. Çarpan = kesintiden sonra eline geçen / doğrudan maliyet.</li>
      </ul>
    </details>
  );
}
