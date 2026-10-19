export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-bg p-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
          className={`min-h-9 shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-offset-1 ${value === item.id ? "bg-surface font-semibold text-navy shadow-sm" : "text-mute hover:text-ink"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
