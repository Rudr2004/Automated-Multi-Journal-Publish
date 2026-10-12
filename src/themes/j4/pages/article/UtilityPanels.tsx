// Below / inside the article card: declarations, related articles, the dual call-out bar (TOC alerts + submit) and the recognition showcase.
import { useMemo, useState, type FormEvent } from 'react'
import { MdOutlineLibraryBooks, MdOutlineMarkEmailUnread, MdOutlineMilitaryTech, MdOutlineNotificationsActive, MdOutlinePublish, MdOutlineSchool, MdOutlineVerified } from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleFull } from '../../../../core/types'
import { areaColor } from '../../components/areas'
import { useToast } from '../../components/Toast'
import { ArrowRight, Book, Submit } from '../../icons'
import { MONO, NAVY, num } from './shared'

export function Declarations({ article }: { article: ArticleFull }) {
  const corr = article.authorDetails?.find((a) => a.corresponding)
  const items: [string, React.ReactNode][] = [
    ['Licence', <>Published open access under {journal.licence.name}.</>],
    ['Peer review', <>Handled under the journal&apos;s <AppLink to={paths.policy('peer-review')} className="font-semibold text-cobalt-700 underline underline-offset-2">peer review policy</AppLink>.</>],
    ['Publication ethics', <>Authors follow the <AppLink to={paths.policy('publication-ethics')} className="font-semibold text-cobalt-700 underline underline-offset-2">publication ethics policy</AppLink>, including disclosure of competing interests.</>],
    ['Correspondence', corr ? <>{corr.name}{corr.email ? <>, <a href={`mailto:${corr.email}`} className="font-semibold text-cobalt-700 underline underline-offset-2">{corr.email}</a></> : null}.</> : <>Contact the editorial office through the <AppLink to={paths.about('contact')} className="font-semibold text-cobalt-700 underline underline-offset-2">contact page</AppLink>.</>],
  ]
  return (
    <section id="sec-declarations" aria-labelledby="decl-h" className="scroll-mt-32 space-y-2 rounded-lg border border-abyss-200 bg-abyss-50 p-4 text-xs">
      <h2 id="decl-h" className={`font-serif4 text-[11px] font-bold uppercase tracking-wider ${NAVY}`}>Declarations &amp; Academic Compliance</h2>
      <div className="grid grid-cols-1 gap-3 text-[11px] leading-snug text-steel-700 md:grid-cols-2">
        {items.map(([k, v]) => <div key={k}><strong className="text-abyss-800">{k}:</strong> {v}</div>)}
      </div>
    </section>
  )
}

