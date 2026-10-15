import { useEffect, useId, useState } from 'react'
import { paths } from '../../../config/routes'
import { api } from '../../../core/api'
import { AppLink } from '../../../core/router'
import { Box } from '../pages/home/parts'
import { cx } from './primitives'
import { Campaign, ChevronRight } from './refIconsJ4'

const card = 'p-5'

// An announcement card: a banner image (date over a gradient), a heading, the paragraph and, when the notice points somewhere, a button.
const BANNERS = ['from-azure-600 to-cobalt-800', 'from-emerald-600 to-teal-800', 'from-amber-500 to-orange-700']
const splitNotice = (text: string): [string, string] => {
  const c = text.indexOf(':')
  if (c > 0 && c < 60) return [text.slice(0, c), text.slice(c + 1).trim().replace(/^./, (x) => x.toUpperCase())]
  const w = text.split(' ')
  return [w.slice(0, 6).join(' ').replace(/[,.]$/, ''), text]
}
/** Where a notice leads, when it clearly refers to a page of the site. */
const noticeLink = (text: string): [string, string] | null => {
  if (/crossref|doi/i.test(text)) return [paths.about('indexing'), 'See indexing']
  if (/call for papers|themed section/i.test(text)) return [paths.submit, 'Submit a paper']
  if (/editor|board/i.test(text)) return [paths.editorialBoard, 'Meet the board']
  return null
}

type Notice = { date: string; text: string }
let cache: Promise<Notice[]> | null = null
const loadNotices = () => (cache ??= api.getHome().then((h) => h.notices ?? []).catch(() => { cache = null; return [] as Notice[] }))

/** The home page's scrolling announcements card; pass `notices` or let it load them (used on every other page). */
export function AnnouncementsFeed({ notices }: { notices?: Notice[] }) {
  const [loaded, setLoaded] = useState<Notice[]>([])
  useEffect(() => { if (notices) return; let live = true; loadNotices().then((n) => live && setLoaded(n)); return () => { live = false } }, [notices])
  const list = (notices ?? loaded).slice(0, 5)
  const id = useId()
  if (!list.length) return null
  const cards = (copy: number) => list.map((a, k) => {
    const d = new Date(`${a.date}T12:00:00`)
    const [head, body] = splitNotice(a.text)
    const link = noticeLink(a.text)
    return (
      <li key={`${copy}-${a.date}${k}`} className="py-1.5">
        <article className="overflow-hidden rounded-[8px] border border-slate-100 bg-slate-50/70">
          <div aria-hidden="true" className={cx('flex h-20 items-center justify-between bg-gradient-to-br px-4 text-white', BANNERS[k % 3])}>
            <Campaign className="h-9 w-9 opacity-90" />
            <div className="text-right"><span className="block font-serif4 text-2xl font-bold leading-none">{d.getDate()}</span><span className="font-mono text-[10px] font-bold uppercase">{d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span></div>
          </div>
          <div className="space-y-1.5 p-3">
            <h3 className="font-serif4 text-sm font-bold leading-snug text-[#0b2545]">{head}</h3>
            {body !== head && <p className="text-xs leading-relaxed text-slate-600">{body}</p>}
            {link && <AppLink to={link[0]} className="inline-flex items-center gap-1 rounded bg-cobalt-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-cobalt-800">{link[1]} <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></AppLink>}
          </div>
        </article>
      </li>
    )
  })
  return (
    <Box aria-labelledby={`${id}-h`} className={cx(card, 'relative overflow-hidden')}>
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 id={`${id}-h`} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700"><Campaign className="h-5 w-5 text-amber-600" aria-hidden="true" />Announcements</h2>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">Latest Updates</span>
      </div>
      {/* The announcements scroll upwards; hover or keyboard focus pauses them, and reduced-motion visitors scroll by hand. */}
      <div className="j1-pausable h-96 overflow-hidden motion-reduce:overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,#000_10px,#000_calc(100%-14px),transparent)]">
        <div className="j1-scroll-up" style={{ ['--j1-scroll-duration' as string]: `${Math.max(24, list.length * 9)}s` }}>
          <ul aria-label="Announcements">{cards(0)}</ul>
          <ul aria-hidden>{cards(1)}</ul>
        </div>
      </div>
    </Box>
  )
}

