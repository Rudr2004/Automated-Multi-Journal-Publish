// "Recent submissions": a live-feed style card on the submission page showing the latest manuscripts sent to the journal (working title,
// institution and how long ago). It reads the same home data the home page uses; the promise is cached so every page shares one request.
import { useEffect, useState } from 'react'
import { MdOutlineHistory, MdOutlineSchedule, MdOutlineSchool } from 'react-icons/md'
import { api } from '../../../core/api'
import type { HomeData } from '../../../core/types'

type Items = HomeData['recentSubmissions']
let cache: Promise<Items> | null = null
const load = () => (cache ??= api.getHome().then((h) => h.recentSubmissions ?? []).catch(() => { cache = null; return [] as Items }))

/** "18 minutes ago", "2 hours ago", "1 day ago". */
export const ago = (minutes: number) => {
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
    <section aria-labelledby="recent-h" className="overflow-hidden border border-line bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-line bg-mist px-4 py-3">
        <h2 id="recent-h" className="flex items-center gap-2 font-serif text-[1.0625rem] font-bold text-navy"><MdOutlineHistory className="h-5 w-5 text-scholar" aria-hidden />Recent Submissions</h2>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-[#B9E0C8] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#14633A]">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#1E9E5A] motion-safe:animate-pulse" />Live feed
        </span>
      </header>
      <ul className="divide-y divide-line">
        {items.slice(0, 5).map((s, i) => (
          <li key={`${s.title ?? s.subject}-${s.minutes}`} className="relative px-4 py-3 pl-5 before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:rounded-r before:bg-scholar/70">
            <p className="font-serif text-[0.9375rem] font-bold leading-snug text-navy">“{s.title ?? s.subject}”</p>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[12px] text-ink-muted">
              <span className="inline-flex min-w-0 items-center gap-1.5"><MdOutlineSchool className="h-4 w-4 shrink-0 text-scholar" aria-hidden /><span className="min-w-0 font-medium text-ink">{s.institution}</span></span>
              <span className="inline-flex shrink-0 items-center gap-1"><MdOutlineSchedule className="h-3.5 w-3.5" aria-hidden />{ago(s.minutes)}</span>
            </div>
            {s.title && <p className="mt-1.5 flex items-center gap-2 text-[11px] text-ink-muted"><span className="rounded-sm border border-line bg-paper px-1.5 py-0.5 font-semibold">{s.subject}</span>{i === 0 && <span className="rounded-sm bg-scholar-soft px-1.5 py-0.5 font-bold text-scholar">New</span>}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}
