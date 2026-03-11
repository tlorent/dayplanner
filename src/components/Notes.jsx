import { SectionLabel } from "./SectionLabel";

export function Notes({ value, onChange }) {
  return (
    <div>
      <SectionLabel>dagnotities</SectionLabel>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Wat bouwde je vandaag? Input voor vrijdagpost..."
        className="w-full min-h-[120px] bg-beige-dark border border-border p-3.5 font-mono text-[12px] text-ink leading-[1.7] resize-none focus:outline-2 focus:outline-terracotta appearance-none"
      />
    </div>
  );
}
