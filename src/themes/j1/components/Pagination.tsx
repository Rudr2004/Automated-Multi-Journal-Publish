import { ChevronLeft, ChevronRight } from './uiIcons'

export function Pagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (p: number) => void }) {
  if (pageCount <= 1) return null
  const base = 'flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors'
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button type="button" className={`${base} border-line hover:bg-navy-50 disabled:opacity-40`} disabled={page === 1}
        onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft className="h-4 w-4" aria-hidden /></button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" aria-current={p === page ? 'page' : undefined} onClick={() => onChange(p)}
          className={`${base} ${p === page ? 'border-navy bg-navy text-white' : 'border-line hover:bg-navy-50'}`}>{p}</button>
      ))}
      <button type="button" className={`${base} border-line hover:bg-navy-50 disabled:opacity-40`} disabled={page === pageCount}
        onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight className="h-4 w-4" aria-hidden /></button>
    </nav>
  )
}
