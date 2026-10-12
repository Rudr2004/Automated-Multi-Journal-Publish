// "01 Browse scholarly articles": three ruled columns (Latest, Most read, Most cited) with numbered rows. Rankings come from the article summaries in HomeData.
import { doiFor } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { linkCls, panel, SquareHead } from './bits'

const N = 3
const num = (i: number) => String(i + 1).padStart(2, '0')
const n = (v: number) => v.toLocaleString('en-US')

interface Col { id: string; title: string; note: string; items: ArticleSummary[]; top: (a: ArticleSummary) => string; left: (a: ArticleSummary) => string; right: (a: ArticleSummary) => string; foot: [string, string] }

function Column({ c }: { c: Col }) {
  return (
    <section aria-labelledby={`cols-${c.id}`} className="flex min-w-0 flex-col p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-j3paper-rule pb-3">
        <h3 id={`cols-${c.id}`} className="font-jakarta text-base font-bold uppercase tracking-[0.02em] text-night-900">{c.title}</h3>
        <span className="font-inter text-xs text-mauve-600">{c.note}</span>
      </div>
      <ol className="flex-1">
        {c.items.slice(0, N).map((a, i) => (
          <li key={a.paperId} className="border-b border-j3paper-rule py-3.5 first:pt-0 last:border-b-0">
            <p className="flex items-baseline justify-between gap-3 font-jakarta text-[11px] font-bold uppercase tracking-[0.04em] text-iris-700">
              <span><span className="tabular-nums">{num(i)}</span> &bull; {a.type}</span>
              <span className="font-semibold text-night-700">{c.top(a)}</span>
            </p>
            <h4 className="mt-1.5 font-jakarta text-[15px] font-semibold leading-snug text-night-900"><AppLink to={paths.article(a.paperId)} className="hover:text-iris-700 hover:underline">{a.title}</AppLink></h4>
            <p className="mt-1 font-inter text-[13px] text-mauve-600">{a.authors.slice(0, 3).join(', ')}{a.authors.length > 3 ? ' et al.' : ''}</p>
            <p className="mt-1.5 flex items-baseline justify-between gap-3 font-inter text-[11px] text-mauve-600"><span className="min-w-0 break-all">{c.left(a)}</span><span className="shrink-0 font-semibold tabular-nums text-night-900">{c.right(a)}</span></p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-center"><AppLink to={c.foot[1]} className={linkCls}>{c.foot[0]} &rarr;</AppLink></p>
    </section>
  )
}

export function ArticleColumns({ latest, mostRead, pool, issueLabel }: { latest: ArticleSummary[]; mostRead: ArticleSummary[]; pool: ArticleSummary[]; issueLabel: string }) {
  const cited = [...pool].sort((a, b) => b.citations - a.citations || b.views - a.views)
  const all: Col[] = [
    { id: 'latest', title: 'Latest articles', note: issueLabel, items: latest.filter((a) => a.type !== 'Editorial'), top: (a) => formatMonthYear(a.publishedAt), left: (a) => `DOI: ${doiFor(a.paperId)}`, right: (a) => `Views: ${n(a.views)}`, foot: ['View current issue', paths.currentIssue] },
    { id: 'read', title: 'Most read articles', note: 'All issues', items: mostRead, top: (a) => `${n(a.views)} reads`, left: (a) => `Vol. ${a.volume}, Iss. ${a.issue}`, right: (a) => `Cited: ${n(a.citations)}`, foot: ['Browse the archive', paths.pastIssues] },
    { id: 'cited', title: 'Most cited articles', note: 'All issues', items: cited, top: (a) => `${n(a.citations)} ${a.citations === 1 ? 'citation' : 'citations'}`, left: (a) => `Vol. ${a.volume}, Iss. ${a.issue}`, right: (a) => `Views: ${n(a.views)}`, foot: ['Search the archive', paths.search('')] },
  ]
  const cols = all.filter((c) => c.items.length)
  if (!cols.length) return null
  return (
    <section aria-labelledby="home-browse" className="mt-14">
      <SquareHead id="home-browse" n="01" title="Browse scholarly articles" />
      <div className={`${panel} grid divide-y divide-j3paper-rule md:grid-cols-3 md:divide-x md:divide-y-0`}>
        {cols.map((c) => <Column key={c.id} c={c} />)}
      </div>
    </section>
  )
}
