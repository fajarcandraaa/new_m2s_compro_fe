"use client";

import { useState } from "react";

/** Share row: WhatsApp, LinkedIn, copy link (text labels, no icons). */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Salin tautan ini:", url);
    }
  };
  const link = "text-[14px] leading-[22px] font-medium text-cyan-ink hover:underline";
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
      <span className="text-small text-ink-muted">Bagikan</span>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={link}>
        WhatsApp
      </a>
      <a href={li} target="_blank" rel="noopener noreferrer" className={link}>
        LinkedIn
      </a>
      <button type="button" onClick={copy} className={link}>
        {copied ? "Tautan disalin" : "Salin tautan"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Tautan disalin" : ""}
      </span>
    </div>
  );
}
