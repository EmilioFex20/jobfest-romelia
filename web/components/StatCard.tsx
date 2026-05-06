export function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`border p-6 ${
        accent ? "border-ember bg-ember text-bone" : "border-ink"
      }`}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
        {label}
      </div>
      <div className="mt-1 font-display text-4xl">{value}</div>
    </div>
  );
}
