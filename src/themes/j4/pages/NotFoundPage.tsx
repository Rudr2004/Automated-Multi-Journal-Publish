// Calm 404: says what happened, then offers search and the most useful places to go next.
import { useState, type FormEvent } from 'react'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { ButtonLink } from '../components/Button'
import { FIELD } from '../components/PageBand'
import { Container, Label, cx } from '../components/primitives'
import { useSearchApi } from '../components/searchContext'
import { ArrowRight, Book, History, Search, Track } from '../icons'

const NEXT = [
  { to: paths.currentIssue, label: 'Current issue', text: 'The latest articles, grouped by type.', Icon: Book },
  { to: paths.pastIssues, label: 'Past issues', text: 'Every volume and issue in the archive.', Icon: History },
  { to: paths.track, label: 'Track my paper', text: 'Check a submission with its Paper ID.', Icon: Track },
]

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  const { onSearch } = useSearchApi()
  const [q, setQ] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); if (q.trim()) onSearch(q.trim()) }
  return (
    <div className="bg-abyss-50">
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl rounded-pane border border-abyss-200 bg-white p-6 shadow-panel sm:p-10">
          <Label className="text-cobalt-700">Error 404</Label>
          <h1 className="mt-2 font-serif4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-abyss-900">We couldn’t find that {what}</h1>
          <p className="mt-3 max-w-xl text-base text-steel-700">The link may be outdated or mistyped, or the {what} may have moved. Search the journal, or pick one of the places below.</p>
          <form role="search" onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="nf-q" className="sr-only">Search articles, authors, keywords, DOI or Paper ID</label>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-500" aria-hidden="true" />
              <input id="nf-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, author, keyword, DOI or Paper ID" className={cx(FIELD, 'h-12 w-full pl-10')} />
            </div>
            <button type="submit" className="inline-flex h-12 items-center justify-center rounded-ctl bg-abyss-900 px-6 text-sm font-semibold text-white hover:bg-abyss-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">Search</button>
          </form>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {NEXT.map(({ to, label, text, Icon }) => (
              <li key={to}>
                <AppLink to={to} className="group flex h-full flex-col rounded-pane border border-abyss-200 p-4 hover:border-azure-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
                  <Icon className="h-6 w-6 text-azure-600" aria-hidden="true" />
                  <span className="mt-2 font-serif4 text-base font-semibold text-abyss-900 group-hover:text-cobalt-700">{label}</span>
                  <span className="mt-1 text-sm text-steel-600">{text}</span>
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
