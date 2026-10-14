import { Minus, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs leading-relaxed text-muted">{hint}</span> : null}
    </label>
  );
}

export function NumField({
  value,
  onChange,
  label,
  integer,
  emptyZero,
  placeholder,
  center,
  maxDecimals = 2,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  integer?: boolean;
  emptyZero?: boolean;
  placeholder?: string;
  center?: boolean;
  maxDecimals?: number;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown =
    draft !== null ? draft : value === 0 && emptyZero ? "" : integer ? String(Math.round(value)) : strip(value);

  return (
    <input
      aria-label={label}
      inputMode={integer ? "numeric" : "decimal"}
      autoComplete="off"
      placeholder={placeholder}
      className={`field tabular-nums ${center ? "text-center" : ""}`}
      value={shown}
      onFocus={() => {
        setDraft(value === 0 && emptyZero ? "" : integer ? String(Math.round(value)) : strip(value));
      }}
      onBlur={() => setDraft(null)}
      onChange={(e) => {
        const raw = e.target.value.replace(",", ".").replace(/\s/g, "");
        const pattern = integer ? /^\d{0,6}$/ : new RegExp(`^\\d{0,7}(\\.\\d{0,${maxDecimals}})?$`);
        if (!pattern.test(raw)) return;
        setDraft(raw);
        if (raw === "" || raw === ".") onChange(0);
        else onChange(Number(raw));
      }}
    />
  );
}

function strip(n: number): string {
  if (!Number.isFinite(n)) return "";
  return String(Math.round(n * 1000) / 1000);
}

export function Stepper({
  value,
  onChange,
  label,
  min = 1,
  max = 999,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  min?: number;
  max?: number;
}) {
  const current = Math.max(0, Math.round(value || 0));
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`${label} azalt`}
        className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink"
        onClick={() => onChange(Math.max(min, (current || min) - 1))}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <NumField integer center label={label} value={current} onChange={(n) => onChange(Math.min(max, Math.max(min, Math.round(n) || min)))} />
      <button
        type="button"
        aria-label={`${label} artır`}
        className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink"
        onClick={() => onChange(Math.min(max, (current || min) + 1))}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select aria-label={label} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function IncludeButton({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={`${label}: ${on ? "fiyata dahil" : "hariç"}`}
      onClick={() => onChange(!on)}
      className={`h-11 shrink-0 rounded-full px-4 text-sm font-medium ${on ? "bg-ink text-surface" : "bg-inset text-muted"}`}
    >
      {on ? "Dahil" : "Hariç"}
    </button>
  );
}

export function Button({
  children,
  onClick,
  tone = "ghost",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "ghost" | "solid" | "quiet";
  disabled?: boolean;
}) {
  const toneClass =
    tone === "solid"
      ? "bg-copper-deep text-copper-ink"
      : tone === "quiet"
        ? "bg-inset text-ink"
        : "border border-line bg-surface text-ink";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium disabled:opacity-40 ${toneClass}`}
    >
      {children}
    </button>
  );
}
