// The "Latest announcements" bar, shown under the header on every page. It loads the same notices the home page used to show.
import { useEffect, useState } from 'react'
import { api } from '../../../core/api'
import { Ticker } from '../pages/home/Ticker'
import { Container } from '../components/primitives'

type Notices = { date: string; text: string }[]
let cache: Promise<{ notices: Notices; reviewDays: number }> | null = null
const load = () => (cache ??= api.getHome().then((h) => ({ notices: h.notices ?? [], reviewDays: h.callForPapers.avgReviewDays })).catch(() => { cache = null; return { notices: [], reviewDays: 14 } }))

export function AnnouncementsBar() {
  const [data, setData] = useState<{ notices: Notices; reviewDays: number } | null>(null)
  useEffect(() => { let live = true; load().then((d) => live && setData(d)); return () => { live = false } }, [])
  return <Container className="pt-4"><Ticker notices={data?.notices ?? []} reviewDays={data?.reviewDays ?? 14} /></Container>
}
