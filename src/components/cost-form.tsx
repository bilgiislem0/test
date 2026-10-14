import { Download, Trash2, Upload } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Button, Field, IncludeButton, NumField, SelectField, Stepper } from "@/components/fields";
import {
  FILAMENTS,
  PRINTERS,
  feePreview,
  laborAmount,
  type IncludeKey,
  type Job,
  type Profile,
  type Workshop,
} from "@/lib/model";
import { formatTL } from "@/lib/money";

const TABS = [
  { id: "job", label: "İş" },
  { id: "shop", label: "Atölye" },
  { id: "sale", label: "Satış" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CHIPS = [
  { name: "Insert", amount: 4 },
  { name: "Mıknatıs", amount: 6 },
  { name: "Boya", amount: 8 },
  { name: "Vida", amount: 3 },
];

export function CostForm({
  job,
  workshop,
  profiles,
  onJob,
  onWorkshop,
  onInclude,
  onSaveProfile,
  onLoadProfile,
  onDeleteProfile,
  onExport,
  onImport,
  onAddExtra,
  onPatchExtra,
  onRemoveExtra,
}: {
  job: Job;
  workshop: Workshop;
  profiles: Profile[];
  onJob: (patch: Partial<Job>) => void;
  onWorkshop: (patch: Partial<Workshop>) => void;
  onInclude: (key: IncludeKey, value: boolean) => void;
  onSaveProfile: (name: string) => void;
  onLoadProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onAddExtra: (name: string, amount: number) => void;
  onPatchExtra: (id: string, patch: Partial<Job["extras"][number]>) => void;
  onRemoveExtra: (id: string) => void;
}) {
  const [tab, setTab] = useState<TabId>("job");
  const [profileName, setProfileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const preview = feePreview(workshop);
  const labor = laborAmount(job, workshop.laborRate);
  const qty = Math.max(1, Math.round(job.qty || 1));

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div role="tablist" aria-label="Hesap bölümleri" className="grid grid-cols-3 gap-1 rounded-xl bg-inset p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            className={`h-11 rounded-lg text-sm font-medium ${tab === item.id ? "bg-surface text-ink" : "text-muted"}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "job" ? (
        <div role="tabpanel" id="panel-job" aria-labelledby="tab-job" className="mt-4">
          <Field label="Parça adı" hint="Teklif metninde görünür. Boş bırakabilirsin.">
            <input
              className="field"
              aria-label="Parça adı"
              maxLength={80}
              value={job.name}
              placeholder="Örn. kapak, aparat, yedek parça"
              onChange={(e) => onJob({ name: e.target.value })}
            />
          </Field>

          <Block
            title="Hammadde"
            detail="Dilimleyicinin yazdığı gram. Destek aynı filamenttaysa o gramın içindedir."
            included={workshop.include.material}
            onIncluded={(value) => onInclude("material", value)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Filament">
                <SelectField
                  label="Filament tipi"
                  value={job.filamentId}
                  onChange={(id) => {
                    const found = FILAMENTS.find((item) => item.id === id);
                    onJob({ filamentId: id, ...(found && found.price > 0 ? { filamentPrice: found.price } : {}) });
                  }}
                  options={FILAMENTS.map((item) => ({ value: item.id, label: item.label }))}
                />
              </Field>
              <Field label="Kg fiyatı" hint="Senin son bobin fiyatın. Katalog değil.">
                <NumField label="Filament kilogram fiyatı" value={job.filamentPrice} onChange={(filamentPrice) => onJob({ filamentPrice })} />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Harcanan filament, adet başı gram">
                <NumField emptyZero label="Gram" value={job.grams} maxDecimals={2} onChange={(grams) => onJob({ grams })} />
              </Field>
            </div>
          </Block>

          <div className="border-t border-line py-4">
            <h3 className="text-sm font-semibold">Baskı süresi, adet başı</h3>
            <p className="mt-1 text-xs text-muted">Dilimleyicinin verdiği süre. Isınmayı ayrıca ekleme; gücü ortalamadan yaz.</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Saat">
                <NumField integer label="Saat" value={job.hours} onChange={(hours) => onJob({ hours })} />
              </Field>
              <Field label="Dakika">
                <NumField
                  integer
                  label="Dakika"
                  value={job.minutes}
                  onChange={(minutes) => {
                    if (minutes >= 60) {
                      onJob({ hours: job.hours + Math.floor(minutes / 60), minutes: minutes % 60 });
                    } else onJob({ minutes });
                  }}
                />
              </Field>
            </div>
          </div>

          <div className="border-t border-line py-4">
            <h3 className="text-sm font-semibold">Adet ve tabla</h3>
            <p className="mt-1 text-xs text-muted">Plaka yıpranması parça başına değil, tabla döngüsü başına yazılır.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Adet">
                <Stepper label="Adet" value={job.qty} min={1} max={999} onChange={(qty) => onJob({ qty })} />
              </Field>
              <Field label="Bir tablaya sığan">
                <Stepper label="Tabla kapasitesi" value={job.perPlate} min={1} max={99} onChange={(perPlate) => onJob({ perPlate })} />
              </Field>
            </div>
          </div>

          <Block
            title="İkinci filament"
            detail="Yalnızca farklı malzeme: PVA, arayüz, çok renk. Aynı filamentin desteğini buraya yazma."
            included={workshop.include.support}
            onIncluded={(value) => onInclude("support", value)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Destek gramı, adet başı">
                <NumField label="Destek gramı" value={job.supportGrams} onChange={(supportGrams) => onJob({ supportGrams })} />
              </Field>
              <Field label="Destek kg fiyatı">
                <NumField label="Destek kilogram fiyatı" value={job.supportPrice} onChange={(supportPrice) => onJob({ supportPrice })} />
              </Field>
            </div>
          </Block>
        </div>
      ) : null}

      {tab === "shop" ? (
        <div role="tabpanel" id="panel-shop" aria-labelledby="tab-shop" className="mt-2">
          <div className="border-b border-line py-4">
            <Field label="Yazıcı profili" hint="Profil fiyat, ömür ve ortalama gücü doldurur. Piyasa rakamı değil, başlangıç. Nozzle ve plaka ayrı.">
              <SelectField
                label="Yazıcı profili"
                value={workshop.printerId}
                onChange={(id) => {
                  const found = PRINTERS.find((item) => item.id === id);
                  if (!found) return;
                  onWorkshop({
                    printerId: id,
                    ...(id === "ozel" ? {} : { watt: found.watt, printerCost: found.cost, printerLife: found.life }),
                  });
                }}
                options={PRINTERS.map((item) => ({ value: item.id, label: item.label }))}
              />
            </Field>
          </div>

          <Block
            title="Elektrik"
            detail="Güç, baskı sırasındaki ortalama çekiştir. Güç kaynağının üzerindeki watt değil."
            included={workshop.include.electricity}
            onIncluded={(value) => onInclude("electricity", value)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="kWh fiyatı">
                <NumField
                  label="Elektrik birim fiyatı"
                  value={workshop.elecRate}
                  onChange={(elecRate) => onWorkshop({ elecRate })}
                />
              </Field>
              <Field label="Ortalama güç, watt">
                <NumField
                  integer
                  label="Ortalama güç"
                  value={workshop.watt}
                  onChange={(watt) => onWorkshop({ watt, printerId: "ozel" })}
                />
              </Field>
            </div>
          </Block>

          <Block
            title="Makine"
            detail="Alış fiyatı bölü tahmin ettiğin ömür saati, baskı saatiyle çarpılır."
            included={workshop.include.printer}
            onIncluded={(value) => onInclude("printer", value)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Yazıcı fiyatı">
                <NumField
                  label="Yazıcı fiyatı"
                  value={workshop.printerCost}
                  onChange={(printerCost) => onWorkshop({ printerCost, printerId: "ozel" })}
                />
              </Field>
              <Field label="Ömür, saat">
                <NumField
                  integer
                  label="Yazıcı ömrü"
                  value={workshop.printerLife}
                  onChange={(printerLife) => onWorkshop({ printerLife, printerId: "ozel" })}
                />
              </Field>
            </div>
          </Block>

          <Block
            title="Nozzle"
            detail="Pirinç, düz PLA'da uzun gider. Karbon dolgulu filament ömrü ciddi kısar."
            included={workshop.include.nozzle}
            onIncluded={(value) => onInclude("nozzle", value)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nozzle fiyatı">
                <NumField label="Nozzle fiyatı" value={workshop.nozzleCost} onChange={(nozzleCost) => onWorkshop({ nozzleCost })} />
              </Field>
              <Field label="Ömür, saat">
                <NumField integer label="Nozzle ömrü" value={workshop.nozzleLife} onChange={(nozzleLife) => onWorkshop({ nozzleLife })} />
              </Field>
            </div>
          </Block>

          <Block
            title="PEI plaka"
            detail="Her tabla döngüsü bir baskı sayılır. Süre uzadıkça artmaz; dolu tabla birim fiyatı düşürür."
            included={workshop.include.pei}
            onIncluded={(value) => onInclude("pei", value)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Plaka fiyatı">
                <NumField label="PEI plaka fiyatı" value={workshop.peiCost} onChange={(peiCost) => onWorkshop({ peiCost })} />
              </Field>
              <Field label="Ömür, baskı sayısı">
                <NumField integer label="PEI ömrü" value={workshop.peiLife} onChange={(peiLife) => onWorkshop({ peiLife })} />
              </Field>
            </div>
          </Block>

          <Block
            title="Fire payı"
            detail="Etek, kule, temizleme. Dilimleyici bunları grama kattıysa oranı düşür, yoksa iki kez yazılır."
            included={workshop.include.waste}
            onIncluded={(value) => onInclude("waste", value)}
          >
            <Field label="Fire oranı, yüzde">
              <NumField label="Fire oranı" value={workshop.wasteRate} onChange={(wasteRate) => onWorkshop({ wasteRate })} />
            </Field>
          </Block>

          <Block
            title="Başarısız baskı"
            detail="Düz yüzde eklenmez. %10, iyi tabla çıkana kadar ortalama 1,11 deneme demektir."
            included={workshop.include.fail}
            onIncluded={(value) => onInclude("fail", value)}
          >
            <Field label="Başarısızlık oranı, yüzde">
              <NumField label="Başarısızlık oranı" value={workshop.failRate} onChange={(failRate) => onWorkshop({ failRate: Math.min(100, failRate) })} />
            </Field>
          </Block>

          <div className="border-t border-line py-4">
            <h3 className="text-sm font-semibold">Kayıtlı profiller</h3>
            <p className="mt-1 text-xs text-muted">Atölye ayarı bu tarayıcıda durur. Dosyaya da indirebilirsin.</p>
            {profiles.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2">
                {profiles.map((profile) => (
                  <li key={profile.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      className="h-11 min-w-0 flex-1 truncate rounded-xl border border-line px-3 text-left text-sm"
                      onClick={() => onLoadProfile(profile.id)}
                    >
                      {profile.name}
                    </button>
                    <button
                      type="button"
                      aria-label={`${profile.name} profilini sil`}
                      className="grid size-11 place-items-center rounded-xl border border-line"
                      onClick={() => onDeleteProfile(profile.id)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                className="field"
                aria-label="Profil adı"
                placeholder="Profil adı"
                maxLength={40}
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <Button
                tone="quiet"
                disabled={!profileName.trim()}
                onClick={() => {
                  onSaveProfile(profileName.trim());
                  setProfileName("");
                }}
              >
                Profil kaydet
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={onExport}>
                <Download className="size-4" aria-hidden />
                Ayarları indir
              </Button>
              <Button onClick={() => fileRef.current?.click()}>
                <Upload className="size-4" aria-hidden />
                Ayar yükle
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="sr-only"
                aria-label="Ayar dosyası yükle"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImport(file);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {tab === "sale" ? (
        <div role="tabpanel" id="panel-sale" aria-labelledby="tab-sale" className="mt-2">
          <Block
            title="İşçilik"
            detail={`Hazırlık ${job.prepMin} dk siparişte bir kez, son işlem ${job.postMin} dk × ${qty} adet. Bu iş: ${formatTL(labor)}.`}
            included={workshop.include.labor}
            onIncluded={(value) => onInclude("labor", value)}
          >
            <Field label="Saatlik ücret">
              <NumField label="Saatlik işçilik" value={workshop.laborRate} onChange={(laborRate) => onWorkshop({ laborRate })} />
            </Field>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Hazırlık, dakika">
                <NumField integer label="Hazırlık dakikası" value={job.prepMin} onChange={(prepMin) => onJob({ prepMin })} />
              </Field>
              <Field label="Son işlem, dakika">
                <NumField integer label="Son işlem dakikası" value={job.postMin} onChange={(postMin) => onJob({ postMin })} />
              </Field>
            </div>
          </Block>

          <Block
            title="Tasarım"
            detail="Modele bir kez yazılır. Adet arttıkça birime bölünür."
            included={workshop.include.design}
            onIncluded={(value) => onInclude("design", value)}
          >
            <Field label="Tasarım bedeli">
              <NumField label="Tasarım bedeli" value={job.design} onChange={(design) => onJob({ design })} />
            </Field>
          </Block>

          <Block
            title="Paketleme"
            detail={job.packagingPer === "piece" ? "Her parçaya ayrı paket." : "Siparişe bir kutu."}
            included={workshop.include.packaging}
            onIncluded={(value) => onInclude("packaging", value)}
          >
            <Field label="Paket tutarı">
              <NumField label="Paketleme tutarı" value={job.packaging} onChange={(packaging) => onJob({ packaging })} />
            </Field>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Choice on={job.packagingPer === "order"} onClick={() => onJob({ packagingPer: "order" })}>
                Sipariş başı
              </Choice>
              <Choice on={job.packagingPer === "piece"} onClick={() => onJob({ packagingPer: "piece" })}>
                Adet başı
              </Choice>
            </div>
          </Block>

          <Block
            title="Kargo"
            detail="Siparişe bir kez. Teklif metninde dahil değilse ayrıca yazar."
            included={workshop.include.shipping}
            onIncluded={(value) => onInclude("shipping", value)}
          >
            <Field label="Kargo tutarı">
              <NumField label="Kargo tutarı" value={job.shipping} onChange={(shipping) => onJob({ shipping })} />
            </Field>
          </Block>

          <div className="border-t border-line py-4">
            <h3 className="text-sm font-semibold">Ek kalemler</h3>
            <p className="mt-1 text-xs text-muted">Insert, boya, vida. Adet başı olanlar başarısız denemeye de girer.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip.name}
                  type="button"
                  className="h-11 rounded-full border border-line px-3 text-sm"
                  onClick={() => onAddExtra(chip.name, chip.amount)}
                >
                  {chip.name}
                </button>
              ))}
              <button type="button" className="h-11 rounded-full border border-line px-3 text-sm" onClick={() => onAddExtra("Ek", 0)}>
                Boş satır
              </button>
            </div>
            <ul className="mt-3 flex flex-col gap-3">
              {job.extras.map((extra) => (
                <li key={extra.id} className="rounded-xl border border-line p-3">
                  <div className="grid gap-2 sm:grid-cols-[1fr_8rem_auto]">
                    <input
                      className="field"
                      aria-label="Ek kalem adı"
                      value={extra.name}
                      maxLength={40}
                      onChange={(e) => onPatchExtra(extra.id, { name: e.target.value })}
                    />
                    <NumField label={`${extra.name} tutarı`} value={extra.amount} onChange={(amount) => onPatchExtra(extra.id, { amount })} />
                    <button
                      type="button"
                      aria-label="Ek kalemi sil"
                      className="grid size-11 place-items-center rounded-xl border border-line"
                      onClick={() => onRemoveExtra(extra.id)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Choice on={extra.per === "piece"} onClick={() => onPatchExtra(extra.id, { per: "piece" })}>
                      Adet başı
                    </Choice>
                    <Choice on={extra.per === "order"} onClick={() => onPatchExtra(extra.id, { per: "order" })}>
                      Sipariş başı
                    </Choice>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Block
            title="Platform komisyonu"
            detail="Müşterinin ödediği tutarın yüzdesi. Maliyetin üstüne eklenip tekrar çarpılmaz."
            included={workshop.include.commission}
            onIncluded={(value) => onInclude("commission", value)}
          >
            <Field label="Komisyon, yüzde">
              <NumField
                label="Platform komisyonu"
                value={workshop.commissionRate}
                onChange={(commissionRate) => onWorkshop({ commissionRate: Math.min(80, commissionRate) })}
              />
            </Field>
          </Block>

          <Block
            title="Vergi"
            detail="KDV fiyata dahil sayılır. 20 yazınca fiyatın %20'si değil, %16,7'si vergidir."
            included={workshop.include.tax}
            onIncluded={(value) => onInclude("tax", value)}
          >
            <Field label="KDV, yüzde">
              <NumField label="Vergi oranı" value={workshop.taxRate} onChange={(taxRate) => onWorkshop({ taxRate: Math.min(80, taxRate) })} />
            </Field>
          </Block>

          <p className="text-sm text-muted">
            100 TL tahsilatta komisyon {formatTL(preview.commission)}, vergi {formatTL(preview.tax)}, sana kalan {formatTL(preview.kept)}.
            Önerilen fiyat, çarpanı bu kalandan tutturacak kadar yükselir.
          </p>

          <div className="mt-4 border-t border-line pt-4">
            <h3 className="text-sm font-semibold">Satış çarpanları</h3>
            <p className="mt-1 text-xs text-muted">Çarpan, kesintiden sonra eline geçen bölü doğrudan maliyettir. Kesinti yoksa eski dosyandaki gibi fiyat = maliyet × çarpan.</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Field label="Minimum">
                <NumField label="Minimum çarpan" value={workshop.multiMin} onChange={(multiMin) => onWorkshop({ multiMin })} />
              </Field>
              <Field label="Önerilen">
                <NumField label="Önerilen çarpan" value={workshop.multiRec} onChange={(multiRec) => onWorkshop({ multiRec })} />
              </Field>
              <Field label="Premium">
                <NumField label="Premium çarpan" value={workshop.multiMax} onChange={(multiMax) => onWorkshop({ multiMax })} />
              </Field>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Block({
  title,
  detail,
  included,
  onIncluded,
  children,
}: {
  title: string;
  detail: string;
  included: boolean;
  onIncluded: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-line py-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
        </div>
        <IncludeButton on={included} onChange={onIncluded} label={title} />
      </div>
      {children}
    </div>
  );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`h-11 rounded-xl text-sm font-medium ${on ? "bg-ink text-surface" : "bg-inset text-muted"}`}
    >
      {children}
    </button>
  );
}
