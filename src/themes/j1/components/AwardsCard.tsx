// "Academic Recognition & Excellence Program": the monthly awards card shown in the right sidebar of every page except the article page.
// Used by the home sidebar (which passes its already-loaded awards) and by the other pages (which let the card load them via the shared home data).
import { useEffect, useState } from 'react'
import { MdOutlineWorkspacePremium } from 'react-icons/md'
import { api } from '../../../core/api'
import type { HomeData } from '../../../core/types'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { Avatar } from './Avatar'
import { Card, Tag } from './PortalParts'

type Awards = HomeData['awards']

/** Names inside an award recipient string such as "Dr. A and Dr. B" or "Prof. C (University)". */
export const recipientNames = (r: string) => r.replace(/\([^)]*\)/g, '').split(/\s+and\s+|,/).map((n) => n.trim()).filter(Boolean)

let cache: Promise<Awards> | null = null
const loadAwards = () => (cache ??= api.getHome().then((h) => h.awards ?? []).catch(() => { cache = null; return [] as Awards }))

export function AwardsCard({ awards: given }: { awards?: Awards }) {
  const [loaded, setLoaded] = useState<Awards>([])
  useEffect(() => {
    if (given) return
    let live = true
    loadAwards().then((a) => live && setLoaded(a))
    return () => { live = false }
  }, [given])
  const awards = given ?? loaded
  if (!awards.length) return null
  return (
    <Card title="Academic Recognition & Excellence" subtitle="Monthly awards from the Senior Editorial Committee." icon={MdOutlineWorkspacePremium} headingId="recognition-h">
      <ul className="space-y-3">
        {awards.map((a) => (
          <li key={a.kind} className="rounded border border-line bg-paper p-3">
            <div className="flex items-center justify-between gap-2"><Tag tone="amber">{a.kind}</Tag><span className="text-[11px] text-ink-muted">{a.period}</span></div>
            <p className="mt-2 font-serif text-[0.95rem] font-bold leading-snug text-navy">{a.title}</p>
            <div className="mt-2 flex items-start gap-2">
              <span className="flex shrink-0 -space-x-1.5" aria-hidden>
                {recipientNames(a.recipient).map((n) => <Avatar key={n} name={n} photo={portraitFor(n)} size="xs" />)}
              </span>
              <p className="min-w-0 text-[12px] leading-snug text-scholar">{a.recipient}</p>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-snug text-ink-muted">{a.reason}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
