/** Step (Figma "Step"): 2px cyan top rule as order marker. */
export function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-4 border-t-2 border-cyan pt-6">
      <p className="text-tagline text-cyan-ink">{number}</p>
      <h3 className="text-title text-ink">{title}</h3>
      <p className="text-small text-ink-muted">{body}</p>
    </div>
  );
}
