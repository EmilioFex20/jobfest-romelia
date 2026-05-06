export function Feature({
  icon,
  title,
  points,
}: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div className="bg-ink p-8">
      <div className="mb-6 inline-flex h-10 w-10 items-center justify-center border border-bone/30">
        {icon}
      </div>
      <h3 className="font-display text-2xl">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-bone/70">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-ember">—</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
