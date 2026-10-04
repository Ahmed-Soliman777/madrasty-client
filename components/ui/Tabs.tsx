export function Tabs<T extends string>({ items, value, onChange }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="group" className="flex gap-1 rounded-xl bg-soft p-1">
      {items.map((i) => (
        <button key={i.id} aria-pressed={value === i.id} onClick={() => onChange(i.id)}
          className={`rounded-lg px-3 py-1.5 text-mute ${value === i.id ? "bg-surface font-semibold text-ink shadow-sm" : ""}`}>{i.label}</button>
      ))}
    </div>
  );
}
