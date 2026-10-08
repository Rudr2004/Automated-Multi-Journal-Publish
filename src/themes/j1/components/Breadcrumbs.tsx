import { ChevronRight } from './uiIcons'
import { AppLink } from '../../../core/router'

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-ink-muted">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            {it.to && i < items.length - 1 ? (
              <AppLink to={it.to} className="hover:text-navy hover:underline">{it.label}</AppLink>
            ) : (
              <span aria-current="page" className="font-medium text-ink">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
