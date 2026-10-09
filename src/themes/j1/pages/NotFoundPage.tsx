import { PageHead } from '../components/PageHead'
import { ButtonLink } from '../components/Button'
import { Container } from '../components/primitives'
import { SearchBox } from '../components/SearchBox'
import { AppLink, useRouter } from '../../../core/router'
import { paths } from '../../../config/routes'

const LINKS = [
  { to: paths.currentIssue, label: 'Current Issue', note: 'The latest published articles' },
  { to: paths.pastIssues, label: 'Past Issues', note: 'Browse the full archive by volume' },
  { to: paths.editorialBoard, label: 'Editorial Board', note: 'Editors and reviewers' },
  { to: paths.track, label: 'Track Paper', note: 'Check a manuscript’s review status' },
  { to: paths.verify(), label: 'Verify Certificate', note: 'Confirm an author certificate' },
]

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  const { navigate } = useRouter()
  return (
    <>
      <PageHead crumbs={[{ label: 'Home', to: paths.home }, { label: 'Not found' }]} eyebrow="Error 404" title={`We couldn’t find that ${what}`}
        subtitle="The link may be outdated or mistyped. Search the archive, or choose one of the pages below." />
      <Container className="mt-8 grid gap-10 pb-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <h2 className="border-b border-line pb-2 font-serif text-[1.0625rem] font-semibold text-navy">Search for it instead</h2>
          <SearchBox id="notfound-search" large className="mt-4 max-w-xl" onSearch={(q) => navigate(paths.search(q))} />
          <h2 className="mt-9 border-b border-line pb-2 font-serif text-[1.0625rem] font-semibold text-navy">Useful pages</h2>
          <ul>
            {LINKS.map((l) => (
              <li key={l.to} className="border-b border-line">
                <AppLink to={l.to} className="flex flex-wrap items-baseline justify-between gap-x-4 py-3 hover:bg-paper">
                  <span className="font-semibold text-scholar">{l.label}</span><span className="text-[13px] text-ink-muted">{l.note}</span>
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
        <aside aria-label="Return home" className="self-start border border-line bg-paper p-5">
          <p className="font-serif text-[2.75rem] font-semibold leading-none tabular-nums text-navy/80" aria-hidden>404</p>
          <p className="mt-3 text-sm leading-relaxed text-ink">Nothing is wrong with your connection. The address simply doesn’t match a page on this journal.</p>
          <ButtonLink to={paths.home} variant="primary" className="mt-4">Back to Home</ButtonLink>
        </aside>
      </Container>
    </>
  )
}
