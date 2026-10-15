"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId, useRef, useState } from "react";
import { errorMessage } from "@/lib/api/browser";
import { cn } from "@/lib/cn";
import { ACCEPT, uploadMedia } from "./media";

/**
 * Tiptap editor (Figma toolbar labels): Judul, Tebal, Miring, Daftar, Kutipan, Tautan, Gambar.
 * Output is HTML; the BE sanitises it (bluemonday UGC) on save.
 */
export function RichTextEditor({
  value,
  onChange,
  label = "Isi artikel",
  error,
}: {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  error?: string;
}) {
  const id = useId();
  const file = useRef<HTMLInputElement>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, protocols: ["http", "https", "mailto"], HTMLAttributes: { rel: "noopener noreferrer" } },
        code: false,
        codeBlock: false,
      }),
      Image.configure({ inline: false }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose-m2s min-h-[220px] px-4 py-4 outline-none",
        "aria-labelledby": `${id}-label`,
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  // Load server content once it arrives (edit screen) without clobbering typing.
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h: e.isActive("heading"),
            b: e.isActive("bold"),
            i: e.isActive("italic"),
            ul: e.isActive("bulletList"),
            ol: e.isActive("orderedList"),
            q: e.isActive("blockquote"),
            a: e.isActive("link"),
          }
        : null,
  });

  const setLink = () => {
    if (!editor) return;
    const prev = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("Alamat tautan (https://...). Kosongkan untuk menghapus tautan.", prev);
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!/^(https?:\/\/|mailto:|\/)/.test(url.trim())) {
      window.alert("Tautan harus diawali https://, http://, mailto:, atau /");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const onImage = async (f: File | undefined) => {
    if (!f || !editor) return;
    setUploadErr(null);
    setUploading(true);
    try {
      const m = await uploadMedia(f);
      const alt = window.prompt("Teks alternatif gambar (untuk pembaca layar):", "") ?? "";
      editor.chain().focus().setImage({ src: m.url, alt }).run();
    } catch (e) {
      setUploadErr(errorMessage(e));
    } finally {
      setUploading(false);
      if (file.current) file.current.value = "";
    }
  };

  const tools: Array<{ label: string; on?: boolean; run: () => void }> = editor
    ? [
        { label: "Judul", on: state?.h, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { label: "Subjudul", run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
        { label: "Tebal", on: state?.b, run: () => editor.chain().focus().toggleBold().run() },
        { label: "Miring", on: state?.i, run: () => editor.chain().focus().toggleItalic().run() },
        { label: "Daftar", on: state?.ul, run: () => editor.chain().focus().toggleBulletList().run() },
        { label: "Daftar angka", on: state?.ol, run: () => editor.chain().focus().toggleOrderedList().run() },
        { label: "Kutipan", on: state?.q, run: () => editor.chain().focus().toggleBlockquote().run() },
        { label: "Tautan", on: state?.a, run: setLink },
        { label: uploading ? "Mengunggah" : "Gambar", run: () => file.current?.click() },
      ]
    : [];

  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-[14px] leading-[22px] font-medium text-ink">
        {label}
      </span>
      <div role="toolbar" aria-label="Format teks" className="flex flex-wrap gap-1 rounded-sm border border-line bg-ground px-2 py-1">
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={t.run}
            aria-pressed={t.on ?? undefined}
            className={cn("rounded-sm px-2 py-[6px] text-[14px] leading-[22px] font-medium", t.on ? "bg-ink text-surface" : "text-ink hover:bg-surface")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className={cn("rounded-sm border bg-surface focus-within:border-cyan", error ? "border-[#b42318]" : "border-line")}>
        <EditorContent editor={editor} />
      </div>
      <input ref={file} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => void onImage(e.target.files?.[0])} />
      {uploadErr || error ? (
        <p role="alert" className="text-small text-[#b42318]">
          {uploadErr ?? error}
        </p>
      ) : null}
    </div>
  );
}
