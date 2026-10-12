// Section below the pre-footer banner, in the slot and layout the reference gives to "Honors, Research Awards & Mentorship Recognition": two highlight cards on the left
// and a scrolling "Learning Resources" strip on the right. J4 has no awards, so the cards show supported facts instead: the most-read paper of the latest issue and the Editor-in-Chief.
import type { ComponentType } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatNumber } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, EditorProfile } from '../../../../core/types'
import { AREA_ICONS, areaColor, areaOf } from '../../components/areas'
import { AuthorAvatarJ4 } from '../../components/AuthorChipJ4'
import { cx } from '../../components/primitives'
import { Arrow, Assignment, Description, FolderZip, Medal, MenuBook, Premium, RateReview, School, Swipe, Trophy, Verified, VerifiedUser } from '../../components/refIconsJ4'
import type { IconProps } from '../../icons'

const GUIDES: { tag: string; title: string; text: string; to: string; icon: ComponentType<IconProps>; badge: string; tile: string }[] = [
  { tag: 'Guidelines', title: 'Author Guidelines', text: 'Manuscript format, structure and the ethics checklist.', to: paths.policy('author-guidelines'), icon: Description, badge: 'bg-cobalt-700', tile: 'from-sky-100 to-sky-50 text-cobalt-700' },
  { tag: 'Process', title: 'Submission Process', text: 'From upload and Paper ID to review, payment and publication.', to: paths.forAuthors('submission-process'), icon: Assignment, badge: 'bg-emerald-700', tile: 'from-emerald-100 to-emerald-50 text-emerald-700' },
  { tag: 'Peer Review', title: 'Peer Review Policy', text: 'How papers are screened, reviewed and decided.', to: paths.policy('peer-review'), icon: RateReview, badge: 'bg-amber-700', tile: 'from-amber-100 to-amber-50 text-amber-700' },
  { tag: 'Integrity', title: 'Publication Ethics', text: 'Standards on authorship, plagiarism and conflicts of interest.', to: paths.policy('publication-ethics'), icon: VerifiedUser, badge: 'bg-purple-700', tile: 'from-purple-100 to-purple-50 text-purple-700' },
  { tag: 'Payment', title: 'APC & Payment', text: 'Charges, GST and receipts for accepted papers.', to: paths.forAuthors('apc-payment'), icon: FolderZip, badge: 'bg-slate-700', tile: 'from-slate-200 to-slate-50 text-slate-700' },
]

const dot = 'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white'

function TopPaper({ a }: { a: ArticleSummary }) {
  const area = areaOf(a.subject)
  const Icon = area ? AREA_ICONS[area.id] : undefined
  const color = areaColor(a.subject)
  const names = a.authors.slice(0, 3)
  return (
    <article aria-label="Most read paper" className="flex flex-col justify-between gap-2.5 rounded-[8px] border border-amber-200 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 p-3.5">
      <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className={cx(dot, 'bg-amber-700')}><Medal className="h-4 w-4" /></span>
          <h3 className="flex items-center gap-2 font-serif4 text-xs font-bold uppercase tracking-wider text-amber-950">Most Read Paper<span className="hidden text-[10px] font-normal normal-case tracking-normal text-amber-800 sm:inline">• Volume {a.volume}, Issue {a.issue}</span></h3>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded border border-amber-300 bg-amber-200/80 px-1.5 text-[10px] font-bold text-amber-900"><Trophy className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />Top Viewed</span>
      </div>
      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border border-amber-200/70" style={{ backgroundColor: `${color}14`, color }}>
          {Icon && <Icon className="h-9 w-9" />}
          <span className="absolute bottom-0.5 right-0.5 max-w-[6.5rem] truncate rounded bg-slate-900/80 px-1 font-mono text-[9px] text-white">{a.subject.split(' ')[0]}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h4 className="line-clamp-2 font-serif4 text-xs font-bold leading-snug text-[#0b2545]">“{a.title}”</h4>
          <p className="text-[11px] text-slate-700">Authors: {names.map((n, i) => <span key={n}><strong className="font-semibold text-[#0b2545]">{n}</strong>{i < names.length - 2 ? ', ' : i === names.length - 2 ? ' & ' : ''}</span>)}{a.authors.length > 3 && ' et al.'}</p>
          <p className="truncate text-[10px] italic text-slate-600">{a.subject}</p>
          <p className="line-clamp-1 text-[10px] text-slate-600">{a.abstract}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-amber-200/60 pt-1.5 text-[11px]">
        <span className="rounded border border-amber-200 bg-amber-100 px-1.5 font-mono text-[10px] font-semibold text-amber-800">Views: {formatNumber(a.views)}</span>
        <AppLink to={paths.article(a.paperId)} className="flex items-center gap-0.5 text-xs font-bold text-cobalt-700 hover:text-cobalt-800 hover:underline">View Article <Arrow className="h-3.5 w-3.5" aria-hidden="true" /></AppLink>
      </div>
    </article>
  )
}

