// "Academic Recognition & Excellence Program": the monthly awards, shown in the right sidebar of every page except the article page.
// The awards come from the same home data the home page uses; the promise is cached so every page shares one request.
import { useEffect, useState } from 'react'
import { api } from '../../../core/api'
import type { HomeData } from '../../../core/types'
import { Award } from '../icons'
import { AuthorAvatar } from './AuthorAvatar'

type Awards = HomeData['awards']
let cache: Promise<Awards> | null = null
const loadAwards = () => (cache ??= api.getHome().then((h) => h.awards ?? []).catch(() => { cache = null; return [] }))

const recipientNames = (r: string) => r.replace(/\([^)]*\)/g, '').split(/\s+and\s+|,/).map((n) => n.trim()).filter(Boolean)

export function AwardsCard({ className = '' }: { className?: string }) {
  const [awards, setAwards] = useState<Awards>([])
  useEffect(() => {
    let live = true
    loadAwards().then((a) => { if (live) setAwards(a) })
    return () => { live = false }
  }, [])
  if (!awards.length) return null
  return (
    <section aria-labelledby="awards-h" className={`rounded-sheet border border-graphite-200 bg-white p-5 shadow-card ${className}`}>
      <h2 id="awards-h" className="flex items-start gap-2 border-b border-graphite-100 pb-3 font-display text-sm font-bold leading-snug text-graphite-900">
        <Award className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" />Academic Recognition &amp; Excellence Program
      </h2>
      <ul className="mt-3 space-y-3">
        {awards.map((a) => (
          <li key={a.kind} className="rounded-panel border border-graphite-200 bg-graphite-50 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-accent-50 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-accent-800">{a.kind}</span>
              <span className="shrink-0 whitespace-nowrap text-xs text-graphite-600">{a.period}</span>
            </div>
            <p className="mt-2 font-display text-sm font-bold leading-snug text-graphite-900">{a.title}</p>
            <div className="mt-2.5 flex items-start gap-2">
              <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
                {recipientNames(a.recipient).map((n) => <AuthorAvatar key={n} name={n} className="h-7 w-7 text-[10px]" />)}
              </span>
              <p className="min-w-0 text-[13px] font-semibold leading-snug text-brand-800">{a.recipient}</p>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-graphite-600">{a.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
