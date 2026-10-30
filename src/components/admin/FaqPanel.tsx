"use client";

import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import type { FaqItem } from "@/lib/api/types";
import { ErrorBox, Panel, TextLink } from "./Page";

export const FAQ_MAX = 10;

/** Mirrors FaqItem (question 1..200, answer 1..1000, max 10 items). */
export const faqsSchema = z
  .array(
    z.object({
      question: z.string().trim().min(1, "Pertanyaan wajib diisi.").max(200, "Maksimal 200 karakter."),
      answer: z.string().trim().min(1, "Jawaban wajib diisi.").max(1000, "Maksimal 1000 karakter."),
    }),
  )
  .max(FAQ_MAX, `Maksimal ${FAQ_MAX} pertanyaan.`);

type FaqForm = { faqs: FaqItem[] };

export const faqsToForm = (faqs: FaqItem[] | undefined): FaqItem[] => (faqs ?? []).map((f) => ({ question: f.question, answer: f.answer }));
export const faqsToBody = (faqs: FaqItem[]): FaqItem[] => faqs.map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }));

/** Repeatable FAQ list (rendered as a public FAQ section and FAQPage JSON-LD). */
export function FaqPanel<T extends FaqForm>({ control, register, errors }: { control: Control<T>; register: UseFormRegister<T>; errors: FieldErrors<T> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctl = control as unknown as Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reg = register as unknown as UseFormRegister<any>;
  const e = (errors as FieldErrors<FaqForm>).faqs;
  const faqs = useFieldArray({ control: ctl, name: "faqs" });
  const n = faqs.fields.length;
  return (
    <Panel
      title="FAQ"
      actions={
        <Button size="sm" variant="secondary" disabled={n >= FAQ_MAX} onClick={() => faqs.append({ question: "", answer: "" })}>
          Tambah pertanyaan
        </Button>
      }
    >
      <p className="text-small text-ink-muted">
        Tampil sebagai bagian &quot;Pertanyaan umum&quot; dan membantu mesin pencari serta AI mengutip jawaban. Teks biasa, maksimal {FAQ_MAX} pertanyaan.
      </p>
      {n === 0 ? <p className="text-small text-ink-muted">Belum ada pertanyaan.</p> : null}
      {faqs.fields.map((f, i) => (
        <div key={f.id} className="flex flex-col gap-3 border-t border-line pt-4 first:border-t-0 first:pt-0">
          <Input label={`Pertanyaan ${i + 1}`} maxLength={200} error={e?.[i]?.question?.message} {...reg(`faqs.${i}.question`)} />
          <Textarea label="Jawaban" rows={3} maxLength={1000} error={e?.[i]?.answer?.message} {...reg(`faqs.${i}.answer`)} />
          <div className="flex gap-4">
            <TextLink onClick={() => faqs.move(i, i - 1)} disabled={i === 0}>
              Naik
            </TextLink>
            <TextLink onClick={() => faqs.move(i, i + 1)} disabled={i === n - 1}>
              Turun
            </TextLink>
            <TextLink onClick={() => faqs.remove(i)}>Hapus</TextLink>
          </div>
        </div>
      ))}
      {e?.message || e?.root?.message ? <ErrorBox message={(e?.message ?? e?.root?.message)!} /> : null}
    </Panel>
  );
}
