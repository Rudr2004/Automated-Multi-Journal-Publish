// Issue header, matching the issue reference: a rounded deep-wine banner with breadcrumb, cover plate, label chips, journal title,
// ISSN / Issue DOI box and the three download buttons (full issue, cover, index). Downloads are generated in the browser (prototype).
import { MdOutlineAutoStories as Stories, MdOutlineImage as ImageIcon, MdOutlinePictureAsPdf as PdfIcon, MdOutlineToc as Toc } from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { buildArticlePdf } from '../../../../core/lib/pdf'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../../core/types'
import { Container } from '../../components/primitives'

const GHOST = 'inline-flex min-h-11 items-center gap-2 rounded border border-amber-300/40 bg-white/10 px-3.5 py-2.5 font-work text-xs font-medium uppercase tracking-wider text-white transition-colors motion-reduce:transition-none hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300'
const COVER = '/journals/j5/images/issue-cover.svg'

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function IssueHeader({ issue, articles = [] }: { issue: IssueSummary; articles?: ArticleSummary[] }) {
  const tag = `${journal.shortName}-V${issue.volume}I${issue.issue}`
  const pdf = (title: string, lines: string[], suffix: string) => save(buildArticlePdf({
    paperId: `${tag}${suffix}`, title, authors: [], abstract: lines.join('  •  ') || 'No articles in this issue yet.',
    volume: issue.volume, issue: issue.issue, pages: '-', publishedAt: issue.publishedAt,
  }), `${tag}${suffix}.pdf`)
  const label = `Volume ${issue.volume} • Issue ${issue.issue}`

  return (
    <div className="bg-[#F9F9FF] pt-4">
      <Container>
        <section className="relative overflow-hidden rounded border border-[#6B1822] px-6 py-8 text-white shadow-lg sm:px-10" style={{ background: 'linear-gradient(135deg, rgb(74, 14, 23) 0%, rgb(59, 8, 16) 100%)' }}>
          <div className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 font-work text-base text-amber-200/80">
                <li><AppLink to={paths.home} className="transition-colors hover:text-white">Home</AppLink></li><li aria-hidden="true">/</li>
                <li><AppLink to={paths.pastIssues} className="transition-colors hover:text-white">Archives</AppLink></li><li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-amber-300">Volume {issue.volume}, Issue {issue.issue}</li>
              </ol>
            </nav>
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="flex justify-center lg:col-span-4 lg:justify-start">
                <div className="group relative w-full max-w-[280px] overflow-hidden rounded border border-amber-300/30 bg-black/20 shadow-lg">
                  <div className="aspect-[280/395] w-full bg-[linear-gradient(160deg,#701A1E,#4C0519)]"><img src={COVER} alt={`${journal.shortName} Volume ${issue.volume} Issue ${issue.issue} cover`} width={360} height={300} className="h-full w-full object-contain transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105" /></div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 text-center">
                    <span className="font-work text-[11px] font-semibold uppercase tracking-wider text-amber-300">{label}</span>
                  </div>
                </div>
              </div>
              <div className="min-w-0 space-y-5 lg:col-span-8">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded bg-amber-400 px-2.5 py-0.5 font-work text-base font-bold uppercase tracking-wider text-[#3B0810] shadow-sm"><Stories className="h-[13px] w-[13px]" aria-hidden="true" />{issue.isCurrent ? 'Current Issue' : 'Past Issue'}</span>
                  <span className="rounded border border-amber-300/40 bg-black/30 px-2.5 py-0.5 font-work text-xs font-semibold uppercase tracking-wide text-amber-200">{label} • {formatMonthYear(issue.month)}</span>
                </div>
                <div>
                  <h1 className="font-newsreader text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">{journal.name}</h1>
                  <p className="pt-1.5 font-serif4 text-sm leading-relaxed text-amber-100/90 sm:text-base">Table of contents of {journal.shortName}. Articles are grouped by type; explore scholarly articles or search directly within this issue below.</p>
                </div>
                <dl className="grid gap-3 rounded border border-[#6B1822] bg-black/30 p-4 font-work sm:grid-cols-2">
                  <div><dt className="block text-[10px] uppercase text-amber-200/80">ISSN (Online)</dt><dd className="mt-0.5 font-mono text-sm font-medium text-white">{journal.issnOnline}</dd></div>
                  <div><dt className="mb-0.5 block text-[10px] uppercase text-amber-200/80">Issue DOI</dt><dd><a href={`https://doi.org/${issue.doi}`} target="_blank" rel="noreferrer" className="break-all font-mono text-sm font-medium text-amber-300 underline transition-colors hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">{issue.doi}<span className="sr-only"> (opens in a new tab)</span></a></dd></div>
                </dl>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button type="button" onClick={() => pdf(`Volume ${issue.volume}, Issue ${issue.issue}: full issue`, articles.map((a) => `pp. ${a.pages} ${a.title} (${a.authors.join(', ')})`), '')}
                    className="inline-flex min-h-11 items-center gap-2 rounded bg-amber-400 px-4 py-2.5 font-work text-xs font-bold uppercase tracking-wider text-[#3B0810] shadow transition-colors motion-reduce:transition-none hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><PdfIcon className="h-4 w-4" aria-hidden="true" />Download Full Issue (PDF)</button>
                  <a href={COVER} download={`${tag}-cover.svg`} className={GHOST}><ImageIcon className="h-4 w-4" aria-hidden="true" />Download Cover Page</a>
                  <button type="button" onClick={() => pdf(`Volume ${issue.volume}, Issue ${issue.issue}: index`, articles.map((a) => `${a.pages}  ${a.title}`), '-index')} className={GHOST}><Toc className="h-4 w-4" aria-hidden="true" />Download Index Page</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  )
}
