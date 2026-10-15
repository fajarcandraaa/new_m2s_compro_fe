import { getService } from "@/lib/api/public";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const revalidate = 300;
export const alt = "Layanan · Mind2Screen";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getService(slug);
  return renderOgImage({ eyebrow: "Layanan", title: item?.title ?? "Mind2Screen" });
}
