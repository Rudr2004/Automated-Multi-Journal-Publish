/** First / 1 2 3 / Next / Last pagination for the issue article list. */
export function IssuePager({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (p: number) => void }) {
  if (pageCount <= 1) return null
  const base = 'flex h-9 min-w-9 items-center justify-center rounded border px-3 text-sm font-semibold tabular-nums transition-colors'
  const idle = 'border-line bg-white text-navy hover:border-scholar hover:bg-scholar-soft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-white'
  const nums = Array.from({ length: pageCount }, (_, i) => i + 1)
  return (
    <nav aria-label="Issue article pages" className="flex flex-wrap items-center gap-1.5">
      <button type="button" className={`${base} ${idle}`} disabled={page === 1} onClick={() => onChange(1)}>First</button>
      {nums.map((p) => (
        <button key={p} type="button" aria-current={p === page ? 'page' : undefined} aria-label={`Page ${p}`} onClick={() => onChange(p)}
          className={`${base} ${p === page ? 'border-navy bg-navy text-white' : idle}`}>{p}</button>
      ))}
      <button type="button" className={`${base} ${idle}`} disabled={page === pageCount} onClick={() => onChange(page + 1)}>Next</button>
      <button type="button" className={`${base} ${idle}`} disabled={page === pageCount} onClick={() => onChange(pageCount)}>Last</button>
    </nav>
  )
}
