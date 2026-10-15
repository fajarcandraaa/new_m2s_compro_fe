/** Server-rendered JSON-LD block; `<` escaped so CMS text can never close the script element. */
export function JsonLd({ data }: { data: object | null | undefined }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
