// Right-hand rail (reference "article detail"): Article outline, How to cite, Article details, Article metrics, Verification & QR, Recommend to librarian and Author declaration cards.
import { useMemo, useState, type FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { MdOutlineCheckCircle, MdOutlineFormatQuote, MdOutlineInfo, MdOutlineInsights, MdOutlineLocalLibrary, MdOutlineSend, MdOutlineVerified, MdOutlineVerifiedUser, MdOutlineVisibility, MdOutlineWorkspacePremium } from 'react-icons/md'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { CITATION_STYLES_WITH_IEEE, citationFilename, formatCitation, type CitationStyle } from '../../../../core/lib/cite'
import { downloadText } from '../../../../core/lib/clipboard'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleFull } from '../../../../core/types'
import { buttonClass } from '../../components/Button'
import { cx } from '../../components/primitives'
import { useToast } from '../../components/Toast'
import { Download, Quote } from '../../icons'
import { OutlineRail } from './OutlineRail'
import { CARD, CARD_H, CopyButton, MONO, NAVY, num, type TabId } from './shared'

function CardHead({ icon, title, tag, id, tagClass }: { icon: React.ReactNode; title: string; tag?: string; id?: string; tagClass?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-abyss-100 pb-2">
      <h2 id={id} className={cx(CARD_H, 'flex items-center gap-1.5')}><span className="text-azure-600">{icon}</span>{title}</h2>
      {tag && <span className={cx('rounded px-1.5 py-0.5 text-[11px]', MONO, tagClass ?? 'bg-azure-50 font-bold text-cobalt-700')}>{tag}</span>}
    </div>
  )
}

function Librarian() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [dept, setDept] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    toast('Thank you! Your recommendation was noted for library services.')
    setEmail(''); setDept('')
  }
  const field = 'min-h-11 w-full rounded border border-abyss-300 bg-abyss-50 px-2.5 py-1.5 text-xs text-abyss-900 placeholder:text-steel-600 focus:border-azure-600 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:min-h-9'
  return (
    <section aria-labelledby="side-lib-h" className={cx(CARD, 'space-y-3 p-4')}>
      <div className="flex items-center gap-2 border-b border-abyss-100 pb-2">
        <MdOutlineLocalLibrary className="h-5 w-5 text-azure-600" aria-hidden="true" />
        <h2 id="side-lib-h" className={CARD_H}>Recommend to Librarian</h2>
      </div>
      <p className="text-xs leading-normal text-steel-600">Recommend {journal.shortName} to your university library or institutional resource repository.</p>
      <form onSubmit={submit} className="space-y-2 text-xs">
        <input type="email" required aria-label="Librarian or institutional email" placeholder="Librarian / Institutional Email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        <input type="text" required aria-label="Your department and university" placeholder="Your Department & University" value={dept} onChange={(e) => setDept(e.target.value)} className={field} />
        <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded border border-abyss-300 bg-abyss-100 px-3 py-1.5 text-xs font-semibold text-[#0b2545] transition-colors hover:bg-abyss-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:min-h-9">
          <MdOutlineSend className="h-4 w-4 text-azure-600" aria-hidden="true" />Send Recommendation
        </button>
      </form>
    </section>
  )
}