function Lead({ e }: { e: EditorProfile }) {
  return (
    <article aria-label={e.role} className="flex flex-col justify-between gap-2.5 rounded-[8px] border border-sky-200 bg-white p-3.5">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className={cx(dot, 'bg-cobalt-700')}><School className="h-4 w-4" /></span>
          <h3 className="flex items-center gap-2 font-serif4 text-xs font-bold uppercase tracking-wider text-cobalt-700">{e.role}<span className="hidden text-[10px] font-normal normal-case tracking-normal text-slate-500 sm:inline">• Editorial Leadership</span></h3>
        </div>
        <span className="shrink-0 rounded border border-sky-200 bg-sky-50 px-1.5 text-[10px] font-semibold text-sky-800">Editorial Board</span>
      </div>
      <div className="flex items-center gap-3">
        <AuthorAvatarJ4 name={e.name} photo={e.photo} className="h-16 w-16 !rounded-lg border border-sky-300 text-lg !ring-0" />
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="truncate font-serif4 text-xs font-bold leading-snug text-[#0b2545]">{e.name}</p>
          <p className="truncate text-[11px] font-medium text-slate-700">{e.designation}</p>
          <p className="truncate text-[10px] italic text-slate-500">{e.institution}, {e.country}</p>
          {e.areas.length > 0 && <p className="flex flex-wrap items-center gap-1.5 pt-0.5">{e.areas.slice(0, 2).map((a) => <span key={a} className="rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[9px] text-slate-600">{a}</span>)}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-[11px]">
        <span className="flex items-center gap-1 text-[10px] text-slate-500"><Verified className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />Listed on the editorial board</span>
        <AppLink to={paths.editorialBoard} className="flex items-center gap-0.5 text-xs font-bold text-cobalt-700 hover:text-cobalt-800 hover:underline">Meet the Board <Arrow className="h-3.5 w-3.5" aria-hidden="true" /></AppLink>
      </div>
    </article>
  )
}

export function Honors({ top, lead }: { top?: ArticleSummary; lead?: EditorProfile }) {
  return (
    <section aria-labelledby="home-honors" className="mt-8 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Premium className="h-7 w-7 text-azure-600" aria-hidden="true" />
          <div>
            <h2 id="home-honors" className="font-serif4 text-lg font-bold text-[#0b2545] md:text-xl">Featured Research, Editorial Leadership &amp; Author Resources</h2>
            <p className="text-xs text-slate-500">Highlights from the latest issue, the people leading {journal.shortName}, and guides for authors.</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-3 lg:col-span-6">
          {top && <TopPaper a={top} />}
          {lead && <Lead e={lead} />}
        </div>
        <section aria-labelledby="home-guides" className="flex min-w-0 flex-col justify-between rounded-[8px] border border-slate-200 bg-white p-3.5 lg:col-span-6">
          <div className="mb-2 flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className={cx(dot, 'bg-cobalt-700')}><MenuBook className="h-4 w-4" /></span>
              <div><h3 id="home-guides" className="font-serif4 text-xs font-bold text-[#0b2545]">Learning Resources</h3><p className="text-[10px] text-slate-500">Scholarly Writing &amp; Publishing Guides</p></div>
            </div>
            <span className="shrink-0 rounded border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-cobalt-700">Open Access</span>
          </div>
          <div tabIndex={0} role="region" aria-label="Author guides, scroll horizontally" className="relative overflow-x-auto scroll-smooth pb-1">
            <ul className="flex min-w-[540px] items-stretch gap-2.5">
              {GUIDES.map(({ tag, title, text, to, icon: Icon, badge, tile }) => (
                <li key={title} className="flex w-48 shrink-0">
                  <div className="flex w-full flex-col justify-between rounded-[8px] border border-slate-200 bg-slate-50/70 p-2.5 transition-all hover:border-sky-300 hover:shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
                    <div className="space-y-1.5">
                      <div aria-hidden="true" className={cx('relative flex h-20 items-center justify-center rounded border border-slate-200 bg-gradient-to-br', tile)}>
                        <Icon className="h-9 w-9" />
                        <span className={cx('absolute left-1 top-1 rounded px-1.5 text-[9px] font-semibold text-white', badge)}>{tag}</span>
                      </div>
                      <h4 className="line-clamp-2 font-serif4 text-[11px] font-bold leading-tight text-[#0b2545]"><AppLink to={to} className="hover:text-cobalt-700">{title}</AppLink></h4>
                      <p className="line-clamp-2 text-[10px] leading-relaxed text-slate-600">{text}</p>
                    </div>
                    <div className="mt-1 flex items-center justify-between border-t border-slate-200/80 pt-1.5 text-[10px]">
                      <span className="truncate font-medium text-slate-500">{journal.shortName}</span>
                      <AppLink to={to} className="inline-flex items-center gap-0.5 font-semibold text-cobalt-700 hover:underline">Read <Arrow className="h-3 w-3" aria-hidden="true" /><span className="sr-only">: {title}</span></AppLink>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px]">
            <span className="flex items-center gap-1 text-slate-500"><Swipe className="h-3.5 w-3.5 text-azure-600" aria-hidden="true" />Scroll guides</span>
            <AppLink to={paths.forAuthors('submission-process')} className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-cobalt-700 hover:text-cobalt-800">View All Guides <Arrow className="h-3.5 w-3.5" aria-hidden="true" /></AppLink>
          </div>
        </section>
      </div>
    </section>
  )
}