export function RelatedSection({ article }: { article: ArticleFull }) {
  // Same research area first, then those sharing words with this paper's keywords.
  const rows = useMemo(() => {
    const kw = new Set((article.keywords ?? []).flatMap((k) => k.toLowerCase().split(/\s+/)))
    const score = (a: ArticleFull['related'][number]) => (a.subject === article.subject ? 10 : 0) + [...new Set(a.title.toLowerCase().split(/\W+/))].filter((w) => w.length > 3 && kw.has(w)).length
    return [...(article.related ?? [])].filter((a) => a.paperId !== article.paperId).sort((a, b) => score(b) - score(a)).slice(0, 3)
  }, [article])
  if (!rows.length) return null
  return (
    <section id="related-articles" aria-labelledby="related-h" className="scroll-mt-32 space-y-4 border-t border-abyss-100 pt-2 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-abyss-100 pb-2">
        <h2 id="related-h" className={`flex items-center gap-2 font-serif4 text-base font-bold ${NAVY}`}><MdOutlineLibraryBooks className="h-6 w-6 text-azure-600" aria-hidden="true" />Related Articles &amp; Suggested Literature</h2>
        <span className={`rounded border border-abyss-200 bg-abyss-100 px-2 py-0.5 text-[11px] text-steel-700 ${MONO}`}>Matched by area and keywords</span>
      </div>
      <ul className="grid gap-4 md:grid-cols-3">
        {rows.map((a) => (
          <li key={a.paperId} className="flex">
            <AppLink to={paths.article(a.paperId)} className="group flex w-full flex-col justify-between space-y-2 rounded-lg border border-abyss-200 bg-abyss-50/60 p-3.5 shadow-hair transition hover:border-azure-600 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 motion-reduce:transition-none">
              <span className="block space-y-1.5">
                <span className={`inline-flex items-center gap-1.5 rounded border border-azure-200 bg-azure-50 px-2 py-0.5 text-[10px] font-semibold text-cobalt-800 ${MONO}`}><span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: areaColor(a.subject) }} />{a.subject}</span>
                <span className="block break-words pt-0.5 font-serif4 text-xs font-bold leading-snug text-abyss-900 transition-colors [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden group-hover:text-cobalt-700">{a.title}</span>
                <span className="block break-words text-[11px] text-steel-600">{a.authors.join(', ')}</span>
              </span>
              <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-abyss-100 pt-2 text-[11px] text-steel-600">
                <span className={`rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-800 ${MONO}`}>{num(a.citations)} Citations</span>
                <span aria-hidden="true">•</span>
                <span>{num(a.downloads)} Downloads</span>
              </span>
            </AppLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function PublishBanner() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const subscribe = (e: FormEvent) => {
    e.preventDefault()
    toast('Subscribed to TOC alerts')
    setEmail('')
  }
  return (
    <section aria-label="Subscribe and submit" className="mt-10 rounded-xl border border-abyss-800 bg-gradient-to-r from-[#0b2545] via-[#0f3460] to-[#071527] p-6 text-white shadow-hair md:p-8 print:hidden">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-6 lg:border-r lg:border-slate-700/80 lg:pr-8">
          <h2 className="flex items-center gap-2 font-serif4 text-base font-bold text-white md:text-lg"><MdOutlineMarkEmailUnread className="h-6 w-6 text-sky-300" aria-hidden="true" />Subscribe to TOC Alerts</h2>
          <p className="text-xs leading-relaxed text-slate-300">Receive the table of contents and call-for-papers notices straight to your inbox each month, when a new issue is published.</p>
          <form onSubmit={subscribe} className="flex w-full flex-col gap-2 pt-1 sm:flex-row">
            <input type="email" required aria-label="Institutional email" placeholder="Enter institutional email..." value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-11 flex-1 rounded border border-slate-600 bg-slate-800/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:border-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:min-h-10" />
            <button type="submit" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded bg-cobalt-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:min-h-10"><MdOutlineNotificationsActive className="h-4 w-4" aria-hidden="true" />Subscribe Free</button>
          </form>
          <p className="text-[11px] text-slate-300">No spam. You may unsubscribe at any time.</p>
        </div>
        <div className="space-y-3 lg:col-span-6 lg:pl-4">
          <h2 className="flex items-center gap-2 font-serif4 text-base font-bold text-white md:text-lg"><MdOutlinePublish className="h-6 w-6 text-sky-300" aria-hidden="true" />Ready to Publish Your Research?</h2>
          <p className="text-xs leading-relaxed text-slate-300">Submit your manuscript to {journal.shortName} and follow it from submission to publication with online tracking and a Crossref DOI.</p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <AppLink to={paths.submit} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-cobalt-700 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"><Submit className="h-4 w-4" aria-hidden="true" />Submit Paper Online</AppLink>
            <AppLink to={paths.pastIssues} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"><Book className="h-4 w-4" aria-hidden="true" />Browse Archive Catalog</AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Recognition showcase: the reference's awards section, filled with this article's own facts because J4 has no awards data. */
export function RecognitionSection({ article }: { article: ArticleFull }) {
  const year = (article.publishedOnline || article.publishedAt || '').slice(0, 4)
  return (
    <section aria-labelledby="recog-h" className="mt-8 space-y-4 print:hidden">
      <div className="flex items-center justify-between border-b border-abyss-200 pb-2">
        <div className="flex items-center gap-2">
          <MdOutlineVerified className="h-7 w-7 text-azure-600" aria-hidden="true" />
          <div>
            <h2 id="recog-h" className={`font-serif4 text-lg font-bold md:text-xl ${NAVY}`}>Honors, Research Awards &amp; Mentorship Recognition</h2>
            <p className="text-xs text-steel-600">Scholarly excellence and academic leadership within {journal.shortName}. Award announcements will appear here.</p>
          </div>
        </div>
        {year && <span className={`hidden items-center rounded border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 sm:inline-flex ${MONO}`}>{year} Volume</span>}
      </div>
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        <div className="relative flex flex-col justify-between rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 p-5 shadow-hair md:p-6">
          <div>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-700 text-white"><MdOutlineMilitaryTech className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h3 className="font-serif4 text-sm font-bold uppercase tracking-wider text-amber-950">Article Spotlight</h3>
                  <span className="text-xs font-medium text-amber-900">Featured from {formatDate(article.publishedOnline || article.publishedAt)}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className={`font-serif4 text-base font-bold leading-snug ${NAVY}`}>&ldquo;{article.title}&rdquo;</h4>
              <p className="text-xs text-abyss-800">Authors: <strong>{article.authors.join(', ')}</strong></p>
              <p className="text-xs italic text-steel-600">{article.subject}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-amber-200/60 pt-4 text-xs">
            <span className="rounded border border-amber-200 bg-amber-100 px-2.5 py-1 font-semibold text-amber-900">{num(article.views)} views · {num(article.downloads)} downloads</span>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex min-h-8 items-center gap-1 font-bold text-cobalt-700 hover:text-cobalt-800 hover:underline">Back to the top <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </div>
        <div className="relative flex flex-col justify-between rounded-xl border border-azure-200 bg-white p-5 shadow-hair md:p-6">
          <div>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-abyss-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cobalt-700 text-white"><MdOutlineSchool className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h3 className="font-serif4 text-sm font-bold uppercase tracking-wider text-cobalt-700">Mentor Recognition</h3>
                  <span className="text-xs text-steel-600">Excellence in Research Supervision &amp; Guidance</span>
                </div>
              </div>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-steel-700">No mentor awards have been announced yet. Authors and research guides can be recommended to the editorial office, and recognised mentors will be featured here.</p>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-abyss-100 pt-4 text-xs">
            <span className="flex items-center gap-1 text-steel-600"><MdOutlineVerified className="h-4 w-4 text-emerald-700" aria-hidden="true" />Editorial office review</span>
            <AppLink to={paths.about('contact')} className="inline-flex items-center gap-1 font-bold text-cobalt-700 hover:text-cobalt-800 hover:underline">Nominate a Research Guide <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}
