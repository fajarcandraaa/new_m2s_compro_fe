const ROWS: Array<[string, string, string]> = [
  ["Fokus", "Kepastian hasil akhir", "Kecepatan dan fleksibilitas"],
  ["Ruang lingkup", "Dikunci di awal kontrak", "Bisa berubah tiap sprint"],
  ["Biaya", "Harga tetap per proyek", "Sesuai waktu kerja yang dipakai"],
  ["Evaluasi", "Di akhir tiap fase besar", "Di akhir tiap sprint 1–2 minggu"],
  ["Paling cocok", "Kebutuhan sudah terdokumentasi", "MVP atau pengembangan berkelanjutan"],
];

/** BOS vs BOR comparison table (Figma Layanan "Model kerja"). Scrolls horizontally on small screens. */
export function WorkModelTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <caption className="sr-only">Perbandingan model kerja BOS dan BOR</caption>
        <thead className="bg-ground">
          <tr className="text-[14px] leading-[22px] font-semibold">
            <th scope="col" className="w-[220px] px-6 py-5 lg:pl-8">
              <span className="sr-only">Aspek</span>
            </th>
            <th scope="col" className="px-6 py-5 text-ink">
              BOS · Based on Scope
            </th>
            <th scope="col" className="px-6 py-5 text-ink lg:pr-8">
              BOR · Based on Request
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([k, a, b]) => (
            <tr key={k} className="border-t border-line align-top">
              <th scope="row" className="px-6 py-5 text-small font-normal text-ink-muted lg:pl-8">
                {k}
              </th>
              <td className="px-6 py-5 text-body text-ink">{a}</td>
              <td className="px-6 py-5 text-body text-ink lg:pr-8">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
