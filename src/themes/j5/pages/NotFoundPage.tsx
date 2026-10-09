// Helpful 404: an atom with one electron that has left its orbit, a plain explanation, search and the most useful places to go next.
import { useState, type FormEvent } from 'react'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { ButtonLink } from '../components/Button'
import { Dateline } from '../components/ClassicHeader'
import { FIELD } from '../components/PageBand'
import { Container, cx } from '../components/primitives'
import { useSearchApi } from '../components/searchContext'
import { Kicker, OrnamentRule } from '../components/signature'
import { ArrowRight, Book, History, Search, Track } from '../icons'

const NEXT = [
  { to: paths.currentIssue, label: 'Current issue', text: 'The latest articles, grouped by type.', Icon: Book },
  { to: paths.pastIssues, label: 'Past issues', text: 'Every volume and issue in the archive.', Icon: History },
  { to: paths.track, label: 'Track my paper', text: 'Check a submission with its Paper ID.', Icon: Track },
]

/** Atom drawing: three orbits, a nucleus, and one electron that has strayed far off its path. */
function LostAtom() {
  return (
    <svg viewBox="0 0 320 320" aria-hidden="true" className="mx-auto h-auto w-full max-w-[280px]">
      <circle cx="160" cy="160" r="150" fill="#FFFDF9" stroke="#701A1E" strokeOpacity=".15" />
      <g transform="translate(160 160)" fill="none" stroke="#701A1E" strokeWidth="1.4">
        {[-30, 30, 90].map((r) => <ellipse key={r} rx="112" ry="40" transform={`rotate(${r})`} strokeOpacity=".7" />)}
        <circle r="60" stroke="#B45309" strokeOpacity=".4" strokeDasharray="2 5" />
        <circle r="14" fill="#701A1E" stroke="none" /><circle r="6" fill="#FBBF24" stroke="none" />
        <circle cx="-97" cy="-56" r="6" fill="#B45309" stroke="none" />
        <circle cx="97" cy="-56" r="6" fill="#B45309" stroke="none" />
        <circle cx="0" cy="112" r="6" fill="#B45309" stroke="none" />
      </g>
      <path d="M205 105 C 240 80, 262 60, 276 44" fill="none" stroke="#B45309" strokeWidth="1.4" strokeDasharray="3 5" />
      <circle cx="280" cy="40" r="7" fill="#FBBF24" stroke="#B45309" strokeWidth="1.4" />
    </svg>
  )
}

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  const { onSearch } = useSearchApi()
  const [q, setQ] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); if (q.trim()) onSearch(q.trim()) }
  return (
    <div className="bg-[#FBF8F4]">
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-5xl rounded border border-[#E6DCD0] border-t-4 border-t-wine-800 bg-white p-6 sm:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_17rem] lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="min-w-0">
              <Dateline className="!text-obsidian-600" />
              <Kicker className="mt-4">Error 404 · Lost in the literature</Kicker>
              <h1 className="mt-2 font-newsreader text-[clamp(1.875rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-obsidian-900">We couldn’t find that {what}</h1>
              <OrnamentRule className="mt-4 max-w-xs" />
              <p className="mt-4 max-w-xl font-serif4 text-base leading-relaxed text-obsidian-700 sm:text-lg">The link may be outdated or mistyped, or the {what} may have moved. Search the journal, or pick one of the places below.</p>
              <form role="search" onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="nf-q" className="sr-only">Search articles, authors, keywords, DOI or Paper ID</label>
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ochre-700" aria-hidden="true" />
                  <input id="nf-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, author, keyword, DOI or Paper ID" className={cx(FIELD, 'h-12 w-full pl-10')} />
                </div>
                <button type="submit" className="inline-flex h-12 items-center justify-center rounded bg-wine-800 px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-wine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2">Search</button>
              </form>
            </div>
            <div className="hidden md:block"><LostAtom /><p className="mt-2 text-center font-serif4 text-sm italic text-obsidian-600">One electron has wandered off.</p></div>
          </div>
          <OrnamentRule className="mt-8" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {NEXT.map(({ to, label, text, Icon }) => (
              <li key={to}>
                <AppLink to={to} className="group flex h-full flex-col rounded border border-[#E6DCD0] bg-[#FBF8F4] p-4 transition duration-150 hover:-translate-y-px hover:border-wine-700 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">
                  <span className="flex h-9 w-9 items-center justify-center rounded bg-wine-800 text-ochre-300"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="mt-3 font-newsreader text-lg font-semibold text-obsidian-900 group-hover:text-wine-700">{label}</span>
                  <span className="mt-1 text-sm text-obsidian-600">{text}</span>
                </AppLink>
              </li>
            ))}
          </ul>
          <div className="mt-8"><ButtonLink to={paths.home} variant="outline">Back to home <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink></div>
        </div>
      </Container>
    </div>
  )
}