export function SidePanel({ article, active, onGo }: { article: ArticleFull; active: TabId; onGo: (tab: TabId, id: string) => void }) {
  const doi = doiFor(article.paperId)
  const [style, setStyle] = useState<CitationStyle>('apa')
  const text = useMemo(() => formatCitation(article, style), [article, style])
  const published = article.publishedOnline || article.publishedAt
  const pageUrl = typeof window === 'undefined' ? paths.article(article.paperId) : `${window.location.origin}${paths.article(article.paperId)}`
  const rows: [string, React.ReactNode][] = [
    ['Article Type', article.type],
    ['Status', <span key="s" className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">Published Online</span>],
    ['Volume & Issue', `Vol. ${String(article.volume).padStart(2, '0')}, Iss. ${String(article.issue).padStart(2, '0')}`],
    ['Published Date', published ? formatDate(published) : undefined],
    ['Received', article.received ? formatDate(article.received) : undefined],
    ['Accepted', article.accepted ? formatDate(article.accepted) : undefined],
    ['Page Extent', article.pages ? <span key="p" className={MONO}>pp. {article.pages}</span> : undefined],
  ]
  const shown = rows.filter(([, v]) => v)
  return (
    <aside aria-label="Outline, citation, details and metrics" className="space-y-6 print:hidden">
      <OutlineRail article={article} active={active} onGo={onGo} />

      <section id="how-to-cite" aria-labelledby="side-cite-h" className={cx(CARD, 'scroll-mt-32 space-y-3 p-4')}>
        <CardHead id="side-cite-h" icon={<MdOutlineFormatQuote className="h-4 w-4" aria-hidden="true" />} title="How to Cite" tag={`${CITATION_STYLES_WITH_IEEE.find((s) => s.id === style)?.label ?? style} Format`} tagClass="bg-abyss-100 text-steel-700" />
        <div role="group" aria-label="Citation style" className="flex flex-wrap gap-1">
          {CITATION_STYLES_WITH_IEEE.filter((s) => s.id !== 'bibtex' && s.id !== 'ris').map((s) => (
            <button key={s.id} type="button" aria-pressed={style === s.id} onClick={() => setStyle(s.id)}
              className={cx('min-h-11 rounded px-2.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:min-h-8', style === s.id ? 'bg-cobalt-700 text-white' : 'border border-abyss-200 bg-white text-steel-700 hover:border-azure-600 hover:text-cobalt-700')}>{s.label}</button>
          ))}
        </div>
        <pre tabIndex={0} aria-label={`${style.toUpperCase()} citation`} className={cx('max-h-44 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-abyss-200 bg-abyss-50 p-2.5 text-xs leading-relaxed text-abyss-800', MONO)}>{text}</pre>
        <div className="space-y-2 pt-1 text-xs">
          <CopyButton text={text} label="Copy citation" what="Citation" className={cx(buttonClass('cta', 'w-full min-h-11 !px-3 !py-1.5 !text-xs lg:min-h-9'), '[&>svg]:h-3.5 [&>svg]:w-3.5')}>Copy Citation</CopyButton>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => downloadText(citationFilename(article, 'bibtex'), formatCitation(article, 'bibtex'))} className={buttonClass('outline', 'min-h-11 !px-2 !py-1.5 !text-[11px] !font-medium lg:min-h-9')}><Download className="h-4 w-4 text-azure-600" aria-hidden="true" />BibTeX</button>
            <button type="button" onClick={() => downloadText(citationFilename(article, 'ris'), formatCitation(article, 'ris'))} className={buttonClass('outline', 'min-h-11 !px-2 !py-1.5 !text-[11px] !font-medium lg:min-h-9')}><Download className="h-4 w-4 text-azure-600" aria-hidden="true" />RIS / EndNote</button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-abyss-100 pt-2 text-[11px] text-steel-600">
          <span>Crossref DOI assigned</span>
          <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 font-medium text-emerald-800 hover:underline"><MdOutlineVerified className="h-3.5 w-3.5" aria-hidden="true" />Resolve DOI<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </section>

      <section aria-labelledby="spec-h" className={cx(CARD, 'space-y-3 p-4')}>
        <CardHead id="spec-h" icon={<MdOutlineInfo className="h-4 w-4" aria-hidden="true" />} title="Article Details" tag={article.paperId} />
        <dl className="space-y-2 text-xs">
          {shown.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 border-b border-abyss-100 pb-1.5">
              <dt className="text-steel-600">{k}</dt>
              <dd className="min-w-0 break-words text-right font-semibold text-abyss-900 [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3">
            <dt className="text-steel-600">License</dt>
            <dd><a href={journal.licence.url} target="_blank" rel="noreferrer" className={cx('rounded border border-abyss-200 bg-abyss-100 px-1.5 py-0.5 text-[11px] text-abyss-800 hover:text-cobalt-700', MONO)}>{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a></dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="side-metrics-h" className={cx(CARD, 'space-y-3 p-4')}>
        <CardHead id="side-metrics-h" icon={<MdOutlineInsights className="h-4 w-4" aria-hidden="true" />} title="Article Metrics" tag="Usage" tagClass="bg-abyss-100 text-steel-700" />
        <ul className="grid grid-cols-3 gap-2 text-center text-xs">
          {([['Views', article.views, MdOutlineVisibility, 'text-azure-600'], ['Downloads', article.downloads, Download, 'text-red-700'], ['Citations', article.citations, Quote, 'text-azure-600']] as const).map(([k, v, Icon, c]) => (
            <li key={k} className="rounded border border-abyss-200 bg-abyss-50 px-1 py-2.5">
              <p className="mb-0.5 flex items-center justify-center gap-1 text-[11px] text-steel-600"><Icon className={cx('h-3.5 w-3.5', c)} aria-hidden="true" />{k}</p>
              <p className={cx('text-base font-bold text-abyss-900', MONO)}>{num(v)}</p>
            </li>
          ))}
        </ul>
        <p className="text-center text-[11px] leading-snug text-steel-600">Citation counts depend on the indexing services that report them and may lag by several weeks.</p>
      </section>

      <section aria-labelledby="side-qr-h" className={cx(CARD, 'space-y-3 p-4')}>
        <CardHead id="side-qr-h" icon={<MdOutlineVerified className="h-4 w-4" aria-hidden="true" />} title="Verification & QR" tag="QR" tagClass="font-bold text-emerald-800" />
        <div className="flex items-center gap-3 rounded-lg border border-abyss-200 bg-abyss-50 p-3">
          <div className="shrink-0 rounded border border-abyss-300 bg-white p-1">
            <QRCodeSVG value={pageUrl} size={56} level="M" fgColor="#0F172A" role="img" aria-label={`QR code linking to ${article.paperId}`} />
          </div>
          <div className="min-w-0 space-y-1 text-xs">
            <div className={cx('text-[10px] uppercase text-steel-600', MONO)}>Manuscript ID:</div>
            <div className={cx('truncate text-[11px] font-bold', NAVY, MONO)}>{article.paperId}</div>
            <div className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-800"><MdOutlineCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />Scan to open this article</div>
          </div>
        </div>
        <div className="pt-1">
          <AppLink to={paths.verify()} className={buttonClass('cta', 'w-full min-h-11 !px-3 !py-1.5 !text-xs lg:min-h-9')}><MdOutlineWorkspacePremium className="h-4 w-4" aria-hidden="true" />Verify Publication Certificate</AppLink>
        </div>
      </section>

      <Librarian />

      <section aria-labelledby="side-decl-h" className="space-y-2.5 rounded border border-azure-200 bg-azure-50/70 p-4 shadow-hair">
        <div className="flex items-center justify-between gap-2 border-b border-azure-200 pb-2">
          <h2 id="side-decl-h" className={cx(CARD_H, 'flex items-center gap-1.5')}><MdOutlineVerifiedUser className="h-4 w-4 text-azure-600" aria-hidden="true" />Author Declaration</h2>
          <span className={cx('rounded bg-azure-100 px-1.5 py-0.5 text-[11px] font-bold text-cobalt-700', MONO)}>ETHICS</span>
        </div>
        <p className="text-xs leading-relaxed text-abyss-800"><strong className={NAVY}>Author Declaration:</strong> Authors submit original work and declare their competing interests under the journal&apos;s <AppLink to={paths.policy('publication-ethics')} className="font-semibold text-cobalt-700 underline underline-offset-2">publication ethics policy</AppLink>. This article is published open access under {journal.licence.name}.</p>
        <p className="flex items-center gap-1.5 text-[11px] text-steel-700"><MdOutlineCheckCircle className="h-4 w-4 text-emerald-700" aria-hidden="true" />Follows the journal&apos;s ethics &amp; peer review policies</p>
      </section>
    </aside>
  )
}
