import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Search and AI crawlers are explicitly welcome (client decision: be cited by ChatGPT, Perplexity,
 * Google AI Overviews, Claude, …). Each gets the same rule as `*`; listing them makes the intent explicit.
 */
const AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  const rule = { allow: "/", disallow: ["/admin", "/api/"] };
  return {
    rules: [...AGENTS.map((userAgent) => ({ userAgent, ...rule })), { userAgent: "*", ...rule }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
