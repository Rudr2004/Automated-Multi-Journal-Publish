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
    <section aria-labelledby="awards-h" className={`relative overflow-hidden rounded-sheet border-2 border-[#E3A92F] bg-gradient-to-b from-[#FFF6DC] via-white to-white p-5 shadow-pop ring-4 ring-[#F5C65A]/25 ${className}`}>
      <h2 id="awards-h" className="flex items-center gap-3 border-b border-[#EBCB7C] pb-3 font-display text-base font-bold leading-snug text-graphite-900">
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F7C948] to-[#E08A00] text-white shadow-card"><Award className="h-6 w-6" /></span>
        Academic Recognition &amp; Excellence Program
      </h2>
      <ul className="mt-4 space-y-3.5">
        {awards.map((a) => (
          <li key={a.kind} className="rounded-panel border border-[#EBCB7C] border-l-[6px] border-l-[#E3A92F] bg-white p-3.5 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F7C948] to-[#E9A21B] px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-wider text-graphite-900 shadow-sm"><span aria-hidden="true">★</span>{a.kind}</span>
              <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-[#8A5A00]">{a.period}</span>
            </div>
            <p className="mt-2.5 font-display text-[0.95rem] font-extrabold leading-snug text-graphite-900">{a.title}</p>
            <div className="mt-2.5 flex items-start gap-2">
              <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
                {recipientNames(a.recipient).map((n) => <AuthorAvatar key={n} name={n} className="h-8 w-8 text-[10px] ring-2 ring-[#F5C65A]" />)}
              </span>
              <p className="min-w-0 text-[13px] font-bold leading-snug text-brand-800">{a.recipient}</p>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-graphite-600">{a.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
