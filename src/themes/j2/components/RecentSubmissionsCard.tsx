// "Recent submissions": a live-feed style card on the submission page showing the latest manuscripts sent to the journal (working title,
// institution and how long ago). It reads the same home data the home page uses; the promise is cached so every page shares one request.
import { useEffect, useState } from 'react'
import { MdOutlineHistory, MdOutlineSchedule, MdOutlineSchool } from 'react-icons/md'
import { api } from '../../../core/api'
import type { HomeData } from '../../../core/types'

type Items = HomeData['recentSubmissions']
let cache: Promise<Items> | null = null
const load = () => (cache ??= api.getHome().then((h) => h.recentSubmissions ?? []).catch(() => { cache = null; return [] as Items }))

/** "24 minutes ago", "2 hours ago", "1 day ago". */
const ago = (minutes: number) => {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))} minute${Math.round(minutes) === 1 ? '' : 's'} ago`
  if (minutes < 1440) { const h = Math.floor(minutes / 60); return `${h} hour${h === 1 ? '' : 's'} ago` }
  const d = Math.floor(minutes / 1440)
  return `${d} day${d === 1 ? '' : 's'} ago`
}

export function RecentSubmissionsCard() {
  const [items, setItems] = useState<Items>([])
  useEffect(() => {
    let live = true
    load().then((i) => live && setItems(i))
    return () => { live = false }
  }, [])
  if (!items.length) return null
  return (
    <section aria-labelledby="recent-h" className="overflow-hidden rounded-sheet border border-graphite-200 bg-white shadow-card">
      <header className="flex items-center justify-between gap-2 border-b border-graphite-100 bg-brand-50/60 px-5 py-3.5">
        <h2 id="recent-h" className="flex items-center gap-2 whitespace-nowrap font-display text-[0.95rem] font-bold text-brand-900"><MdOutlineHistory className="h-[18px] w-[18px] text-accent-700" aria-hidden="true" />Recent submissions</h2>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-chip border border-brand-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-brand-800">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-600 motion-safe:animate-pulse" />Live feed
        </span>
      </header>
      <ul className="divide-y divide-graphite-100">
        {items.slice(0, 5).map((s, i) => (
          <li key={`${s.title ?? s.subject}-${s.minutes}`} className="px-5 py-3.5">
            <p className="font-display text-sm font-semibold leading-snug text-graphite-900">“{s.title ?? s.subject}”</p>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-graphite-600">
              <span className="inline-flex min-w-0 items-center gap-1.5"><MdOutlineSchool className="h-4 w-4 shrink-0 text-accent-700" aria-hidden="true" /><span className="min-w-0 font-medium text-graphite-800">{s.institution}</span></span>
              <span className="inline-flex shrink-0 items-center gap-1"><MdOutlineSchedule className="h-3.5 w-3.5" aria-hidden="true" />{ago(s.minutes)}</span>
            </div>
            {s.title && <p className="mt-2 flex items-center gap-2 text-[11px]"><span className="rounded-chip bg-graphite-100 px-2 py-0.5 font-semibold text-graphite-700">{s.subject}</span>{i === 0 && <span className="rounded-chip bg-accent-100 px-2 py-0.5 font-bold text-accent-800">New</span>}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}
